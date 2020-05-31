export interface TDTrackerStat {
  announce: string;
  announceState: number;
  downloadCount: number;
  hasAnnounced: boolean;
  hasScraped: boolean;
  host: string;
  id: number;
  isBackup: boolean;
  lastAnnouncePeerCount: number;
  lastAnnounceResult: string;
  lastAnnounceStartTime: number
  lastAnnounceSucceeded: true
  lastAnnounceTime: number
  lastAnnounceTimedOut: boolean;
  lastScrapeResult: string;
   lastScrapeStartTime: number;
   lastScrapeSucceeded: boolean;
   lastScrapeTime: number;
   lastScrapeTimedOut: number;
   leecherCount: number;
   nextAnnounceTime: number;
   nextScrapeTime: number;
   scrape: string;
   scrapeState: number;
   seederCount: number;
   tier: number;
}}
}
