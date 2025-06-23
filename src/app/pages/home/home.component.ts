import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs'; // ✅ Pour gérer l'abonnement HTTP
import { Color, ScaleType } from '@swimlane/ngx-charts';

// ✅ Interfaces pour typer les données issues du fichier JSON
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

// ✅ Format adapté pour ngx-charts (camembert)
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
  // 🧠 Données principales pour le graphique
  countries: ChartCountry[] = [];

  // 📊 Statistiques globales
  totalCountries = 0;
  totalJO = 0;

  // ❌ Message en cas de chargement échoué
  errorMessage = '';

  // 📐 Dimensions du graphique (ajustées dynamiquement)
  view: [number, number] = [0, 400];

  // 🎨 Palette personnalisée pour ngx-charts
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#956065', '#b9cbe7', '#89a1db', '#793d52', '#9780a1'],
  };

  // 📦 Garde une référence de l’abonnement HTTP pour s'en désabonner proprement
  private dataSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // 🔁 Au chargement du composant
  ngOnInit(): void {
    this.updateViewSize(); // Calcule la taille initiale du graphique
    window.addEventListener('resize', this.updateViewSize); // 📱 Rend le graphique responsive

    // 📥 Charge les données du fichier JSON
    this.dataSubscription = this.http.get<Olympic[]>('assets/mock/olympic.json').subscribe({
      next: (data) => {
        // ✅ Formatage des données pour le graphique
        this.countries = data.map((country): ChartCountry => ({
          name: country.country,
          value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0),
          id: country.id,
        }));

        // 📈 Mise à jour des stats globales
        this.totalCountries = data.length;
        this.totalJO = data[0]?.participations.length || 0;
      },
      error: () => {
        this.errorMessage = '❌ Impossible de charger les données. Vérifiez votre connexion ou le fichier JSON.';
      }
    });
  }

  // 🧹 Nettoyage du composant
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateViewSize); // Retire l’écouteur resize

    // ✅ Se désabonne pour éviter les fuites mémoire
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // 🔁 Met à jour la taille du graphique selon la largeur de l’écran
  private updateViewSize = (): void => {
    const width = window.innerWidth;
    this.view = [width > 768 ? width * 0.6 : width * 0.9, 400];
  };

  // 🎯 Quand l'utilisateur clique sur une part du graphique
  onSelect(event: { name: string }): void {
    const country = this.countries.find(c => c.name === event.name);
    if (country) {
      this.router.navigate(['/country-details', country.id]); // Redirige vers la page de détails
    }
  }

  // 🧭 Redirection manuelle vers un pays (ex: bouton)
  goToDetails(id: number): void {
    this.router.navigate(['/country-details', id]);
  }

  // 💬 Personnalisation du tooltip ngx-charts
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
