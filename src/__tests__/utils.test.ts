import { isAgeEligible, formatVoterCount, calculateSeatPercentage } from '../lib/election-utils';

describe('Election Utilities', () => {
  describe('isAgeEligible', () => {
    test('should return true for age 18', () => {
      expect(isAgeEligible(18)).toBe(true);
    });

    test('should return true for age above 18', () => {
      expect(isAgeEligible(25)).toBe(true);
    });

    test('should return false for age below 18', () => {
      expect(isAgeEligible(17)).toBe(false);
    });
  });

  describe('formatVoterCount', () => {
    test('should format lakhs correctly', () => {
      expect(formatVoterCount(100000)).toBe('1.0 L');
      expect(formatVoterCount(450000)).toBe('4.5 L');
    });

    test('should format crores correctly', () => {
      expect(formatVoterCount(10000000)).toBe('1.0 Cr');
      expect(formatVoterCount(968000000)).toBe('96.8 Cr');
    });

    test('should use locale string for smaller numbers', () => {
      expect(formatVoterCount(5000)).toBe('5,000');
    });
  });

  describe('calculateSeatPercentage', () => {
    test('should calculate correct percentage for Lok Sabha', () => {
      expect(calculateSeatPercentage(272)).toBe('50.1%');
    });

    test('should handle zero gracefully', () => {
      expect(calculateSeatPercentage(0)).toBe('0.0%');
    });
  });
});
