import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const PIXEL_RATIO = 2;

async function captureNode(node: HTMLElement): Promise<string> {
  return toPng(node, {
    pixelRatio: PIXEL_RATIO,
    backgroundColor: '#f8fafc', // bg-slate-50 と揃える
    cacheBust: true,
  });
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export async function exportAsPng(node: HTMLElement, filename: string) {
  const dataUrl = await captureNode(node);
  triggerDownload(dataUrl, filename);
}

export async function exportAsPdf(node: HTMLElement, filename: string) {
  const dataUrl = await captureNode(node);
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('画像生成に失敗しました'));
  });
  const widthPx = img.width;
  const heightPx = img.height;

  const pdf = new jsPDF({
    orientation: widthPx > heightPx ? 'landscape' : 'portrait',
    unit: 'px',
    format: [widthPx, heightPx],
    hotfixes: ['px_scaling'],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, widthPx, heightPx);
  pdf.save(filename);
}
