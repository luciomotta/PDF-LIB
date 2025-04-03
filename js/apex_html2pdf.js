function generatePDF() {
    // Function to generate PDF
    const element = document.getElementById('P_PDF_CONTENT');
    const options= {
        margin: 10,
    filename: 'PAII'+evento.numPaii+'.pdf', // Use the global evento variable
    filename: 'PAII'+evento.numPaii+'.pdf', // Use the global evento variable
    filename: 'PAII'+evento.numPaii+'.pdf', // Use the global evento variable
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }
    //html2pdf().from(element).set(options).save();
    html2pdf().from(element).set(options).output('blob').then(function (pdfBlob) {
        var url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank', "width=1500,height=1000")
    });
}