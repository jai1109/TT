import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Maximize2,
  Wand2,
  ArrowRight
} from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/api';

export const ImageStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [inputImageBase64, setInputImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('Thought Titan Visual Engine');
  const [copied, setCopied] = useState(false);

  const ACADEMIC_IMAGE_PRESETS = [
    'System Architecture Flowchart with Microservices, Ingestion Queues & In-Memory Cache',
    'Deep Neural Network Layer Pipeline with Attention Heatmap, Technical Visualization',
    'Autonomous Drone Navigation Sensors, LiDAR Point Cloud & Quadcopter Aerodynamics',
    'Distributed Database Sharding, Consensus Nodes and Multi-Region Replication Topology',
    'Cybersecurity Zero Trust Network Architecture with Cryptographic Enclaves',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setInputImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateOrEdit = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToUse,
          aspectRatio,
          imageSize,
          inputImageBase64: activeMode === 'edit' ? inputImageBase64 : null,
          mimeType: 'image/png',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();
      if (json.imageUrl) {
        setGeneratedImageUrl(json.imageUrl);
        setModelUsed(json.model || 'Thought Titan Vector Engine');
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `ThoughtTitan_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Thought Titan Visual Studio
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-950 text-violet-400 border border-violet-800">
                  Vector Graphics & Diagrams
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Create scalable architecture diagrams, flowcharts, and technical schemas or edit existing graphics with precision.
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveMode('create')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'create'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Image
            </button>
            <button
              onClick={() => setActiveMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'edit'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Edit Image
            </button>
          </div>
        </div>

        {/* Input Configuration */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-4">
          {/* Edit Mode: Upload Target Image */}
          {activeMode === 'edit' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Upload Image to Edit
                </span>
                <p className="text-[11px] text-slate-500">
                  Select a diagram, slide graphic, or photo to modify with natural language prompts.
                </p>
                <label className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-violet-400" />
                  <span>Choose Image File...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {inputImageBase64 && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                  <img
                    src={inputImageBase64}
                    alt="Upload Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 px-1 text-[9px] text-white rounded">
                    Selected
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {activeMode === 'create'
                ? 'Image Description & Visual Requirements'
                : 'Editing Instructions (e.g. "Add technical annotations and arrows", "Change background to dark theme")'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeMode === 'create'
                    ? 'e.g. System Architecture Diagram with Microservices, Ingestion Queues & In-Memory Cache, photorealistic 4K render'
                    : 'e.g. Add red arrows indicating data flow and add glowing labels to each server component...'
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pr-28"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerateOrEdit();
                }}
              />
              <button
                onClick={() => handleGenerateOrEdit()}
                disabled={loading || !prompt.trim() || (activeMode === 'edit' && !inputImageBase64)}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    {activeMode === 'create' ? 'Generate' : 'Apply Edit'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Aspect Ratio
              </label>
              <div className="flex gap-1.5 overflow-x-auto py-1">
                {['16:9', '1:1', '4:3', '9:16', '3:4'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Resolution Quality
              </label>
              <div className="flex gap-2">
                {['1K', '2K'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-all ${
                      imageSize === size
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {size} Resolution
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Presets */}
          {activeMode === 'create' && (
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                Technical Graphic Presets (1-Click Try):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ACADEMIC_IMAGE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(p);
                      handleGenerateOrEdit(p);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/50 text-slate-300 transition-colors"
                  >
                    {p.slice(0, 48)}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Output Canvas Workspace */}
      {generatedImageUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">
                Visual Rendered via {modelUsed}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setInputImageBase64(generatedImageUrl);
                  setActiveMode('edit');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                <span>Edit This Image</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Image</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex items-center justify-center overflow-hidden shadow-2xl min-h-[380px]">
            <img
              src={generatedImageUrl}
              alt="Generated Visual"
              className="max-h-[540px] max-w-full rounded-xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
