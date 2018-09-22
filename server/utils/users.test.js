const {Users} = require('./users');

const expect = require('expect');

describe('Users', () => {
    var testUsers;

    beforeEach(() => {
        testUsers = new Users();
        testUsers.usersArray = [
            {
                id: 1,
                name: "One",
                room: "Test-A"
            },{
                id: 2,
                name: "Two",
                room: "Test-B"
            },{
                id: 3,
                name: "Three",
                room: "Test-A"
            }
        ]
    });

    it('should add a new user', () => {
        var users = new Users();
        var user = {
            id: 123,
            name: 'Keef',
            room: 'The League of Disproportionate Lesbians'
        }
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.usersArray).toEqual([user]);
        expect(resUser).toEqual(user);
    });

    it('should return names for particular room', () => {
        var userList = testUsers.getUserList("Test-A");
        expect(userList).toEqual(['One','Three']);
    });

    it('should remove a particular user', () => {
        var removed = testUsers.removeUser(3);
        expect(testUsers).toEqual({usersArray: [
            {
                id: 1,
                name: "One",
                room: "Test-A"
            },{
                id: 2,
                name: "Two",
                room: "Test-B"
            }
        ]});
        expect(removed).toEqual({
            id: 3,
            name: "Three",
            room: "Test-A"
        });
    });

    it('should not remove a non-existant user and should return null', () => {
        var before = testUsers.usersArray;
        var removed = testUsers.removeUser(4);
        expect(testUsers.usersArray).toEqual(before);
        expect(removed).toBeFalsy();
    });

    it('should find user', () => {
        var user = testUsers.getUserByID(2);
        expect(user).toEqual({
            id: 2,
            name: "Two",
            room: "Test-B"
        });
    });

    it('should not find a non-existant user', () => {
        var user = testUsers.getUserByID(4);
        expect(user).toBeFalsy();
    });
});