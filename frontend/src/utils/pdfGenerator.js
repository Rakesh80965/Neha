import html2pdf from 'html2pdf.js';

export const generateFDSPDF = async (elementIdOrNode, filename = 'NSL_FDS_Report.pdf', shareTitle = 'NSL Feasibility Report', shareText = 'NSL Feasibility & Buyer Order Report') => {
  const targetElement = typeof elementIdOrNode === 'string' ? document.getElementById(elementIdOrNode) : elementIdOrNode;

  if (!targetElement) {
    alert('PDF content element not found!');
    return;
  }

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    // 1. Save / Download PDF directly to device
    const pdfWorker = html2pdf().set(opt).from(targetElement);
    await pdfWorker.save();

    // 2. Attempt Web Share API with generated PDF file Blob
    const pdfBlob = await pdfWorker.output('blob');
    const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        files: [pdfFile],
      });
    }
  } catch (err) {
    console.log('PDF generation/share handled:', err);
  }
};
