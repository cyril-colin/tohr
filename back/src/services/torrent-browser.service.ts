import { Environment } from '../environment';


export type YggCategories = 'All' | 'Videos' | 'Movies' | 'TV' | 'Emulation' | 'Games' | 'Applications' | 'Music' | 'Books' | 'GPS' | 'XXX';
export interface BrowserSearch {search: string; category: YggCategories; limit: number};
export class TorrentBrowserService {

  constructor(private ts: any, env: Environment) {
    env.torrentProviders.forEach(p => {
      ts.overrideConfig(p.name, {
        baseUrl: p.baseUrl,
      });
      ts.enableProvider(p.name, p.username, p.password);
    });
  }

  search(s: BrowserSearch): Promise<any> {
    return this.ts.search(s.search, s.category, s.limit);
  }

  downloadTorrent(torrent: any, path?: string): Promise<any> {
    if (path) {
      this.ts.downloadTorrent(torrent, path);
    }
    return this.ts.downloadTorrent(torrent);
  }


}
