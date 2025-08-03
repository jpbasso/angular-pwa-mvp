import { Injectable, signal } from '@angular/core';
import { fromEvent, merge } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  online = signal(navigator.onLine);

  constructor() {
    merge(fromEvent(window, 'online'), fromEvent(window, 'offline')).subscribe(
      () => this.online.set(navigator.onLine)
    );
  }
}
