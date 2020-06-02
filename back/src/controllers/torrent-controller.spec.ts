
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
      get: (a: any, b: any[]): Promise<any[]> => Promise.resolve([{}]),
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

  test('getAll() error TDS', async () => {
    const Mock = jest.fn().mockImplementation(() => ({
      get: (a: any, b: any[]): Promise<any[]> => Promise.reject(),
    }));

    tdServiceMock = new Mock();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.getAll(null, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });

  test('get()', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      get: (a: any, b: any[]): Promise<any[]> => Promise.resolve([{}]),
    }));
    tdServiceMock = new MockTD();

    const MockMapper = jest.fn().mockImplementation(() => ({
      toFrontTorrent: (a: any): any => ({fake: null}),
    }));
    mockMapper = new MockMapper();
    controller = new TorrentController(tdServiceMock, mockMapper, null);


    const result = await controller.get({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual({fake: null});
  });

  test('get() without id', async () => {
    controller = new TorrentController(null, null, null);
    const result = await controller.get({params: {id: 'no-anumber'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-id');
  });

  test('get() error TDS', async () => {
    const Mock = jest.fn().mockImplementation(() => ({
      get: (a: any, b: any[]): Promise<any[]> => Promise.reject(),
    }));

    tdServiceMock = new Mock();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.get({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });
});


