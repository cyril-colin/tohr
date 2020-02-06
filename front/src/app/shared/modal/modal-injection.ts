import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

export interface ModalInjectedData {
  ref?: OverlayRef;
  data?: any;
}
export const MODAL_CONTAINER_DATA = new InjectionToken<ModalInjectedData>('MODAL_CONTAINER_DATA');
