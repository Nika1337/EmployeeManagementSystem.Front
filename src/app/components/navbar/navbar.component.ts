import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    MatIcon,
    RouterLink,
    MatIconButton,
    MatToolbar,
    NgIf,
    MatButton,
    NgForOf
  ],
})
export class NavbarComponent implements OnInit {
  username: string | null = null; // Set as null initially
  notifications: any[] = [];
  notificationDrawerOpened = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (user: User | null) => {
        if (user) {
          this.username = `${user.firstName} ${user.lastName}`;
        }
      },
      error: (error: any) => {
        console.error('Error fetching user info:', error);
      }
    });

    this.apiService.getNotifications().subscribe({
      next: (data: any) => {
        this.notifications = data;
      },
      error: (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }

  toggleNotifications(): void {
    this.notificationDrawerOpened = !this.notificationDrawerOpened;
  }

  markAsRead(notification: any): void {
    if (!notification.isRead) {
      this.apiService.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
        },
        error: (error: any) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  get unreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
