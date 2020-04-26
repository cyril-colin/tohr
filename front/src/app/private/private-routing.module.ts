import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TorrentDashboardComponent } from './torrent-dashboard/torrent-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { TorrentDetailComponent } from './torrent-detail/torrent-detail.component';
import { TorrentBrowserComponent } from './torrent-browser/torrent-browser.component';


const routes: Routes = [
  { path: 'dashboard', component: TorrentDashboardComponent },
  { path: 'torrents/:id', component: TorrentDetailComponent },
  { path: 'monitoring', component: MonitoringComponent },
  { path: 'browser', component: TorrentBrowserComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class PrivateRoutingModule { }
