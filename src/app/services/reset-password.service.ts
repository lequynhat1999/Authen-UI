import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import { HttpClient } from '@angular/common/http';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService extends BaseService {

constructor(private http: HttpClient) {
  super();
 }

  sendResetPasswordLink(email: string) {
    return this.http.post<any>(`${this.baseURL}/send-email/${email}`, "");
  }

  resetPassword(resetPasswordObj : ResetPassword){
    return this.http.post<any>(`${this.baseURL}/reset-password`, resetPasswordObj);
  }
}
