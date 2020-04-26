import { Environment } from '../environment';
import { BrowserTorrent, BrowserComputedData, BrowserTag } from '../core/torrent.model';


export type YggCategories = 'All' | 'Videos' | 'Movies' | 'TV' | 'Emulation' | 'Games' | 'Applications' | 'Music' | 'Books' | 'GPS' | 'XXX';
export interface BrowserSearch {search: string; category: YggCategories; limit: number};

const knownTags : BrowserTag[] = [
  { name: '1080p', color: '#f23d3d'},
  { name: '720p', color: '#f2a53d'},
  { name: 'x264', color: '#e3ec30'},
  { name: 'H264', color: '#4baa25'},
  { name: 'BluRay', color: '#1cb157'},
  { name: 'HDLight', color: '#11afac'},
  { name: 'TrueFrench', color: '#1178af'},
  { name: 'Multi', color: '#1d40c4'},
  { name: 'AC3', color: '#5f1dc4'},
  { name: 'DVDRip', color: '#8012a9'},
  { name: 'FLAC', color: '#12a952'},
  { name: 'MP3', color: '#a91289'},
  { name: 'x265', color: '#a91289'},
  { name: 'x265-H4S5S', color: '#a91289'},
  { name: 'x264-ARK01', color: '#a91289'},
  { name: 'x265-H4S5S', color: '#a91289'},
  { name: 'VOSTFR', color: '#a91289'},
  { name: 'VFF', color: '#a91289'},
  { name: 'FRENCH', color: '#a91289'},
  { name: 'TVRip ', color: '#a91289'},
  { name: 'MP3 220kbs', color: '#a91289'},
];
export class TorrentBrowserService {

  constructor(private ts: any, env: Environment) {
    env.torrentProviders.forEach(p => {
      ts.overrideConfig(p.name, {
        baseUrl: p.baseUrl,
        enableCloudFareBypass: true,
      });
      ts.enableProvider(p.name, p.username, p.password);
    });
  }

  search(s: BrowserSearch): Promise<BrowserTorrent[]> {
    return this.ts.search(s.search, s.category, s.limit)
      .then((results: BrowserTorrent[]) => Promise.resolve(results.map((r: BrowserTorrent) => this.computeData(r))));
  }

  downloadTorrent(torrent: BrowserTorrent, path?: string): Promise<any> {
    if (path) {
      this.ts.downloadTorrent(torrent, path);
    }
    return this.ts.downloadTorrent(torrent as any);
  }

  computeData(torrent: BrowserTorrent): BrowserTorrent {
    const data : BrowserComputedData = {
      title: this.computeTitle(torrent),
      tags: this.computeTags(torrent),
    };

    torrent.computedData = data;
    return torrent;
  }

  private computeTitle(torrent: BrowserTorrent): string {
    const titleSplit = torrent.title.replace(/\s/g, '.').replace('/\[/g', '').replace('/\]/g', '').split('.');

    let title = '';
    titleSplit.forEach(part => {
      const foundTag = knownTags.find(t => t.name.toLocaleLowerCase() === part.toLocaleLowerCase());
      if (!foundTag) {
        title += '.' + part;
      }
    });

    return title.replace(/\./g, ' ');
  }

  private computeTags(torrent: BrowserTorrent): BrowserTag[] {
    const tags : BrowserTag[] = [];
    const title = torrent.title.replace(/\s/g, '.').replace('/\[/g', '').replace('/\]/g', '');
    title.split('.').forEach(part => {
      const foundTag = knownTags.find(t => t.name.toLocaleLowerCase() === part.toLocaleLowerCase());
      if (foundTag) {
        tags.push(foundTag)
      }
    });

    return tags;
  }

}
