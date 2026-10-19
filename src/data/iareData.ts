export const IARE_BRANCHES = [
  'Computer Science and Engineering (CSE)',
  'CSE (Artificial Intelligence & Machine Learning)',
  'CSE (Data Science)',
  'Computer Science and Information Technology (CSIT)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Aeronautical Engineering (AE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
];

export const IARE_SEMESTERS = [
  'I Year I Semester',
  'I Year II Semester',
  'II Year I Semester',
  'II Year II Semester',
  'III Year I Semester',
  'III Year II Semester',
  'IV Year I Semester',
  'IV Year II Semester',
];

export const IARE_REGULATIONS = ['R22 (Autonomous)', 'R20 (Autonomous)', 'R18 (Autonomous)'];

export const IARE_SECTIONS = ['A', 'B', 'C', 'D'];

export const GRADE_POINTS: { [grade: string]: number } = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  F: 0,
};

export interface SubjectCreditInfo {
  code: string;
  name: string;
  credits: number;
}

// Typical IARE curriculum subjects by semester
export const IARE_CURRICULUM_DATA: Record<string, SubjectCreditInfo[]> = {
  'I Year I Semester': [
    { code: 'AHSD01', name: 'Linear Algebra and Calculus', credits: 4.0 },
    { code: 'AHSD02', name: 'Applied Physics', credits: 4.0 },
    { code: 'ACSD01', name: 'Programming for Problem Solving using C', credits: 4.0 },
    { code: 'AHSD03', name: 'Applied Physics Laboratory', credits: 1.5 },
    { code: 'ACSD02', name: 'Programming for Problem Solving using C Laboratory', credits: 1.5 },
    { code: 'AMED01', name: 'Computer Aided Engineering Graphics', credits: 3.0 },
  ],
  'I Year II Semester': [
    { code: 'AHSD04', name: 'Differential Equations and Vector Calculus', credits: 4.0 },
    { code: 'AHSD05', name: 'Engineering Chemistry', credits: 4.0 },
    { code: 'ACSD03', name: 'Data Structures', credits: 4.0 },
    { code: 'AHSD06', name: 'English for Skill Enhancement', credits: 2.0 },
    { code: 'ACSD04', name: 'Data Structures Laboratory', credits: 1.5 },
    { code: 'AHSD07', name: 'Engineering Chemistry Laboratory', credits: 1.5 },
  ],
  'II Year I Semester': [
    { code: 'ACSD05', name: 'Mathematical Foundations for Computer Science', credits: 3.0 },
    { code: 'ACSD06', name: 'Object Oriented Programming through Java', credits: 3.0 },
    { code: 'ACSD07', name: 'Digital Logic and Computer Organization', credits: 3.0 },
    { code: 'ACSD08', name: 'Database Management Systems', credits: 3.0 },
    { code: 'ACSD09', name: 'Software Engineering', credits: 3.0 },
    { code: 'ACSD10', name: 'Java Programming Laboratory', credits: 1.5 },
    { code: 'ACSD11', name: 'Database Management Systems Laboratory', credits: 1.5 },
    { code: 'ACSD12', name: 'Data Structures & Algorithms Design Studio', credits: 1.5 },
  ],
  'II Year II Semester': [
    { code: 'ACSD13', name: 'Design and Analysis of Algorithms', credits: 3.0 },
    { code: 'ACSD14', name: 'Operating Systems', credits: 3.0 },
    { code: 'ACSD15', name: 'Computer Networks', credits: 3.0 },
    { code: 'ACSD16', name: 'Formal Languages and Automata Theory', credits: 3.0 },
    { code: 'AHSD08', name: 'Managerial Economics and Financial Analysis', credits: 3.0 },
    { code: 'ACSD17', name: 'Operating Systems Laboratory', credits: 1.5 },
    { code: 'ACSD18', name: 'Computer Networks Laboratory', credits: 1.5 },
    { code: 'ACSD19', name: 'Full Stack Development Laboratory', credits: 1.5 },
  ],
  'III Year I Semester': [
    { code: 'ACSD20', name: 'Web Technologies', credits: 3.0 },
    { code: 'ACSD21', name: 'Machine Learning & Neural Networks', credits: 3.0 },
    { code: 'ACSD22', name: 'Compiler Design', credits: 3.0 },
    { code: 'ACSD23', name: 'Professional Elective - I (Cloud Computing)', credits: 3.0 },
    { code: 'AOED01', name: 'Open Elective - I (Disaster Management)', credits: 3.0 },
    { code: 'ACSD24', name: 'Web Technologies Laboratory', credits: 1.5 },
    { code: 'ACSD25', name: 'Machine Learning Laboratory', credits: 1.5 },
    { code: 'ACSD26', name: 'Technical Seminar & Presentation', credits: 1.0 },
  ],
  'III Year II Semester': [
    { code: 'ACSD27', name: 'Artificial Intelligence & Expert Systems', credits: 3.0 },
    { code: 'ACSD28', name: 'Information Security & Cryptography', credits: 3.0 },
    { code: 'ACSD29', name: 'Professional Elective - II (Big Data Analytics)', credits: 3.0 },
    { code: 'ACSD30', name: 'Professional Elective - III (DevOps)', credits: 3.0 },
    { code: 'AOED02', name: 'Open Elective - II (Intellectual Property Rights)', credits: 3.0 },
    { code: 'ACSD31', name: 'AI & Security Laboratory', credits: 1.5 },
    { code: 'ACSD32', name: 'Mini Project with Seminar', credits: 2.0 },
  ],
  'IV Year I Semester': [
    { code: 'ACSD33', name: 'Deep Learning & Natural Language Processing', credits: 3.0 },
    { code: 'ACSD34', name: 'Professional Elective - IV (Blockchain Technologies)', credits: 3.0 },
    { code: 'ACSD35', name: 'Professional Elective - V (Cyber Forensics)', credits: 3.0 },
    { code: 'AOED03', name: 'Open Elective - III (Industrial Management)', credits: 3.0 },
    { code: 'ACSD36', name: 'Project Work Phase - I', credits: 3.0 },
    { code: 'ACSD37', name: 'Comprehensive Viva Voce', credits: 1.0 },
  ],
  'IV Year II Semester': [
    { code: 'ACSD38', name: 'Professional Elective - VI (Autonomous Robotics)', credits: 3.0 },
    { code: 'ACSD39', name: 'Project Work Phase - II & Dissertation', credits: 9.0 },
  ],
};

