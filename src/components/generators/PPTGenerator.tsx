import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Download, 
  Copy, 
  Check, 
  MessageSquare, 
  Lightbulb, 
  Layout, 
  RefreshCw
} from 'lucide-react';
import { PPTData, SlideItem, StudentProfile } from '../../types';
import { PPT_PRESETS } from '../../data/iareData';
import { copyToClipboard, downloadFile, requestGeneration, saveHistoryItem } from '../../utils/api';

interface PPTGeneratorProps {
  student: StudentProfile;
  initialData?: PPTData | null;
}

// Official IARE Logo Component matching IARE_PowerpointTemplate_WidescreenHD1
export const IARECollegeLogo = ({ 
  variant = 'white', 
  className = '' 
}: { 
  variant?: 'white' | 'navy'; 
  className?: string;
}) => {
  const isWhite = variant === 'white';
  const textColor = isWhite ? '#ffffff' : '#003e7e';
  const subTextColor = isWhite ? '#e2e8f0' : '#1e3a8a';
  const shieldBorder = isWhite ? '#ffffff' : '#003e7e';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official IARE Shield Crest */}
      <svg viewBox="0 0 80 85" className="w-12 h-14 sm:w-14 sm:h-16 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield shape */}
        <path
          d="M6 10 C 26 4, 54 4, 74 10 C 74 46, 56 70, 40 82 C 24 70, 6 46, 6 10 Z"
          fill={isWhite ? '#ffffff' : '#003e7e'}
        />
        {/* Inner shield inset */}
        <path
          d="M9 13 C 27 8, 53 8, 71 13 C 71 44, 54 66, 40 78 C 26 66, 9 44, 9 13 Z"
          fill="#004385"
        />
        {/* Upper Sunburst Area */}
        <path
          d="M12 15 C 28 11, 52 11, 68 15 L 68 44 C 52 44, 28 44, 12 44 Z"
          fill="#fef08a"
        />
        {/* Sun rays radiating */}
        <g stroke="#ca8a04" strokeWidth="1.5">
          <line x1="40" y1="44" x2="40" y2="20" />
          <line x1="40" y1="44" x2="25" y2="24" />
          <line x1="40" y1="44" x2="55" y2="24" />
          <line x1="40" y1="44" x2="16" y2="34" />
          <line x1="40" y1="44" x2="64" y2="34" />
          <circle cx="40" cy="44" r="10" fill="#eab308" stroke="#ca8a04" />
        </g>
        {/* Lower Blue Bird / Lotus */}
        <path
          d="M12 44 C 28 44, 52 44, 68 44 C 68 62, 54 72, 40 76 C 26 72, 12 62, 12 44 Z"
          fill="#002d5a"
        />
        <path
          d="M40 50 C 33 54, 24 57, 20 60 C 28 62, 34 60, 40 68 C 46 60, 52 62, 60 60 C 56 57, 47 54, 40 50 Z"
          fill="#ffffff"
        />
        <circle cx="40" cy="54" r="3" fill="#38bdf8" />
        {/* Ribbon Text */}
        <text
          x="40"
          y="73"
          fontFamily="Arial, sans-serif"
          fontSize="4"
          fontWeight="bold"
          fill="#fef08a"
          textAnchor="middle"
          letterSpacing="0.4"
        >
          EDUCATION FOR LIBERATION
        </text>
      </svg>

      {/* Typography: IARE INSTITUTE OF AERONAUTICAL ENGINEERING */}
      <div className="flex flex-col text-left leading-tight">
        <span
          className="font-black text-2xl sm:text-3xl tracking-tight"
          style={{ color: textColor, fontFamily: 'Arial, sans-serif' }}
        >
          IARE
        </span>
        <span
          className="font-extrabold text-[11px] sm:text-[13px] tracking-wider uppercase mt-[-2px]"
          style={{ color: subTextColor, fontFamily: 'Arial, sans-serif' }}
        >
          INSTITUTE OF
        </span>
        <span
          className="font-extrabold text-[11px] sm:text-[13px] tracking-wider uppercase"
          style={{ color: subTextColor, fontFamily: 'Arial, sans-serif' }}
        >
          AERONAUTICAL ENGINEERING
        </span>
        <span
          className="text-[9px] font-semibold tracking-normal mt-0.5 opacity-90"
          style={{ color: subTextColor, fontFamily: 'Arial, sans-serif' }}
        >
          (Autonomous • Dundigal, Hyderabad)
        </span>
      </div>
    </div>
  );
};

