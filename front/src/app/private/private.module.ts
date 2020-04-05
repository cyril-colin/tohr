import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { TorrentDashboardComponent } from './torrent-dashboard/torrent-dashboard.component';
import { DeleteConfirmDialogComponent } from '../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { TorrentDetailComponent } from './torrent-detail/torrent-detail.component';
import { MoveDialogComponent } from '../shared/move-dialog/move-dialog.component';
import { TorrentBrowserComponent } from './torrent-browser/torrent-browser.component';



@NgModule({
  declarations: [
    TorrentDashboardComponent,
    TorrentDetailComponent,
    UploadFormComponent,
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
