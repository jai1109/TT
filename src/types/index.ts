export interface StudentProfile {
  name: string;
  rollNo: string;
  branch: string;
  yearSem: string;
  section?: string;
  regulation?: string;
}

export type TabType =
  | 'ppt'
  | 'tech_talk'
  | 'lab_record'
  | 'assignment'
  | 'samvidha'
  | 'live_voice'
  | 'image_studio'
  | 'case_study'
  | 'code_solver'
  | 'project_doc'
  | 'cgpa_calc'
  | 'attendance'
  | 'question_bank'
  | 'portal_links';

export interface SlideItem {
  slideNumber: number;
  title: string;
  content: string[];
  visualIdea?: string;
  speakerNotes?: string;
}

export interface PPTData {
  title: string;
  subtitle: string;
  presenter: string;
  slides: SlideItem[];
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface LabRecordData {
  experimentNumber: string;
  experimentTitle: string;
  aim: string;
  softwareHardwareRequirements: string[];
  theoreticalConcepts: string;
  algorithm: string[];
  flowchartDescription: string;
  sourceCode: string;
  language: string;
  sampleInput: string;
  sampleOutput: string;
  timeComplexity: string;
  spaceComplexity: string;
  result: string;
  vivaQuestions: VivaQuestion[];
}

export interface AssignmentQuestion {
  questionNumber: number;
  questionText: string;
  bloomsLevel: string;
  courseOutcome: string;
  answer: string;
}

export interface AssignmentData {
  subjectName: string;
  subjectCode: string;
  assignmentTitle: string;
  questions: AssignmentQuestion[];
  references: string[];
}

export interface CaseStudyData {
  title: string;
  executiveSummary: string;
  problemStatement: string;
  backgroundAnalysis: string;
  proposedSolution: string;
  implementationDetails: string;
  resultsAndImpact: string;
  challengesAndMitigations: { challenge: string; mitigation: string }[];
  futureScope: string;
  references: string[];
}

export interface TestCaseItem {
  input: string;
  expectedOutput: string;
  explanation: string;
}

export interface CodeSolutionData {
  problemTitle: string;
  language: string;
  optimalCode: string;
  timeComplexity: string;
  spaceComplexity: string;
  approachExplanation: string;
  keyEdgeCases: string[];
  testCases: TestCaseItem[];
}

export interface ProjectDocData {
  projectTitle: string;
  domain: string;
  abstract: string;
  problemDefinition: string;
  existingVsProposed: {
    existingSystemDrawbacks: string[];
    proposedSystemAdvantages: string[];
  };
  hardwareSoftwareRequirements: {
    hardware: string[];
    software: string[];
  };
  systemArchitectureOverview: string;
  modules: { name: string; description: string }[];
  conclusion: string;
}

export interface SavedHistoryItem {
  id: string;
  type: TabType;
  title: string;
  timestamp: string;
  data: any;
}

export interface TechTalkMetric {
  metric: string;
  existingBaseline: string;
  proposedSystem: string;
  improvement: string;
}

export interface TechTalkChapter {
  chapterNumber: number;
  title: string;
  content: string[];
  visualDescription?: string;
  keyTakeaways?: string[];
}

export interface TechTalkReportData {
  title: string;
  subtitle: string;
  domain: string;
  courseTitle: string;
  presenter: string;
  rollNo: string;
  branch: string;
  academicYear: string;
  abstract: string;
  keywords: string[];
  chapters: TechTalkChapter[];
  comparativeMetrics: TechTalkMetric[];
  vivaQuestions: VivaQuestion[];
  references: string[];
}
