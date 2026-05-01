import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NotificationBarComponent } from './shared/notification-bar/notification-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    NotificationBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  disconnect() {
    localStorage.removeItem('Authorization');
    this.router.navigate(['/login']);
  }
}
