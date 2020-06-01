import { TransmissionDaemonClient } from './transmission-daemon-client';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


const getResponseEmpty : any = {
  arguments: {
    torrents: [],
  }
}
describe('TransmissionDaemonClient', () => {
  let client: TransmissionDaemonClient;

  beforeEach(() => client = new TransmissionDaemonClient({
    url: 'http://fakeurl.com',
    password: 'password',
    login: 'login',
  }));


  test('get() should return an empty array.', async() => {
    mockedAxios.post.mockResolvedValue({data: getResponseEmpty});
    const result = await client.get();
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('get() with ids should return an empty array.', async() => {
    mockedAxios.post.mockResolvedValue({data: getResponseEmpty});
    const result = await client.get([1, 2]);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('get() with ids and fields should return an empty array.', async() => {
    mockedAxios.post.mockResolvedValue({data: getResponseEmpty});
    const result = await client.get([1, 2], ['id', 'downloadDir']);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('add() should return a valid response', async() => {
    mockedAxios.post.mockResolvedValue({data: null});
    const result = await client.add('/download/dir', 'abase64string');
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(null);
  });


  test('addTorrentFile() should return a valid response', async() => {
    mockedAxios.post.mockResolvedValue({data: null});
    const result = await client.addTorrentFile('file name', 'torrent-dir');
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  test('remove() should return a valid response', async() => {
    mockedAxios.post.mockResolvedValue({data: null});
    const result = await client.remove('anId', false);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  test('move() should return a valid response', async() => {
    mockedAxios.post.mockResolvedValue({data: null});
    const result = await client.move(1, '/new/path');
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  test('start() should return a valid response', async() => {
    mockedAxios.post.mockResolvedValue({data: null});
    const result = await client.start(1);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  test('stop() should return a valid response', async() => {
    mockedAxios.post.mockResolvedValue({data: null});
    const result = await client.stop(1);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  test('get() should retry once because of http 409 error from TDS', async() => {
    const headers: any = {};
    headers[TransmissionDaemonClient.HEADER_TRANSMISSION_SESSION] = 'fakekey';
    mockedAxios.post.mockRejectedValueOnce({response: {status: 409,headers}}).mockResolvedValue({data: getResponseEmpty});

    const result = await client.get();
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    expect(result).toEqual([]);
  });



  test('get() should throw error because of http 500 error from TDS', async() => {
    mockedAxios.post.mockRejectedValueOnce({response: {status: 500}});
    let error;
    await client.get().catch(err => error = err);
    expect(error).toBeTruthy();
  });



  test('get() should throw error because of to many attempt to get data from TDS with 409 error', async() => {
    const headers: any = {};
    headers[TransmissionDaemonClient.HEADER_TRANSMISSION_SESSION] = 'fakekey';

    const attempts = mockedAxios.post.mockRejectedValueOnce({response: {status: 409, headers}})
    for(let i = 0; i <= TransmissionDaemonClient.MAX_SESSION_ATTEMPT; i++) {
      attempts.mockRejectedValueOnce({response: {status: 409, headers}});
    }

    try {
      await client.get();
    } catch (e) {
      expect(e).toEqual(new Error('TOO-MANY-ATTEMPT-ERROR'));
    }
  });

  test('getStatus() should return null.', async() => {
    const status = client.getStatus(-1);
    expect(status).toBeFalsy();
  });

  test('getStatus() should return null.', async() => {
    const status = client.getStatus(1);
    expect(status).toEqual('TR_STATUS_CHECK_WAIT');
  });
});


