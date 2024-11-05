import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  users_id: number;
  message: string;
  etat: boolean;
  users_notification: any[];
}

export interface NotificationResponse {
  data: Notification[];
  message: string;
  status: number;
  links: any[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3005';

  constructor(private http: HttpClient) {}

  getUnreadNotifications(userId: number): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.apiUrl}/notifications/unread/${userId}`);
  }

}