import axios from 'axios';
import querystring from 'querystring';
import { JSearch } from './models/jsearch.model';
import { JTorrent } from './models/jtorrent.model';

export class JackettClient {
  constructor(private url: string, private apiKey: string) {

  }

  search(query: JSearch): Promise<JTorrent[]> {
    const jacketRequest: any = {
      apikey: this.apiKey,
      Query: query.query,
      Category: query.categories,
    }
    const queryString = querystring.stringify(jacketRequest);
    return axios.get(`${this.url}/api/v2.0/indexers/all/results?${queryString}`).then(res => res.data.Results);
  }

  download(link: {path: string; file: string;}): Promise<any> {
    const jacketRequest: any = {
      jackett_apikey: this.apiKey,
      path: link.path,
      file: link.file,
    }
    const queryString = querystring.stringify(jacketRequest);
    return axios.get(`${this.url}/dl/yggtorrent/?${queryString}`, {responseType: 'arraybuffer'})
  }
}
