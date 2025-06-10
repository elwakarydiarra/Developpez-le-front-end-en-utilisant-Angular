import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  country = '';
  totalMedals = 0;
  totalAthletes = 0;
  totalEntries = 0;
  lineChartData!: ChartData<'line'>;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('country')!;
    this.olympicService.getOlympics().subscribe(data => {
      const countryData = data.find((c: any) => c.country === this.country);
      if (!countryData) return;

      this.totalEntries = countryData.participations.length;
      this.totalMedals = countryData.participations.reduce((sum: number, p: any) => sum + p.medalsCount, 0);
      this.totalAthletes = countryData.participations.reduce((sum: number, p: any) => sum + p.athletesCount, 0);

      this.lineChartData = {
        labels: countryData.participations.map((p: any) => p.year),
        datasets: [{
          label: 'Total medals',
          data: countryData.participations.map((p: any) => p.medalsCount),
          borderColor: 'blue',
          fill: false
        }]
      };
    });
  }
}
