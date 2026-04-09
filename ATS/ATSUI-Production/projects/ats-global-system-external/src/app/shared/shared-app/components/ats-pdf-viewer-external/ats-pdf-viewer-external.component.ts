import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
  SimpleChanges
} from '@angular/core';

import * as pdfjsLib from 'pdfjs-dist';

// (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
//   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  'assets/pdfjs/pdf.worker.min.js';

@Component({
  selector: 'app-ats-pdf-viewer-external',
  templateUrl: './ats-pdf-viewer-external.component.html',
  styleUrls: ['./ats-pdf-viewer-external.component.scss']
})
export class AtsPdfViewerExternalComponent  implements OnChanges, OnDestroy {
  
  @Input() pdfBlob?: Blob;
  @Input() pdfBase64?: string;
  @Input() pdfUrl?: string;
  @Input() fileName?: string;

  @ViewChild('pdfContainer', { static: true })
  pdfContainer!: ElementRef<HTMLDivElement>;

  // PDF viewer state
  currentPage: number = 1;
  totalPages: number = 0;
  zoomLevel: number = 100;
  zoomLevels: number[] = [25, 50, 75, 100, 125, 150, 175, 200];
  sidebarOpen: boolean = false;
  pdfDocument: any = null;
  objectUrl: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  async ngOnChanges(changes: SimpleChanges) {
    try {
      this.error = null;

      const url = await this.getPdfSource();

      if (!url) {
        // Don't show error for initial state or when no source is provided yet
        this.isLoading = false;
        return;
      }

      this.isLoading = true;

      const loadingTask = pdfjsLib.getDocument(url);
      this.pdfDocument = await loadingTask.promise;
      this.totalPages = this.pdfDocument.numPages;
      this.currentPage = 1;

      await this.renderAllPages();
      this.isLoading = false;
    } catch (err) {
      this.error = 'Failed to load PDF';
      this.isLoading = false;
      console.error('PDF loading error:', err);
    }
  }

  ngOnDestroy() {
    // Clean up object URLs to prevent memory leaks
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  async getPdfSource(): Promise<string | null> {
    // Clean up previous object URL if exists
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }

    if (this.pdfBlob) {
      this.objectUrl = URL.createObjectURL(this.pdfBlob);
      return this.objectUrl;
    }

    if (this.pdfBase64) {
      const byteCharacters = atob(this.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      this.objectUrl = URL.createObjectURL(blob);
      return this.objectUrl;
    }

    if (this.pdfUrl) {
      return this.pdfUrl;
    }

    return null;
  }

  async renderAllPages() {
    if (!this.pdfDocument) return;

    const container = this.pdfContainer.nativeElement;
    container.innerHTML = '';

    const scale = this.zoomLevel / 100;

    for (let pageNum = 1; pageNum <= this.pdfDocument.numPages; pageNum++) {
      const page = await this.pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const pageWrapper = document.createElement('div');
      pageWrapper.className = 'pdf-page';

      pageWrapper.appendChild(canvas);
      container.appendChild(pageWrapper);

      await page.render({
        canvasContext: context!,
        viewport: viewport
      }).promise;
    }
  }

  // Toolbar actions
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  zoomIn() {
    const currentIndex = this.zoomLevels.indexOf(this.zoomLevel);
    if (currentIndex < this.zoomLevels.length - 1) {
      this.zoomLevel = this.zoomLevels[currentIndex + 1];
      this.renderAllPages();
    }
  }

  zoomOut() {
    const currentIndex = this.zoomLevels.indexOf(this.zoomLevel);
    if (currentIndex > 0) {
      this.zoomLevel = this.zoomLevels[currentIndex - 1];
      this.renderAllPages();
    }
  }

  onZoomChange(event: any) {
    this.zoomLevel = parseInt(event.target.value, 10);
    this.renderAllPages();
  }

  fitToPage() {
    this.zoomLevel = 100;
    this.renderAllPages();
  }

  print() {
    if (this.pdfBlob) {
      const url = URL.createObjectURL(this.pdfBlob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  }

  download() {
    if (this.pdfBlob) {
      const url = URL.createObjectURL(this.pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.fileName || 'document.pdf';
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  firstPage() {
    this.currentPage = 1;
    this.scrollToPage(1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToPage(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToPage(this.currentPage);
    }
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.scrollToPage(this.totalPages);
  }

  scrollToPage(pageNum: number) {
    const container = this.pdfContainer.nativeElement;
    const pages = container.querySelectorAll('.pdf-page');
    if (pages[pageNum - 1]) {
      pages[pageNum - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
