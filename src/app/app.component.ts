import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stok-web';
}
