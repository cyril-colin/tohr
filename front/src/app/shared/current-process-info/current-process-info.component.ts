import { Component, OnInit, Input } from '@angular/core';
import { CurrentProcessInfo } from 'src/app/core/model/current-process-info.model';

@Component({
  selector: 'app-current-process-info',
  templateUrl: './current-process-info.component.html',
  styleUrls: ['./current-process-info.component.scss']
})
export class CurrentProcessInfoComponent implements OnInit {
  @Input() currentProcessInfo: CurrentProcessInfo;
  constructor() { }

  ngOnInit() {
  }

}
