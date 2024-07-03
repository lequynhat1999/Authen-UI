import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApi } from '../models/token-api.model';
import { BaseService } from './base-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  private userPayload: any;
  constructor(private http: HttpClient) {
    super();
    this.userPayload = this.decodeToken();
  }

  register(user : any){
    return this.http.post<any>(`${this.baseURL}/register`, user);
  }

  login(param: any){
    return this.http.post<any>(`${this.baseURL}/login`, param);
  }

  storeToken(token : string)
  {
    localStorage.setItem("token", token);
  }

  storeRefreshToken(refreshToken : string)
  {
    localStorage.setItem("refreshToken", refreshToken);
  }

  getToken()
  {
    return localStorage.getItem("token");
  }

  getRefreshToken()
  {
    return localStorage.getItem("refreshToken");
  }

  checkTokenValid()
  {
    return !!this.getToken();
  }

  logout(){
    if(localStorage.getItem("token")){
      localStorage.removeItem("token");
    }
  }

  getAllUser() : Observable<any> {
    return this.http.get(`${this.baseURL}/get-all-user`);
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    const payload = jwtHelper.decodeToken(token);
    console.log(payload);
    return payload;
  }

  getFullNameFromToken(){
    if(this.userPayload)
    {
      return this.userPayload.unique_name;
    }
  }

  getRoleFromToken(){
    if(this.userPayload)
    {
      return this.userPayload.role;
    }
  }

  renewToken(tokenApi: TokenApi){
    return this.http.post<any>(`${this.baseURL}/refresh`, tokenApi);
  }
}
