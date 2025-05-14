const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Company Report", 14, 20); // Title
  
    const tableColumn = ["Name", "Industry", "Location", "Email", "Phone", "Website"];
    const tableRows = [];
  
    //filtering companies details 
    filteredCompanies.forEach(company => {
      const row = [
        company.name || "N/A",
        company.industry || "N/A",
        company.location || "N/A",
        company.contactEmail || "N/A",
        company.contactPhone || "N/A",
        company.website || "N/A"
      ];
      tableRows.push(row);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 }
    });
  
    doc.save("company-report.pdf"); // Save the PDF
  };
  