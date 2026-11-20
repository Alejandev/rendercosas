import { Routes } from '@angular/router';
import { PdfViewerComponent } from './pdf-viewer.component';

export const routes: Routes = [
  { path: '', component: PdfViewerComponent, data: { pdfUrl: 'helados artesanales.pdf' } },
  { path: 'curso', component: PdfViewerComponent, data: { pdfUrl: 'curso.pdf' } },
  { path: 'informe_arq', component: PdfViewerComponent, data: { pdfUrl: 'informe_arq.pdf' } },
  {
    path: 'expo2026',
    component: PdfViewerComponent,
    title: 'Tendedero de Arte - Expo 2026',
    data: { pdfUrl: 'Dossier_Expo_2026.pdf' }
  },
  {
    path: 'informe_cierre',
    component: PdfViewerComponent,
    title: 'Informe Cierre Dpto 701',
    data: { pdfUrl: 'Informe_Cierre_Dpto_701.pdf' }
  },
  { path: '**', redirectTo: '' }
];
