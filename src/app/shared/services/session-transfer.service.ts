import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionTransferService implements OnDestroy {

  constructor() {
    window.addEventListener('storage', this.handleStorageEvent, false);
    this.sync_request();
  }

  handleStorageEvent = (event: StorageEvent): void => {
    if (event.key === 'sync_request') {
      console.log('handleStorageEvent - sync_request', event);
      localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
      localStorage.removeItem('sessionStorage');
    } else if (event.key === 'sessionStorage') {
      console.log('handleStorageEvent - sessionStorage', event);
      const sessionStorage = JSON.parse(event.newValue || '{}');
      for (const key in sessionStorage) {
        window.sessionStorage.setItem(key, sessionStorage[key]);
      }
    }
  }

  sync_request(): void {
    console.log('sync_request - sessionStorage', sessionStorage);
    if (!sessionStorage.length) {
      const current = new Date().toLocaleTimeString();
      console.log('sync_request - request', current);
      localStorage.setItem(
        'sync_request',
        'request session storage ' + current
      );
    }
  }

  getToken(): string {
    const tokenStr = window.sessionStorage.getItem('token') || 'null';
    const token = JSON.parse(tokenStr);
    console.log('getToken', token);
    return token;
  }

  setToken(): void {
    const token = {
      username: 'some user',
      token: 'and.her.token',
      timestamp: new Date().toLocaleTimeString(),
    };
    console.log('setToken', token);
    window.sessionStorage.setItem('token', JSON.stringify(token));
  }

  removeToken(): void {
    window.sessionStorage.removeItem('token');
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageEvent, false);
  }
}
