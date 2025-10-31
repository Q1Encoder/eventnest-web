// src/lib/generateCertificatePDF.ts
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

/**
 * Generates a personalized certificate PDF with the user's name perfectly centered.
 */
export async function generateCertificatePDF(
  userName: string,
  basePdfPath: string
): Promise<Blob> {
  // === 1. Load base PDF ===
  const response = await fetch(basePdfPath)
  if (!response.ok) throw new Error("Base PDF not found")
  const existingPdfBytes = await response.arrayBuffer()
  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // === 2. Get first page ===
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  // === 3. Embed a standard font (or custom if you have it) ===
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold) // Cambia a tu fuente si es personalizada

  // === 4. Configuración del texto ===
  const fontSize = 24
  const text = userName.trim()

  // === 5. CÁLCULO EXACTO DEL ANCHO DEL TEXTO ===
  const textWidth = font.widthOfTextAtSize(text, fontSize)

  // === 6. CENTRADO HORIZONTAL PERFECTO ===
  const x = (width - textWidth) / 2

  // === 7. POSICIÓN VERTICAL (ajusta según tu diseño) ===
  const y = height / 2 - 5 // Ajusta este valor para mover arriba/abajo

  // === 8. Dibujar el texto ===
  firstPage.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0.1, 0.1, 0.1),
  })

  // === 9. Generar y devolver Blob ===
  const pdfBytes = await pdfDoc.save()
  // Make a copy into a plain ArrayBuffer to satisfy TypeScript's BlobPart types
  const arrayBuffer = new Uint8Array(pdfBytes).buffer
  return new Blob([arrayBuffer], { type: "application/pdf" })
}