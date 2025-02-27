import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router'; // Adjust the path as needed

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
  // If using standalone components, include your imports here.
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Initialize the form with empty/default values.
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      position: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      startDate: [{ value: '', disabled: true }],
    });

    // Fetch user data from the API
    this.apiService.getUser().subscribe({
      next: (user: any) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          // Convert UTC date string to a format suitable for the input (yyyy-MM-dd)
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
      // Build an object with only the fields the user can change
      const updatedUser = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        // Assuming the API expects the birth date in the same format
        birthDateUtc: this.profileForm.value.birthDate,
      };

      this.apiService.updateUser(updatedUser).subscribe({
        next: (result: any) => {
          console.log('Profile updated:', result);
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
