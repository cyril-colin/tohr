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
    jackett: {url: string, apiKey: string};
}
