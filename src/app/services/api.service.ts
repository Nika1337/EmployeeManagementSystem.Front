import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5010';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/login`, { username, password });
  }


  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/user`, user);
  }

  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/messages`);
  }

  markNotificationAsRead(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/messages/${id}`, {});
  }
}
