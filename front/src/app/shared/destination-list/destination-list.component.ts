import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';

@Component({
  selector: 'app-destination-list',
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.scss']
})
export class DestinationListComponent implements OnInit {
  @Input() destinations: TorrentDestination[] = [];
  @Input() selected: TorrentDestination;
  @Output() selectEvent = new EventEmitter<TorrentDestination>();
  constructor() { }

  ngOnInit() {
  }

  selectDestination(destination: TorrentDestination) {
    this.selected = destination;
    this.selectEvent.emit(destination);
  }

}
