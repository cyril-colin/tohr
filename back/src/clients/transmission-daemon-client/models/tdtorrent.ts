import { TDFileStat } from './tdfile-stat';
import { TDFile } from './tdfile';
import { TDTrackerStat } from './tdtracker-stat';
import { TDTracker } from './tdtracker';



export interface TDTorrent {
  activityDate: number;
  comment: string;
  corruptEver: number;
  creator: string;
  dateCreated: number;
  desiredAvailable: number;
  downloadEver: number;
  fileStats: TDFileStat[];
  files: TDFile[];
  hashString: string;
  haveUnchecked: number;
  haveValid: number;
  id: number;
  isPrivate: boolean;
  peers: any[];
  pieceCount: number;
  pieceSize: number;
  startDate: number;
  trackStats: TDTrackerStat[];
  trackers: TDTracker[];
  status: number;
  downloadDir: string;
  error: number;
  errorString: string;
  name: string;
  percentDone: number;
  rateDownload: number;
  rateUpload: number;
  totalSize: number;
  addedDate: number;
}
