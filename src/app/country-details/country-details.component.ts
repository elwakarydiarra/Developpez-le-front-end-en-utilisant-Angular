import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';

// Interface utilisée pour le graphique en ligne
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
  country!: Olympic; // Données du pays
  lineMedalsData: LineChartData[] = []; // Données pour le graphique
  totalMedals = 0;
  totalAthletes = 0;
  participations = 0;
  errorMessage = ''; // ✅ En cas d’échec réseau

  view: [number, number] = [0, 400]; // Taille du graphique responsive

  // Palette de couleur du graphique
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#007C89']
  };

  // Écouteur pour resize
  private resizeListener = this.updateViewSize.bind(this);

  constructor(
    private route: ActivatedRoute,
    private dataService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateViewSize();
    window.addEventListener('resize', this.resizeListener);

    const id = Number(this.route.snapshot.paramMap.get('country'));

    this.dataService.getOlympics().subscribe({
      next: (data: Olympic[] | null) => {
        if (!data) return;

        const found = data.find((c: Olympic) => c.id === id);

        if (!found) {
          this.router.navigate(['/404']);
          return;
        }

        this.country = found;
        this.participations = found.participations.length;

        this.totalMedals = found.participations.reduce(
          (sum, p) => sum + p.medalsCount,
          0
        );

        this.totalAthletes = found.participations.reduce(
          (sum, p) => sum + p.athleteCount,
          0
        );

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
      error: (err) => {
        console.error('Erreur de chargement :', err);
        this.errorMessage = '❌ Impossible de charger les données. Vérifiez votre connexion Internet.';
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  // 📏 Met à jour la taille du graphique en fonction de l’écran
  private updateViewSize(): void {
    const width = window.innerWidth;
    const chartWidth = width > 768 ? width * 0.8 : width * 0.95;
    this.view = [chartWidth, 400];
  }

  // 🔙 Retour à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}
