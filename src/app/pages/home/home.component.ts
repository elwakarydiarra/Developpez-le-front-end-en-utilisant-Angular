import { Component, OnInit } from '@angular/core';
import { count, map, tap, catchError } from 'rxjs/operators';
import { Observable, of, partition } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { ChartOlympicsData, OlympicsData } from 'src/app/core/models/Olympic';
import { AppRoutingModule } from 'src/app/app-routing.module';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<ChartOlympicsData[]> = of([
    {
      name: '',
      value: 0,
      extra: {
      id: 0,
      country: '',
      participations: [],
      }
    }
  ]
  )
  public olympicsDatas$: Observable<OlympicsData[]> = new Observable();
  public totalCountries: number =0;
  public nombreDeJo: number = 0;

  constructor(private olympicService: OlympicService,
    private olympicService2: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.olympics$ = this.olympicService.getOlympics().pipe(
      map((data:OlympicsData[]) =>
        
        
        data.map((item) => ({
          name: item.country,
          value: item.participations.reduce(
            (sum, partition) => sum + partition.medalsCount,0
          ),
          extra: {
          id: item.id,
          country: item.country,
          participations: item.participations
          
          }
        }))
      ),
      tap((data) => {
        this.totalCountries = data.length,
        this.nombreDeJo = Math.max(
          ...data.map((country) => country.extra.participations.length) 
        );
        console.log('Total Countries:', this.totalCountries);
        console.log('Max Participations:', this.nombreDeJo);
      })
    );
  }
    

  

  onSelect(data: ChartOlympicsData): void {
    console.log('Contry clicked:' ,data)
  
    //redirection vers la page de détail
    this.router.navigate(['/country-detail', data.extra.id]);
  }
}
