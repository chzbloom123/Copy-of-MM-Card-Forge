import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export async function exportCardPdf(
  threatScanEl: HTMLElement,
  dossierEl: HTMLElement,
  entityName: string,
  accentColor: string
): Promise<void> {
  const sanitized = entityName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'entity';

  const [threatPng, dossierPng] = await Promise.all([
    toPng(threatScanEl, { pixelRatio: 2, cacheBust: true }),
    toPng(dossierEl, { pixelRatio: 2, cacheBust: true }),
  ]);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: 'letter' });

  // Letter landscape: 11 x 8.5 inches
  const pageW = 11;
  const pageH = 8.5;
  const margin = 0.5;
  const cardW = (pageW - margin * 3) / 2;
  const cardH = pageH - margin * 2;

  // Background
  pdf.setFillColor(13, 13, 13);
  pdf.rect(0, 0, pageW, pageH, 'F');

  // Accent line
  pdf.setDrawColor(accentColor);
  pdf.setLineWidth(0.02);
  pdf.line(margin, margin - 0.1, pageW - margin, margin - 0.1);

  pdf.addImage(threatPng, 'PNG', margin, margin, cardW, cardH);
  pdf.addImage(dossierPng, 'PNG', margin * 2 + cardW, margin, cardW, cardH);

  pdf.save(`${sanitized}_card.pdf`);
}
