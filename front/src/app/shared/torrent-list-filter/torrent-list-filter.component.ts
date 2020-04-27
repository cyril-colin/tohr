import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-torrent-list-filter',
  templateUrl: './torrent-list-filter.component.html',
  styleUrls: ['./torrent-list-filter.component.scss']
})
export class TorrentListFilterComponent implements OnInit {
  @Output() filterEvent = new EventEmitter<any>();
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nameFilter: this.fb.control(null),
    });

    this.form.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const searchData = this.form.getRawValue();
    this.filterEvent.emit(searchData);
  }

}
