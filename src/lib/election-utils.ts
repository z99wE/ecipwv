/**
 * Utility functions for election-related logic and data formatting
 */

/**
 * Validates if a person is eligible to vote based on age
 * @param age - The age of the citizen
 * @returns boolean
 */
export function isAgeEligible(age: number): boolean {
  return age >= 18;
}

/**
 * Formats large voter counts into readable strings (Indian numbering system)
 * @param count - The number of voters
 * @returns string
 */
export function formatVoterCount(count: number): string {
  if (count >= 10000000) {
    return (count / 10000000).toFixed(1) + " Cr";
  }
  if (count >= 100000) {
    return (count / 100000).toFixed(1) + " L";
  }
  return count.toLocaleString('en-IN');
}

/**
 * Calculates the percentage of seats won
 */
export function calculateSeatPercentage(seats: number, total: number = 543): string {
  if (total === 0) return "0%";
  return ((seats / total) * 100).toFixed(1) + "%";
}
