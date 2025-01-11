import { Injectable } from '@angular/core';
import { LocaStorageUser } from '../interfaces/local-storage-user';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageSessionService {
  storeUserDetails(userData: LocaStorageUser): void {
    localStorage.setItem(
      'planning-poker-user-details',
      JSON.stringify(userData)
    );
  }

  getUserDetails(): string | null {
    return localStorage.getItem('planning-poker-user-details');
  }
}
