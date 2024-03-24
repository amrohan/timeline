import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TimelineComponent } from './timeline.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TimelineComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'tweet';
}
