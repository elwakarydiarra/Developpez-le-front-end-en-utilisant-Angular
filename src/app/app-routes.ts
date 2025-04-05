import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';


export const routes: Routes = [
{path: '', component: HomeComponent}, 
{path: 'country-detail/:id', component: CountryDetailComponent},   
{path: '**', component: NotFoundComponent},

];