export type ExamCategory = 'central' | 'state';

export interface ExamStage {
  name: string;
  type: 'Objective (MCQ)' | 'Descriptive' | 'Physical / Medical' | 'Interview / Personality' | 'Typing / Skill';
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: string;
  description: string;
  subjects: {
    subjectName: string;
    questionsCount: number;
    marks: number;
  }[];
}

export interface SyllabusSection {
  subject: string;
  weightage: 'High' | 'Medium' | 'Essential';
  topics: string[];
  recommendedBooks: string[];
  keyFocusAreas: string;
}

export interface Exam {
  id: string;
  title: string;
  shortCode: string;
  category: ExamCategory;
  state?: string;
  conductingBody: string;
  educationalQualification: string;
  ageLimit: string;
  attempts: string;
  stages: ExamStage[];
  syllabus: SyllabusSection[];
  preparationStrategy: {
    roadmap: string[];
    cutoffTrends: string;
    proTips: string[];
  };
  officialPortal: string;
  frequency: string;
  popularFor: string;
}

export interface QuizQuestion {
  id: string;
  examId: string;
  examName: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  previousYearRef?: string;
}

export interface QuizSession {
  id: string;
  title: string;
  examId: string;
  examName: string;
  category: 'Full Mock' | 'Subject Practice' | 'Previous Year' | 'Scholarship Aptitude';
  totalQuestions: number;
  durationMinutes: number;
  negativeMarkingRatio: number; // e.g. 0.25, 0.33, or 0
  questions: QuizQuestion[];
  instructions: string[];
}

export interface QuestionAnalyticsItem {
  questionId: string;
  userAnswerIndex: number | null;
  correctAnswerIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  id: string;
  quizSessionId: string;
  quizTitle: string;
  examName: string;
  date: string;
  totalQuestions: number;
  timeSpentSeconds: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  subjectAnalytics: Record<string, { correct: number; total: number; accuracy: number }>;
  questionAnalytics: QuestionAnalyticsItem[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: 'Central Exams' | 'State Exams' | 'General Studies' | 'Aptitude & Reasoning' | 'Scholarships' | 'Current Affairs';
  targetExams: string[];
  subject: string;
  readTime: string;
  format: 'Revision Capsule' | 'Quick Notes' | 'Formula Sheet' | 'Previous Year Digest';
  tags: string[];
  lastUpdated: string;
  summary: string;
  content: string; // Markdown or rich structured text
  isDownloaded?: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  authority: string;
  category: 'Central Government' | 'State Government' | 'Technical & Higher' | 'Girl Child & Minority' | 'Talent Search';
  targetLevel: 'School (Class 8-10)' | 'Class 11 & 12' | 'Undergraduate (UG)' | 'Postgraduate (PG)' | 'Abroad / Overseas';
  awardAmount: string;
  financialBenefitDetails: string;
  eligibility: {
    familyIncomeLimit: string;
    academicPercentage: string;
    targetCommunity: string;
    applicableCourses: string;
  };
  selectionProcess: {
    hasWrittenExam: boolean;
    examName?: string;
    examPattern?: string;
    selectionCriteria: string;
  };
  keyDates: {
    applicationWindow: string;
    examDate?: string;
  };
  officialPortal: string;
  documentsRequired: string[];
  stepByStepGuide: string[];
}

// ----------------------------------------------------
// BRANDED COMPANY AI INTERVIEW & TEST ASSESSMENT TYPES
// ----------------------------------------------------

export type CompanyDifficulty = 'Medium' | 'Hard' | 'Very Hard' | 'Executive';

export interface CompanyRound {
  stageNumber: number;
  title: string;
  duration: string;
  type: 'Recruiter Screen' | 'Online Assessment (OA)' | 'Technical / DSA' | 'System Design & Architecture' | 'Behavioral / Leadership Fit' | 'Case Study / Superday';
  description: string;
  evalCriteria: string[];
  sampleQuestions: string[];
  passRate: string;
  proTips: string[];
}

export interface CompanyInfo {
  id: string;
  name: string;
  logoBadge: string;
  tagline: string;
  accentColor: string;
  difficulty: CompanyDifficulty;
  avgTurnaroundWeeks: string;
  interviewStyle: string;
  keyHiringPillars: {
    name: string;
    description: string;
  }[];
  salaryBenchmark: {
    level: string;
    role: string;
    base: string;
    totalCompensation: string;
  }[];
  rounds: CompanyRound[];
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
  topQuestions: {
    question: string;
    category: string;
    idealAnswerOutline: string;
    keyMetricsToHit: string;
  }[];
}

export interface InterviewMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Lean No Hire' | 'No Hire';
  verdictDescription: string;
  metrics: {
    technicalOrDomain: number;
    starMethodStructure: number;
    communicationClarity: number;
    culturalAndLeadershipFit: number;
  };
  strengths: string[];
  weaknesses: string[];
  exemplaryAnswer: string;
  actionableAdvice: string[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'coding' | 'mcq' | 'situational';
  title: string;
  problemText: string;
  starterCode?: string;
  testCases?: { input: string; expectedOutput: string }[];
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  companyTip: string;
}

export interface CompanyAssessmentTest {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  type: 'Coding & Algorithmic Challenge' | 'Aptitude & Logical OA' | 'Work Style & Situational Judgment' | 'Case Math & Financial Analytics';
  durationMinutes: number;
  difficulty: 'Medium' | 'Hard';
  description: string;
  questions: AssessmentQuestion[];
}

export interface SavedInterviewSession {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  level: string;
  roundType: string;
  date: string;
  durationMinutes: number;
  messages: InterviewMessage[];
  evaluation?: InterviewEvaluation;
}

// PRO AI Tri-Department Engineering Types
export interface ECEComponent {
  name: string;
  category: 'Microcontroller' | 'Sensor' | 'Actuator' | 'Power' | 'Communication' | 'Passive';
  specs: string;
  pinConnections: string;
  roleInProject: string;
}

export interface ECECircuitNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'mcu' | 'sensor' | 'actuator' | 'power' | 'network';
  x: number; // percentage in diagram
  y: number; // percentage in diagram
  connectedTo: string[];
  details: string;
  voltage: string;
}

