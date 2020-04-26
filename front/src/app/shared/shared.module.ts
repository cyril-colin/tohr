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
import { TorrentBrowserSearchComponent } from './torrent-browser-search/torrent-browser-search.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { RouterModule } from '@angular/router';
import { TorrentUploadComponent } from './torrent-upload/torrent-upload.component';
import { HeaderCollapseComponent } from './header-collapse/header-collapse.component';
import { TorrentListFilterComponent } from './torrent-list-filter/torrent-list-filter.component';

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
    TorrentBrowserSearchComponent,
    TorrentUploadComponent,
    TabBarComponent,
    HeaderCollapseComponent,
    TorrentListFilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxFilesizeModule,
    TranslateModule,
    RouterModule,
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
    TorrentBrowserSearchComponent,
    TabBarComponent,
    HeaderCollapseComponent,
    TorrentUploadComponent,
    TorrentListFilterComponent,
  ]
})
export class SharedModule { }
