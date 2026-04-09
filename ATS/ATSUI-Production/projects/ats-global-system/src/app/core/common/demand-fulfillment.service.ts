import { Injectable } from '@angular/core';

export interface DemandInput {
  HTi: number;   // Historical Trend Internal (%)
  HTe: number;   // Historical Trend External (%)
  HTc: number;   // Historical Trend Cancelled (%)
  RMCount: number;
  K: number;
  JDQ: number;   // Job Description Quality (%)
}

export interface DemandOutput {
  // Step 1: Raw probabilities
  P_internal: number;
  P_external: number;
  P_cancelled: number;

  // Step 2: Normalized probabilities (sum = 1)
  P_i_prime: number;
  P_e_prime: number;
  P_c_prime: number;

  // Step 3: Normalized percentages (0–100)
  P_i_percent: number;
  P_e_percent: number;
  P_c_percent: number;

  // Step 4: Total sum (for validation/debugging)
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemandFulfillmentService {

  constructor() { }

  /**
   * Main entry function
   * Calculates demand fulfillment probabilities and returns
   * raw, normalized, and percentage values.
   */
  calculateProbability(input: DemandInput): DemandOutput {
    const { P_internal, P_external, P_cancelled } = this.calculateRawProbabilities(input);
    const { P_i_prime, P_e_prime, P_c_prime, total } = this.normalizeProbabilities(P_internal, P_external, P_cancelled);
    const { P_i_percent, P_e_percent, P_c_percent } = this.convertToPercent(P_i_prime, P_e_prime, P_c_prime);
 debugger
    return {
      P_internal,
      P_external,
      P_cancelled,
      P_i_prime,
      P_e_prime,
      P_c_prime,
      P_i_percent,
      P_e_percent,
      P_c_percent,
      total
    };
  }

  /**
   * Step 1 — Calculate raw probabilities
   */
  private calculateRawProbabilities(input: DemandInput) {
  debugger;
  let { HTi, HTe, HTc, RMCount, K, JDQ } = input;

  // --- Utility functions ---
  const safeValue = (val: number): number =>
    !isNaN(val) && val !== undefined && val !== null ? val : 0;

  const safeDivide = (num: number, den: number): number =>
    den > 0 && !isNaN(num) ? num / den : 0;

  // --- Convert percentage inputs to decimals safely ---
  HTi = safeValue(HTi) / 100;
  HTe = safeValue(HTe) / 100;
  HTc = safeValue(HTc) / 100;
  JDQ = safeValue(JDQ) / 100;
  RMCount = safeValue(RMCount);
  K = safeValue(K);

  // --- Coefficients (from recommendation table) ---
  const alpha = 0.4;
  const beta1 = 0.25;
  const beta2 = 0.25;
  const gamma = 0.10;
  const delta1 = 0.50;
  const delta2 = 0.10;
  const epsilon1 = 0.35;
  const epsilon2 = 0.25;

  // --- Derived ratios ---
  const safeRM_K = safeDivide(RMCount, K);
  const minRM = Math.min(safeRM_K, 1);

  // --- Internal Probability ---
  const P_internal =
    alpha * HTi +
    beta1 * safeRM_K +
    beta2 * minRM +
    gamma * JDQ;

  // --- External Probability ---
  const P_external =
    alpha * HTe +
    delta1 * (1 - safeRM_K) +
    delta2 * JDQ;

  // --- Cancelled Probability ---
  const P_cancelled =
    alpha * HTc +
    epsilon1 * (1 - minRM) +
    epsilon2 * (1 - JDQ);

  // --- Return results safely ---
  return {
    P_internal: +P_internal.toFixed(4),
    P_external: +P_external.toFixed(4),
    P_cancelled: +P_cancelled.toFixed(4)
  };
}


  /**
   * Step 2 — Normalize probabilities
   * Formula: P' = P / (Pi + Pe + Pc)
   */
  private normalizeProbabilities(Pi: number, Pe: number, Pc: number) {
    debugger
    const total = Pi + Pe + Pc;

    const P_i_prime = total ? Pi / total : 0;
    const P_e_prime = total ? Pe / total : 0;
    const P_c_prime = total ? Pc / total : 0;

    return { P_i_prime, P_e_prime, P_c_prime, total };
  }

  /**
   * Step 3 — Convert normalized values to percentages (0–100)
   */
  private convertToPercent(Pi: number, Pe: number, Pc: number) {
    const P_i_percent = +(Pi * 100).toFixed(2);
    const P_e_percent = +(Pe * 100).toFixed(2);
    const P_c_percent = +(Pc * 100).toFixed(2);

    return { P_i_percent, P_e_percent, P_c_percent };
  }
}
