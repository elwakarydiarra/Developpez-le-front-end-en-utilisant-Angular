import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Olympic} from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';

interface LineChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-detail',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class DetailComponent implements OnInit {
  country!: Olympic;
  lineMedalsData: LineChartData[] = [];
  totalMedals = 0;
  totalAthletes = 0;
  participations = 0;

  view: [number, number] = [window.innerWidth * 0.8, 400];

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#007C89']
  };

  constructor(
    private route: ActivatedRoute,
    private dataService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('country'));
    this.dataService.getOlympics().subscribe((data: Olympic[] | null) => {
      if (data) {
        const found = data.find((c: Olympic) => c.id === id);
        if (found) {
          this.country = found;
          this.participations = this.country.participations.length;

          this.totalMedals = this.country.participations.reduce(
            (sum, p) => sum + p.medalsCount,
            0
          );

          this.totalAthletes = this.country.participations.reduce(
            (sum, p) => sum + p.athleteCount,
            0
          );

          this.lineMedalsData = [
            {
              name: this.country.country,
              series: this.country.participations.map((p: Participation) => ({
                name: String(p.year),
                value: p.medalsCount
              }))
            }
          ];
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
