import type { Alert, AlertSeverity } from '@/shared/types';
import { BAD_WEBSITES } from '@/shared/types';
import type { Website } from '@/shared/types/appsWebsites';
import type { ActivityTimelineItem } from '@/shared/types/studentDetail';

interface AlertDetectionParams {
  studentId: string;
  studentName: string;
  websites: Website[];
  activities: ActivityTimelineItem[];
  productivityScore?: number;
}

// Extract domain from URL
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// Check if website is in bad websites list
const checkBadWebsite = (url: string): { severity: AlertSeverity | null; category: string } => {
  const domain = extractDomain(url).toLowerCase();

  for (const site of BAD_WEBSITES.high) {
    if (domain.includes(site.toLowerCase())) {
      return { severity: 'high', category: site };
    }
  }

  for (const site of BAD_WEBSITES.medium) {
    if (domain.includes(site.toLowerCase())) {
      return { severity: 'medium', category: site };
    }
  }

  for (const site of BAD_WEBSITES.low) {
    if (domain.includes(site.toLowerCase())) {
      return { severity: 'low', category: site };
    }
  }

  return { severity: null, category: '' };
};

// Detect bad website alerts
export const detectBadWebsiteAlerts = (
  websites: Website[],
  studentId: string,
  studentName: string
): Alert[] => {
  const alerts: Alert[] = [];

  websites.forEach((website) => {
    const check = checkBadWebsite(website.fullUrl || website.domain);
    if (check.severity) {
      alerts.push({
        id: `bad-website-${website.id}-${Date.now()}`,
        type: 'bad_website',
        severity: check.severity,
        status: 'unresolved',
        studentId,
        studentName,
        message: `Visited flagged website: ${extractDomain(website.fullUrl || website.domain)}`,
        timestamp: website.lastVisit,
        details: {
          websiteUrl: website.fullUrl || website.domain,
          duration: Math.floor(website.totalDuration / 60),
        },
      });
    }
  });

  return alerts;
};

// Detect extended idle alerts
export const detectExtendedIdleAlerts = (
  activities: ActivityTimelineItem[],
  studentId: string,
  studentName: string
): Alert[] => {
  const alerts: Alert[] = [];
  const IDLE_THRESHOLD_MINUTES = 25;

  // Sort activities by start time
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  for (let i = 0; i < sortedActivities.length - 1; i++) {
    const current = sortedActivities[i];
    const next = sortedActivities[i + 1];

    const currentEnd = new Date(current.endTime).getTime();
    const nextStart = new Date(next.startTime).getTime();
    const gapMinutes = (nextStart - currentEnd) / (1000 * 60);

    if (gapMinutes > IDLE_THRESHOLD_MINUTES) {
      alerts.push({
        id: `idle-${current.id}-${Date.now()}`,
        type: 'extended_idle',
        severity: 'medium',
        status: 'unresolved',
        studentId,
        studentName,
        message: `Extended idle period detected: ${Math.floor(gapMinutes)} minutes`,
        timestamp: current.endTime,
        details: {
          duration: Math.floor(gapMinutes),
        },
      });
    }
  }

  return alerts;
};

// Detect low productivity alerts
export const detectLowProductivityAlerts = (
  activities: ActivityTimelineItem[],
  productivityScore: number | undefined,
  studentId: string,
  studentName: string
): Alert[] => {
  const alerts: Alert[] = [];
  const LOW_PRODUCTIVITY_THRESHOLD = 40;
  const MIN_DURATION_HOURS = 2;

  if (productivityScore !== undefined && productivityScore < LOW_PRODUCTIVITY_THRESHOLD) {
    // Calculate total unproductive time
    const unproductiveActivities = activities.filter(
      (a) => a.productivity === 'unproductive'
    );
    const totalUnproductiveMinutes = unproductiveActivities.reduce(
      (sum, a) => sum + a.duration,
      0
    );
    const totalUnproductiveHours = totalUnproductiveMinutes / 60;

    if (totalUnproductiveHours >= MIN_DURATION_HOURS) {
      alerts.push({
        id: `low-productivity-${studentId}-${Date.now()}`,
        type: 'low_productivity',
        severity: totalUnproductiveHours > 4 ? 'medium' : 'low',
        status: 'unresolved',
        studentId,
        studentName,
        message: `Low productivity detected: ${productivityScore}% for ${Math.floor(totalUnproductiveHours)} hours`,
        timestamp: new Date().toISOString(),
        details: {
          productivityScore,
          duration: Math.floor(totalUnproductiveMinutes),
        },
      });
    }
  }

  return alerts;
};

// Main detection function
export const detectAlerts = (params: AlertDetectionParams): Alert[] => {
  const alerts: Alert[] = [];

  // Detect bad website alerts
  const badWebsiteAlerts = detectBadWebsiteAlerts(
    params.websites,
    params.studentId,
    params.studentName
  );
  alerts.push(...badWebsiteAlerts);

  // Detect extended idle alerts
  const idleAlerts = detectExtendedIdleAlerts(
    params.activities,
    params.studentId,
    params.studentName
  );
  alerts.push(...idleAlerts);

  // Detect low productivity alerts
  const productivityAlerts = detectLowProductivityAlerts(
    params.activities,
    params.productivityScore,
    params.studentId,
    params.studentName
  );
  alerts.push(...productivityAlerts);

  return alerts;
};
