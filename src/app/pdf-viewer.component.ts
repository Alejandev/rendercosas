import { Component, signal, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare const pdfjsLib: any;

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  template: `
    <div class="viewer-container">
      @if (loading()) {
        <div class="loading-state">
          <span>Cargando documento...</span>
        </div>
      }
      @if (error()) {
        <div class="error-state">
          <span>{{ error() }}</span>
        </div>
      }
      <div id="pdf-container" class="pdf-container"></div>
    </div>
  `,
  styleUrl: './app.css',
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  
  loading = signal(true);
  error = signal<string | null>(null);

  ngAfterViewInit() {
    // Disable right-click on the document to make it harder to download
    document.addEventListener('contextmenu', this.preventRightClick);
    // Disable copy/save/print hotkeys
    document.addEventListener('keydown', this.preventKeys);

    this.loadPdf();
  }

  ngOnDestroy() {
    document.removeEventListener('contextmenu', this.preventRightClick);
    document.removeEventListener('keydown', this.preventKeys);
  }

  async loadPdf() {
    try {
      // Get the pdfUrl from route data, defaulting to 'helados artesanales.pdf'
      const pdfUrl = this.route.snapshot.data['pdfUrl'] || 'helados artesanales.pdf';
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      const container = document.getElementById('pdf-container');
      if (!container) {
        throw new Error('No se encontró el contenedor del PDF.');
      }

      // Clear any existing canvases just in case
      container.innerHTML = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        
        // Render at a high scale (2x) for sharpness, CSS will resize to fit
        const viewport = page.getViewport({ scale: 2 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          // Disable right-click menu specifically on the canvas elements
          canvas.oncontextmenu = (e) => e.preventDefault();
          
          container.appendChild(canvas);
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          await page.render(renderContext).promise;
        }
      }

      this.loading.set(false);
    } catch (err: any) {
      console.error('Error rendering PDF:', err);
      this.error.set('No se pudo cargar el documento PDF. Asegúrate de que el archivo exista en la carpeta public.');
      this.loading.set(false);
    }
  }

  private preventRightClick(e: MouseEvent) {
    e.preventDefault();
  }

  private preventKeys(e: KeyboardEvent) {
    const isMetaOrCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Block Ctrl+S (Save), Ctrl+P (Print), Ctrl+C (Copy), Ctrl+U (View Source)
    if (isMetaOrCtrl && (key === 's' || key === 'p' || key === 'c' || key === 'u')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