export const PPT_PRESETS = [
  'Artificial Intelligence in Modern Healthcare & Diagnostics',
  'Blockchain Architecture for Secure Electronic Voting',
  'Quantum Computing: Principles and Cryptographic Impact',
  'Edge Computing in Autonomous Vehicles',
  'Zero Trust Architecture for Enterprise Cybersecurity',
  'Microservices vs Serverless Cloud Architecture',
  'Generative AI: Transformer Models & LLM Mechanics',
];

export const LAB_PRESETS = [
  { subject: 'Data Structures', title: 'Binary Search Tree Operations (Insert, Delete, Search, Traversal)', lang: 'c' },
  { subject: 'Data Structures', title: 'Implementation of Dijkstra\'s Shortest Path Algorithm', lang: 'cpp' },
  { subject: 'Python Programming', title: 'Data Cleaning and Exploratory Analysis using Pandas and NumPy', lang: 'python' },
  { subject: 'Java Programming', title: 'Multithreading and Producer-Consumer Synchronization using Monitor', lang: 'java' },
  { subject: 'Database Management Systems', title: 'Bank Transaction Management with ACID Properties and SQL Triggers', lang: 'sql' },
  { subject: 'Operating Systems', title: 'Simulation of Round Robin and Priority CPU Scheduling Algorithms', lang: 'c' },
  { subject: 'Web Technologies', title: 'Responsive E-Commerce Catalog with AJAX and RESTful Fetch API', lang: 'javascript' },
  { subject: 'Machine Learning', title: 'Classification of Diabetes Dataset using Random Forest Classifier', lang: 'python' },
];

