import { Component, OnInit, Input } from '@angular/core';

export interface ErrorAreaItem {
  id: number;
  message: string;
}

@Component({
  selector: 'app-error-area',
  templateUrl: './error-area.component.html',
  styleUrls: ['./error-area.component.scss']
})
export class ErrorAreaComponent implements OnInit {

  @Input() errors: ErrorAreaItem[] = [];
  constructor() { }

  ngOnInit() {
  }

  deleteError(error: ErrorAreaItem) {
    this.errors = this.errors.filter(e => e.id !== error.id);
  }

}
