export interface DiskStatus {
  fileSystem: string;
  size: number;
  used: number;
  available: number;
  use: string;
}


export const mockDiskStatus: DiskStatus[] = [
  {
    fileSystem: '/dev/sda2',
    size: 16445308,
    used: 14343808,
    available: 1246412,
    use: '93%'
  },
  {
    fileSystem: '10.10.10.1:/mnt/DATA',
    size: 1921803264,
    used: 930593792,
    available: 893517824,
    use: '52%'
  },
  {
    fileSystem: '10.10.10.1:/mnt/DATA',
    size: 1921803264,
    used: 930593792,
    available: 893517824,
    use: '100%'
  },
  {
    fileSystem: '10.10.10.1:/mnt/DATA',
    size: 1921803264,
    used: 930593792,
    available: 893517824,
    use: '0%'
  },
];
