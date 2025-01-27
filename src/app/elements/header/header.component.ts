import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'pm-header',
  imports: [
    MatToolbar,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    RouterLink,
    MatMenuItem
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
