import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'olympic-games-starter';
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
