import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  showAlert: boolean = false;
  alertText: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';

  // Simple hard-coded credential for demo purposes
  private readonly VALID_USERNAME = 'neel123';
  private readonly VALID_PASSWORD = '2006';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // prefill for visual parity with the mock
    this.username = 'neel123';
  }

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      this.alertText = this.errorMessage;
      this.alertType = 'error';
      this.showAlert = true;
      return;
    }

    // In a real app, call an authentication service here.
    console.log(`Attempting login with username: ${this.username} and password: ${this.password}`);
    if (this.username === this.VALID_USERNAME && this.password === this.VALID_PASSWORD) {
      this.successMessage = 'Login successful!';
      this.errorMessage = '';
      this.alertText = this.successMessage;
      this.alertType = 'success';
      this.showAlert = true;
      this.router.navigateByUrl('writer');
      // add post-login actions here (navigate, emit event, etc.)
    } else {
      this.errorMessage = 'Invalid username or password.';
      this.successMessage = '';
      this.alertText = this.errorMessage;
      this.alertType = 'error';
      this.showAlert = true;
    }
  }

  closeAlert(): void {
    this.showAlert = false;
    // optionally clear messages
    // this.errorMessage = ''; this.successMessage = ''; this.alertText = '';
  }

}
