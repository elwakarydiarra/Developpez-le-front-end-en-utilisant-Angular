import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute,  RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { map, Observable} from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

interface LineChartDatas {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.component.html',
  imports: [NgxChartsModule, RouterModule],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit {
  public countryName: string;
  olympic$!: Observable<Olympic | undefined>;
  lineChartData$!: Observable<LineChartDatas[] | undefined>;
  totalMedals$!: Observable<number>;
  totalAthletes$!: Observable<number>;         

  // Transformer tous mes appels aux méthodes en observable pour pipe | async

  view: [number, number] = [600, 400];

  private viewWidth!: number;

  private setViewWidth(): void {
    if (window.innerWidth < 576) {
      this.viewWidth = 300;
    } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
      this.viewWidth = 500;
    } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      this.viewWidth = 700;
    } else {
      this.viewWidth = 700;
    }
    this.view = [this.viewWidth, 400];
  }

  constructor(
    route: ActivatedRoute,
    private readonly olympicService: OlympicService // private cdk: ChangeDetectorRef
  ) {
    this.countryName = String(route.snapshot.params['name']).toLowerCase();
  }

  ngOnInit(): void {
    const formattedName = this.countryName.split('-').join(' ');
    this.olympic$ = this.olympicService.getOlympicByCountry(formattedName);
    this.lineChartData$ = this.olympic$.pipe(
      map((olympic) => this.convertOlympicDataToLineChartData(olympic))
    );
    this.totalMedals$ = this.olympic$.pipe(
      map((olympic) => {
        return (
          olympic?.participations?.reduce(
            (acc: number, curr: Participation) => acc + curr.medalsCount,
            0
          ) ?? 0
        );
      })
    );
    this.totalAthletes$ = this.olympic$.pipe(
      map((olympic) => {
        return (
          olympic?.participations?.reduce(
            (acc: number, curr: Participation) => acc + curr.athleteCount,
            0
          ) ?? 0
        );
      })
    );
    
    this.setViewWidth();
    window.addEventListener('resize', () => {
      this.setViewWidth();
    });
  }

  convertOlympicDataToLineChartData(
    olympicData: Olympic | undefined
  ): { name: string; series: { name: string; value: number }[] }[] {
    return [
      {
        name: olympicData?.country ?? '',
        series:
          olympicData?.participations.map((participation) => {
            return {
              name: String(participation.year),
              value: participation.medalsCount,
            };
          }) || [],
      },
    ];
  }
}
