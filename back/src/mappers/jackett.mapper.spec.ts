import {JackettMapper} from './jackett.mapper';
import { JTorrent } from '../clients/jacket-client/models/jtorrent.model';



describe('JackettMapper', () => {
  test('Should transform a Jackett torrent to a front torrent', () => {
    const j: JTorrent = {
      FirstSeen: '',
      Tracker: '',
      TrackerId: '',
      CategoryDesc: '',
      BlackholeLink: '',
      Title: 'atitle.BluRay.HDLight',
      Guid: '',
      Link: '',
      Comments: '',
      PublishDate: '',
      Category: [],
      Size: 0,
      Grabs: null,
      Description: '',
      MinimumRatio: 0,
      MinimumSeedTime: 0,
      DownloadVolumeFactor: 0,
      UploadVolumeFactor: 0,
      Gain: 0,
      Seeders: 0,
      Peers: 0,
    }

    const t = JackettMapper.toFrontResult(j);
    expect(t).toEqual({
      title: 'atitle.BluRay.HDLight',
      time: null,
      seeds: 0,
      peers: 0,
      size: 0,
      desc: '',
      id: null,
      provider: '',
      link: {
        path: undefined,
        file: undefined,
      },
      computedData: {
        title: 'atitle',
        tags: [
          {name: 'BluRay', color: '#1cb157'},
          {name: 'HDLight', color: '#11afac'},
        ],
      },
      destination: null
    });
  });
});


