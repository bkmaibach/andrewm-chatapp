const expect = require('expect');
const {generateMessage} = require('./message.js');

describe('message.js', () => {
    it('should generate message object correctly', () => {
        var testMessage = generateMessage('tester1', 'Check one two, check check');
        expect(testMessage).toHaveProperty('from', 'tester1');
        expect(testMessage).toHaveProperty('text', 'Check one two, check check');
        expect(testMessage.createdAt).toBeGreaterThan(1531070889);

    });
});