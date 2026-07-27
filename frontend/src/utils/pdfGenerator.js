import html2pdf from 'html2pdf.js';

export const generateFDSPDF = async (elementIdOrNode, filename = 'NSL_FDS_Report.pdf', shareTitle = 'NSL Feasibility Report', shareText = 'NSL Feasibility & Buyer Order Report') => {
  const targetElement = typeof elementIdOrNode === 'string' ? document.getElementById(elementIdOrNode) : elementIdOrNode;

  if (!targetElement) {
    alert('PDF content element not found!');
    return false;
  }

  const opt = {
    margin: [6, 6, 6, 6],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    const html2pdfFunc = typeof html2pdf === 'function' ? html2pdf : (html2pdf.default || window.html2pdf);

    if (html2pdfFunc) {
      // Clone element so inputs render as crisp spans in canvas/PDF
      const elementClone = targetElement.cloneNode(true);
      const origInputs = targetElement.querySelectorAll('input');
      const cloneInputs = elementClone.querySelectorAll('input');

      origInputs.forEach((inp, idx) => {
        if (cloneInputs[idx]) {
          const span = document.createElement('span');
          span.textContent = inp.value || '—';
          span.style.fontWeight = inp.style.fontWeight || '700';
          span.style.color = inp.style.color || '#0f172a';
          span.style.fontSize = inp.style.fontSize || '0.85rem';
          span.style.fontFamily = 'Arial, sans-serif';
          cloneInputs[idx].parentNode.replaceChild(span, cloneInputs[idx]);
        }
      });

      // 1. Generate & download PDF file directly to device
      await html2pdfFunc().set(opt).from(elementClone).save();

      // 2. Web Share API check for PDF file attachment (if supported synchronously)
      if (navigator.share) {
        try {
          const pdfBlob = await html2pdfFunc().set(opt).from(elementClone).output('blob');
          if (pdfBlob) {
            const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
            if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
              await navigator.share({
                title: shareTitle,
                text: shareText,
                files: [pdfFile],
              });
              return true;
            }
          }
        } catch (shareErr) {
          console.log('Web share fallback:', shareErr);
        }

        // Web Share API text fallback if files aren't shareable on this browser/OS
        try {
          await navigator.share({
            title: shareTitle,
            text: `${shareText}\n\nPDF Report: ${filename}`,
          });
        } catch (e) {
          // ignore user cancel
        }
      }
      return true;
    }
  } catch (err) {
    console.error('html2pdf error, using print fallback:', err);
  }

  // Fallback to native print window
  window.print();
  return true;
};
