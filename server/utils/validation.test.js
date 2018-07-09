const expect = require('expect');

const {isRealString} = require('./validation.js');

describe('isRealString', () => {
    it('should reject a non-string value like a number', () => {
        expect(isRealString(25)).toBeFalsy();
        expect(isRealString({key: 'value'})).toBeFalsy();
    });

    it('should reject all whitespace string', () => {
        expect(isRealString(' ')).toBeFalsy();
        expect(isRealString('     ')).toBeFalsy();
    });

    it('should accept a string with non whtiespace characters', () => {
        expect(isRealString('valid string')).toBeTruthy();
        expect(isRealString('    valid      string   ')).toBeTruthy();
    });
});
