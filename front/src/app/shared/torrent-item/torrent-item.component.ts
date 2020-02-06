import { Component, OnInit, Input } from '@angular/core';
import { Torrent } from 'src/app/core/model/torrent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-torrent-item',
  templateUrl: './torrent-item.component.html',
  styleUrls: ['./torrent-item.component.scss']
})
export class TorrentItemComponent implements OnInit {
  @Input() torrent: Torrent;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  goTorrent(torrent: Torrent): void {
    this.router.navigate(['private', 'torrents', torrent.id]);
  }

}
