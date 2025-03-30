import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { OlympicsData } from './core/models/Olympic';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
    
})
export class AppComponent implements OnInit {
  data: OlympicsData[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((response) =>{
      this.data = response;
      console.log(this.data);//affiche dans la console les données
    });
  }
}
