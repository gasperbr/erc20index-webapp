import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import 'chart.js';
import { ApiService, History } from 'src/app/services/api.service';

declare const Chart;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() initialData: History[];
  @Input() isVisible;
  
  config = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Fund value',
        backgroundColor: '#3f51b530',
        borderColor: '#3f51b510',
        data: [] as any,
        fill: true,
        fillColor: '#3f51b530',
        yAxisID: 'left-y-axis',
        pointRadius: 1,
        borderWidth: 3,
        lineTension: 0.1,
      },{
        label: 'ERCI price',
        backgroundColor: '#ffd922a0',
        borderColor: '#ffd922a0',
        data: [] as any,
        yAxisID: 'right-y-axis',
        fill: false,
        pointRadius: 1,
        borderWidth: 3,
        lineTension: 0.1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        // intersect: true
        callbacks: {
          label: (tooltipItem, data) => {
            return `${data.datasets[tooltipItem.datasetIndex].label}: $${Math.round((tooltipItem.value || 0) * 100) / 100}`;
          }
        }
      },
      layout: {
        padding: {
          top: 0, right: 10, bottom: 10, left: 10
        },
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
            displayFormats: {
              millisecond: 'HH:mm:ss',
              second: 'H:mm:ss',
              minute: 'H:mm',
              hour: 'MMM DD H:mm',
              day: 'MMM DD',
              month: 'MMM DD'
            }
          },
          distribution: 'series',
          ticks: {
            autoSkip: true,
            maxTicksLimit: 15
            //fontColor: '#dbdbdb',
          },
          scaleLabel: {
            display: false
          },
        }],
        yAxes: [{
          type: 'linear',
          id: 'left-y-axis',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: 'Fund value [ $ ]',
          },
          ticks: {
            beginAtZero: true,
            suggestedMax: 0 // must be set to appropriate value before chart update
          },
          gridLines: {display:false}
        },{
          type: 'linear',
          id: 'right-y-axis',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'ERCI price [ $ ]',
          },
          ticks: {
            beginAtZero: false,
            suggestedMin: 0 // must be set to appropriate value before chart update
          },
          gridLines: {display:false}
        }]
      }
    }
  }

  dataLoading = false;
  chart;
  ctx;
  history: History[];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // const time = Math.floor(new Date().getTime() / 1000);
    // this.getData(time - 604800, time);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialData && !changes.initialData.previousValue && changes.initialData.currentValue) {
      // executed only on init
      this.createChart(changes.initialData.currentValue);
    }
    if (changes.isVisible) {
      if (changes.isVisible.currentValue === true && changes.isVisible.previousValue === false) {
        
        // redraw
        setTimeout(() => {this.chart = new Chart(this.ctx, this.config);});

      } else if (changes.isVisible.previousValue === true && changes.isVisible.currentValue === false && this.chart) {

        this.chart.destroy();  
        
      }
    }
  }

  selectTimeFrame(event) {
    const time = Math.floor(new Date().getTime() / 1000);
    if (event.value === '0') {
      this.getData(time - 604800, time); // 1 week
    } else if (event.value === '1') {
      this.getData(time - 2678400, time); // 1 month (31 days)
    } else if (event.value === '2') {
      this.getData(time - 31556926, time); // 1 year
    } else if (event.value === '3') {
      this.getData(); // all
    }
  }

  getData(from?, to?) {
    this.dataLoading = true;
    this.apiService.getHistory(from, to).subscribe(history => {
      this.createChart(history);
    });
  }
  
  createChart(history: History[]) {

    this.history = history;

    this.config.data.datasets[0].data = []; // fund value
    this.config.data.datasets[1].data = []; // erci price

    if (!history || history.length === 0) {
      this.chart && this.chart.update();
      this.dataLoading = false;
      return;
    }

    const first = [];
    const second = [];
    let firstMax = history[0].usdValue;
    let secondMin = history[0].tokenPrice;

    history.forEach(data => {

      first.push({y: data.usdValue, x: data.createdAt * 1000});
      second.push({y: data.tokenPrice, x: data.createdAt * 1000});
      
      firstMax = firstMax < data.usdValue ? data.usdValue : firstMax;
      secondMin = secondMin > data.tokenPrice ? data.tokenPrice : secondMin;

    });

    this.config.data.datasets[0].data = first;
    this.config.data.datasets[1].data = second;

    this.config.options.scales.yAxes[0].ticks.suggestedMax = firstMax * 1.15;
    this.config.options.scales.yAxes[1].ticks.suggestedMin = secondMin * 0.85;
    
    this.ctx = this.ctx || (this.document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.ctx, this.config);

    this.dataLoading = false;
  }

}
