import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export async function exportCardPdf(
  threatScanEl: HTMLElement,
  dossierEl: HTMLElement,
  entityName: string,
  color: string
): Promise<void> {
  const sanitized = entityName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'entity';

  const threatPng = await toPng(threatScanEl, { pixelRatio: 2, cacheBust: true });
  const dossierPng = await toPng(dossierEl, { pixelRatio: 2, cacheBust: true });

  const cardWidth = threatScanEl.offsetWidth;
  const cardHeight = threatScanEl.offsetHeight;

  // Create PDF with card dimensions (in mm, roughly)
  const pdfWidth = 100;
  const pdfHeight = (cardHeight / cardWidth) * pdfWidth;

  const pdf = new jsPDF({
    orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pdfWidth + 20, pdfHeight + 20],
  });

  // Page 1: Threat Scan
  pdf.setFillColor(13, 13, 13);
  pdf.rect(0, 0, pdfWidth + 20, pdfHeight + 20, 'F');
  pdf.addImage(threatPng, 'PNG', 10, 10, pdfWidth, pdfHeight);

  // Page 2: Containment Dossier
  pdf.addPage([pdfWidth + 20, pdfHeight + 20]);
  pdf.setFillColor(13, 13, 13);
  pdf.rect(0, 0, pdfWidth + 20, pdfHeight + 20, 'F');
  pdf.addImage(dossierPng, 'PNG', 10, 10, pdfWidth, pdfHeight);

  pdf.save(`${sanitized}_card.pdf`);
}
