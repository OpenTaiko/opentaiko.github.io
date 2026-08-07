/**
 * Max list points for a Hall-of-Fame rank (1 = best play).
 *
 * Points decay geometrically from a base of 1000, but the per-rank decay eases
 * off for later ranks, so being a few places lower costs less the further down
 * the list you are:
 *   ranks  1–20 : ×0.95 per rank
 *   ranks 21–50 : ×0.96 per rank
 *   ranks 51+   : ×0.98 per rank
 * The bands compound cumulatively (each rank multiplies the previous rank's
 * value by its band ratio), so the sequence is continuous at the boundaries
 * and stays strictly decreasing.
 */
export const computeMaxListPoints = (rank) => {
    if (rank <= 0) return 0;
    const base = 1000;
    const steps95 = Math.min(rank, 20) - 1;                // ranks 2–20  → ×0.95
    const steps96 = Math.max(0, Math.min(rank, 50) - 20);  // ranks 21–50 → ×0.96
    const steps98 = Math.max(0, rank - 50);                // ranks 51+   → ×0.98
    return Math.trunc(base * Math.pow(0.95, steps95) * Math.pow(0.96, steps96) * Math.pow(0.98, steps98));
};
