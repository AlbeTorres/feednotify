import { RssFeed, YoutubeFeed } from '../../Interfaces';

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { buildHTML } from './builtHtml';

type FeedsInput = {
  rss: RssFeed[];
  youtube: YoutubeFeed[];
};

/**
 * Genera un PDF (Buffer) a partir de { rss, youtube }.
 * Devuelve Buffer para adjuntarlo por email sin escribir a disco.
 */
export async function feedsToPdfBuffer(data: FeedsInput) {
  // En entornos serverless podrías usar puppeteer-core + chrome-aws-lambda.
  const browser = await puppeteer.launch({
    // Si corres en contenedor/CI:
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    const html = buildHTML(data);

    // Carga HTML y espera imágenes/recursos
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // respeta colores de fondo
      preferCSSPageSize: true,
    });

    await page.close();
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function savePdfToDisk(
  data: Buffer<ArrayBuffer>,
  outputPath?: string
): Promise<string> {
  // Generar nombre de archivo con timestamp si no se proporciona ruta
  if (!outputPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `newsletter-${timestamp}.pdf`;

    // Crear directorio 'pdfs' si no existe
    const pdfDir = path.join(process.cwd(), 'pdfs');
    try {
      await fs.access(pdfDir);
    } catch {
      await fs.mkdir(pdfDir, { recursive: true });
      console.log(`Created directory: ${pdfDir}`);
    }

    outputPath = path.join(pdfDir, filename);
  }

  // Asegurar que el directorio padre existe
  const dir = path.dirname(outputPath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }

  // ¡AQUÍ ESTABA EL PROBLEMA! Faltaba esta línea:
  await fs.writeFile(outputPath, data);

  // Verificar que el archivo se guardó correctamente
  const stats = await fs.stat(outputPath);
  const sizeInMB = stats.size / (1024 * 1024);

  console.log(`✅ PDF guardado exitosamente:`);
  console.log(`   📍 Ruta: ${outputPath}`);
  console.log(`   📦 Tamaño: ${sizeInMB.toFixed(2)} MB`);

  return outputPath;
}
