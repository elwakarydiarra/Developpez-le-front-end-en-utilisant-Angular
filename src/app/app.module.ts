import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { provideHttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeaderComponent } from './pages/header/header.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CountryDetailComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    HeaderComponent
  ],
  providers: [
    provideHttpClient() // ajout de provide client
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }





