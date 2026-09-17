import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js'; // Importamos Chart.js

export interface DashboardMetrics {
  totalNotes: number;
  pending: number;
  inProgress: number;
  done: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'] // O .css según lo tengas
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private lambdaUrl = 'http://localhost:3001/metrics';

  metrics: DashboardMetrics | null = null;
  errorMsg = '';
  chart: any = null;

  constructor() {
    // Registramos los componentes de la gráfica
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.fetchMetrics();
  }

  fetchMetrics() {
    this.http.get<DashboardMetrics>(this.lambdaUrl).subscribe({
      next: (data) => {
        this.metrics = data;
        this.errorMsg = '';
        // Pequeña pausa para asegurar que el HTML ya se renderizó antes de dibujar
        setTimeout(() => this.renderChart(data), 50);
      },
      error: (err) => {
        this.errorMsg = 'Error al conectar con AWS Lambda Local.';
      }
    });
  }

  renderChart(data: DashboardMetrics) {
    const canvas = document.getElementById('metricsChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Si ya existía un gráfico anterior, lo destruimos para no sobreponerlos
    if (this.chart) {
      this.chart.destroy();
    }

    // Creamos el gráfico de Dona interactivo
    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'En Curso', 'Hechas'],
        datasets: [{
          data: [data.pending, data.inProgress, data.done],
          backgroundColor: ['#ffc107', '#0dcaf0', '#198754'],
          borderColor: '#212529',
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#f8f9fa', font: { size: 14 } }
          }
        }
      }
    });
  }
}
