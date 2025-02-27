import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserService, User } from '../../services/user.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel
  ],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize form with default values.
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      position: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      startDate: [{ value: '', disabled: true }],
    });

    // Populate form with user data from API
    this.apiService.getUser().subscribe({
      next: (user: any) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          birthDate: user.birthDateUtc ? user.birthDateUtc.substring(0, 10) : '',
          position: user.position,
          department: user.department,
          startDate: user.startDateUtc ? user.startDateUtc.substring(0, 10) : '',
        });
      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedUser: Partial<User> = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        birthDateUtc: this.profileForm.value.birthDate,
      };

      this.apiService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Profile updated');
          this.userService.updateUser();
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.error('Error updating profile:', error);
        }
      });
    } else {
      console.log('Form is invalid.');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
