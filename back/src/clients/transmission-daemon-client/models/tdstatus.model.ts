export interface TDStatus {
  value: number,
  text: string
}


/**
 * @see https://github.com/transmission/transmission/blob/master/libtransmission/transmission.h
 * The description of status
 */
export const TD_STATUS: TDStatus[] = [
  {value: 0, text: 'TR_STATUS_STOPPED'},
  {value: 1, text: 'TR_STATUS_CHECK_WAIT'},
  {value: 2, text: 'TR_STATUS_CHECK'},
  {value: 3, text: 'TR_STATUS_DOWNLOAD_WAIT'},
  {value: 4, text: 'TR_STATUS_DOWNLOAD'},
  {value: 5, text: 'TR_STATUS_SEED_WAIT'},
  {value: 6, text: 'TR_STATUS_SEED'},
]
