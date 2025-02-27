import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ApiService } from '../../services/api.service'; // Adjust path as needed
import { Router } from '@angular/router';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    NgIf,
    MatLabel
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (result: any) => {
          // Assume the JWT token is in result.token.
          localStorage.setItem('token', result.token);
          // Redirect to a protected route (e.g., profile or home page)
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.error('Login error:', error);
          this.errorMessage = 'Invalid username or password';
        }
      });
    }
  }
}
