import PDFDocument from 'pdfkit';

import fs from 'fs'; // fs tradicional
import fsPromises from 'fs/promises'; // fs/promises
import { RssFeed, YoutubeFeed } from '../../Interfaces';
import path from 'path';
import { truncateText } from '../../util/truncateText';

export type FeedsInput = {
  rss: RssFeed[];
  youtube: YoutubeFeed[];
};

// ------------------------------
// Función adaptada
// ------------------------------

export async function createFeedsPDF(feeds: FeedsInput, outputPath?: string) {
  if (!outputPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pdfDir = path.join(process.cwd(), 'pdfs');
    await fsPromises.mkdir(pdfDir, { recursive: true });
    outputPath = path.join(pdfDir, `newsletter-${timestamp}.pdf`);
  }

  // Asegurar directorio padre
  await fsPromises.mkdir(path.dirname(outputPath), { recursive: true });

  const doc = new PDFDocument({ margin: 40 });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // === Contenido del PDF ===
  doc.fontSize(22).text('📑 Resumen de Feeds', { align: 'center' });
  doc.moveDown(2);

  // RSS
  feeds.rss.forEach((feed) => {
    doc.fontSize(16).text(feed.name);
    doc
      .fontSize(10)
      .fillColor('blue')
      .text(feed.url, { link: feed.url, underline: true });
    doc
      .fillColor('black')
      .text(`Última lectura: ${feed.lastRead.toISOString()}`);
    doc.moveDown(0.5);

    feed.posts.forEach((post) => {
      doc.fontSize(14).text(`• ${post.title}`, { underline: true });
      doc
        .fontSize(10)
        .fillColor('blue')
        .text(post.link, { link: post.link, underline: true });
      doc.fillColor('black').text(`Publicado: ${post.pubDate}`);
      doc.moveDown(0.8);
      doc.text(truncateText(post.content, 800));
      doc.moveDown();
    });
    doc.moveDown();
  });

  // YouTube
  doc.addPage();
  feeds.youtube.forEach((feed) => {
    doc.fontSize(16).fillColor('black').text(feed.name);
    doc
      .fontSize(10)
      .fillColor('blue')
      .text(feed.url, { link: feed.url, underline: true });
    doc
      .fillColor('black')
      .text(`Última lectura: ${feed.lastRead.toISOString()}`);
    doc.moveDown(0.5);

    feed.videos.forEach((video) => {
      doc.fontSize(14).text(`• ${video.title}`, { underline: true });
      doc
        .fontSize(10)
        .fillColor('blue')
        .text(video.link, { link: video.link, underline: true });
      doc.fillColor('black').text(`Publicado: ${video.publishedAt}`);
      doc.text(video.description);
      doc.moveDown();
    });
    doc.moveDown();
  });

  doc.end();

  // ⚡ Esperar a que el PDF se escriba completamente
  await new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => resolve());
    writeStream.on('error', (err) => reject(err));
  });

  // Ahora el archivo existe, puedes hacer stat o enviarlo
  const stats = await fsPromises.stat(outputPath);
  console.log(
    `✅ PDF generado: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
  );

  return outputPath; // opcional si quieres devolver la ruta
}
