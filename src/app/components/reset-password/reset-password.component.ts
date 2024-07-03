import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import ValidateForm from 'src/app/helpers/validateForm';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();
  constructor(private fb: FormBuilder, private activated: ActivatedRoute,
    private router: Router,
    private resetPasswordService: ResetPasswordService,
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      });
    this.activated.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = (val['code']);
      this.emailToken = uriToken.replace(/ /g, '+');
    });
  }
  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordService.resetPassword(this.resetPasswordObj)
        .subscribe({
          next: (res) => {
            this.toast.success('Notification', 'Reset password success!');
            this.router.navigate(['/'])
          },
          error: (err) => {
            this.toast.error('Notification', 'Reset password fail!');
          }
        })
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
