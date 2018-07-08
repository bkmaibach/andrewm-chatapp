const expect = require('expect');
const {generateMessage} = require('./message.js');
const {generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
    it('should generate message object correctly', () => {
        var testMessage = generateMessage('tester1', 'Check one two, check check');
        expect(testMessage).toHaveProperty('from', 'tester1');
        expect(testMessage).toHaveProperty('text', 'Check one two, check check');
        expect(testMessage.createdAt).toBeGreaterThan(1531070889);
    });
});

describe('generateLocationMessage', () => {
    it('should generate location message object correctly', () => {
        var testLocMessage = generateLocationMessage('tester1', 1, 1);
        expect(testLocMessage).toHaveProperty('from', 'tester1');
        expect(testLocMessage).toHaveProperty('url', `https://www.google.com/maps?q=1,1`,);
        expect(testLocMessage.createdAt).toBeGreaterThan(1531070889);
    });
});