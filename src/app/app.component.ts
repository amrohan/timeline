import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TweetComponent } from './tweet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TweetComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'tweet';
}
