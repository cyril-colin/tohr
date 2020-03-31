import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SearchData } from 'src/app/core/services/proxy/proxy-browser/proxy-browser.service';

@Component({
  selector: 'app-torrent-browser-search',
  templateUrl: './torrent-browser-search.component.html',
  styleUrls: ['./torrent-browser-search.component.scss']
})
export class TorrentBrowserSearchComponent implements OnInit {
  @Input() destinations: TorrentDestination[] = [];
  @Input() selected: TorrentDestination;
  @Output() searchEvent = new EventEmitter<SearchData>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      searchValue: this.fb.control(null),
      destination: this.fb.control(this.selected),
    });
  }

  selectDestination(des: TorrentDestination): void {
    this.selected = des;
  }

  search(): void {
    const searchData = this.form.getRawValue() as SearchData;
    this.searchEvent.emit(searchData);
  }
}
