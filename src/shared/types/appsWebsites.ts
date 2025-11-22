export interface Application {
  id: string;
  name: string;
  category: 'productive' | 'neutral' | 'unproductive';
  totalDuration: number; // seconds
  sessionsCount: number;
  lastUsed: string; // ISO timestamp
  icon?: string;
}

export interface ApplicationCategoryStats {
  productive: {
    count: number;
    percentage: number;
    totalDuration: number;
  };
  neutral: {
    count: number;
    percentage: number;
    totalDuration: number;
  };
  unproductive: {
    count: number;
    percentage: number;
    totalDuration: number;
  };
  totalApps: number;
}

export interface TopAppsParams {
  limit?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  userId?: string;
}

export interface Website {
  id: string;
  domain: string;
  fullUrl: string;
  category: 'productive' | 'neutral' | 'flagged';
  totalDuration: number; // seconds
  visitsCount: number;
  lastVisit: string; // ISO timestamp
  isBlocked?: boolean;
  urls?: string[]; // All URLs from this domain
}

export interface WebsiteUsageParams {
  limit?: number;
  startDate: string; // YYYY-MM-DD
  userId?: string;
}

export interface WebsiteHeatmapData {
  hour: number; // 0-23
  domain: string;
  duration: number; // seconds
}

// Hardcoded productivity mappings
export const PRODUCTIVE_APPS = [
  'vscode',
  'visual studio code',
  'code',
  'sublime',
  'atom',
  'notion',
  'obsidian',
  'microsoft word',
  'microsoft excel',
  'google docs',
  'slack',
  'zoom',
  'teams',
  'chrome',
  'firefox',
  'safari',
  'edge',
];

export const UNPRODUCTIVE_APPS = [
  'game',
  'steam',
  'epic games',
  'fortnite',
  'minecraft',
  'roblox',
  'discord',
  'spotify',
  'youtube',
  'netflix',
  'tiktok',
  'instagram',
];

export const FLAGGED_WEBSITES = [
  'gaming-site.com',
  'game.com',
  'gaming.com',
  'unblocked-games.com',
  'coolmathgames.com',
  'friv.com',
  'y8.com',
];

export const PRODUCTIVE_WEBSITES = [
  'github.com',
  'stackoverflow.com',
  'w3schools.com',
  'mdn.com',
  'coursera.org',
  'edx.org',
  'khanacademy.org',
  'udemy.com',
  'codecademy.com',
];
