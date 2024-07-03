import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStorageService } from 'src/app/services/user-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  users : any[] = [];

  fullName = '';

  constructor(
    private authSV: AuthService,
    private route: Router,
    private userStoreSV: UserStorageService
  ) { }

  ngOnInit(): void {
    this.getAllUser();

    this.userStoreSV.getFullNameFromStore().subscribe(res => {
      const fullNameFromToken = this.authSV.getFullNameFromToken();
      this.fullName = res || fullNameFromToken;
    });
  }

  getAllUser(){
    this.authSV.getAllUser().subscribe(res => {
      if(res && res.data)
      {
        this.users = res.data;
      }
    })
  }

  logout(){
    this.authSV.logout();
    this.route.navigate(['/login']);
  }
}
