import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface ButtonListAction {
  label: string, id: string;
}

@Component({
  selector: 'app-button-list-action',
  templateUrl: './button-list-action.component.html',
  styleUrls: ['./button-list-action.component.scss'],
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
  ]
})
export class ButtonListActionComponent implements OnInit {
  collapseAnimation: string;
  @Input() buttons: ButtonListAction[] = [];
  @Output() choice = new EventEmitter<ButtonListAction>();
  constructor() { }

  ngOnInit(): void {
    this.collapseAnimation = 'out';
  }

  launchAction(action: ButtonListAction) {
    this.choice.emit(action);
    this.toggleButtons();
  }

  toggleButtons(): void {
    this.collapseAnimation = this.collapseAnimation === 'out' ? 'in' : 'out';
  }

}
