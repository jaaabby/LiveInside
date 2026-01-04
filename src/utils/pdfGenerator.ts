import { jsPDF } from 'jspdf';
import type { Quote } from '@/types';
import { formatCurrency, formatDate } from './helpers';

// Helper function to load image as base64
const loadImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
};

export const generateQuotePDF = async (quote: Quote) => {
  const doc = new jsPDF();
  
  // Configuración de colores
  const primaryColor = [124, 58, 237]; // #7c3aed
  const textColor = [31, 41, 55]; // gray-800
  const lightGray = [243, 244, 246]; // gray-100
  
  // Logo y Header con degradado visual
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 50, 'F');
  
  // Cargar y agregar logo centrado verticalmente
  try {
    const logoBase64 = await loadImageAsBase64('/src/assets/images/logo_blanco_horizontal.png');
    if (logoBase64) {
      // Logo más grande y mejor posicionado
      doc.addImage(logoBase64, 'PNG', 15, 12, 60, 24);
    }
  } catch (error) {
    // Si falla la carga del logo, mostrar texto
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('LiveInside', 20, 25);
  }
  
  // Texto "Cotización de Muebles" a la derecha
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Cotización de Muebles', 210 - 15, 25, { align: 'right' });
  
  // Fecha de generación en el header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${formatDate(new Date().toISOString())}`, 210 - 15, 35, { align: 'right' });
  
  // Línea decorativa debajo del header
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(0, 50, 210, 50);
  
  // Información de la cotización
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  
  let yPos = 65;
  
  // Número y fecha
  doc.setFont('helvetica', 'bold');
  doc.text('Cotización:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${quote.id.padStart(3, '0')}`, 60, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(quote.date), 60, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Catálogo:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.catalogName, 60, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Estado:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  const statusLabels = {
    draft: 'Borrador',
    sent: 'Enviada',
    completed: 'Completada',
  };
  doc.text(statusLabels[quote.status], 60, yPos);
  
  // Línea separadora
  yPos += 10;
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  
  // Tabla de productos
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Productos', 20, yPos);
  
  yPos += 8;
  
  // Encabezado de tabla
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, yPos - 5, 170, 8, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Producto', 22, yPos);
  doc.text('Cantidad', 120, yPos);
  doc.text('Precio Unit.', 145, yPos);
  doc.text('Subtotal', 175, yPos);
  
  yPos += 8;
  
  // Items de la cotización
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let subtotal = 0;
  
  quote.items.forEach((item, index) => {
    // Verificar si necesitamos una nueva página
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    
    // Alternar color de fondo para filas
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, yPos - 5, 170, 8, 'F');
    }
    
    // Nombre del producto (truncar si es muy largo)
    const productName = item.product.name.length > 40 
      ? item.product.name.substring(0, 37) + '...' 
      : item.product.name;
    doc.text(productName, 22, yPos);
    
    // Cantidad
    doc.text(item.quantity.toString(), 130, yPos, { align: 'center' });
    
    // Precio unitario
    doc.text(formatCurrency(item.product.price), 145, yPos);
    
    // Subtotal del item
    const itemSubtotal = item.product.price * item.quantity;
    doc.text(formatCurrency(itemSubtotal), 175, yPos);
    
    subtotal += itemSubtotal;
    yPos += 8;
  });
  
  // Línea separadora
  yPos += 5;
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(20, yPos, 190, yPos);
  
  // Total
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 145, yPos);
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(formatCurrency(quote.total), 175, yPos);
  
  // Footer
  const pageCount = doc.internal.pages.length - 1;
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${pageCount} | Generado el ${formatDate(new Date().toISOString())}`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  // Descargar el PDF
  doc.save(`cotizacion-${quote.id.padStart(3, '0')}.pdf`);
};
