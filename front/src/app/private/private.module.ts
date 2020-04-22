import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TorrentDashboardComponent } from './torrent-dashboard/torrent-dashboard.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { TorrentDetailComponent } from './torrent-detail/torrent-detail.component';
import { TorrentBrowserComponent } from './torrent-browser/torrent-browser.component';



@NgModule({
  declarations: [
    TorrentDashboardComponent,
    TorrentDetailComponent,
    MonitoringComponent,
    TorrentBrowserComponent,
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
  ]
})
export class PrivateModule { }
