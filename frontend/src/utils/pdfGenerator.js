import html2pdf from 'html2pdf.js';

export const generateFDSPDF = async (elementIdOrNode, filename = 'NSL_FDS_Report.pdf', shareTitle = 'NSL Feasibility Report', shareText = 'NSL Feasibility & Buyer Order Report') => {
  const targetElement = typeof elementIdOrNode === 'string' ? document.getElementById(elementIdOrNode) : elementIdOrNode;

  if (!targetElement) {
    alert('PDF content element not found!');
    return false;
  }

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    const html2pdfFunc = typeof html2pdf === 'function' ? html2pdf : (html2pdf.default || window.html2pdf);
    
    if (html2pdfFunc) {
      // 1. Generate and save/download PDF directly to user's device
      await html2pdfFunc().set(opt).from(targetElement).save();

      // 2. Web Share API check
      if (navigator.share) {
        try {
          const pdfBlob = await html2pdfFunc().set(opt).from(targetElement).output('blob');
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
          console.log('File share fallback:', shareErr);
        }

        // Text share fallback if browser can't share PDF file directly
        await navigator.share({
          title: shareTitle,
          text: `${shareText}\n\nPDF Report saved as ${filename}`,
        });
      }
      return true;
    }
  } catch (err) {
    console.error('html2pdf error, using print fallback:', err);
  }

  // Fallback if library fails
  window.print();
  return true;
};
