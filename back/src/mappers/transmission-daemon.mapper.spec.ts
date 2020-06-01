import { TransmissionDaemonMapper } from './transmission-daemon.mapper';
import { TDTorrent } from '../clients/transmission-daemon-client/models/tdtorrent';
import { TorrentDestination } from '../core/public-models/torrent-destination';
import { TransmissionDaemonClient } from '../clients/transmission-daemon-client/transmission-daemon-client';
import { Torrent } from '../core/public-models/torrent';

const destinationMock: TorrentDestination[] = [
  {
    name: 'Films',
    path: '/data/films',
    description: 'Films',
    warning: null,
    icon: 'movie',
    category: '2000',
    rights: null,
    default: true
  },
  {
    name: 'Musics',
    path: '/data/musics',
    description: 'Musiques',
    warning: null,
    icon: 'music_note',
    category: '3000',
    rights: null,
    default: false
  },
  {
    name: 'Series',
    path: '/data/series',
    description: 'Séries',
    warning: null,
    icon: 'fast_forward',
    category: '5000',
    rights: null,
    default: false
  },
  {
    name: 'Autre',
    path: '/data/other',
    description: 'Autre',
    warning: 'Les fichiers de cette catégorie ne seront pas disponibles dans Plex.',
    icon: 'help',
    category: '',
    rights: null,
    default: false
  }
]

const tdService = new TransmissionDaemonClient({url: 'http://fakeUrl', login:'login', password:'password'});
describe('TransmissionDaemonMapper', () => {
  let mapper: TransmissionDaemonMapper;

  beforeEach(() => mapper = new TransmissionDaemonMapper(destinationMock, tdService));

  test('Should transform a TDTorrent torrent to a front torrent', () => {
    const tdTorrent: TDTorrent = {
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
    }

    const t = mapper.toFrontTorrent(tdTorrent);

    const tf : Torrent = {
      downloadDir: '',
      error: 0,
      errorString: '',
      id: 0,
      name: '',
      percentDone: 0,
      rateDownload: 0,
      rateUpload: 0,
      totalSize: 0,
      destination: undefined,
      statusStr: 'TR_STATUS_STOPPED',
      status: 0,
      addedDate: 0,
      files: [],
      trackers: [],
    }
    expect(t).toEqual(tf);
  });
});


