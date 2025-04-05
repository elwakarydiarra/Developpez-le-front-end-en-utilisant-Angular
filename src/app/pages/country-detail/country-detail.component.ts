import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicsData } from 'src/app/core/models/Olympic';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  standalone : false
})
export class CountryDetailComponent implements OnInit, OnDestroy {  
  view: [number, number] = [700, 400]; // Dimensions par défaut du graphique
  countryData: OlympicsData |  undefined;
  chartData: {name: string; series: {name: string; value: number}[]}[] = [];
  totalParticipations: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  private destroy$ = new Subject<void>(); // Subject pour gérer les désabonnements

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) { }

  ngOnInit(): void {
    // Récupération de l'ID du pays depuis l'URL
    // et appel du service par snapshot pour récupérer les données des JO
    const countryId = Number(this.route.snapshot.paramMap.get('id'));

    this.olympicService
    .getOlympics()
    .pipe(takeUntil(this.destroy$), // Désabonnement automatique lors de la destruction
    catchError((error) => {
      console.error('Erreur lors de la récupération des données des JO:', error);
      return of([]); // Retourne un tableau vide en cas d'erreur
    }))
    .subscribe((data: OlympicsData[]) => {
      this.countryData = data.find((item) => item.id === countryId);
      if (this.countryData) {  
        this.chartData = [
          {
            name: this.countryData?.country ,
            series: (this.countryData?.participations).map((participation) => ({
              name: participation.year.toString(),
              value: participation.medalsCount
            }))
          }
        ];
        this.totalParticipations = this.countryData?.participations.length;

        this.totalMedals = this.countryData?.participations.reduce((sum, participation) => 
          sum + participation.medalsCount, 0
        );

        this.totalAthletes = this.countryData?.participations.reduce((sum, participation) =>
          sum + participation.athleteCount, 0
        );
      } else {
        // Si aucune donnée n'est trouvée pour le pays
        this.chartData = [];
        this.totalParticipations = 0;
        this.totalMedals = 0;
        this.totalAthletes = 0;
      }
   });

    this.updateChartSize(); // Met à jour la taille au graphique au chargement

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

  ngOnDestroy(): void {
    this.destroy$.next(); // Émet un signal pour arrêter les abonnements
    this.destroy$.complete(); // Termine le Subject
  }
  
}



