import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor() {}
  public baseURL = 'https://localhost:44398/api/User';
}
