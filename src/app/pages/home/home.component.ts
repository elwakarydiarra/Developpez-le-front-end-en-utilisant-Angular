import { Component, OnInit, OnDestroy } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Olympic } from 'src/app/core/models/Olympic';

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
  countries: ChartCountry[] = [];       // Données pour le graphique
  totalCountries = 0;                   // Nombre total de pays
  totalJO = 0;                          // Nombre de Jeux Olympiques
  errorMessage = '';                   // Message d’erreur si pas d’Internet

  view: [number, number] = [0, 400];   // Taille du graphique (mise à jour dynamique)

  // Couleurs personnalisées du camembert
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#956065', '#b9cbe7', '#89a1db', '#793d52', '#9780a1'],
  };

  constructor(
    private dataService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateViewSize(); // Définir la taille initiale du graphique
    window.addEventListener('resize', this.updateViewSize); // Écoute le redimensionnement

    // Appel au service pour récupérer les données olympiques
    this.dataService.getOlympics().subscribe({
      next: (data: Olympic[] | null) => {
        if (data) {
          this.countries = data.map((country: Olympic): ChartCountry => ({
            name: country.country,
            value: country.participations.reduce(
              (sum, p) => sum + p.medalsCount,
              0
            ),
            id: country.id,
          }));
          this.totalCountries = data.length;
          this.totalJO = data[0].participations.length;
          console.log('Countries for chart:', this.countries);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement :', err);
        this.errorMessage = '❌ Impossible de charger les données. Vérifiez votre connexion Internet.';
      }
    });
  }

  ngOnDestroy(): void {
    // Nettoie l'écouteur pour éviter les fuites mémoire
    window.removeEventListener('resize', this.updateViewSize);
  }

  // 📏 Met à jour dynamiquement la taille du graphique
  private updateViewSize = (): void => {
    const width = window.innerWidth;
    const chartWidth = width > 768 ? width * 0.6 : width * 0.9;
    this.view = [chartWidth, 400];
  };

  // Navigation vers la page de détails d’un pays
  onSelect(event: { name: string }): void {
    const country = this.countries.find(c => c.name === event.name);
    if (country) {
      this.router.navigate(['/country-details', country.id]);
    } else {
      console.warn('Pays non trouvé pour', event.name);
    }
  }

  // Navigation via un bouton
  goToDetails(id: number): void {
    this.router.navigate(['/country-details', id]);
  }

  // Personnalisation du tooltip
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
