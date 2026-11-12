export type ReactorState = 
  | 'standby' 
  | 'activation' 
  | 'listening' 
  | 'thinking' 
  | 'speaking' 
  | 'executing' 
  | 'error';

export type PageView = 
  | 'landing'
  | 'dashboard'
  | 'conversation'
  | 'memory'
  | 'personalization'
  | 'devices'
  | 'commands'
  | 'automations'
  | 'history'
  | 'ai-settings'
  | 'account'
  | 'apk'
  | 'contract'
  | 'help';

export type MemoryCategory = 
  | 'Personal information'
  | 'Preferences'
  | 'Projects'
  | 'Conversations'
  | 'Routines'
  | 'Knowledge'
  | 'Custom instructions'
  | 'Device information';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  preferredName: string;
  assistantName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  assistantName?: string;
  preferredName?: string;
  theme: 'cyber-dark' | 'deep-navy' | 'stark-black';
  reactorColor: 'cyan' | 'gold-crimson' | 'violet' | 'emerald' | 'monochrome';
  reactorStyle: 'classic-arc' | 'mark-50' | 'genesis' | 'quantum';
  voiceName: string;
  speechRate: number; // 0.8 to 1.3
  speechPitch: number; // 0.8 to 1.2
  language: 'English' | 'Hindi' | 'Hinglish';
  personality: 'professional' | 'friendly' | 'concise' | 'detailed';
  autoMemoryEnabled: boolean;
  cloudSyncEnabled: boolean;
  soundEffectsEnabled: boolean;
  wakeWordEnabled: boolean;
  updatedAt: string;
}

export interface Memory {
  id: string;
  userId: string;
  category: MemoryCategory;
  title: string;
  content: string;
  tags?: string[];
  source: 'user_input' | 'ai_conversation' | 'command_execution' | 'manual';
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messageCount: number;
  lastMessageSnippet: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  detectedAction?: string | null;
}

export interface CustomCommand {
  id: string;
  userId: string;
  name: string;
  triggerPhrase: string;
  description: string;
  targetDevice: 'Web App' | 'Android Phone' | 'Windows PC' | 'All Connected';
  actionIdentifier: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Automation {
  id: string;
  userId: string;
  name: string;
  triggerType: 'Schedule (Time)' | 'Device Connected' | 'Voice Shortcut' | 'Geofence Entry';
  triggerConfig: string;
  actionType: 'Daily Briefing' | 'Memory Snapshot' | 'Device Routine' | 'Notification Ping';
  actionPayload: string;
  isEnabled: boolean;
  lastRunAt?: string;
  createdAt: string;
}

export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'Android Phone' | 'Windows PC' | 'Smart Board';
  status: 'online' | 'standby' | 'pairing' | 'revoked';
  pairingCode: string;
  lastSyncAt: string;
  permissions: {
    microphone: boolean;
    notifications: boolean;
    camera: boolean;
    accessibility: boolean;
  };
  supportedFeatures: string[];
  createdAt: string;
}

export interface APKReleaseManifest {
  versionName: string;
  versionCode: number;
  downloadUrl: string;
  fileSize: string;
  releaseDate: string;
  minimumAndroidVersion: string;
  targetAndroidVersion: string;
  architecture: string;
  sha256: string;
  isReleased: boolean;
  releaseNotes: string[];
}

export type SyncStatus = 'cloud_synced' | 'local_mode' | 'syncing' | 'offline_cached';
