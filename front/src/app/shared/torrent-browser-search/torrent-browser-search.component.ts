import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SearchData } from 'src/app/core/services/proxy/proxy-browser/proxy-browser.service';
import { state, style, transition, animate, trigger } from '@angular/animations';

@Component({
  selector: 'app-torrent-browser-search',
  templateUrl: './torrent-browser-search.component.html',
  styleUrls: ['./torrent-browser-search.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: '*',
      })),
      state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
      })),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ])
  ]
})
export class TorrentBrowserSearchComponent implements OnInit {
  @Input() destinations: TorrentDestination[] = [];
  @Input() selected: TorrentDestination;
  @Output() searchEvent = new EventEmitter<SearchData>();

  formAnimation: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.formAnimation = 'in'
    this.form = this.fb.group({
      searchValue: this.fb.control(null),
      destination: this.fb.control(this.selected),
    });
  }

  selectDestination(des: TorrentDestination): void {
    this.selected = des;
    this.form.get('destination').setValue(this.selected);
  }

  search(): void {
    const searchData = this.form.getRawValue() as SearchData;
    this.toggleForm();
    this.searchEvent.emit(searchData);
  }

  toggleForm(): void {
    this.formAnimation = this.formAnimation === 'out' ? 'in' : 'out';
  }
}
