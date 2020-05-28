export interface JTorrent {
  FirstSeen: string;
  Tracker: string;
  TrackerId: string;
  CategoryDesc: string;
  BlackholeLink: string;
  Title: string;
  Guid: string;
  Link: string;
  Comments: string;
  PublishDate: string;
  Category: any[];
  Size: number;
  Grabs: any;
  Description: string;
  MinimumRatio: number;
  MinimumSeedTime: number;
  DownloadVolumeFactor: number;
  UploadVolumeFactor: number;
  Gain: number;
  Seeders: number;
  Peers: number;
}
