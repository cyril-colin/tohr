
import { TorrentController } from './torrent-controller';

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


  test('add() with invalid download directory', async () => {
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.add({body: {downloadDir: null}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-download-dir');
  });

  test('add() with invalid metainfo', async () => {
    controller = new TorrentController(null, null, null);
    const result = await controller.add({body: {downloadDir: 'a/path', metainfo: false}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-metainfo');
  });

  test('add()', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      add: (a: string, b: string) => Promise.resolve('success'),
    }));
    tdServiceMock = new MockTD();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.add({body: {downloadDir: 'a/path', metainfo: 'blabla'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('add() with TDS error', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      add: (a: string, b: string) => Promise.reject('error'),
    }));
    tdServiceMock = new MockTD();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.add({body: {downloadDir: 'a/path', metainfo: 'blabla'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });

  test('remove() with invalid id', async () => {
    controller = new TorrentController(null, null, null);
    const result = await controller.remove({
      params: {id: null},
      query: {deleteLocalData : null}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-id');
  });

  test('remove() with invalid destination', async () => {
    controller = new TorrentController(null, null, null);
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : null}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-destination');
  });

  test('remove() with data', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      remove: (a: number, b: boolean) => Promise.resolve('success'),
    }));
    tdServiceMock = new MockTD();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : 'true'}
    } as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('remove() without data', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      remove: (a: number, b: boolean) => Promise.resolve('success'),
    }));
    tdServiceMock = new MockTD();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : 'false'}
    } as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('remove() with TDS error', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      remove: (a: number, b: boolean) => Promise.reject('error'),
    }));
    tdServiceMock = new MockTD();
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : 'false'}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('move() with invalid id', async () => {
    controller = new TorrentController(null, null, null);
    const result = await controller.move({
      params: {id: 'dsqfsdf'},
      body: {destinationName: null}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-id');

    const withNull = await controller.move({
      params: {id: null},
      body: {destinationName: null}
    } as any, responseMock, (err: any) => err);

    expect(withNull.businessCode).toEqual('invalid-id');
  });

  test('move() with invalid destination', async () => {
    controller = new TorrentController(null, null, [{
        name: 'Films',
        path: '/data/films',
        description: 'Films',
        warning: null,
        icon: 'movie',
        category: '2000',
        rights: null,
        default: true
      }]);
    const result = await controller.move({
      params: {id: '1'},
      body: {destinationName: null}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-destination');
  });

  test('move()', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      move: (a: number, b: boolean) => Promise.resolve('success'),
    }));
    tdServiceMock = new MockTD();

    controller = new TorrentController(tdServiceMock, null, [{
        name: 'Films',
        path: '/data/films',
        description: 'Films',
        warning: null,
        icon: 'movie',
        category: '2000',
        rights: null,
        default: true
      }]);
    const result = await controller.move({
      params: {id: '1'},
      body: {destinationName: 'Films'}
    } as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('move() error TDS', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      move: (a: number, b: boolean) => Promise.reject('error'),
    }));
    tdServiceMock = new MockTD();

    controller = new TorrentController(tdServiceMock, null, [{
        name: 'Films',
        path: '/data/films',
        description: 'Films',
        warning: null,
        icon: 'movie',
        category: '2000',
        rights: null,
        default: true
      }]);
    const result = await controller.move({
      params: {id: '1'},
      body: {destinationName: 'Films'}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('stop() with invalid id', async () => {
    controller = new TorrentController(null, null, null);
    const result = await controller.stop({params: {id: 'qsdqsdqs'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-id');

    const result2 = await controller.stop({params: {id: null}} as any, responseMock, (err: any) => err);
    expect(result2.businessCode).toEqual('invalid-id');
  });

  test('stop()', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      stop: (a: number) => Promise.resolve('success'),
    }));
    tdServiceMock = new MockTD();

    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.stop({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('stop() error TDS', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      stop: (a: number) => Promise.reject('error'),
    }));
    tdServiceMock = new MockTD();

    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.stop({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('start() with invalid id', async () => {
    controller = new TorrentController(null, null, null);
    const result = await controller.start({params: {id: 'qsdqsdqs'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-id');

    const result2 = await controller.start({params: {id: null}} as any, responseMock, (err: any) => err);
    expect(result2.businessCode).toEqual('invalid-id');
  });

  test('start()', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      start: (a: number) => Promise.resolve('success'),
    }));
    tdServiceMock = new MockTD();

    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.start({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('start() error TDS', async () => {
    const MockTD = jest.fn().mockImplementation(() => ({
      start: (a: number) => Promise.reject('error'),
    }));
    tdServiceMock = new MockTD();

    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.start({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });
});


