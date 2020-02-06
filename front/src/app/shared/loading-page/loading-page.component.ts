import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss']
})
export class LoadingPageComponent implements OnInit {
  @Input() errors: string[] = [];
  @Input() loadingMessage: string;
  @Input() errorMessage: string;
  constructor() { }

  ngOnInit() {
  }

}
