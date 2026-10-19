import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  RefreshCw, 
  MessageSquare,
  Bot,
  User,
  Zap,
  GraduationCap
} from 'lucide-react';

export const LiveVoiceAssistant: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<
    { sender: 'user' | 'titan'; text: string; time: string }[]
  >([
    {
      sender: 'titan',
      text: 'Hello! I am Thought Titan, powered by Gemini 3.8 Live. Click "Start Live Conversation" and speak naturally to discuss your research, practice your seminar viva, or solve engineering problems in real time.',
      time: 'Ready',
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  const pcmToBase64 = (float32Array: Float32Array): string => {
    const l = float32Array.length;
    const int16Array = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playAudioChunk = (base64Data: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const ctx = outputAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Base64 decode raw 24kHz 16-bit PCM little endian
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      const startTime = Math.max(now, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + buffer.duration;

      activeSourcesRef.current.push(source);
      setIsSpeaking(true);

      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0) {
          setIsSpeaking(false);
        }
      };
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  const stopActiveAudio = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextPlayTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsSpeaking(false);
  };

  const startSession = async () => {
    setErrorMsg(null);
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);

        try {
          // Mic capture at 16kHz
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: 1,
              sampleRate: 16000,
              echoCancellation: true,
              noiseSuppression: true,
            },
          });
          mediaStreamRef.current = stream;

          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
          inputAudioCtxRef.current = audioCtx;

          const source = audioCtx.createMediaStreamSource(stream);
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = processor;

          source.connect(processor);
          processor.connect(audioCtx.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
              const channelData = e.inputBuffer.getChannelData(0);
              // check volume to update talking indicator
              let sum = 0;
              for (let i = 0; i < channelData.length; i++) {
                sum += channelData[i] * channelData[i];
              }
              const rms = Math.sqrt(sum / channelData.length);
              setIsTalking(rms > 0.02);

              const base64Audio = pcmToBase64(channelData);
              ws.send(JSON.stringify({ audio: base64Audio }));
            }
          };
        } catch (micErr: any) {
          setErrorMsg('Microphone access denied or unavailable: ' + micErr.message);
          stopSession();
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMsg(msg.error);
          }
          if (msg.audio) {
            playAudioChunk(msg.audio);
          }
          if (msg.interrupted) {
            stopActiveAudio();
          }
          if (msg.text) {
            setTranscriptHistory((prev) => [
              ...prev,
              {
                sender: 'titan',
                text: msg.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }
        } catch (e) {
          console.error(e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setErrorMsg('WebSocket connection encountered an error.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsTalking(false);
        setIsSpeaking(false);
      };
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to start Live session');
      stopSession();
    }
  };

  const stopSession = () => {
    stopActiveAudio();
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsTalking(false);
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Thought Titan Live Voice (gemini-3.8-live)
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Real-time Audio WebSocket
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Low-latency, bi-directional voice conversations with Gemini 3.8 Live API for viva rehearsal, seminar defense, and research discussions.
              </p>
            </div>
          </div>

          {/* Connection Toggle */}
          <div>
            {!isConnected ? (
              <button
                onClick={startSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Start Live Conversation</span>
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                <MicOff className="w-4 h-4" />
                <span>End Conversation</span>
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Interactive Voice Orb & Telemetry */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glowing Background Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div
            className={`w-72 h-72 rounded-full border border-cyan-500/30 transition-all duration-700 ${
              isTalking || isSpeaking ? 'scale-125 border-cyan-400/60' : 'scale-100'
            }`}
          />
          <div
            className={`w-96 h-96 rounded-full border border-indigo-500/20 transition-all duration-1000 ${
              isSpeaking ? 'scale-150 border-indigo-400/50' : 'scale-100'
            }`}
          />
        </div>

        {/* Central Core Orb */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              !isConnected
                ? 'bg-slate-950 border-2 border-slate-800 text-slate-600'
                : isSpeaking
                ? 'bg-gradient-to-tr from-cyan-400 to-indigo-600 border-4 border-cyan-300 scale-110 shadow-cyan-500/50 animate-pulse'
                : isTalking
                ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 border-4 border-emerald-300 scale-105 shadow-emerald-500/50'
                : 'bg-gradient-to-tr from-indigo-900 to-slate-900 border-2 border-indigo-500/50 text-indigo-400'
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="w-12 h-12 text-slate-950 animate-bounce" />
            ) : isTalking ? (
              <Mic className="w-12 h-12 text-slate-950" />
            ) : (
              <Bot className="w-12 h-12 text-slate-400" />
            )}
          </div>

          <div className="mt-6">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                !isConnected
                  ? 'bg-slate-800 text-slate-400'
                  : isSpeaking
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : isTalking
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
              }`}
            >
              {!isConnected
                ? 'Microphone Standby'
                : isSpeaking
                ? 'Thought Titan is Speaking...'
                : isTalking
                ? 'Listening to You...'
                : 'Live Connected • Speak Whenever Ready'}
            </span>
            <p className="text-xs text-slate-400 mt-2 max-w-md">
              Powered by Google Gemini 3.8 Live API with 16kHz audio ingestion & 24kHz output playback.
            </p>
          </div>
        </div>
      </div>

      {/* Live Conversation Transcript Feed */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Live Dialogue Stream
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Model: gemini-3.8-live
          </span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
          {transcriptHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                item.sender === 'titan'
                  ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                  : 'bg-indigo-950/30 border-indigo-800/40 text-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                  {item.sender === 'titan' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  {item.sender === 'titan' ? 'Thought Titan AI' : 'You'}
                </span>
                <span>{item.time}</span>
              </div>
              <p className="leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
