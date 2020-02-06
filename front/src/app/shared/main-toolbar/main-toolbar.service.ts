import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MainToolbarService {
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly title$: Observable<string> = this.titleSubject.asObservable();

  constructor(
    private translate: TranslateService,
  ) {
  }

  setMainTitle(title: string): void {
    this.translate.get(title).subscribe({
      next: text => this.titleSubject.next(text),
      error: err => {
        console.error('Cannot translate.', err);
      }
    });

  }
}
