import {Component, OnInit} from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {ImageModule} from "primeng/image";
import {AvatarModule} from "primeng/avatar";
import {InputTextModule} from "primeng/inputtext";
import {IconFieldModule} from "primeng/iconfield";
import {MenuModule} from "primeng/menu";
import {DropdownModule} from "primeng/dropdown";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [MenubarModule, ImageModule, AvatarModule, InputTextModule, MenuModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menuItems: MenuItem[] = [
  ];
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  disconnect() {
    localStorage.removeItem('Authorization');
    this.router.navigate(['/login']);
  }
}
