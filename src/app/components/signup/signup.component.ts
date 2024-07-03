import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  typePassword: string = 'password';
  signupForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authSV: AuthService,
    private route: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePassword() {
    this.typePassword = this.typePassword === 'password' ? 'text' : 'password';
  }

  onSubmitForm() {
    if (this.signupForm.valid) {
      // call api
      let user = this.signupForm.value;
      user.Token = '123';
      user.Role = '1';
      this.authSV.register(user).subscribe((res) => {
        if (res && res.success) {
          // show toast message
          this.toastr.success('Notification', 'Register success!');
          this.signupForm.reset();

          this.route.navigate(['login']);
        } else {
          this.toastr.error('Notification', 'Register failed!');
        }
      });
    } else {
      ValidateForm.validateForm(this.signupForm);
    }
  }
}
