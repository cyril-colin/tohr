import { TorrentDestination } from './core/monitoring/torrent-destination.model';

export interface Environment {
    serverPort: number;
    bind: string;
    distPath: string;
    logFile: string;
    transmissionDaemonLogin: string;
    transmissionDaemonPassword: string;
    transmissionDaemonUrl: string;
    jwtSecret: string;
    users: { login: string, password: string, }[];
    monitoring: {diskToWatch: string[], destinations: TorrentDestination[]};
    torrentProviders: TorrentProvider[];
}

export interface TorrentProvider {
  name: 'YggTorrent';
  baseUrl: string;
  username: string;
  password: string;
}