export const PPTGenerator: React.FC<PPTGeneratorProps> = ({ student, initialData }) => {
  const [topic, setTopic] = useState('');
  const [courseTitle, setCourseTitle] = useState();
  const [slideCount, setSlideCount] = useState(7);
  const [targetType, setTargetType] = useState('Technical Seminar / Tech Talk');
  const [loading, setLoading] = useState(false);
  const [lectureNumber, setLectureNumber] = useState();
  const [pptData, setPptData] = useState<PPTData | null>(initialData || null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    if (initialData) {
      setPptData(initialData);
      setCurrentSlideIndex(0);
    }
  }, [initialData]);

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pptData) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => Math.min(pptData.slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pptData, isFullscreen]);

  const handleGenerate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || topic;
    if (!promptToUse.trim()) return;

    setLoading(true);
    try {
      const data = await requestGeneration(
        'ppt',
        promptToUse,
        {
          slideCount,
          targetType,
          courseTitle,
          lectureNumber,
        },
        student
      );
      setPptData(data);
      setCurrentSlideIndex(0);
      saveHistoryItem('ppt', data.title || promptToUse, data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!pptData) return;
    const text = pptData.slides
      .map(
        (s) =>
          `SLIDE ${s.slideNumber}: ${s.title}\n${s.content.map((c) => `• ${c}`).join('\n')}\n${
            s.speakerNotes ? `[Speaker Script: ${s.speakerNotes}]\n` : ''
          }`
      )
      .join('\n\n---\n\n');

    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!pptData) return;
    const md = `# IARE_PowerpointTemplate_WidescreenHD1
**INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)**  
**Dundigal, Hyderabad - 500 043**  
### Department of ${student.branch}

**Course Title:** ${courseTitle}  
**Topic Title:** ${pptData.title}  
**Presenter's Name:** ${student.name}  
**Presenter's ID:** ${student.rollNo}  
**Department Name:** ${student.branch}  
**Lecture / Session Number:** ${lectureNumber}  
**Presentation Date:** ${currentDate}  

---

${pptData.slides
  .map(
    (s) => `## Slide ${s.slideNumber}: ${s.title}

${s.content.map((c) => `- ${c}`).join('\n')}

