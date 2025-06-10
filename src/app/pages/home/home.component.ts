import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { Olympic} from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  olympicsData: Olympic[] = [];
  pieChartLabels: string[] = [];
  pieChartData!: ChartData<'pie', number[], string>;
  pieChartType: ChartType = 'pie';

  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333',
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label;
            const value = context.parsed;
            return `${label}: 🏅 ${value}`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const country = this.pieChartLabels[index];
        this.router.navigate(['/country-details', country]);
      }
    }
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((data: Olympic[]) => {
      this.olympicsData = data;

      const labels = data.map(o => o.country);
      const totals = data.map(o =>
        o.participations.reduce((sum : number, p: any) => sum + p.medalsCount, 0)
      );
      this.pieChartData = {
        labels,
        datasets: [
          {
            data: totals,
            // backgroundColor reste optionnel si tu veux les couleurs par défaut
          }
        ]
      };
    });
  }

  get numberOfJOs(): number {
    return this.olympicsData.reduce((sum, o) => sum + o.participations.length, 0);
  }

  get numberOfCountries(): number {
    return this.olympicsData.length;
  }
}
