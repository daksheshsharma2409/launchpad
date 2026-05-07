/**
 * opportunitiesApi.js
 * Fetches opportunities.json from the public folder and provides
 * paginated access. The JSON is cached in memory after the first fetch.
 */

const PAGE_SIZE = 15;
let cache = null;

async function loadAll() {
  if (cache) return cache;
  const res = await fetch('/data/opportunities.json');
  if (!res.ok) throw new Error('Failed to load opportunities data');
  cache = await res.json();
  return cache;
}

/**
 * Fetch a page of opportunities for a given category.
 * @param {string} category  - "all" or a specific category id
 * @param {number} page      - 1-based page number
 * @param {object} filters   - { searchQuery, modeFilter, paidOnly, minAmount }
 * @returns {{ items: [], totalCount: number, hasMore: boolean }}
 */
export async function fetchOpportunities(category, page = 1, filters = {}) {
  const all = await loadAll();

  // Category filter
  let filtered = category === 'all' ? all : all.filter(o => o.category === category);

  // Apply advanced filters
  const { searchQuery = '', modeFilter = 'all', paidOnly = false, minAmount = 0 } = filters;

  if (modeFilter !== 'all') {
    filtered = filtered.filter(o => o.mode === modeFilter);
  }
  if (paidOnly) {
    filtered = filtered.filter(o => o.prize || o.stipend);
  }
  if (minAmount > 0) {
    filtered = filtered.filter(o =>
      Math.max(o.prizeNumber || 0, o.stipendNumber || 0) >= minAmount
    );
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(o =>
      o.title.toLowerCase().includes(q) ||
      o.org.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q)
    );
  }

  const totalCount = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < totalCount;

  return { items, totalCount, hasMore, page };
}

/**
 * Get a single opportunity by id (searches full cache).
 */
export async function fetchOpportunityById(id) {
  const all = await loadAll();
  return all.find(o => o.id === id) || null;
}

/**
 * Synchronous version for components that already have the full cache loaded.
 * Falls back to null if cache isn't warm yet.
 */
export function getOpportunityByIdSync(id) {
  if (!cache) return null;
  return cache.find(o => o.id === id) || null;
}

export { PAGE_SIZE };
