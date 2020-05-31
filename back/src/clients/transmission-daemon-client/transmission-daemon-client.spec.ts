import { TransmissionDaemonClient } from './transmission-daemon-client';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Test person.ts', () => {
  let client: TransmissionDaemonClient;

  beforeEach(() => client = new TransmissionDaemonClient({
    url: 'http://fakeurl.com',
    password: 'password',
    login: 'login',
  }));

  test('get() should return an empty array.', async() => {
    const response: any = {
      arguments: {
        torrents: [],
      }
    }
    mockedAxios.post.mockResolvedValue({data: response});

    const result = await client.get();
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});


