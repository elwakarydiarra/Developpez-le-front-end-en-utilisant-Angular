export interface PieChartDatas {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  hoverOffset: number;
}
