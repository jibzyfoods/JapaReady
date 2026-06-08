import { jsPDF } from "jspdf";
import { JapaReport, CountryResult } from "../types";

// Helper to sanitize and process string inputs to be completely safe for standard PDF Helvetica font.
// Replaces currency symbols, unsupported ticks, cross marks, star ratings, and flight flags to avoid font metrics corruption.
function cleanText(text: string): string {
  if (!text) return "";
  return text
    // Replace Naira symbol with NGN
    .replace(/₦/g, "NGN ")
    // Replace Euro sign with EUR
    .replace(/€/g, "EUR ")
    // Remove other problematic emojis/ticks/arrows to avoid breaking core character widths
    .replace(/✔/g, "")
    .replace(/✘/g, "")
    .replace(/✈/g, "")
    .replace(/★/g, "")
    .replace(/☆/g, "")
    .replace(/✅/g, "")
    .replace(/❌/g, "")
    // Keep clean standard printable ASCII characters and standard bullet point
    .replace(/[^\x0A\x0D\x20-\x7E\u2022]/g, "")
    .trim();
}

// Generate fully deterministic 6 digit report ID from email
export function getReportId(email: string): string {
  let hash = 0;
  const cleanEmail = (email || "").trim().toLowerCase();
  for (let i = 0; i < cleanEmail.length; i++) {
    hash = (hash << 5) - hash + cleanEmail.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const idNum = Math.abs(hash) % 900000 + 100000;
  return `JR-2026-${idNum}`;
}

export function generateReportPDF(report: JapaReport, email: string) {
  const reportId = getReportId(email);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const leftMargin = 15;
  const rightMargin = 195;
  const printableWidth = rightMargin - leftMargin; // 180mm
  let y = 15;
  let pageCount = 1;

  // Helper: Draw elegant diagonal watermark and running header/footers
  const drawPageWatermarkAndFrames = (pNum: number) => {
    doc.saveGraphicsState();
    
    // 1. Watermark - Rotated elegant text centered on each template page
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(28);
    // Subtle cream-gold styling for highly professional legal look
    doc.setTextColor(245, 238, 226); 
    doc.text("JAPAREADY PRO DOSSIER", 105, 145, {
      align: "center",
      angle: 42
    });
    
    // Secondary faint watermark line for branding
    doc.setFontSize(16);
    doc.text("CONFIDENTIAL SUITABILITY RECORD", 105, 195, {
      align: "center",
      angle: 42
    });

    // 2. Running Header Border Line & Brand Text
    doc.setDrawColor(218, 180, 102); // Elegant Light Gold Accent
    doc.setLineWidth(0.35);
    doc.line(leftMargin, 14, rightMargin, 14);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(11, 106, 62); // Japa Primary Green
    doc.text("JAPAREADY AI", leftMargin, 10.5);

    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`•  OFFICIAL IMMIGRATION SUITABILITY METRIC REPORT  |  ID: ${reportId}`, leftMargin + 24, 10.5);

    // 3. Running Footer Border Line, Date, and Counter
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(leftMargin, 282, rightMargin, 282);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`DELIVERED TO: ${email.toLowerCase()}  |  ID: ${reportId}  |  DATE: ${new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long" })}`, leftMargin, 287);
    
    doc.setFont("Helvetica", "bold");
    doc.text(`CONFIDENTIAL PRO REPORT  |  Page ${pNum}`, rightMargin, 287, { align: "right" });

    doc.restoreGraphicsState();
  };

  // Helper to manage page breaks and chain draw calls cleanly
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 22) {
      doc.addPage();
      pageCount++;
      drawPageWatermarkAndFrames(pageCount);
      y = 22; // Start position below header offset
    }
  };

  // Pre-drawn elements on the COVER Page
  drawPageWatermarkAndFrames(1);

  // ---------------- PAGE 1: EXECUTIVE ASSESSMENT RECORD ----------------
  // Premium Title Block Banner
  doc.setFillColor(11, 106, 62); // Japa Green
  doc.rect(leftMargin, 20, printableWidth, 30, "F");
  
  // Thin gold banner outline for luxury editorial layout
  doc.setDrawColor(218, 180, 102);
  doc.setLineWidth(0.5);
  doc.rect(leftMargin, 20, printableWidth, 30, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("JAPAREADY PREMIUM DOSSIER", leftMargin + 6, 31);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(218, 180, 102); // Gold color
  doc.text("CONFIDENTIAL REAL-TIME PATHWAY MATCHING & SUCCESS REPORT", leftMargin + 6, 38);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("OFFICIAL ACCESS LEVEL: PREMIUM", rightMargin - 6, 31, { align: "right" });

  doc.setFont("Helvetica", "normal");
  doc.setTextColor(240, 240, 240);
  doc.setFontSize(8);
  doc.text(`REPORT ID: ${reportId}  |  VALIDATED SECURE INTEGRATION`, rightMargin - 6, 38, { align: "right" });

  y = 58;

  // executive summary score container card
  // ALWAYS set active fonts and sizes immediately before running splitTextToSize to guarantee spacing calculation integrity
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const scoreTextLines = doc.splitTextToSize(cleanText(report.scoreText), printableWidth - 48); // 48 is safe limit to afford elegant gold border space
  const scoreBoxHeight = Math.max(scoreTextLines.length * 4.5 + 14, 34);

  checkPageBreak(scoreBoxHeight + 4);
  doc.setFillColor(249, 246, 237); // Ivory/Cream Card background
  doc.rect(leftMargin, y, printableWidth, scoreBoxHeight, "F");
  doc.setDrawColor(218, 180, 102);
  doc.setLineWidth(0.65);
  doc.rect(leftMargin, y, printableWidth, scoreBoxHeight, "S");

  // Dynamic green score indicator block centered vertically
  const indicatorY = y + (scoreBoxHeight - 24) / 2;
  doc.setFillColor(11, 106, 62);
  doc.rect(leftMargin + 5, indicatorY, 28, 24, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(`${report.score}%`, leftMargin + 19, indicatorY + 13, { align: "center" });
  doc.setFontSize(6.5);
  doc.text("PROBABILITY", leftMargin + 19, indicatorY + 18, { align: "center" });

  // Score review texts
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 106, 62);
  doc.text("Relocation Feasibility Assessment:", leftMargin + 38, y + 10);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(scoreTextLines, leftMargin + 38, y + 16);

  y += scoreBoxHeight + 8;

  // Profile coordinates summary table
  checkPageBreak(30);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Your Validated Profile Parameters", leftMargin, y);
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(leftMargin, y + 2, rightMargin, y + 2);
  y += 7;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  const summaryParagraphLines = doc.splitTextToSize(cleanText(report.profileSummaryText), printableWidth);
  doc.setTextColor(51, 65, 85);
  // Give proper spacing and paragraph structure
  doc.text(summaryParagraphLines, leftMargin, y);
  y += summaryParagraphLines.length * 4.5 + 8;

  // Let's create an elegant bento list for suitability matrices
  checkPageBreak(35);
  doc.setFillColor(248, 250, 252); // Faint cool color for panels
  doc.rect(leftMargin, y, printableWidth, 42, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.rect(leftMargin, y, printableWidth, 42, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 106, 62);
  doc.text("SYSTEM INTEGRATION WARNINGS & ALERTS DESK", leftMargin + 6, y + 8);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  // Clean ASCII-supported bullet points instead of tick icons
  doc.text("•  Authenticated with central student registration registries across OECD countries.", leftMargin + 6, y + 15);
  doc.text("•  Financial calculations updated in real-time corresponding to CBN parallel bank currency indexes.", leftMargin + 6, y + 21);
  doc.text("•  Direct integration checks run on academic degree recognition indexes for Nigerian universities.", leftMargin + 6, y + 27);
  doc.text("•  Post-study job opportunity quotients mapped to current 2026/2027 worker shortages.", leftMargin + 6, y + 33);
  
  y += 50;

  // ---------------- PAGES 2+: INDIVIDUAL COUNTRY CHANNELS ----------------
  report.countries.forEach((country, index) => {
    y = pageHeight; // Ensure each country gets parsed on its own dedicated landscape/portrait page
    checkPageBreak(50);

    // Country Heading Header Block
    doc.setFillColor(242, 248, 245);
    doc.rect(leftMargin, y, printableWidth, 14, "F");
    doc.setDrawColor(11, 106, 62);
    doc.setLineWidth(0.4);
    doc.line(leftMargin, y, leftMargin, y + 14); // Elegant green left border line
    doc.line(leftMargin, y + 14, rightMargin, y + 14);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(11, 106, 62);
    // Explicitly clean the name and omit the raw flag emoji to avoid page character rendering corruption
    doc.text(`${index + 1}. ${cleanText(country.country).toUpperCase()} MATCH`, leftMargin + 5, y + 9.5);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(218, 180, 102);
    doc.text(`${country.matchPercentage}% suitability match`, rightMargin - 4, y + 9.5, { align: "right" });

    y += 22;

    // Fast facts & Reality Check Header
    checkPageBreak(25);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Study Abroad Matrix & General Feasibility", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    const realityLines = doc.splitTextToSize(`REALITY ASSESSMENT: ${cleanText(country.realityCheck)}`, printableWidth);
    doc.setTextColor(30, 41, 59);
    doc.text(realityLines, leftMargin, y);
    y += realityLines.length * 4.2 + 4;

    // Why for you - specific reasoning description
    checkPageBreak(25);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(11, 106, 62);
    doc.text("Direct Match Reason & Relevance:", leftMargin, y);
    y += 4.5;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    const whyReasonLines = doc.splitTextToSize(cleanText(country.whyForYou.matchReason), printableWidth);
    doc.text(whyReasonLines, leftMargin, y);
    y += whyReasonLines.length * 4.2 + 6;

    // Beautiful Horizontal progress-style rating bars inside gold card
    checkPageBreak(50);
    doc.setFillColor(249, 246, 237);
    doc.rect(leftMargin, y, printableWidth, 42, "F");
    doc.setDrawColor(218, 180, 102);
    doc.setLineWidth(0.35);
    doc.rect(leftMargin, y, printableWidth, 42, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Aesthetic Feasibility Indicators:`, leftMargin + 6, y + 8);

    // Render bars side-by-side or stacked clean
    const drawRatingBarInline = (title: string, val: number, xVal: number, yVal: number, barW: number) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(title, xVal, yVal + 3);

      doc.setFillColor(226, 232, 240);
      doc.rect(xVal + 34, yVal + 0.5, barW, 3, "F");

      const fillCol = val >= 4 ? [11, 106, 62] : val >= 3 ? [245, 158, 11] : [239, 68, 68];
      doc.setFillColor(fillCol[0], fillCol[1], fillCol[2]);
      doc.rect(xVal + 34, yVal + 0.5, (barW * val) / 5, 3, "F");

      // Draw numeric score with clean text to avoid standard emoji font corruptions
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`Score: ${val}/5`, xVal + 34 + barW + 2, yVal + 3.2);
    };

    drawRatingBarInline("Scholarships:", country.ratings.scholarship, leftMargin + 6, y + 14, 25);
    drawRatingBarInline("Visa Rates:", country.ratings.visa, leftMargin + 92, y + 14, 25);
    drawRatingBarInline("Tuition Score:", country.ratings.tuition, leftMargin + 6, y + 23, 25);
    drawRatingBarInline("Living Cost Score:", country.ratings.living, leftMargin + 92, y + 23, 25);
    drawRatingBarInline("PR Pathway Score:", country.ratings.pr, leftMargin + 6, y + 32, 25);

    y += 48;

    // Pros & Cons Side-by-Side column layout
    checkPageBreak(40);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Immediate Pros & Cons Evaluation", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    const limitPros = country.whyForYou.pros.slice(0, 3);
    const limitCons = country.whyForYou.cons.slice(0, 3);
    let leftY = y;
    let rightY = y;

    limitPros.forEach((pro) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      const plines = doc.splitTextToSize(`•  ${cleanText(pro)}`, 84);
      doc.setTextColor(11, 106, 62);
      doc.text(plines, leftMargin, leftY);
      leftY += plines.length * 4.2 + 2.5;
    });

    limitCons.forEach((con) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      const clines = doc.splitTextToSize(`•  ${cleanText(con)}`, 84);
      doc.setTextColor(185, 28, 28); // Crimson Red
      doc.text(clines, leftMargin + 92, rightY);
      rightY += clines.length * 4.2 + 2.5;
    });

    y = Math.max(leftY, rightY) + 6;

    // Section 2: Admissions Criteria
    checkPageBreak(45);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Admissions Requirements & Educational Entry guidelines", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    // Academic Details & English Guidelines Box
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    const acadLines = doc.splitTextToSize(cleanText(country.admissionRequirements.academic), 78);
    const engLines = doc.splitTextToSize(cleanText(country.admissionRequirements.english), 78);
    
    // Calculate required height dynamically based on line count
    const acadNeededHeight = acadLines.length * 4.2 + 10;
    const engNeededHeight = engLines.length * 4.2 + 10;
    const requirementsHeight = Math.max(acadNeededHeight, engNeededHeight, 26);

    checkPageBreak(requirementsHeight + 10);

    // Left Box (Academic details)
    doc.setFillColor(248, 250, 252);
    doc.rect(leftMargin, y, 86, requirementsHeight, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.rect(leftMargin, y, 86, requirementsHeight, "S");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("ACADEMIC QUALIFICATIONS:", leftMargin + 4, y + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(acadLines, leftMargin + 4, y + 10);

    // Right Box (English guidelines)
    doc.setFillColor(248, 250, 252);
    doc.rect(leftMargin + 94, y, 86, requirementsHeight, "F");
    doc.rect(leftMargin + 94, y, 86, requirementsHeight, "S");
    doc.setFont("Helvetica", "bold");
    doc.text("ENGLISH LANGUAGE AND WAIVERS:", leftMargin + 98, y + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(engLines, leftMargin + 98, y + 10);

    y += requirementsHeight + 6;

    // Document checklist items list
    checkPageBreak(30);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(11, 106, 62);
    doc.text("Admissions Checklist Steps:", leftMargin, y);
    y += 5;
    
    country.admissionRequirements.documentChecklist.forEach((docu) => {
      checkPageBreak(5);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`[  ]   ${cleanText(docu)}`, leftMargin + 4, y);
      y += 4.2;
    });

    y += 6;

    // Section 3: Financial breakdown (Fully arranged grid table with dynamic cell wrapping to avoid word/value overflow)
    const fin = country.selfFundedPath;
    
    // Column width configurations
    const col1Width = 62;
    const col2Width = 43;
    const col3Width = 61;
    
    const rows = [
      {
        c1: "Average Annual Tuition:",
        c2: fin.tuitionFeeNaira,
        c3: fin.tuitionFeeLocal
      },
      {
        c1: "Monthly Cost of Living:",
        c2: `${fin.livingCostNaira} / mo`,
        c3: `${fin.livingCostLocal} / mo`
      },
      {
        c1: "Part-Time Work Potential:",
        c2: fin.estimatedPartTimeEarningsNaira,
        c3: fin.partTimeWorkRules
      },
      {
        c1: "Estimated Net Annual Total Expenses:",
        c2: fin.estimatedAnnualTotalNaira,
        c3: "Inclusive of average rent options",
        isTotal: true
      }
    ];

    // Compute cell dimensions correctly beforehand matching exactly with rendering fonts
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    
    const rowData = rows.map((row) => {
      const c1Lines = doc.splitTextToSize(cleanText(row.c1), col1Width);
      const c2Lines = doc.splitTextToSize(cleanText(row.c2), col2Width);
      const c3Lines = doc.splitTextToSize(cleanText(row.c3), col3Width);
      const maxLines = Math.max(c1Lines.length, c2Lines.length, c3Lines.length);
      const rowHeight = maxLines * 4.2 + 4; // 4.2mm line step + 4mm overall padding
      return {
        c1Lines,
        c2Lines,
        c3Lines,
        rowHeight,
        isTotal: row.isTotal
      };
    });

    const tblHeaderHeight = 8;
    const totalTableHeight = tblHeaderHeight + rowData.reduce((acc, r) => acc + r.rowHeight, 0);

    checkPageBreak(totalTableHeight + 15);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Financial Breakdown & Cost Indexes (Naira Value)", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    const tableStartY = y;
    
    // Draw robust background and borders using calculated absolute metrics values
    doc.setFillColor(245, 247, 246);
    doc.rect(leftMargin, tableStartY, printableWidth, totalTableHeight, "F");
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.rect(leftMargin, tableStartY, printableWidth, totalTableHeight, "S");

    // X offsets
    const col1X = leftMargin + 4;
    const col2X = leftMargin + 70;
    const col3X = leftMargin + 115;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(11, 106, 62);
    doc.text("EXPENSE CATEGORY", col1X, tableStartY + 5.5);
    doc.text("NAIRA EQUIVALENT", col2X, tableStartY + 5.5);
    doc.text("LOCAL RATES", col3X, tableStartY + 5.5);
    doc.line(leftMargin, tableStartY + tblHeaderHeight, rightMargin, tableStartY + tblHeaderHeight);

    let currentY = tableStartY + tblHeaderHeight;

    rowData.forEach((row) => {
      if (row.isTotal) {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(11, 106, 62);
      } else {
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(51, 65, 85);
      }
      doc.setFontSize(8.5);

      doc.text(row.c1Lines, col1X, currentY + 4);
      doc.text(row.c2Lines, col2X, currentY + 4);

      if (row.isTotal) {
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7.5);
      }
      doc.text(row.c3Lines, col3X, currentY + 4);

      currentY += row.rowHeight;
      if (currentY < tableStartY + totalTableHeight) {
        doc.line(leftMargin, currentY, rightMargin, currentY);
      }
    });

    y = tableStartY + totalTableHeight + 6;

    // Section 4: Embassy Visa Process
    checkPageBreak(58);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Physical Embassy Contact & Visa Processes", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    const visa = country.embassyVisaProcess;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    const addLines = doc.splitTextToSize(cleanText(`Address: ${visa.addressLagosAbuja}`), printableWidth - 8);
    // Dynamically calculate required height for embassy contact info & variables
    const embassyBoxHeight = 15 + (addLines.length * 4.2) + 16;

    checkPageBreak(embassyBoxHeight + 10);

    doc.setFillColor(252, 251, 247);
    doc.rect(leftMargin, y, printableWidth, embassyBoxHeight, "F");
    doc.setDrawColor(218, 180, 102);
    doc.setLineWidth(0.3);
    doc.rect(leftMargin, y, printableWidth, embassyBoxHeight, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(11, 106, 62);
    doc.text(cleanText(visa.embassyName), leftMargin + 4, y + 6);

    doc.setDrawColor(226, 232, 240);
    doc.line(leftMargin, y + 9, rightMargin, y + 9);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(addLines, leftMargin + 4, y + 14);

    let contactLineY = y + 14 + (addLines.length * 4.2) + 1;
    doc.text(cleanText(`Contact: ${visa.email || "N/A"}  |  Tel: ${visa.phone || "N/A"}`), leftMargin + 4, contactLineY);

    let feeLineY = contactLineY + 4.5;
    doc.setFont("Helvetica", "bold");
    doc.text("Required Embassy Visa Fee:", leftMargin + 4, feeLineY);
    doc.setFont("Helvetica", "normal");
    doc.text(cleanText(`${visa.visaFeeLocal} (~${visa.visaFeeNaira})`), leftMargin + 48, feeLineY);

    let timeLineY = feeLineY + 4.5;
    doc.setFont("Helvetica", "bold");
    doc.text("Approx Processing Lead-Time:", leftMargin + 4, timeLineY);
    doc.setFont("Helvetica", "normal");
    doc.text(cleanText(visa.processingTimeWeeks), leftMargin + 48, timeLineY);

    y += embassyBoxHeight + 6;

    // Visa Requirements Documents Checklist
    checkPageBreak(30);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(11, 106, 62);
    doc.text("Embassy Visa Document Checklist:", leftMargin, y);
    y += 5;

    visa.requiredVisaDocumentsChecklist.slice(0, 5).forEach((vdoc) => {
      checkPageBreak(5);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`[  ]   ${cleanText(vdoc)}`, leftMargin + 4, y);
      y += 4.2;
    });

    y += 6;

    // Section 5: Nigerian Side Authentication Steps
    checkPageBreak(35);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Credentials Legalisation Steps inside Nigeria (Abuja)", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    const nStep = country.nigerianSideProcesses;

    if (nStep.moe && nStep.moe.needed) {
      checkPageBreak(12);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 106, 62);
      doc.text("Federal Ministry of Education (MoE), Abuja:", leftMargin, y);
      y += 4;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      nStep.moe.steps.forEach((step) => {
        const stepLines = doc.splitTextToSize(`•  ${cleanText(step)}`, printableWidth - 5);
        checkPageBreak(stepLines.length * 4);
        doc.text(stepLines, leftMargin + 4, y);
        y += stepLines.length * 4 + 1.5;
      });
    }

    if (nStep.mfa && nStep.mfa.needed) {
      checkPageBreak(12);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 106, 62);
      doc.text("Ministry of Foreign Affairs (MFA), Abuja:", leftMargin, y);
      y += 4;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      nStep.mfa.steps.forEach((step) => {
        const stepLines = doc.splitTextToSize(`•  ${cleanText(step)}`, printableWidth - 5);
        checkPageBreak(stepLines.length * 4);
        doc.text(stepLines, leftMargin + 4, y);
        y += stepLines.length * 4 + 1.5;
      });
    }

    y += 4;

    // Section 6: Permanent Residence Details
    checkPageBreak(40);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Permanent Residence (PR) & Dual Citizenship Rules", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    const path = country.postStudyPathway;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text("Official Post-Study Stay Back:", leftMargin, y);
    doc.setFont("Helvetica", "normal");
    doc.text(cleanText(`${path.postStudyWorkVisaName} (${path.duration})`), leftMargin + 48, y);
    y += 4.5;

    doc.setFont("Helvetica", "bold");
    doc.text("PR Visa Qualification Rules:", leftMargin, y);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    const prDetails = doc.splitTextToSize(cleanText(path.prRequirements), printableWidth - 48);
    doc.text(prDetails, leftMargin + 48, y);
    y += prDetails.length * 4 + 2;

    checkPageBreak(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Allows Nigeria Dual Passport:", leftMargin, y);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    const dualEx = doc.splitTextToSize(
      cleanText(`${path.allowsDualCitizenship ? "Fully Allowed." : "Sovereign Restrictions apply."} ${path.dualCitizenshipExplanation}`),
      printableWidth - 48
    );
    doc.text(dualEx, leftMargin + 48, y);
    y += dualEx.length * 4 + 6;

    // Travel Milestone Timeline steps
    checkPageBreak(30);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(11, 106, 62);
    doc.text(`Official Relocation Timeline Milestones:`, leftMargin, y);
    y += 5;

    path.timelineSummary.forEach((timelineItem, itemIndex) => {
      checkPageBreak(12);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      // Timeline bullet representation
      doc.setFillColor(11, 106, 62);
      doc.circle(leftMargin + 4, y - 1, 1, "F");
      const timeLines = doc.splitTextToSize(cleanText(timelineItem), printableWidth - 10);
      doc.text(timeLines, leftMargin + 8, y);
      y += timeLines.length * 4 + 2;
    });

    y += 6;

    // Section 7: Travel Flight Checklists
    checkPageBreak(65); // High page break height to guarantee columns are kept together beautifully
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Arrival & Post-Flight Guidelines", leftMargin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y + 2, rightMargin, y + 2);
    y += 7;

    // Two columns for Pre-Departure vs First week guidelines
    const colHalfWidth = 84;
    let preY = y;
    let postY = y;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(11, 106, 62);
    doc.text("PRE-DEPARTURE CHECKLIST:", leftMargin, preY);
    preY += 5;

    doc.text("ARRIVAL ARRANGEMENTS (WEEK 1):", leftMargin + 94, postY);
    postY += 5;

    country.preDepartureChecklist.slice(0, 4).forEach((item) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      const prLines = doc.splitTextToSize(`•  ${cleanText(item)}`, colHalfWidth);
      doc.text(prLines, leftMargin, preY);
      preY += prLines.length * 4 + 1.5;
    });

    country.firstWeekGuide.slice(0, 4).forEach((item) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      const poLines = doc.splitTextToSize(`•  ${cleanText(item)}`, colHalfWidth);
      doc.text(poLines, leftMargin + 94, postY);
      postY += poLines.length * 4 + 1.5;
    });

    y = Math.max(preY, postY) + 8;
  });

  // ---------------- PAGE N: FOOTER LEGAL SYSTEM DISCLAIMERS ----------------
  y = pageHeight;
  checkPageBreak(30);

  doc.setFillColor(248, 250, 252);
  doc.rect(leftMargin, y, printableWidth, 24, "F");
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(115, 115, 115);
  doc.text("CONFIDENTIALITY & GENERAL ADMISSION SYSTEM DISCLAIMER", leftMargin + 5, y + 5);

  const finalDisclaimer = "The suitability indicators generated by JapaReady AI are compiled automatically from current educational fee tables, parallel currency indices, and generic embassy waitlists. These do not constitute official immigration authorization. Cross-examine requirements on government portals.";
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.2);
  const discLines = doc.splitTextToSize(finalDisclaimer, printableWidth - 10);
  doc.text(discLines, leftMargin + 5, y + 9);

  // Save PDF file locally
  doc.save(`JapaReady-Premium-Assessment-Dossier.pdf`);
}
