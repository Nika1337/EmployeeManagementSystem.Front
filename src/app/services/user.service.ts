import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  firstName: string;
  lastName: string;
  birthDateUtc?: string;
  position?: string;
  department?: string;
  startDateUtc?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private apiService: ApiService) {
    this.loadUser();
  }

  loadUser(): void {
    this.apiService.getUser().subscribe({
      next: (user: any) => this.userSubject.next(user),
      error: (error: any) => console.error('Error loading user', error)
    });
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  updateUser(): void {
    this.loadUser();
  }
}
