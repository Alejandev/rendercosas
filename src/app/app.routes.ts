import { Routes } from '@angular/router';
import { PdfViewerComponent } from './pdf-viewer.component';

export const routes: Routes = [
  { path: '', component: PdfViewerComponent, data: { pdfUrl: 'helados artesanales.pdf' } },
  { path: 'curso', component: PdfViewerComponent, data: { pdfUrl: 'curso.pdf' } },
  { path: 'informe_arq', component: PdfViewerComponent, data: { pdfUrl: 'informe_arq.pdf' } },
  { path: '**', redirectTo: '' }
];
