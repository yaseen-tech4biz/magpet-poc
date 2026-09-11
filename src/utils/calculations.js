/**
 * Financial calculation engine for Magpet Operations Intelligence.
 * Conforms exactly with Magpet POC Build Specification and Working Demo formulas.
 */

export const perTonneResin = (resinPrice = 85) => resinPrice * 1000;

export const perTonneContrib = (contrib = 12) => contrib * 1000;

/**
 * Calculates resin value held back during unplanned downtime.
 * @param {number} hrs Downtime duration in hours
 * @param {number} tph Line throughput rate in tonnes/hour (e.g. 5.5)
 * @param {number} resinPrice ₹/kg (e.g. 85)
 * @returns {number} Value in ₹
 */
export const calcResinHeld = (hrs, tph = 5.5, resinPrice = 85) => {
  return hrs * tph * perTonneResin(resinPrice);
};

/**
 * Calculates contribution margin lost during downtime.
 * @param {number} hrs Downtime duration in hours
 * @param {number} tph Line throughput in t/h
 * @param {number} contrib Margin in ₹/kg (e.g. 12)
 * @returns {number} Value in ₹
 */
export const calcContribLost = (hrs, tph = 5.5, contrib = 12) => {
  return hrs * tph * perTonneContrib(contrib);
};

/**
 * Calculates month-to-date resin bill lost due to rejected preforms.
 * @param {number} outT Output tonnes MTD (e.g. 3120)
 * @param {number} rejPct Rejection percentage (e.g. 2.1)
 * @param {number} resinPrice ₹/kg (e.g. 85)
 * @returns {number} Value in ₹
 */
export const calcRejBill = (outT = 3120, rejPct = 2.1, resinPrice = 85) => {
  return outT * (rejPct / 100) * perTonneResin(resinPrice);
};

/**
 * Formats rupee amounts into Indian numbering system: ₹X.XX Cr or ₹X.X L
 * @param {number} amount
 * @returns {string}
 */
export const formatInr = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0 L';
  if (amount >= 1e7) {
    return '₹' + (amount / 1e7).toFixed(2) + ' Cr';
  }
  return '₹' + (amount / 1e5).toFixed(1) + ' L';
};

/**
 * Formats plain numbers with standard comma separators (e.g. 45,000)
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num == null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};
