import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import 'chart.js';

declare const Chart;


@Component({
  selector: 'app-chart-target-values',
  templateUrl: './chart-target-values.component.html',
  styleUrls: ['./chart-target-values.component.scss']
})
export class ChartTargetValuesComponent implements OnInit, OnChanges{

  config = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Target value  ', // #ffd922 // yellow
				backgroundColor: '#ffbb6f80',
        borderColor: '#ffbb6f30',
        borderWidth: 3,
				stack: 'Stack 0',
				data: []
      },
      {
        label: 'Current value',
        backgroundColor: '#3f51b530',
        borderColor: '#3f51b510',
        borderWidth: 3,
        stack: 'Stack 1',
        data: []
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        callbacks: {
          label: (tooltipItem, data) => {
            return `${data.datasets[tooltipItem.datasetIndex].label}: $${tooltipItem.value || 0}`;
          }
        }
        // intersect: true
      },
      layout: {
        padding: {
          top: 0, right: 10, bottom: 10, left: 10
        },
      },
      scales: {
        xAxes: [],
        yAxes: [{
          type: 'linear',
          id: 'left-y-axis',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Tokens value [ $ ]',
          },
          ticks: {
            beginAtZero: true,
            // suggestedMax: 0 // will be set to appropriate value
          },
          gridLines: {
            display:false
          }
        }]
      }
    }
  }

  chart;
  ctx;

  @Input() isVisible: boolean;
  @Input() chartData: {
    labels: string[],
    currentValues: number[],
    targetValues: number[],
  }

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartData && changes.chartData.currentValue && changes.chartData.currentValue.labels.length > 0) {
      this.createChart();
    }
    if (changes.isVisible) {
      if (changes.isVisible.currentValue === true && changes.isVisible.previousValue === false) {
        
        // redraw
        setTimeout(() => this.chart = new Chart(this.ctx, this.config));

      } else if (changes.isVisible.previousValue === true && changes.isVisible.currentValue === false && this.chart) {

        this.chart.destroy();
        
      }
    }
  }
  
  createChart() {
    
    this.config.data.labels = this.chartData.labels; //['OMG', 'KNC', 'BAT', 'OMG', 'KNC', 'BAT', 'ETH'];

    this.config.data.datasets[0].data = this.chartData.targetValues.map(value => Math.round(value * 100) / 100); // [120, 110, 100, 90, 80, 70, 60];
    this.config.data.datasets[1].data = this.chartData.currentValues.map(value => Math.round(value * 100) / 100); // [122, 121, 90, 90, 77, 60, 70];

    this.ctx = (this.document.getElementById('myTargetsChart') as HTMLCanvasElement).getContext('2d');
    this.chart = new Chart(this.ctx, this.config);
  }

}
