import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit,AfterViewInit  {
  typePassword: string = 'password';
  loginForm!: FormGroup;

  resetPasswordEmail!: string;
  isValidEmail = false;


  @ViewChild('inputEl') inputEl!: ElementRef;

  @ViewChild('inputEmailEl') inputEmailEl!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private authSV: AuthService,
    private route: Router,
    private toastr: ToastrService,
    private resetPasswordSV: ResetPasswordService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.inputEl.nativeElement.focus();
  }

  togglePassword() {
    this.typePassword = this.typePassword === 'password' ? 'text' : 'password';
  }

  onSubmitForm() {
    if (this.loginForm.valid) {
      // call api
      this.authSV.login(this.loginForm.value).subscribe((res) => {
        if (res && res.success && res.data) {
          // show toast message
          this.toastr.success('Notification', 'Login success!');
          this.authSV.storeToken(res.data.accessToken);
          this.authSV.storeRefreshToken(res.data.refreshToken);
          this.loginForm.reset();
          this.route.navigate(['dashboard']);
        } else {
          this.toastr.error('Notification', 'Login failed!');
        }
      });
    } else {
      ValidateForm.validateForm(this.loginForm);
    }
  }

  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      const btnRef = document.getElementById("closeBtn");
      btnRef?.click();

      this.resetPasswordSV.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
        next: (res) => {
          if(res && res.success){
            this.toastr.success('Notification', 'Link send success!');
          }else{
            this.toastr.error('Notification', 'Link send failed!');
          }
        },
        error: (err) => {
          this.toastr.error('Notification', 'Link send failed!');
        }
      })
    }
  }
}
