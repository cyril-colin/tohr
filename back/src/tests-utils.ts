export const EXPRESS_RES_MOCK: any = {
  json: (data: any) => Promise.resolve(data),
  writeHead: (status: number, data: any): any => {}
}

export const TransmissionDaemonClientMock = jest.fn().mockImplementation(() => ({
  get: (a: any, b: any[]): Promise<any[]> => Promise.resolve([{}]),
  add: (a: string, b: string) => Promise.resolve('success'),
  remove: (a: number, b: boolean) => Promise.resolve('success'),
  move: (a: number, b: boolean) => Promise.resolve('success'),
  stop: (a: number) => Promise.resolve('success'),
  start: (a: number) => Promise.resolve('success'),
}));

export const JackettClientMock = jest.fn().mockImplementation(() => ({
  search: (val: any) => Promise.resolve([{}]),
}));


export const TransmissionDaemonMapperMock = jest.fn().mockImplementation(() => ({
  toFrontTorrent: (a: any): any => ({}),
}));

