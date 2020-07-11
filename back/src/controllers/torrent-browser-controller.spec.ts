import {TorrentBrowserController} from './torrent-browser-controller';
import { JTorrent } from '../clients/jacket-client/models/jtorrent.model';
const EXPRESS_RES_MOCK: any = {
  json: (data: any) => Promise.resolve(data),
  writeHead: (status: number, data: any): any => {}
}

const TransmissionDaemonClientMock = jest.fn().mockImplementation(() => ({
  get: (a: any, b: any[]): Promise<any[]> => Promise.resolve([{}]),
  add: (a: string, b: string) => Promise.resolve('success'),
  remove: (a: number, b: boolean) => Promise.resolve('success'),
  move: (a: number, b: boolean) => Promise.resolve('success'),
  stop: (a: number) => Promise.resolve('success'),
  start: (a: number) => Promise.resolve('success'),
}));

const JackettClientMock = jest.fn().mockImplementation(() => ({
  search: (val: any) => Promise.resolve([{}]),
}));




describe('TorrentBrowserController', () => {
  let controller: TorrentBrowserController;
  let tdClient: any;
  let jackettClient: any;

  beforeEach(() => {
    tdClient = new TransmissionDaemonClientMock();
    jackettClient = new JackettClientMock();
    controller = new TorrentBrowserController(jackettClient, tdClient,[{
      name: 'Films',
      path: '/data/films',
      description: 'Films',
      warning: null,
      icon: 'movie',
      category: '2000',
      rights: null,
      default: true
    }]);
  });


  test('search()', async () => {
    const request: any = {
      query: {
        search: 'test',
        category: '2000',
      }
    }

    const jtMock: JTorrent = {
      FirstSeen: '',
      Tracker: '',
      TrackerId: '',
      CategoryDesc: '',
      BlackholeLink: '',
      Title: '',
      Guid: '',
      Link: '',
      Comments: '',
      PublishDate: '',
      Category: [],
      Size: 0,
      Grabs: '',
      Description: '',
      MinimumRatio: 0,
      MinimumSeedTime: 0,
      DownloadVolumeFactor: 0,
      UploadVolumeFactor: 0,
      Gain: 0,
      Seeders: 0,
      Peers: 0,
    }
    jackettClient.search =  (val: any) => Promise.resolve([jtMock]);
    const result = await controller.search(request, EXPRESS_RES_MOCK, null);
    expect(result).toEqual([{
      computedData: {
        tags: [],
        title: '',
      },
      desc: '',
      destination: null,
      id: null,
      link: {
        file: undefined,
        path: undefined,
      },
      peers: 0,
      provider: '',
      seeds: 0,
      size:0,
      time: null,
      title: ''
    }]);
  });
});
