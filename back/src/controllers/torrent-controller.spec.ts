
import { TorrentController } from './torrent-controller';
import * as fs from 'fs';
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;


const responseMock: any = {
  json: (data: any) => Promise.resolve(data),
  writeHead: (status: number, data: any): any => {}
}

const MockTD = jest.fn().mockImplementation(() => ({
  get: (a: any, b: any[]): Promise<any[]> => Promise.resolve([{}]),
  add: (a: string, b: string) => Promise.resolve('success'),
  remove: (a: number, b: boolean) => Promise.resolve('success'),
  move: (a: number, b: boolean) => Promise.resolve('success'),
  stop: (a: number) => Promise.resolve('success'),
  start: (a: number) => Promise.resolve('success'),
}));


const MockMapper = jest.fn().mockImplementation(() => ({
  toFrontTorrent: (a: any): any => ({}),
}));


describe('JackettClient', () => {
  let controller: TorrentController;
  let tdServiceMock: any;
  let mockMapper: any;

  beforeEach(() => {
    tdServiceMock = new MockTD();
    mockMapper = new MockMapper();
    controller = new TorrentController(tdServiceMock, mockMapper, [{
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


  test('getAll()', async () => {
    const result = await controller.getAll(null, responseMock, null);
    expect(result.length).toEqual(1);
  });

  test('getAll() error TDS', async () => {
    tdServiceMock.get = (a: any, b: any[]): Promise<any[]> => Promise.reject();
    const result = await controller.getAll(null, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });

  test('get()', async () => {
    const result = await controller.get({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual({});
  });

  test('get() without id', async () => {
    const result = await controller.get({params: {id: 'no-anumber'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-id');
  });

  test('get() error TDS', async () => {
    tdServiceMock.get = (a: any, b: any[]): Promise<any[]> => Promise.reject();
    const result = await controller.get({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('add() with invalid download directory', async () => {
    const result = await controller.add({body: {downloadDir: null}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-download-dir');
  });

  test('add() with invalid metainfo', async () => {
    const result = await controller.add({body: {downloadDir: 'a/path', metainfo: false}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-metainfo');
  });

  test('add()', async () => {
    const result = await controller.add({body: {downloadDir: 'a/path', metainfo: 'blabla'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('add() with TDS error', async () => {
    tdServiceMock.add = (a: string, b: string) => Promise.reject('error')
    const result = await controller.add({body: {downloadDir: 'a/path', metainfo: 'blabla'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });

  test('remove() with invalid id', async () => {
    const result = await controller.remove({
      params: {id: null},
      query: {deleteLocalData : null}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-id');
  });

  test('remove() with invalid destination', async () => {
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : null}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-destination');
  });

  test('remove() with data', async () => {
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : 'true'}
    } as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('remove() without data', async () => {
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : 'false'}
    } as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('remove() with TDS error', async () => {
    tdServiceMock.remove = (a: number, b: boolean) => Promise.reject('error');
    const result = await controller.remove({
      params: {id: 'anId'},
      query: {deleteLocalData : 'false'}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('move() with invalid id', async () => {
    async function check(value: any) {
      const result = await controller.move({
        params: {id: value},
        body: {destinationName: null}
      } as any, responseMock, (err: any) => err);
      expect(result.businessCode).toEqual('invalid-id');
    }

    check('qsqsqs');
    check(null)
  });

  test('move() with invalid destination', async () => {
    const result = await controller.move({
      params: {id: '1'},
      body: {destinationName: null}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('invalid-destination');
  });

  test('move()', async () => {
    const result = await controller.move({
      params: {id: '1'},
      body: {destinationName: 'Films'}
    } as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('move() error TDS', async () => {
    tdServiceMock.move = (a: number, b: boolean) => Promise.reject('error');
    const result = await controller.move({
      params: {id: '1'},
      body: {destinationName: 'Films'}
    } as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('stop() with invalid id', async () => {
    async function check(value: any) {
      const result = await controller.stop({params: {id: value}} as any, responseMock, (err: any) => err);
      expect(result.businessCode).toEqual('invalid-id');
    }
    check('qsdqsd');
    check(null);
  });

  test('stop()', async () => {
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.stop({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('stop() error TDS', async () => {
    tdServiceMock.stop = (a: number) => Promise.reject('error');
    const result = await controller.stop({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('start() with invalid id', async () => {
    async function check(value: any) {
      const result = await controller.start({params: {id: value}} as any, responseMock, (err: any) => err);
      expect(result.businessCode).toEqual('invalid-id');
    }
    check('qsdqsd');
    check(null);
  });

  test('start()', async () => {
    controller = new TorrentController(tdServiceMock, null, null);
    const result = await controller.start({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result).toEqual('success');
  });

  test('start() error TDS', async () => {
    tdServiceMock.start = (a: number) => Promise.reject('error');
    const result = await controller.start({params: {id: '1'}} as any, responseMock, (err: any) => err);
    expect(result.businessCode).toEqual('unkown-transmission-error');
  });


  test('download() with invalid id', async () => {
    async function check(value: string) {
      const result = await controller.download({params: {id: value}} as any, responseMock, (err: any) => err);
      expect(result.businessCode).toEqual('invalid-id');
    }

    check('invalidid');
    check(null);
  });

  test('download() with invalid filename', async () => {
    async function check(value: string) {
      const result = await controller.download({
        params: {id: '1'},
        query: {filename: value}
      } as any, responseMock, (err: any) => err);
      expect(result.businessCode).toEqual('invalid-filename');
    }

    check(null);
    check('../test.move');
    check('');
  });

  test('download()', async () => {
    tdServiceMock.get = (a: number) => Promise.resolve([{
      files: [{name: 'my-file.mkv',}],
      downloadDir: '/test/films/',
    }]);

    mockedFs.statSync.mockReturnValue({size: '1000'} as never);
    mockedFs.createReadStream.mockReturnValue({size: '1000', pipe: (v: any): any => null} as never);
    const result = await controller.download({
      params: {id: '1'},
      query: {filename: 'my-file.mkv'}
    } as any, responseMock, (err: any) => err);
    expect(result).toEqual(null);
  });

  test('download() error TDS', async () => {
    tdServiceMock.get = (a: number) => Promise.reject('error');
    const next = (err: any) => {throw err};
    await controller.download({params: {id: '1'}, query: {filename: 'my-file.mkv'}} as any, responseMock, next)
    .catch(err => expect(err.businessCode).toEqual('unkown-transmission-error'));
  });
});


