import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service'; // ✅ On utilise le service
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';

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
  country!: Olympic;
  lineMedalsData: LineChartData[] = [];
  totalMedals = 0;
  totalAthletes = 0;
  participations = 0;
  errorMessage = '';

  view: [number, number] = [0, 400];
  private subscriptions = new Subscription();

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#007C89']
  };

  private resizeListener = this.updateViewSize.bind(this);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService // ✅ On injecte le service
  ) {}

  ngOnInit(): void {
    this.updateViewSize();
    window.addEventListener('resize', this.resizeListener);

    const id = Number(this.route.snapshot.paramMap.get('country'));

    // ✅ Étape 1 : charger les données depuis le service
    const loadSub = this.olympicService.loadInitialData().subscribe({
      next: () => {
        // ✅ Étape 2 : lire les données du BehaviorSubject
        const dataSub = this.olympicService.getOlympics().subscribe((data) => {
          if (!data) return;

          const found = data.find((c: Olympic) => c.id === id);

          if (!found) {
            this.router.navigate(['/404']);
            return;
          }

          this.country = found;
          this.participations = found.participations.length;
          this.totalMedals = found.participations.reduce((sum, p) => sum + p.medalsCount, 0);
          this.totalAthletes = found.participations.reduce((sum, p) => sum + p.athleteCount, 0);

          this.lineMedalsData = [
            {
              name: found.country,
              series: found.participations.map((p) => ({
                name: String(p.year),
                value: p.medalsCount
              }))
            }
          ];
        });

        this.subscriptions.add(dataSub);
      },
      error: () => {
        this.errorMessage = '❌ Erreur de chargement des données.';
      }
    });

    this.subscriptions.add(loadSub);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.subscriptions.unsubscribe(); // ✅ On évite les fuites mémoire
  }

  private updateViewSize(): void {
    const width = window.innerWidth;
    this.view = [width > 768 ? width * 0.8 : width * 0.95, 400];
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
