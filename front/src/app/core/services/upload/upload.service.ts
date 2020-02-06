import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { TorrentPost } from '../../model/torrent';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  /**
   * Return an observable containing a list of torrent
   * compatible with the proxy.
   * 
   * Note that it convert all given File objects into
   * a base64 string.
   */
  getConvertedFiles(files: File[]): Observable<TorrentPost[]> {
    const observables: Observable<string>[] = [];
    for (const file of files) {
      observables.push(this.readFile(file));
    }

    return forkJoin(observables).pipe(map(strings => this.convertBase64ToTorrentPost(strings)));
  }

  private convertBase64ToTorrentPost(base64: string[]): TorrentPost[] {
    const torrents: TorrentPost[] = [];
    base64.forEach(fileAsB64 => torrents.push({ downloadDir: null, metainfo: fileAsB64.split(',')[1] as string }))
    return torrents;
  }

  private readFile(file: File): Observable<string> {
    if (!(file instanceof File)) {
      return throwError(new Error('`file` must be an instance of File.'));
    }

    return new Observable<string>(obs => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result as string);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(file);
    });
  }
}
