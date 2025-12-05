import fc from 'fast-check';
import {
  validateVideoDuration,
  validateTitle,
  validateDescription,
  validateFileType,
  validateFileSize,
  validateWalletAddress,
} from './validation';

describe('Validation Property-Based Tests', () => {
  // Feature: video-platform-core, Property 1: Video duration validation
  it('Property 1: Validates video duration between 6 and 60 seconds', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 120 }), (duration) => {
        const result = validateVideoDuration(duration);
        const shouldBeValid = duration >= 6 && duration <= 60;
        expect(result.valid).toBe(shouldBeValid);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: video-platform-core, Property 34: Empty title rejection
  it('Property 34: Rejects empty or whitespace-only titles', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => s.trim().length === 0),
        (title) => {
          const result = validateTitle(title);
          expect(result.valid).toBe(false);
          expect(result.error).toContain('empty');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: video-platform-core, Property 35: Title length validation
  it('Property 35: Rejects titles exceeding 100 characters', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 200 }), (title) => {
        const result = validateTitle(title);
        const trimmed = title.trim();
        const shouldBeValid = trimmed.length > 0 && trimmed.length <= 100;
        expect(result.valid).toBe(shouldBeValid);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: video-platform-core, Property 36: Description length validation
  it('Property 36: Rejects descriptions exceeding 500 characters', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 600 }), (description) => {
        const result = validateDescription(description);
        const shouldBeValid = description.length <= 500;
        expect(result.valid).toBe(shouldBeValid);
      }),
      { numRuns: 100 }
    );
  });

  it('Validates file types correctly', () => {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const invalidTypes = ['image/jpeg', 'audio/mp3', 'text/plain', 'application/pdf'];

    validTypes.forEach((type) => {
      expect(validateFileType(type).valid).toBe(true);
    });

    invalidTypes.forEach((type) => {
      expect(validateFileType(type).valid).toBe(false);
    });
  });

  it('Validates file size correctly', () => {
    const maxSize = 100 * 1024 * 1024; // 100MB

    expect(validateFileSize(maxSize - 1).valid).toBe(true);
    expect(validateFileSize(maxSize).valid).toBe(true);
    expect(validateFileSize(maxSize + 1).valid).toBe(false);
  });

  it('Validates wallet addresses correctly', () => {
    const validAddresses = [
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      '0x0000000000000000000000000000000000000000',
      '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    ];

    const invalidAddresses = [
      '742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Missing 0x
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bE', // Too short
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbb', // Too long
      '0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', // Invalid characters
    ];

    validAddresses.forEach((address) => {
      expect(validateWalletAddress(address).valid).toBe(true);
    });

    invalidAddresses.forEach((address) => {
      expect(validateWalletAddress(address).valid).toBe(false);
    });
  });
});
