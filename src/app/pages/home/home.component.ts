import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service'; // Adjust the import path as necessary
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class DashboardComponent implements OnInit {
  countries: any[] = [];
  totalCountries = 0;
  totalJO = 0;

  view: [number, number] = [window.innerWidth * 0.6, 400];
  colorScheme: Color = {
  name: 'customScheme',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#956065', '#b9cbe7', '#89a1db', '#793d52', '#9780a1']
};


  constructor(private dataService: OlympicService, private router: Router) {}

  ngOnInit() {
    this.dataService.getOlympics().subscribe(data => {
      if (data) {
        this.countries = data.map((country: any) => ({
          name: country.country,
          value: country.participations.reduce((sum: number, p: any) => sum + p.medalsCount, 0),
          id: country.id
        }));
        console.log('Countries for chart:', this.countries);
        this.totalCountries = data.length;
        this.totalJO = data[0].participations.length;
      }
    });
  }

  onSelect(event: any) {
  console.log('Selected:', event);
  const country = this.countries.find(c => c.name === event.name);
  console.log('Matched country:', country);
  if (country) {
    this.router.navigate(['/country-details', country.id]);
  } else {
    console.warn('Pays non trouvé pour', event.name);
  }
}

  goToDetails(id: number) {
  this.router.navigate(['/country-details', id]);
}

}
