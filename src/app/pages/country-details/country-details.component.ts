import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Color, ScaleType } from '@swimlane/ngx-charts';

// Interface pour les participations (détail par année)
interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

// Interface pour chaque pays dans le JSON
interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}

// Données formatées pour ngx-charts (graphique en ligne)
interface LineChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-detail',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  country!: Olympic;                     // Données du pays sélectionné
  lineMedalsData: LineChartData[] = []; // Données du graphique
  totalMedals = 0;
  totalAthletes = 0;
  participations = 0;
  errorMessage = '';

  view: [number, number] = [0, 400];     // Dimensions du graphique (responsive)

  private dataSubscription?: Subscription; // Pour se désabonner proprement

  // Couleurs du graphique ngx-charts
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#007C89']
  };

  // Fonction bindée pour resize (utile à l'unsubscribe)
  private resizeListener = this.updateViewSize.bind(this);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateViewSize();
    window.addEventListener('resize', this.resizeListener);

    // Récupération de l'ID dans l'URL
    const id = Number(this.route.snapshot.paramMap.get('country'));

    // Chargement du fichier JSON
    this.dataSubscription = this.http.get<Olympic[]>('assets/mock/olympic.json').subscribe({
      next: (data) => {
        const found = data.find((c: Olympic) => c.id === id);

        if (!found) {
          this.router.navigate(['/404']); // Redirection si le pays est introuvable
          return;
        }

        this.country = found;
        this.participations = found.participations.length;

        // Calcul du total des médailles
        this.totalMedals = found.participations.reduce(
          (sum, p) => sum + p.medalsCount,
          0
        );

        // Calcul du total des athlètes
        this.totalAthletes = found.participations.reduce(
          (sum, p) => sum + p.athleteCount,
          0
        );

        // Formatage des données pour ngx-charts
        this.lineMedalsData = [
          {
            name: found.country,
            series: found.participations.map((p: Participation) => ({
              name: String(p.year),
              value: p.medalsCount
            }))
          }
        ];
      },
      error: () => {
        this.errorMessage = '❌ Erreur de chargement. Vérifiez votre connexion.';
      }
    });
  }

  // Nettoyage des écouteurs et des abonnements
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // Mise à jour dynamique de la taille du graphique
  private updateViewSize(): void {
    const width = window.innerWidth;
    this.view = [width > 768 ? width * 0.8 : width * 0.95, 400];
  }

  // Redirection vers la page d’accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}
