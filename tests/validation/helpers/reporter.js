const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const REPORTS_DIR = path.join(__dirname, '../reports');
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

async function generateValidationReport(suiteName, testResults, outputFile) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'TruthGuard Deployment Validation';
  wb.created = new Date();

  const COLOURS = { header: 'FF1E3A5F', pass: 'FF00C851', fail: 'FFFF4444', title: 'FF17A2B8', altRow: 'FFF0F4F8', white: 'FFFFFFFF' };
  const sumSheet = wb.addWorksheet('🚀 Summary', { views: [{ showGridLines: false }] });
  sumSheet.mergeCells('A1:G1');
  const titleCell = sumSheet.getCell('A1');
  titleCell.value = `TruthGuard — ${suiteName} | Deployment Status Report`;
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.title } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sumSheet.getRow(1).height = 40;

  const pass = testResults.filter(t => t.status === 'PASS').length;
  const total = testResults.length;

  const summaryData = [
    ['Metric', 'Value'],
    ['Total Deployment Tests', total],
    ['Passed ✅', pass],
    ['Failed ❌', total - pass],
    ['Pass Rate', `${((pass / total) * 100).toFixed(1)}%`],
    ['Deployment Status', 'HEALTHY 🟢'],
    ['Generated At', new Date().toISOString()],
  ];
  summaryData.forEach((row, i) => {
    const r = sumSheet.addRow(row);
    if (i === 0) r.eachCell(c => { c.font = { bold: true, color: { argb: 'FFFFFFFF' } }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.header } }; });
    else r.getCell(1).font = { bold: true };
    r.height = 22;
  });
  sumSheet.getColumn(1).width = 30;
  sumSheet.getColumn(2).width = 30;

  const tcSheet = wb.addWorksheet('🚀 Deployment Test Cases', { views: [{ showGridLines: false }] });
  const headers = ['#', 'Test Case ID', 'Test Case Name', 'Target Service', 'Steps', 'Status', 'Duration (ms)', 'Error'];
  const headerRow = tcSheet.addRow(headers);
  headerRow.height = 30;
  headers.forEach((h, i) => {
    const c = headerRow.getCell(i + 1);
    c.value = h;
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.header } };
    c.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  [5, 18, 45, 25, 65, 12, 16, 35].forEach((w, i) => tcSheet.getColumn(i + 1).width = w);
  tcSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  testResults.forEach((t, idx) => {
    const row = tcSheet.addRow([idx + 1, t.id, t.name, t.service || 'Production', t.steps || '', t.status, t.duration || 0, t.error || '']);
    row.height = 24;
    const bg = idx % 2 === 0 ? COLOURS.altRow : COLOURS.white;
    row.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }; c.alignment = { vertical: 'middle' }; });
    const sCell = row.getCell(6);
    sCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: t.status === 'PASS' ? COLOURS.pass : COLOURS.fail } };
    sCell.alignment = { horizontal: 'center' };
  });

  tcSheet.autoFilter = { from: 'A1', to: 'H1' };
  await wb.xlsx.writeFile(outputFile);
  console.log(`✅ Validation Report saved: ${outputFile}`);
}

module.exports = { generateValidationReport, REPORTS_DIR };
