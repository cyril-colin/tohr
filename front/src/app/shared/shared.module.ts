import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { ErrorAreaComponent } from './error-area/error-area.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TorrentItemComponent } from './torrent-item/torrent-item.component';
import { TorrentDestinationComponent } from './torrent-destination/torrent-destination.component';
import { DiskStatusComponent } from './disk-status/disk-status.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { CurrentProcessInfoComponent } from './current-process-info/current-process-info.component';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DestinationListComponent } from './destination-list/destination-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { TorrentBrowserItemComponent } from './torrent-browser-item/torrent-browser-item.component';

@NgModule({
  declarations: [
    DeleteConfirmDialogComponent,
    ErrorAreaComponent,
    TorrentItemComponent,
    TorrentDestinationComponent,
    TorrentBrowserItemComponent,
    DiskStatusComponent,
    CurrentProcessInfoComponent,
    LoadingPageComponent,
    MoveDialogComponent,
    ProgressBarComponent,
    DestinationListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxFilesizeModule,
    TranslateModule,
  ],

  exports: [
    DeleteConfirmDialogComponent,
    ErrorAreaComponent,
    TorrentItemComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TorrentDestinationComponent,
    DiskStatusComponent,
    NgxFilesizeModule,
    CurrentProcessInfoComponent,
    LoadingPageComponent,
    MoveDialogComponent,
    ProgressBarComponent,
    DestinationListComponent,
    TranslateModule,
    TorrentBrowserItemComponent,
  ]
})
export class SharedModule { }
