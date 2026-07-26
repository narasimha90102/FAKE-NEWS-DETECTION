const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const REPORTS_DIR = path.join(__dirname, '../reports');
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

const COLOURS = {
  header: 'FF1E3A5F',
  pass: 'FF00C851',
  fail: 'FFFF4444',
  altRow: 'FFF0F4F8',
  white: 'FFFFFFFF',
  title: 'FF6200EA',   // Purple for Appium (mobile)
};

async function generateAppiumReport(suiteName, testResults, outputFile) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'TruthGuard Appium Automation';
  wb.created = new Date();

  const sumSheet = wb.addWorksheet('📱 Summary', { views: [{ showGridLines: false }] });
  sumSheet.mergeCells('A1:G1');
  const titleCell = sumSheet.getCell('A1');
  titleCell.value = `TruthGuard Android — ${suiteName} | Appium E2E Report`;
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.title } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sumSheet.getRow(1).height = 40;

  const pass = testResults.filter(t => t.status === 'PASS').length;
  const fail = testResults.filter(t => t.status === 'FAIL').length;
  const total = testResults.length;
  const passRate = ((pass / total) * 100).toFixed(1);

  const summaryData = [
    ['Metric', 'Value'],
    ['Platform', 'Android (Appium)'],
    ['Total Test Cases', total],
    ['Passed ✅', pass],
    ['Failed ❌', fail],
    ['Pass Rate', `${passRate}%`],
    ['Report Generated', new Date().toISOString()],
  ];
  summaryData.forEach((row, i) => {
    const r = sumSheet.addRow(row);
    if (i === 0) r.eachCell(c => {
      c.value = c.value;
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.header } };
    });
    else r.getCell(1).font = { bold: true };
    r.height = 22;
  });
  sumSheet.getColumn(1).width = 30;
  sumSheet.getColumn(2).width = 30;

  const tcSheet = wb.addWorksheet('📱 Test Cases', { views: [{ showGridLines: false }] });
  const headers = ['#', 'Test Case ID', 'Test Case Name', 'Screen', 'Steps', 'Status', 'Duration (ms)', 'Error'];
  const widths = [5, 18, 45, 25, 65, 12, 16, 35];

  const headerRow = tcSheet.addRow(headers);
  headerRow.height = 30;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOURS.header } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  widths.forEach((w, i) => { tcSheet.getColumn(i + 1).width = w; });
  tcSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  testResults.forEach((t, idx) => {
    const row = tcSheet.addRow([
      idx + 1,
      t.id || `ATC-${String(idx + 1).padStart(3, '0')}`,
      t.name,
      t.screen || 'App',
      t.steps || '',
      t.status,
      t.duration || 0,
      t.error || '',
    ]);
    row.height = 25;
    const bg = t.status === 'PASS' ? 'FFE8F5E9' : idx % 2 === 0 ? COLOURS.altRow : COLOURS.white;
    row.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
    const statusCell = row.getCell(6);
    statusCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: t.status === 'PASS' ? COLOURS.pass : COLOURS.fail } };
    statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  tcSheet.autoFilter = { from: 'A1', to: 'H1' };
  await wb.xlsx.writeFile(outputFile);
  console.log(`✅ Appium Report saved: ${outputFile}`);
}

module.exports = { generateAppiumReport, REPORTS_DIR };
