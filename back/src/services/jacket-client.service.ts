import Axios from 'axios';
import querystring from 'querystring';

export interface JSearch {
  query: string;
  categories?: any[];
  tracker?: string;
}

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
}

export enum JCategory {
  MOVIES = 2000,
  AUDIO = 3000,
  SERIES = 5000,
}

export class JacketClientService {
  constructor(private url: string, private apiKey: string) {

  }

  search(query: JSearch): Promise<JTorrent[]> {
    const jacketRequest: any = {
      apikey: this.apiKey,
      Query: query.query,
      Category: query.categories,
    }
    const queryString = querystring.stringify(jacketRequest);
    return Axios.get(`${this.url}/api/v2.0/indexers/all/results?${queryString}`).then(res => res.data.Results);
  }

  download(link: {path: string; file: string;}): Promise<any> {
    const jacketRequest: any = {
      jackett_apikey: this.apiKey,
      path: link.path,
      file: link.file,
    }
    const queryString = querystring.stringify(jacketRequest);
    return Axios.get(`${this.url}/dl/yggtorrent/?${queryString}`, {responseType: 'arraybuffer'})
  }
}
