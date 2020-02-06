import { Injectable, Inject, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { SideMenuComponent } from './side-menu.component';
import { SideMenuInjectedData, SIDE_MENU_CONTAINER_DATA } from './side-menu-injection';

interface SideMenuConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: SideMenuConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
};

@Injectable()
export class SideMenuService {

  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) { }

  open(config: SideMenuConfig = {}) {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);
    overlayRef.backdropClick().subscribe({next: () => {
      overlayRef.dispose();
    }});
    const filePreviewPortal = new ComponentPortal(SideMenuComponent, null, this.createInjector({ref: overlayRef}));

    overlayRef.attach(filePreviewPortal);
  }

  private createOverlay(config: SideMenuConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: SideMenuConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global().left();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
      positionStrategy
    });

    return overlayConfig;
  }

  createInjector(dataToPass: SideMenuInjectedData): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(SIDE_MENU_CONTAINER_DATA, dataToPass);
    return new PortalInjector(this.injector, injectorTokens);
}
}
