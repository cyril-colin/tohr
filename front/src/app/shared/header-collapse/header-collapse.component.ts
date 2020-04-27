import { Component, OnInit, ElementRef, ContentChild, ViewChild, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header-collapse',
  templateUrl: './header-collapse.component.html',
  styleUrls: ['./header-collapse.component.scss'],
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
    ]),
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-180deg)' })),
      transition('rotated => default', animate('400ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})
export class HeaderCollapseComponent implements OnInit {
  @Input() empty = false;
  @Input() defaultDisplay = true;
  collapseAnimation: string;
  state = 'rotated';
  constructor() { }

  ngOnInit(): void {
    this.collapseAnimation = this.defaultDisplay ? 'in' : 'out';
  }

  toggleBar(): void {
    this.collapseAnimation = this.collapseAnimation === 'out' ? 'in' : 'out';
    this.rotate();
  }



  rotate() {
    this.state = (this.state === 'default' ? 'rotated' : 'default');
  }
}