export const ASSIGNMENT_PRESETS = [
  'Analyze Memory Management and Paging vs Segmentation in Linux Kernel',
  'Design an ACID-Compliant Distributed Relational Database Schema for E-Commerce',
  'Derive Time Complexity of QuickSort and MergeSort with Recurrence Relations',
  'Explain TCP Congestion Control Algorithms (Tahoe, Reno, BBR)',
  'Contrast Convolutional Neural Networks (CNN) vs Vision Transformers (ViT)',
];

export const CASE_STUDY_PRESETS = [
  'Netflix Microservices Architecture & Chaos Monkey Resiliency',
  'Uber Dynamic Surge Pricing & Distributed Geospatial Dispatching',
  'CrowdStrike Falcon Sensor Outage Analysis & Root Cause Mitigation',
  'WhatsApp Architecture for Handling 100 Billion Messages Daily',
  'UPI (Unified Payments Interface) High-Throughput Financial Pipeline',
];

export const CODE_SOLVER_PRESETS = [
  'Longest Substring Without Repeating Characters (Sliding Window)',
  'Trapping Rain Water (Two Pointers & Dynamic Programming)',
  'LRU Cache Implementation using Doubly Linked List and Hash Map',
  'Detect Cycle in a Directed Graph using Kahn\'s BFS Algorithm',
  'Median of Two Sorted Arrays in O(log(min(M, N)))',
];

export const PROJECT_DOC_PRESETS = [
  'Smart Campus Navigation and IoT-Powered Attendance System for IARE',
  'Automated Resume Screening & Placement Eligibility Predictor',
  'Decentralized Student Credential Verification on Ethereum Blockchain',
  'AI-Powered Medical Diagnosis and Prescription OCR System',
  'Autonomous Drone Collision Avoidance using Computer Vision and LiDAR',
];

export const IARE_PORTAL_LINKS = [
  {
    name: 'IARE AUMS Portal',
    url: 'https://iare-aums.com',
    desc: 'Academic ERP, Marks, Course Registration & Grade Cards',
    category: 'Portals',
    badge: 'Primary ERP',
  },
  {
    name: 'Akanksha Student Information',
    url: 'https://akanksha.iare.ac.in',
    desc: 'Student Profile, Fee Payments, Hall Tickets & CIA Marks',
    category: 'Portals',
    badge: 'Student Info',
  },
  {
    name: 'IARE CMS (Course Management System)',
    url: 'https://cms.iare.ac.in',
    desc: 'Lecture notes, Course files, Question banks & PPT slides',
    category: 'Academics',
    badge: 'Study Material',
  },
  {
    name: 'IARE MOODLE LMS',
    url: 'https://moodle.iare.ac.in',
    desc: 'Online quizzes, Virtual labs, coding assignments & tutorials',
    category: 'Academics',
    badge: 'Learning LMS',
  },
  {
    name: 'Autonomous Examination Portal',
    url: 'https://exams.iare.ac.in',
    desc: 'Semester End Examination (SEE) Results, Timetables & Revaluation',
    category: 'Examinations',
    badge: 'Results',
  },
  {
    name: 'IARE Digital Library & IEEE Explore',
    url: 'https://library.iare.ac.in',
    desc: 'IEEE Xplore, DELNET, ScienceDirect research papers & e-books',
    category: 'Research',
    badge: 'Research',
  },
];

export const BLOOMS_TAXONOMY_LEVELS = [
  { level: 'L1: Remembering', verbs: 'Define, State, List, Name, Identify, Recall', weight: '10-15%' },
  { level: 'L2: Understanding', verbs: 'Explain, Describe, Discuss, Summarize, Classify', weight: '20-25%' },
  { level: 'L3: Applying', verbs: 'Solve, Apply, Calculate, Demonstrate, Illustrate', weight: '25-30%' },
  { level: 'L4: Analyzing', verbs: 'Analyze, Compare, Contrast, Differentiate, Distinguish', weight: '20-25%' },
  { level: 'L5: Evaluating', verbs: 'Assess, Justify, Appraise, Conclude, Criticize', weight: '10-15%' },
  { level: 'L6: Creating', verbs: 'Design, Construct, Formulate, Develop, Propose', weight: '5-10%' },
];
