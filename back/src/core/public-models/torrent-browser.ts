import {TorrentBrowserComputedData} from './torrent-browser-computed-data';

export interface TorrentBrowser {
  title: string;
  time: Date;
  seeds: number;
  peers: number;
  size: string;
  desc: string;
  id: string;
  provider: string;
  link: {
    path: string;
    file: string;
  };
  computedData: TorrentBrowserComputedData;
  destination?: any
}
