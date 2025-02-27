import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {NgForOf, NgIf} from '@angular/common'; // Adjust the path as needed

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
  // Add necessary imports for Angular Material components if using standalone components.
})
export class NavbarComponent implements OnInit {
  username = 'John Doe';
  notifications: any[] = [];
  notificationDrawerOpened = false;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    // Fetch user information to update the username
    this.apiService.getUser().subscribe({
      next: (user: any) => {
        this.username = `${user.firstName} ${user.lastName}`;
      },
      error: (error: any) => {
        console.error('Error fetching user info:', error);
      }
    });

    // Fetch notifications from the API
    this.apiService.getNotifications().subscribe({
      next: (data: any) => {
        // Assuming data is an array of notifications
        this.notifications = data;
      },
      error: (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }

  // Toggle notification sidebar visibility
  toggleNotifications(): void {
    this.notificationDrawerOpened = !this.notificationDrawerOpened;
  }

  // Mark a notification as read using the API
  markAsRead(notification: any): void {
    if (!notification.isRead) {
      this.apiService.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          // Update the notification state locally after successful API call
          notification.isRead = true;
        },
        error: (error: any) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  // Returns the count of unread notifications
  get unreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  // Navigate to the profile page
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Logout logic
  logout(): void {
    console.log('User logged out');
    // Implement additional logout logic here (e.g., clear tokens, navigate to login page)
  }
}
