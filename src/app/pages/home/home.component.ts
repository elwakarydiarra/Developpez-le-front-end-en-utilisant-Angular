import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service'; // ✅ On utilise le service
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';

// Modèle pour ngx-charts
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
  countries: ChartCountry[] = [];
  totalCountries = 0;
  totalJO = 0;
  errorMessage = '';
  view: [number, number] = [0, 400];

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#956065', '#b9cbe7', '#89a1db', '#793d52', '#9780a1'],
  };

  // ✅ Pour stocker les abonnements et les nettoyer
  private subscriptions = new Subscription();

  constructor(
    private olympicService: OlympicService, // ✅ On injecte le service au lieu du HttpClient
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateViewSize();
    window.addEventListener('resize', this.updateViewSize);

    // ✅ 1. On charge les données (ceci déclenche l’appel HTTP dans le service)
    const loadSub = this.olympicService.loadInitialData().subscribe({
      next: () => {
        // ✅ 2. Une fois les données chargées, on s’abonne au BehaviorSubject
        const dataSub = this.olympicService.getOlympics().subscribe((data) => {
          if (data) {
            this.countries = data.map((country): ChartCountry => ({
              name: country.country,
              value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0),
              id: country.id,
            }));
            this.totalCountries = data.length;
            this.totalJO = data[0]?.participations.length || 0;
          }
        });

        this.subscriptions.add(dataSub);
      },
      error: () => {
        this.errorMessage = '❌ Impossible de charger les données.';
      }
    });

    this.subscriptions.add(loadSub);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateViewSize);

    // ✅ On se désabonne de tous les abonnements pour éviter les fuites mémoire
    this.subscriptions.unsubscribe();
  }

  private updateViewSize = (): void => {
    const width = window.innerWidth;
    this.view = [width > 768 ? width * 0.6 : width * 0.9, 400];
  };

  onSelect(event: { name: string }): void {
    const country = this.countries.find(c => c.name === event.name);
    if (country) {
      this.router.navigate(['/country-details', country.id]);
    }
  }

  goToDetails(id: number): void {
    this.router.navigate(['/country-details', id]);
  }

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
