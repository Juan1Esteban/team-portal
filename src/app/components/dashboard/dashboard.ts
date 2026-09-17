import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

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
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  // 1. Inyectamos el verificador de plataforma
  private platformId = inject(PLATFORM_ID);
  private lambdaUrl = 'http://localhost:3001/metrics';

  metrics: DashboardMetrics | null = null;
  errorMsg = '';
  chart: any = null;

  constructor() {
    // 2. Solo registramos Chart.js en el navegador
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngOnInit() {
    // 3. Solo hacemos la petición automática si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.fetchMetrics();
    }
  }

  fetchMetrics() {
    this.http.get<DashboardMetrics>(this.lambdaUrl).subscribe({
      next: (data) => {
        this.metrics = data;
        this.errorMsg = '';
        setTimeout(() => this.renderChart(data), 50);
      },
      error: (err) => {
        this.errorMsg = 'Error al conectar con AWS Lambda Local.';
      }
    });
  }

  renderChart(data: DashboardMetrics) {
    if (!isPlatformBrowser(this.platformId)) return; // Doble validación por seguridad

    const canvas = document.getElementById('metricsChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

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
            // Cambiado a texto oscuro para que se vea en tu fondo blanco
            labels: { color: '#212529', font: { size: 14 } }
          }
        }
      }
    });
  }
}
