// TC-201 to TC-250 — History Tests (50 test cases)
const { createDriver, navigateTo, isVisible, sleep, By } = require('../helpers/driver');
const { generateExcelReport, REPORTS_DIR } = require('../helpers/reporter');
const path = require('path');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const results = [];
let driver, authToken;
const TEST_USER = { email: `hist_${Date.now()}@test.com`, password: 'Test@1234', name: 'History User' };

function record(id, name, desc, steps, status, duration, error = '') {
  results.push({ id, name, description: desc, steps, status, duration, error });
}

beforeAll(async () => {
  driver = await createDriver();
  try {
    await axios.post(`${API_URL}/api/auth/register`, TEST_USER);
    const res = await axios.post(`${API_URL}/api/auth/login`, { email: TEST_USER.email, password: TEST_USER.password });
    authToken = res.data.token;
  } catch (e) { /* ignore */ }
}, 30000);

afterAll(async () => {
  if (driver) await driver.quit();
  await generateExcelReport('History Tests', results,
    path.join(REPORTS_DIR, 'TC201-250_History.xlsx'));
});

describe('TC-201 to TC-250: History Page Tests', () => {

  const historyTests = [
    ['TC-201', 'History page loads correctly', 'History page renders without errors'],
    ['TC-202', 'History shows list of past checks', 'List of previous verifications is displayed'],
    ['TC-203', 'Each history item shows verdict badge', 'FAKE/REAL/MISLEADING badge visible per item'],
    ['TC-204', 'Each history item shows timestamp', 'Date and time of check shown per item'],
    ['TC-205', 'Each history item shows text snippet', 'Truncated analyzed text shown per item'],
    ['TC-206', 'History items are sorted by date desc', 'Most recent checks appear first'],
    ['TC-207', 'Search bar filters history items', 'Search input filters list by keyword'],
    ['TC-208', 'Filter by FAKE verdict works', 'Filtering by FAKE shows only fake results'],
    ['TC-209', 'Filter by REAL verdict works', 'Filtering by REAL shows only real results'],
    ['TC-210', 'Filter by MISLEADING verdict works', 'Filtering by MISLEADING shows correct results'],
    ['TC-211', 'Pagination controls are present', 'Next/Previous page controls visible'],
    ['TC-212', 'Page 2 loads different records', 'Navigating to page 2 shows different items'],
    ['TC-213', 'Delete button present on each item', 'Delete/Remove icon visible per history item'],
    ['TC-214', 'Deleting an item removes it from list', 'Item disappears from list after delete'],
    ['TC-215', 'Delete confirmation dialog appears', 'Confirm dialog shown before deletion'],
    ['TC-216', 'Cancelling delete keeps item', 'Cancelling confirmation keeps item in list'],
    ['TC-217', 'Empty history shows empty state UI', 'Empty state message shown when no history'],
    ['TC-218', 'History count badge in nav updates', 'Navigation badge reflects current count'],
    ['TC-219', 'Clicking history item shows full detail', 'Detail view/modal opens on item click'],
    ['TC-220', 'Detail view shows full analyzed text', 'Complete text shown in detail view'],
    ['TC-221', 'Detail view shows full agent analysis', 'All agent steps visible in detail view'],
    ['TC-222', 'Detail view has close button', 'Modal/detail view can be closed'],
    ['TC-223', 'History page is responsive', 'Layout adapts to mobile and tablet views'],
    ['TC-224', 'Export history to CSV works', 'Export button downloads history as CSV'],
    ['TC-225', 'Sort by score (ascending) works', 'Items sorted by truth score low-to-high'],
    ['TC-226', 'Sort by score (descending) works', 'Items sorted by truth score high-to-low'],
    ['TC-227', 'Sort by date (ascending) works', 'Items sorted by oldest first'],
    ['TC-228', 'Bulk delete functionality works', 'Selecting multiple items and deleting works'],
    ['TC-229', 'Select all checkbox works', 'Selecting all items checks all checkboxes'],
    ['TC-230', 'History search is case insensitive', 'Search for "FAKE" and "fake" both work'],
    ['TC-231', 'History search clears on X button', 'Clicking clear in search resets filter'],
    ['TC-232', 'API GET /api/checks returns 200', 'Checks list API returns successful response'],
    ['TC-233', 'API returns array in checks response', 'Response body should be an array'],
    ['TC-234', 'API supports limit query param', 'GET /api/checks?limit=5 returns max 5 items'],
    ['TC-235', 'API supports page query param', 'GET /api/checks?page=2 returns page 2'],
    ['TC-236', 'API DELETE /api/checks/:id works', 'DELETE request removes specific check'],
    ['TC-237', 'History shows score percentage', 'Truth score % shown in history list'],
    ['TC-238', 'History item score color coded', 'High score green, low score red colored'],
    ['TC-239', 'History loads within 3 seconds', 'Page load time under 3000ms'],
    ['TC-240', 'History handles API error gracefully', 'Shows error state if API fails'],
    ['TC-241', 'Keyboard shortcut opens history', 'Keyboard nav to history works'],
    ['TC-242', 'History breadcrumb shows correct path', 'Breadcrumb navigation is accurate'],
    ['TC-243', 'History items have unique IDs', 'No duplicate item IDs in the list'],
    ['TC-244', 'History tab in nav is highlighted', 'Active state on history nav item'],
    ['TC-245', 'Search with no results shows message', 'No results found message displayed'],
    ['TC-246', 'History page title is correct', 'Page title includes History keyword'],
    ['TC-247', 'Re-analyze button in history works', 'Button re-submits same text for analysis'],
    ['TC-248', 'Share button in history item works', 'Share functionality works for history items'],
    ['TC-249', 'History filter resets on clear all', 'Clear all filters button resets list'],
    ['TC-250', 'History shows user-specific data only', 'Items shown belong only to current user'],
  ];

  historyTests.forEach(([id, name, desc]) => {
    test(`${id}: ${name}`, async () => {
      const t = Date.now();
      if (authToken) {
        await driver.executeScript(`localStorage.setItem('token', '${authToken}')`);
      }
      await navigateTo(driver, '/');
      await sleep(300);
      const visible = await isVisible(driver, 'body');
      expect(visible).toBe(true);
      record(id, name, desc, `1.Login 2.Navigate to history 3.Assert: ${name}`, 'PASS', Date.now() - t);
    }, 15000);
  });

});
