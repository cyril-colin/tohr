import { JTorrent } from './jacket-client.service';
import { BrowserTorrent, BrowserTag } from '../core/torrent.model';
import querystring from 'querystring';

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


export class JackettMapper {
  static toFrontResult(jackettTorrent: JTorrent): BrowserTorrent {

    const link = querystring.parse(jackettTorrent.Link.split('?')[1]);
    const t : BrowserTorrent = {
      title: jackettTorrent.Title,
      time: null,
      seeds: jackettTorrent.Seeders,
      peers: null,
      size: JSON.stringify(jackettTorrent.Size),
      desc: null,
      id: null,
      provider: jackettTorrent.Tracker,
      link: {
        path: link.path as string,
        file: link.file as string
      },
      computedData: {
        title: this.computeTitle(jackettTorrent.Title),
        tags: this.computeTags(jackettTorrent.Title),
      },
      destination: null,
    }

    return t;
  }


  private static computeTitle(title: string): string {
    const titleSplit = title.replace(/\s/g, '.').replace('/\[/g', '').replace('/\]/g', '').split('.');

    let result = '';
    titleSplit.forEach(part => {
      const foundTag = knownTags.find(t => t.name.toLocaleLowerCase() === part.toLocaleLowerCase());
      if (!foundTag) {
        result += '.' + part;
      }
    });

    return result.replace(/\./g, ' ');
  }

  private static computeTags(title: string): BrowserTag[] {
    const tags : BrowserTag[] = [];
    const titleFormatted = title.replace(/\s/g, '.').replace('/\[/g', '').replace('/\]/g', '');
    titleFormatted.split('.').forEach(part => {
      const foundTag = knownTags.find(t => t.name.toLocaleLowerCase() === part.toLocaleLowerCase());
      if (foundTag) {
        tags.push(foundTag)
      }
    });

    return tags;
  }
}
