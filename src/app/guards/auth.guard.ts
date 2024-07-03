import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authSV: AuthService, private router: Router, private toastr: ToastrService) {}
  canActivate() {
    if (this.authSV.checkTokenValid()) {
      return true;
    } else {
      this.router.navigate(['login']);
      this.toastr.error('Please login first!', "Notification");
      return false;
    }
  }
}
