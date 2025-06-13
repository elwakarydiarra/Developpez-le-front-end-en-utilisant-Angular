import { Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  countries: ChartCountry[] = [];
  totalCountries = 0;
  totalJO = 0;

  view: [number, number] = [window.innerWidth * 0.6, 400];

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
    this.dataService.getOlympics().subscribe((data: Olympic[] | null) => {
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
    });
  }

  onSelect(event: { name: string }): void {
    const country = this.countries.find(c => c.name === event.name);
    if (country) {
      this.router.navigate(['/country-details', country.id]);
    } else {
      console.warn('Pays non trouvé pour', event.name);
    }
  }

  goToDetails(id: number): void {
    this.router.navigate(['/country-details', id]);
  }

  customTooltip({ data }: { data: ChartCountry }): string {
    return `
      <div class="ngx-tooltip">
        <div class="tooltip-title">${data.name}</div>
        <div class="tooltip-value">🏅 ${data.value}</div>
      </div>
    `;
  }
}
