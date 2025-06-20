import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';

// Interfaces des données (issues de olympic.json)
interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}

// Interface pour formater les données pour ngx-charts
interface ChartCountry {
  name: string;
  value: number;
  id: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  countries: ChartCountry[] = [];     // Données pour le camembert (un pays = une part)
  totalCountries = 0;                 // Nombre total de pays dans le fichier JSON
  totalJO = 0;                        // Nombre d'éditions JO (supposé identique pour tous)
  errorMessage = '';                 // Message d’erreur si chargement échoue

  // Taille du graphique (vue ngx-charts) – ajustée automatiquement
  view: [number, number] = [0, 400];

  // Palette de couleurs personnalisée
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#956065', '#b9cbe7', '#89a1db', '#793d52', '#9780a1'],
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateViewSize(); // Calcule la taille du graphique selon l'écran
    window.addEventListener('resize', this.updateViewSize); // Rend le graphique responsive

    // Récupère les données JSON depuis assets/olympic.json
    this.http.get<Olympic[]>('assets/mock/olympic.json').subscribe({
      next: (data) => {
        // Transforme les données pour ngx-charts (camembert)
        this.countries = data.map((country): ChartCountry => ({
          name: country.country,
          value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0),
          id: country.id,
        }));

        this.totalCountries = data.length;

        // On suppose que toutes les participations ont le même nombre d’éditions
        this.totalJO = data[0]?.participations.length || 0;
      },
      error: () => {
        this.errorMessage = '❌ Impossible de charger les données. Vérifiez votre connexion ou le fichier JSON.';
      }
    });
  }

  ngOnDestroy(): void {
    // Supprime le listener pour éviter les fuites mémoire
    window.removeEventListener('resize', this.updateViewSize);
  }

  // Met à jour dynamiquement la taille du graphique ngx-charts
  private updateViewSize = (): void => {
    const width = window.innerWidth;
    this.view = [width > 768 ? width * 0.6 : width * 0.9, 400];
  };

  // Redirige vers la page de détails du pays cliqué
  onSelect(event: { name: string }): void {
    const country = this.countries.find(c => c.name === event.name);
    if (country) {
      this.router.navigate(['/country-details', country.id]);
    }
  }

  // Redirige vers les détails (utilisé dans un bouton, si besoin)
  goToDetails(id: number): void {
    this.router.navigate(['/country-details', id]);
  }

  // Contenu personnalisé du tooltip ngx-charts
  customTooltip({ data }: { data: ChartCountry }): string {
    return `
      <div class="custom-tooltip">
        <div class="tooltip-title">${data.name}</div>
        <div class="tooltip-value">
          <img src="assets/images/medal.png" alt="medal" class="medal-icon" />
          <span>${data.value}</span>
        </div>
      </div>
    `;
  }
}
