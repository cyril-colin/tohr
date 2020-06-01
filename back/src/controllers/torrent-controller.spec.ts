
import { TorrentController } from './torrent-controller';
import { TransmissionDaemonClient } from '../clients/transmission-daemon-client/transmission-daemon-client'
import { TDTorrent } from '../clients/transmission-daemon-client/models/tdtorrent';

const responseMock: any = {
  json: (data: any) => Promise.resolve(data),
}

// get: (a: any, b:any[]): any[] => []
describe('JackettClient', () => {
  let controller: TorrentController;
  let tdServiceMock: any;
  let mockMapper: any;


  test('getAll()', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      get: (a: any, b: any[]): Promise<TDTorrent[]> => Promise.resolve([{
        activityDate: 0,
        comment: '',
        corruptEver: 0,
        creator: '',
        dateCreated: 0,
        desiredAvailable: 0,
        downloadEver: 0,
        fileStats: [],
        files: [],
        hashString: '',
        haveUnchecked: 0,
        haveValid: 0,
        id: 0,
        isPrivate: true,
        peers: [],
        pieceCount: 0,
        pieceSize: 0,
        startDate: 0,
        trackStats: [],
        trackers: [],
        status: 0,
        downloadDir: '',
        error: 0,
        errorString: '',
        name: '',
        percentDone: 0,
        rateDownload: 0,
        rateUpload: 0,
        totalSize: 0,
        addedDate: 0,
      }]),
    }));
    tdServiceMock = new MockTD();

    const MockMapper = jest.fn().mockImplementation(() => ({
      toFrontTorrent: (a: any): any => ({}),
    }));
    mockMapper = new MockMapper();
    controller = new TorrentController(tdServiceMock, mockMapper, null);
    const result = await controller.getAll(null, responseMock, null);
    expect(result.length).toEqual(1);
  });

  test('getAll() error', async () => {
    const Mock = jest.fn().mockImplementation(() => ({
      get: (a: any, b: any[]): Promise<any[]> => Promise.reject(),
    }));

    tdServiceMock = new Mock();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.getAll(null, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });
});


