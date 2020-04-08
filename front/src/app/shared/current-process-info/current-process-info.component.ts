import { Component, OnInit, Input } from '@angular/core';
import { CurrentProcessInfo } from 'src/app/core/model/current-process-info.model';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-current-process-info',
  templateUrl: './current-process-info.component.html',
  styleUrls: ['./current-process-info.component.scss']
})
export class CurrentProcessInfoComponent implements OnInit {
  @Input() currentProcessInfo: CurrentProcessInfo;
  constructor(
    private proxyMonitoringService: ProxyMonitoringService,
  ) { }

  ngOnInit() {
  }

  download() {
    const date = new Date();
    this.proxyMonitoringService.downloadLogs().subscribe({
      next: (obj) => FileSaver.saveAs(obj, date.getFullYear()+'-' +(date.getMonth() +1) + '-'+ (date.getDay()+1) +'tohr.logs'),
      error: (err) => console.error(err),
    })
  }

}
