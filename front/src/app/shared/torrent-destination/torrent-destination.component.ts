import { Component, OnInit, Input } from '@angular/core';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';

@Component({
  selector: 'app-torrent-destination',
  templateUrl: './torrent-destination.component.html',
  styleUrls: ['./torrent-destination.component.scss']
})
export class TorrentDestinationComponent implements OnInit {

  @Input() torrentDestination: TorrentDestination;
  constructor() { }

  ngOnInit() {
  }

}
