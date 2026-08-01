export interface AppScreen {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  category?: string;
  aiExtractedFeatures?: string[];
  aiAnalysisDone?: boolean;
}

export interface ProjectLinks {
  githubUrl?: string;
  apkUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  websiteUrl?: string;
}

export interface DeviceConfig {
  deviceType: 'iphone' | 'pixel' | 'samsung' | 'flat';
  color: 'black' | 'titanium' | 'silver' | 'purple' | 'gold';
  showGlare: boolean;
  showShadow: boolean;
  notchType: 'dynamic' | 'small' | 'corner' | 'center' | 'notch' | 'punchhole';
  theme: 'dark' | 'light';
}

export interface DevelopmentMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in_progress' | 'planned';
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  screenId?: string;
}

export interface UserFlowStep {
  stepNumber: number;
  title: string;
  description: string;
  screenId?: string;
}

export interface ShowcaseContent {
  heroTitle: string;
  heroTagline: string;
  overviewSummary: string;
  features: FeatureCard[];
  userFlow: UserFlowStep[];
  milestones: DevelopmentMilestone[];
  architectureNotes?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor?: string;
  techStack: string[];
  links: ProjectLinks;
  screens: AppScreen[];
  deviceConfig: DeviceConfig;
  showcase: ShowcaseContent;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export type ViewMode = 'dashboard' | 'editor' | 'standalone-preview';
export type EditorTab = 'info' | 'screenshots' | 'organizer' | 'device' | 'ai-copilot' | 'preview' | 'export';
export type DevicePreviewViewport = 'desktop' | 'tablet' | 'mobile';
