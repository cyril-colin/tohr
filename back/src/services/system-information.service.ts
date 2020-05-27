import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import { Environment } from '../environment';
import { DiskStatus } from '../core/public-models/disk-status';
import { TorrentDestination } from '../core/public-models/torrent-destination';

export class SystemInformationService {
  constructor() { }

  public getProcessUser(): string {
    return os.userInfo().username;
  }

  public getRootDir(): string {
    return __dirname + '/../../../';
  }

  public async getCpuUsage(): Promise<string> {
    return this.exec('/bin/grep \'cpu \' /proc/stat | awk \'{usage=($2+$4)*100/($2+$4+$5)} END {print usage ""}\'');
  }

  public async getMemoryUsage(): Promise<string> {
    return this.exec('/usr/bin/free | /bin/grep Mem | awk \'{print $3/$2 * 100.0}\'');
  }

  public async getDiskStatus(): Promise<DiskStatus[]> {
    const data: DiskStatus[] = [];

    return this.exec('/bin/df').then(stdout => {
      const cleanStdout: string[] = stdout.toString().split('\n');
      cleanStdout.forEach(line => {
        const splitted = line.replace(/ +/g, ' ').split(' ');
        data.push(
          {
            fileSystem: splitted[0],
            size: +splitted[1],
            used: +splitted[2],
            available: +splitted[3],
            use: splitted[4]
          }
        );
      });
      return data;
    });
  }

  public async getDestinationRight(dest: TorrentDestination): Promise<string> {
    if (!fs.existsSync(dest.path)) {
      return Promise.reject('not exists');
    }
    return this.exec('/usr/bin/stat -c "%A" ' + dest.path).then(res => res.replace(/(\r\n|\n|\r)/gm, ''));
  }

  public async isDestinationExists(dest: TorrentDestination): Promise<boolean> {
    await fs.promises.access(dest.path).catch(error => Promise.reject(false));
    return Promise.resolve(true);
  }

  public async isLogFileExists(config: Environment): Promise<boolean> {
    await fs.promises.access(config.logFile).catch(error => Promise.reject(false));
    return Promise.resolve(true);
  }

  private exec(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      cp.exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        if (!error) {
          resolve(stdout);
        }
      });
    });
  }
}
