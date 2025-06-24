import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service'; // ✅ Service qui charge les données JSON
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';

// ✅ Interface pour adapter les données à ngx-charts (graphiques camembert)
interface ChartCountry {
  name: string; // Nom du pays
  value: number; // Total de médailles
  id: number; // Identifiant du pays
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // ✅ Données transformées pour ngx-charts
  countries: ChartCountry[] = [];

  // ✅ Statistiques globales
  totalCountries = 0;
  totalJO = 0;

  // ✅ Message d'erreur en cas d'échec de chargement
  errorMessage = '';

  // ✅ Taille du graphique (responsive)
  view: [number, number] = [0, 400];

  // ✅ Couleurs personnalisées pour le graphique
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#956065', '#b9cbe7', '#89a1db', '#793d52', '#9780a1'],
  };

  // ✅ Ensemble des abonnements RxJS (pour tout nettoyer à la fin)
  private subscriptions = new Subscription();

  constructor(
    private olympicService: OlympicService, // ✅ Injection du service Angular pour accéder aux données
    private router: Router                  // ✅ Pour naviguer vers la page de détails
  ) {}

  ngOnInit(): void {
    this.updateViewSize(); // ✅ Calcul de la taille initiale du graphique
    window.addEventListener('resize', this.updateViewSize); // ✅ Met à jour la taille quand la fenêtre change

    // ✅ 1. Charger les données (déclenche le chargement JSON une seule fois)
    const loadSub = this.olympicService.loadInitialData().subscribe({
      next: () => {
        // ✅ 2. Une fois les données chargées, s’abonner pour les lire
        const dataSub = this.olympicService.getOlympics().subscribe((data) => {
          if (data) {
            // ✅ Transforme les données pour ngx-charts
            this.countries = data.map((country): ChartCountry => ({
              name: country.country,
              value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0), // total des médailles
              id: country.id,
            }));

            // ✅ Statistiques globales
            this.totalCountries = data.length;
            this.totalJO = data[0]?.participations.length || 0; // nombre de JO (même pour les autres pays)
          }
        });

        // ✅ Enregistre l’abonnement pour le nettoyer plus tard
        this.subscriptions.add(dataSub);
      },
      error: () => {
        // ✅ En cas d’erreur de chargement
        this.errorMessage = '❌ Impossible de charger les données.';
      }
    });

    this.subscriptions.add(loadSub);
  }

  // ✅ Nettoyage lors de la destruction du composant (ex : changement de page)
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateViewSize); // ✅ On enlève l’écouteur resize
    this.subscriptions.unsubscribe(); // ✅ On coupe tous les abonnements pour éviter les fuites mémoire
  }

  // ✅ Calcule dynamiquement la taille du graphique selon la taille de l’écran
  private updateViewSize = (): void => {
    const width = window.innerWidth;
    this.view = [width > 768 ? width * 0.6 : width * 0.9, 400];
  };

  // ✅ Quand on clique sur un pays dans le graphique (redirection vers les détails)
  onSelect(event: { name: string }): void {
    const country = this.countries.find(c => c.name === event.name);
    if (country) {
      this.router.navigate(['/country-details', country.id]);
    }
  }

  // ✅ Redirection manuelle depuis un bouton ou autre
  goToDetails(id: number): void {
    this.router.navigate(['/country-details', id]);
  }

  // ✅ Personnalisation de l’info-bulle du graphique
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
