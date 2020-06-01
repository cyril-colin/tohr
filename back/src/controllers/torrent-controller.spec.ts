
import { TorrentController } from './torrent-controller';
import { TransmissionDaemonClient } from '../clients/transmission-daemon-client/transmission-daemon-client'
jest.mock('../clients/transmission-daemon-client/transmission-daemon-client', () => {
  return {
    TransmissionDaemonClient: jest.fn().mockImplementation(() => {
      return {
        get: (a: any, b: any[]): Promise<any[]> => Promise.resolve([]),
      }
    })
  }
});

const mockedAxios = TransmissionDaemonClient as jest.Mocked<typeof TransmissionDaemonClient>;

const responseMock: any = {
  json: (data: any) => Promise.resolve(data),
}

// get: (a: any, b:any[]): any[] => []
describe('JackettClient', () => {
  let controller: TorrentController;
  let tdSpy: any;
  let tdServiceMock: TransmissionDaemonClient;
  beforeEach(() => {
    tdServiceMock = new TransmissionDaemonClient(null);
    controller = new TorrentController(tdServiceMock, null, null);
  });


  test('getAll()', async () => {

    const result = await controller.getAll(null, responseMock, null);
    expect(result).toEqual([]);
  });
});


