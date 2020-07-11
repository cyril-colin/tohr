import { TDTorrent } from '../clients/transmission-daemon-client/models/tdtorrent';
import { Torrent } from '../core/public-models/torrent';
import { TorrentDestination } from '../core/public-models/torrent-destination';
import { TransmissionDaemonClient } from '../clients/transmission-daemon-client/transmission-daemon-client';

export class TransmissionDaemonMapper {
  constructor(
    private destinations: TorrentDestination[],
    private tdService: TransmissionDaemonClient,
  ) { }

  toFrontTorrent(o: TDTorrent): Torrent {
    const t : Torrent = {
      downloadDir: o.downloadDir,
      error: o.error,
      errorString: o.errorString,
      id: o.id,
      name: o.name,
      percentDone: o.percentDone,
      rateDownload: o.rateDownload,
      rateUpload: o.rateUpload,
      totalSize: o.totalSize,
      destination: this.destinations.find(d => d.path === o.downloadDir),
      statusStr: this.tdService.getStatus(o.status),
      status: o.status,
      addedDate: o.addedDate,
      files: o.files,
      trackers: o.trackers,
    }

    return t;
  }
}
