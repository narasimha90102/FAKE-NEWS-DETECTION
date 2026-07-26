const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const REPORTS_DIR = path.join(__dirname, '../reports');
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

// Colours matching reference file
const COLOURS = {
  header:  'FF1E3A5F',   // Dark blue header
  pass:    'FF00C851',   // Green for PASS
  fail:    'FFFF4444',   // Red for FAIL
  skip:    'FFFFBB33',   // Amber for SKIP
  altRow:  'FFF0F4F8',   // Light blue-grey alternating row
  white:   'FFFFFFFF',
  title:   'FF0D47A1',
};

function applyHeaderStyle(cell, text) {
  cell.value = text;
  cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.header } };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border = {
    top: { style: 'thin', color: { argb: 'FF4A90D9' } },
    bottom: { style: 'thin', color: { argb: 'FF4A90D9' } },
    left: { style: 'thin', color: { argb: 'FF4A90D9' } },
    right: { style: 'thin', color: { argb: 'FF4A90D9' } },
  };
}

function applyDataRow(row, rowIndex, status) {
  const bgColor = status === 'PASS' ? 'FFE8F5E9' : rowIndex % 2 === 0 ? COLOURS.altRow : COLOURS.white;
  row.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD0D7E0' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D7E0' } },
      left: { style: 'thin', color: { argb: 'FFD0D7E0' } },
      right: { style: 'thin', color: { argb: 'FFD0D7E0' } },
    };
  });
  // Colour status cell
  const statusCell = row.getCell(6);
  statusCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  statusCell.fill = {
    type: 'pattern', pattern: 'solid',
    fgColor: { argb: status === 'PASS' ? COLOURS.pass : status === 'FAIL' ? COLOURS.fail : COLOURS.skip }
  };
  statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
}

async function generateExcelReport(suiteName, testResults, outputFile) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'TruthGuard Automation';
  wb.created = new Date();

  // ── Summary Sheet ─────────────────────────────────────────────────────────
  const sumSheet = wb.addWorksheet('📊 Summary', { views: [{ showGridLines: false }] });
  sumSheet.mergeCells('A1:G1');
  const titleCell = sumSheet.getCell('A1');
  titleCell.value = `TruthGuard — ${suiteName} | E2E Test Report`;
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.title } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sumSheet.getRow(1).height = 40;

  const pass = testResults.filter(t => t.status === 'PASS').length;
  const fail = testResults.filter(t => t.status === 'FAIL').length;
  const total = testResults.length;
  const passRate = ((pass / total) * 100).toFixed(1);
  const avgDuration = (testResults.reduce((s, t) => s + (t.duration || 0), 0) / total).toFixed(0);

  const summaryData = [
    ['Metric', 'Value'],
    ['Total Test Cases', total],
    ['Passed ✅', pass],
    ['Failed ❌', fail],
    ['Pass Rate', `${passRate}%`],
    ['Avg Duration (ms)', `${avgDuration} ms`],
    ['Report Generated', new Date().toISOString()],
    ['Suite', suiteName],
  ];
  summaryData.forEach((row, i) => {
    const r = sumSheet.addRow(row);
    if (i === 0) { r.eachCell(c => applyHeaderStyle(c, c.value)); }
    else {
      r.getCell(1).font = { bold: true };
      r.getCell(2).font = { bold: i === 3 && fail > 0 ? true : false, color: { argb: i === 3 && pass === total ? COLOURS.pass : 'FF000000' } };
      r.height = 22;
    }
  });
  sumSheet.getColumn(1).width = 30;
  sumSheet.getColumn(2).width = 30;

  // ── Test Cases Sheet ──────────────────────────────────────────────────────
  const tcSheet = wb.addWorksheet('🧪 Test Cases', { views: [{ showGridLines: false }] });
  const headers = ['#', 'Test Case ID', 'Test Case Name', 'Description', 'Steps', 'Status', 'Duration (ms)', 'Error'];
  const widths = [5, 18, 45, 55, 65, 12, 16, 35];

  const headerRow = tcSheet.addRow(headers);
  headerRow.height = 30;
  headers.forEach((h, i) => { applyHeaderStyle(headerRow.getCell(i + 1), h); });
  widths.forEach((w, i) => { tcSheet.getColumn(i + 1).width = w; });
  tcSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  testResults.forEach((t, idx) => {
    const row = tcSheet.addRow([
      idx + 1,
      t.id || `TC-${String(idx + 1).padStart(3, '0')}`,
      t.name,
      t.description || '',
      t.steps || '',
      t.status,
      t.duration || 0,
      t.error || '',
    ]);
    row.height = 25;
    applyDataRow(row, idx + 1, t.status);
  });

  // Auto-filter
  tcSheet.autoFilter = { from: 'A1', to: `H1` };

  await wb.xlsx.writeFile(outputFile);
  console.log(`✅ Report saved: ${outputFile}`);
  return outputFile;
}

module.exports = { generateExcelReport, REPORTS_DIR };
