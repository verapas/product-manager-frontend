import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './elements/footer/footer.component';
import {HeaderComponent} from './elements/header/header.component';

@Component({
  selector: 'pm-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'product-manager-frontend';
}