export interface ECECircuitDesign {
  title: string;
  summary: string;
  workingPrinciple: string;
  schematicDescription: string;
  nodes: ECECircuitNode[];
  components: ECEComponent[];
  signalFlowSteps: string[];
  voltageAndPowerSpecs: {
    operatingVoltage: string;
    currentConsumption: string;
    backupSource: string;
  };
}

export interface CSEModuleCode {
  language: 'cpp' | 'python' | 'typescript';
  filename: string;
  purpose: string;
  whyLanguage?: string;
  code: string;
  buggyCodeSample: string;
  simulatedError: {
    errorType: string;
    errorMessage: string;
    line: number;
    explanation: string;
    solutionDiff: string;
  };
}

export interface ArchitectureMaterialCalculation {
  builtUpAreaSqFt: number;
  floors: number;
  wallThicknessInches: number;
  ceilingHeightFeet: number;
  mortarRatio: string;
  concreteGrade: string;
  sand: {
    cubicFeet: number;
    cubicMeters: number;
    metricTons: number;
    truckloads: number;
    formula: string;
  };
  cement: {
    bags50kg: number;
    metricTons: number;
    kg: number;
    formula: string;
  };
  bricks: {
    totalUnits: number;
    standardSize: string;
    wastagePercent: number;
    formula: string;
  };
  steel: {
    kg: number;
    tons: number;
  };
  aggregateGravel: {
    cubicFeet: number;
    metricTons: number;
  };
  waterLiters: number;
  estimatedMaterialCostINR: number;
  estimatedMaterialCostUSD: number;
}

export interface ArchitectureDesign {
  title: string;
  conceptVision: string;
  structuralLayout: {
    zones: {
      name: string;
      dimensions: string;
      purpose: string;
      sensorPlacement: string;
      constructionDetails: string;
    }[];
    sustainabilityFeatures: string[];
    passiveBioclimaticStrategies: string[];
  };
  defaultMaterialEstimates: ArchitectureMaterialCalculation;
}

export interface ProAIUnifiedProject {
  id: string;
  name: string;
  tagline: string;
  visionAbstract: string;
  domainSynergy: {
    eceRole: string;
    cseRole: string;
    archRole: string;
    unifiedValue: string;
  };
  systemDesignBlueprint: {
    overallArchitecture: string;
    subsystems: { name: string; dept: 'ECE' | 'CSE' | 'ARCHITECTURE'; description: string }[];
  };
  advantages: string[];
  disadvantages: string[];
  futureUpgrades: string[];
  ece: ECECircuitDesign;
  cse: {
    title: string;
    architectureOverview: string;
    modules: CSEModuleCode[];
  };
  architecture: ArchitectureDesign;
}

