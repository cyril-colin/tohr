import { Injectable, Inject, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ModalInjectedData, MODAL_CONTAINER_DATA } from './modal-injection';

interface ModalConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: ModalConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
};

@Injectable()
export class ModalService {

  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) { }

  open<T>(modalObject: any, data?: any) {
    const overlayRef = this.createOverlay(DEFAULT_CONFIG);
    overlayRef.backdropClick().subscribe({next: () => {
      overlayRef.dispose();
    }});

    const filePreviewPortal = new ComponentPortal<T>(modalObject, null, this.createInjector({ref: overlayRef, data}));


    return overlayRef.attach<T>(filePreviewPortal);
  }

  private createOverlay(config: ModalConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: ModalConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global().centerHorizontally().centerVertically();

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

  createInjector(dataToPass: ModalInjectedData): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(MODAL_CONTAINER_DATA, dataToPass);
    return new PortalInjector(this.injector, injectorTokens);
}
}
