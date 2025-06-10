import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country-details',
  template: `
    <div style="text-align: center; margin-top: 2rem;">
      <h2>Détails pour {{ country }}</h2>
      <!-- Affiche ici les infos spécifiques du pays -->
    </div>
  `
})
export class CountryDetailsComponent implements OnInit {
  country!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('country')!;
  }
}


