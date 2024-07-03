import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenApi } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authSV: AuthService,
    private toastr: ToastrService,
    private route: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authSV.getToken();
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next.handle(request).pipe(
      catchError((err) => {
        if(err instanceof HttpErrorResponse && err.status === HttpStatusCode.Unauthorized) {
          return this.handleUnAuthorizedErrror(request,next);
        }
        return throwError(() => new Error("Something was wrong"));
      })
    );
  }

  handleUnAuthorizedErrror(req: HttpRequest<any>, next: HttpHandler) {
    let tokenApi = new TokenApi();
    tokenApi.accessToken = this.authSV.getToken()!;
    tokenApi.refreshToken = this.authSV.getRefreshToken()!;
    return this.authSV.renewToken(tokenApi).pipe(
      switchMap((data: TokenApi) => {
        this.authSV.storeRefreshToken(data.refreshToken);
        this.authSV.storeToken(data.accessToken);
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${data.accessToken}`
          }
        })
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toastr.warning('Token was expired. Please login again!', "Notification");
          this.route.navigate(['/login']);
        });
      })
    );
  }
}