${s.visualIdea ? `> **IARE Technical Architecture / Diagram:** ${s.visualIdea}\n` : ''}
${s.speakerNotes ? `**Speaker Script (Viva Defense):**\n_${s.speakerNotes}_\n` : ''}
---`
  )
  .join('\n\n')}
`;
    downloadFile(`${pptData.title.replace(/\s+/g, '_')}_IARE_Template.md`, md, 'text/markdown');
  };

  const handleDownloadHTMLSlides = () => {
    if (!pptData) return;
    const slidesJSON = JSON.stringify(pptData.slides);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pptData.title} - IARE_PowerpointTemplate_WidescreenHD1</title>
  <link href="https://fonts.googleapis.com/css2?family=Arial:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #0b1120; color: #1e293b; overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
    header { padding: 8px 24px; background: #002e61; color: white; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0056b3; font-size: 13px; font-weight: 700; }
    #deck-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 16px 20px; }
    .slide-card { width: 100%; max-width: 1060px; aspect-ratio: 16/9; background: #ffffff; border-radius: 4px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
    /* Slide 1: Cover Header */
    .cover-top-banner { background: #003e7e; padding: 28px 48px; color: white; display: flex; align-items: center; justify-content: space-between; height: 36%; border-bottom: 4px solid #eab308; }
    .cover-logo-box { display: flex; align-items: center; gap: 16px; }
    .cover-bottom-body { padding: 32px 48px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; position: relative; background: #ffffff; }
    .course-title { font-size: 28px; font-weight: 700; color: #003e7e; margin-bottom: 6px; }
    .topic-title { font-size: 22px; font-weight: 600; color: #1e293b; margin-bottom: 18px; }
    .meta-list { display: flex; flex-direction: column; gap: 6px; font-size: 16px; color: #334155; }
    .meta-list span { color: #0056b3; font-weight: 600; }
    .slide-corner-num { position: absolute; bottom: 14px; right: 28px; font-size: 14px; font-weight: 700; color: #003e7e; font-family: Arial, sans-serif; }
    /* Content Slide Styles */
    .content-slide { padding: 28px 48px 16px 48px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; }
    .content-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
    .content-slide-title { font-size: 26px; font-weight: 700; color: #003e7e; }
    .content-bullets { list-style: none; display: flex; flex-direction: column; gap: 14px; font-size: 17px; color: #1e293b; }
    .content-bullets li { display: flex; align-items: flex-start; gap: 12px; line-height: 1.5; }
    .bullet-dot { width: 8px; height: 8px; border-radius: 50%; background: #003e7e; margin-top: 9px; flex-shrink: 0; }
    .visual-box { background: #f0f7ff; border-left: 4px solid #003e7e; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #334155; margin-top: 16px; }
    .content-bottom-bar { height: 16px; background: #003e7e; width: 100%; border-top: 3px solid #eab308; position: relative; }
    /* Nav Footer */
    footer { padding: 10px 24px; background: #002244; display: flex; justify-content: space-between; align-items: center; color: #e2e8f0; }
    .nav-btn { background: #003e7e; color: white; border: 1px solid #0056b3; padding: 6px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; }
    .nav-btn:hover { background: #0056b3; }
  </style>
</head>
<body>
  <header>
    <div>IARE Official College Presentation Template — <strong>${pptData.title}</strong></div>
    <div>${student.name} (${student.rollNo}) • Department of ${student.branch}</div>
  </header>
  <div id="deck-container">
    <div class="slide-card">
      <div id="slide-render" style="height:100%; display:flex; flex-direction:column;"></div>
    </div>
  </div>
  <footer>
    <div id="notes-view" style="font-size: 13px; font-style: italic; max-width: 600px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"></div>
    <div>
      <button class="nav-btn" onclick="prevSlide()">◀ Previous</button>
      <button class="nav-btn" onclick="nextSlide()" style="background:#0284c7; margin-left:8px;">Next ▶</button>
    </div>
  </footer>
  <script>
    const slides = ${slidesJSON};
    let idx = 0;
    function render() {
      const s = slides[idx];
      const container = document.getElementById('slide-render');
      if (idx === 0) {
        container.innerHTML = 
          '<div class="cover-top-banner">' +
            '<div style="display:flex; align-items:center; gap:16px;">' +
              '<div style="font-size:30px; font-weight:900; line-height:1; letter-spacing:1px;">IARE<br><span style="font-size:12px; font-weight:700; letter-spacing:1px;">INSTITUTE OF<br>AERONAUTICAL ENGINEERING</span><br><span style="font-size:9px; font-weight:600; opacity:0.9;">(Autonomous • Hyderabad)</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="cover-bottom-body">' +
            '<div>' +
              '<div class="course-title">Course Title - <span>${courseTitle}</span></div>' +
              '<div class="topic-title">Topic Title - <span>' + s.title + '</span></div>' +
              '<div class="meta-list">' +
                '<div>Presenter’s Name - <span>${student.name}</span></div>' +
                '<div>Presenter’s ID - <span>${student.rollNo}</span></div>' +
                '<div>Department Name - <span>${student.branch}</span></div>' +
                '<div>Lecture Number - <span>${lectureNumber}</span></div>' +
                '<div>Presentation Date - <span>${currentDate}</span></div>' +
              '</div>' +
            '</div>' +
            '<div class="slide-corner-num">1</div>' +
          '</div>';
      } else {
        let bullets = '';
        s.content.forEach(b => {
          bullets += '<li><span class="bullet-dot"></span><span>' + b + '</span></li>';
        });
        container.innerHTML = 
          '<div class="content-slide">' +
            '<div>' +
              '<div class="content-header">' +
                '<h2 class="content-slide-title">' + s.title + '</h2>' +
                '<div style="text-align:right; font-weight:bold; font-size:13px; color:#003e7e;">IARE<br><span style="font-size:9px; font-weight:600; color:#64748b;">INSTITUTE OF AERONAUTICAL ENGINEERING<br>(Autonomous)</span></div>' +
              '</div>' +
              '<ul class="content-bullets">' + bullets + '</ul>' +
              (s.visualIdea ? '<div class="visual-box"><strong>IARE Recommended Diagram:</strong> ' + s.visualIdea + '</div>' : '') +
            '</div>' +
            '<div style="text-align:right; font-size:14px; font-weight:bold; color:#003e7e; margin-top:auto;">' + (idx + 1) + '</div>' +
          '</div>' +
          '<div class="content-bottom-bar"></div>';
      }
      document.getElementById('notes-view').innerText = s.speakerNotes ? 'Speaker Script: ' + s.speakerNotes : '';
    }
    function nextSlide() { if(idx < slides.length - 1) { idx++; render(); } }
    function prevSlide() { if(idx > 0) { idx--; render(); } }
    window.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if(e.key === 'ArrowLeft') prevSlide();
    });
    render();
  </script>
</body>
</html>`;

    downloadFile(`${pptData.title.replace(/\s+/g, '_')}_IARE_Template.html`, html, 'text/html');
  };

  const currentSlide: SlideItem | undefined = pptData?.slides[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* Top Generator Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Presentation className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                IARE Official PowerPoint Template Generator
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  IARE_PowerpointTemplate_WidescreenHD1
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Faithfully formatted to the official IARE Widescreen HD PowerPoint template with college header, course outcomes, and presentation metadata.
              </p>
            </div>
          </div>
        </div>

        {/* Input Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Design and Analysis of Algorithms, Web Technologies..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lecture / Session Number
              </label>
              <input
                type="text"
                value={lectureNumber}
                onChange={(e) => setLectureNumber(e.target.value)}
                placeholder="e.g. Lecture 04, Seminar Session 01..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Topic Title / Seminar Subject
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Consensus in Cloud Systems, AI in Healthcare, Dynamic Programming..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-28"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !topic.trim()}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate PPT
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-400">
                  Number of Slides (5 to 18)
                </label>
                <span className="font-mono text-xs font-bold text-blue-400">
                  {slideCount} Slides
                </span>
              </div>
              <div className="flex gap-1.5">
                {[5, 7, 10, 12, 15, 18].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSlideCount(num)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      slideCount === num
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="18"
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                College Presentation Template
              </label>
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-950 border border-blue-500/30 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                    IARE College Slide Template
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono font-normal">
                      Only Active
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    IARE_PowerpointTemplate_WidescreenHD1 (Navy Banner + Crest)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular IARE Presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Popular IARE Topics (1-Click Try):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PPT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setTopic(preset);
                    handleGenerate(preset);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-slate-300 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated PPT Workspace */}
      {pptData && (
        <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col' : ''}`}>
          {/* Top Presentation Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-[10px] font-mono text-blue-300 font-bold uppercase">
                IARE HD1 Widescreen
              </span>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{pptData.title}</span>
                  <span className="text-xs font-normal text-blue-400 font-mono">
                    ({currentSlideIndex + 1} / {pptData.slides.length})
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {student.name} ({student.rollNo}) • {student.branch}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  showSpeakerNotes
                    ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle Speaker Presentation Script"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Speaker Script</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
                title="Copy all slides text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
                title="Download as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Markdown</span>
              </button>

              <button
                onClick={handleDownloadHTMLSlides}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                title="Export Standalone IARE PowerPoint HTML"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Export Presentation</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Projector Mode'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slide Screen matching IARE_PowerpointTemplate_WidescreenHD1 exactly */}
          {currentSlide && (
            <div
              className={`relative flex flex-col justify-between bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-300 transition-all ${
                isFullscreen ? 'flex-1' : 'min-h-[460px] aspect-video w-full max-w-5xl mx-auto'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {/* SLIDE 1: Official IARE Cover Slide Layout */}
              {currentSlideIndex === 0 ? (
                <div className="flex flex-col h-full justify-between">
                  {/* Top Solid Navy Banner with Logo & Golden Accent Line */}
                  <div className="bg-[#003e7e] text-white px-8 sm:px-14 py-6 sm:py-8 flex items-center justify-between border-b-4 border-[#eab308]">
                    <IARECollegeLogo variant="white" />
                  </div>

                  {/* Lower White Body */}
                  <div className="p-8 sm:p-14 flex-1 flex flex-col justify-between relative bg-white">
                    <div>
                      <div className="text-xl sm:text-3xl font-bold text-[#003e7e] tracking-tight">
                        Course Title - <span className="font-semibold text-slate-800">{courseTitle}</span>
                      </div>
                      <div className="text-lg sm:text-2xl font-semibold text-slate-700 mt-2 mb-6 sm:mb-8">
                        Topic Title - <span className="font-normal text-slate-800">{currentSlide.title}</span>
                      </div>

                      {/* Metadata Rows */}
                      <div className="space-y-1.5 text-sm sm:text-base text-slate-700">
                        <div>
                          Presenter’s Name - <span className="text-[#0056b3] font-semibold">{student.name}</span>
                        </div>
                        <div>
                          Presenter’s ID - <span className="text-[#0056b3] font-semibold font-mono">{student.rollNo}</span>
                        </div>
                        <div>
                          Department Name - <span className="text-[#0056b3] font-semibold">{student.branch}</span>
                        </div>
                        <div>
                          Lecture Number - <span className="text-[#0056b3] font-semibold">{lectureNumber}</span>
                        </div>
                        <div>
                          Presentation Date - <span className="text-[#0056b3] font-semibold">{currentDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Corner Slide Number */}
                    <div className="text-right text-sm font-bold text-[#003e7e] mt-4">
                      1
                    </div>
                  </div>
                </div>
              ) : (
                /* SLIDES 2 to N: Official IARE Content Slide Layout */
                <div className="flex flex-col h-full justify-between">
                  {/* Main Slide White Canvas */}
                  <div className="p-8 sm:p-12 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Header Row with Title and IARE Logo Branding */}
                      <div className="flex items-start justify-between border-b-2 border-slate-200 pb-3 mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#003e7e] tracking-tight">
                          {currentSlide.title}
                        </h2>
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-sm font-black tracking-tight text-[#003e7e]">IARE</span>
                          <span className="text-[10px] text-slate-600 font-semibold hidden sm:inline">
                            INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
                          </span>
                        </div>
                      </div>

                      {/* Content Bullet Points */}
                      <ul className="space-y-3.5 my-4">
                        {currentSlide.content.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-800 leading-relaxed">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#003e7e] mt-1.5 flex-shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Visual Idea Box */}
                      {currentSlide.visualIdea && (
                        <div className="mt-6 p-3.5 rounded bg-blue-50/70 border-l-4 border-[#003e7e] text-xs text-slate-700 flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-[#003e7e] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#003e7e] block">
                              IARE Technical Graphic / Architecture Flow:
                            </span>
                            <p className="mt-0.5 leading-relaxed">{currentSlide.visualIdea}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Corner Slide Number */}
                    <div className="text-right text-sm font-bold text-[#003e7e] mt-4">
                      {currentSlideIndex + 1}
                    </div>
                  </div>

                  {/* Bottom Solid Navy Banner with Golden Accent Stripe */}
                  <div className="h-4 bg-[#003e7e] w-full border-t-2 border-[#eab308]" />
                </div>
              )}
            </div>
          )}

          {/* Speaker Notes Script Panel */}
          {showSpeakerNotes && currentSlide?.speakerNotes && (
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-900/40 text-slate-300">
              <div className="flex items-center gap-2 mb-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                What to say during this slide (IARE Viva / Seminar Defense Script):
              </div>
              <p className="text-sm italic text-slate-200 leading-relaxed">
                "{currentSlide.speakerNotes}"
              </p>
            </div>
          )}

          {/* Bottom Slide Thumbnails & Controls */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Slide Index Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2">
              {pptData.slides.map((s, idx) => (
                <button
                  key={s.slideNumber}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {s.slideNumber}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(pptData.slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === pptData.slides.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
