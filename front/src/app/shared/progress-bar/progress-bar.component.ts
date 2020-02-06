import { Component, OnInit, Input } from '@angular/core';
import { Torrent } from 'src/app/core/model/torrent';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() torrent: Torrent;

  constructor() { }

  ngOnInit() {
  }

}
