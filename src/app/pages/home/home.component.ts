import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

interface PieChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[] | undefined>;
  pieChartData$!: Observable<PieChartData[]>;

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
    private cdk: ChangeDetectorRef,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.olympics$;
    this.pieChartData$ = this.olympics$.pipe(
      map((olympics) => this.convertOlympicsToPieChartData(olympics))
    );
    this.setViewWidth();
    window.addEventListener('resize', () => {
      this.setViewWidth();
      this.cdk.markForCheck();
    });
  }

  convertOlympicsToPieChartData(
    olympics: Olympic[] | undefined
  ): PieChartData[] {
    const data: { name: string; value: number }[] = [];

    if (olympics) {
      olympics.forEach((olympic) => {
        data.push({
          name: olympic.country,
          value: olympic.participations.reduce(
            (acc, curr) => acc + curr.medalsCount,
            0
          ),
        });
      });
    }

    return data;
  }
  colorScheme: { domain: Array<string> } = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  onSelect(data: {label: string, name: string, value: number}): void {
    const { name } = JSON.parse(JSON.stringify(data));
    const slug = name.split(' ').join('-').toLowerCase();
    this.router.navigate([`/details/${slug}`]);
  }
}
