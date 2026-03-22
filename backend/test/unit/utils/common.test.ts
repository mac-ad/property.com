import { isNumeric, slugify } from "../../../src/utils/common"

describe('slugify', () => {
    it('should convert text to lowercase slug', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    })

    it('should replace spaces with hyphens', () => {
        expect(slugify('Hello World Test')).toBe('hello-world-test');
    })

    it('should handle empty string', () => {
        expect(slugify('')).toBe('');
    });

    it('should handle single word', () => {
        expect(slugify('test')).toBe('test');
    });

    it('should handle already lowercase text', () => {
        expect(slugify('already-slug')).toBe('already-slug');
    });
})

describe('isNumeric', () => {
    it('should return true for integer strings', () => {
        expect(isNumeric('123')).toBe(true);
    });

    it('should return true for float strings', () => {
        expect(isNumeric('12.5')).toBe(true);
    });

    it('should return true for negative numbers', () => {
        expect(isNumeric('-42')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
        expect(isNumeric('abc')).toBe(false);
    });

    it('should return false for mixed strings', () => {
        expect(isNumeric('12abc')).toBe(false);
    });

    it('should return true for zero', () => {
        expect(isNumeric('0')).toBe(true);
    });

    it('should return false for empty string', () => {
        expect(isNumeric('')).toBe(false);
    });
});