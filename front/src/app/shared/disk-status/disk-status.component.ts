import { Component, OnInit, Input } from '@angular/core';
import { DiskStatus } from 'src/app/core/model/disk-status.model';

@Component({
  selector: 'app-disk-status',
  templateUrl: './disk-status.component.html',
  styleUrls: ['./disk-status.component.scss']
})
export class DiskStatusComponent implements OnInit {
  @Input() diskStatus: DiskStatus;
  constructor() { }

  ngOnInit() {
  }

}
