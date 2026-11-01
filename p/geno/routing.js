(function (root) {
  'use strict';
  // Checks orthogonal assisted-reproduction routes against other person symbols.
  function crossesPerson(points, positions, excluded) {
    const omit = new Set(excluded || []);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      for (const [id, point] of Object.entries(positions)) {
        if (omit.has(id)) continue;
        const left=point.x-28,right=point.x+28,top=point.y-28,bottom=point.y+28;
        if (a.x===b.x && a.x>left && a.x<right &&
          Math.max(a.y,b.y)>top && Math.min(a.y,b.y)<bottom) return true;
        if (a.y===b.y && a.y>top && a.y<bottom &&
          Math.max(a.x,b.x)>left && Math.min(a.x,b.x)<right) return true;
      }
    }
    return false;
  }
  root.genoRouting = {crossesPerson};
  if (typeof module !== 'undefined') module.exports = root.genoRouting;
})(typeof window === 'undefined' ? globalThis : window);
