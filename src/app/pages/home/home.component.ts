import { Component, HostListener, OnInit } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { ChartOlympicsData, OlympicsData } from 'src/app/core/models/Olympic';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<ChartOlympicsData[]> = new Observable(); // Observable pour stocker les données des JO
  public totalCountries: number =0;
  public nombreDeJo: number = 0;

  public view: [number, number] = [700, 400]; // Dimensions par défaut du graphique

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void { 
    // Appel du service pour récupérer les données des JO , gérer en asynchrone donc de OnDestroy   
    // et transformation des données pour le graphique
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
      }),
      // en cas d'erreur, renvoyer un tableau vide
      catchError((error) => {
        console.error('Erreur lors de la récupération des données des JO:', error);
        return of([]); 
      })
    );
    this.updateChartSize(); // Met à jour la taille au chargement
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateChartSize(); // Met à jour la taille lors du redimensionnement
  }

  private updateChartSize(): void {
    const width = window.innerWidth * 0.8; // 80% de la largeur de l'écran
    const height = window.innerHeight * 0.5; // 50% de la hauteur de l'écran
    this.view = [width, height];
  }
  
  onSelect(data: ChartOlympicsData): void {
    console.log('Contry clicked:' ,data)
  
    //redirection vers la page de détail
    this.router.navigate(['/country-detail', data.extra.id]);
  }
}
