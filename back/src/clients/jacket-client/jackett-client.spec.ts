import axios from 'axios';
import {JackettClient} from './jackett-client'
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


const getResponseEmpty : any = {
  Results: []
}
describe('JackettClient', () => {
  let client: JackettClient;

  beforeEach(() => client = new JackettClient('http://fakeurl.com', 'apikey'));


  test('Search should return an empty list.', async() => {
    mockedAxios.get.mockResolvedValue({data: getResponseEmpty});
    const result = await client.search({query: 'Into The Wild', categories: ['2000'], tracker: 'myTracker'});
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('Download should run a correct query.', async() => {
    mockedAxios.get.mockResolvedValue({data: null});
    const result = await client.download({path: 'path', file: 'file'});
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(result).toEqual({data: null});
  });

});


