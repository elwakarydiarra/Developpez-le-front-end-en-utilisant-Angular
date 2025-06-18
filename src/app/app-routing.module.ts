import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailComponent } from './country-details/country-details.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  { path: 'country-details/:country', component: DetailComponent },
  { path: '404', component: NotFoundComponent },

  {
    path: '**', // wildcard
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
