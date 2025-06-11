import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service'; // Adjust the import path as necessary
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-detail',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class DetailComponent implements OnInit {
  country: any;
  //medalsData: any[] = [];
  lineMedalsData: any[] = [];
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

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('country'));
    this.dataService.getOlympics().subscribe(data => {
      if (data) {
        this.country = data.find((c: any) => c.id === id);
        this.participations = this.country.participations.length;
        this.totalMedals = this.country.participations.reduce((sum: number, p: any) => sum + p.medalsCount, 0);
        this.totalAthletes = this.country.participations.reduce((sum: number, p: any) => sum + p.athleteCount, 0);
       /* this.medalsData = [
  {
    name: this.country.country,
    series: this.country.participations.map((p: any) => ({
      name: String(p.year), // important que ce soit une string
      value: p.medalsCount
    }))
  }
];*/
this.lineMedalsData = [
            {
              name: this.country.country,
              series: this.country.participations.map((p: any) => ({
                name: String(p.year),
                value: p.medalsCount
              }))
            }
          ];


      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
