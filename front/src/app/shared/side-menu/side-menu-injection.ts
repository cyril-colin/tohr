import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

export interface SideMenuInjectedData {
  ref: OverlayRef;
}
export const SIDE_MENU_CONTAINER_DATA = new InjectionToken<SideMenuInjectedData>('SIDE_MENU_CONTAINER_DATA');
