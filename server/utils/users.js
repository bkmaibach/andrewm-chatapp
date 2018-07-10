const _ = require('lodash');

class Users{
    constructor(){
        this.usersArray = [];
    }

    addUser(id, name, room){
        var user = {id, name, room};
        this.usersArray.push(user);
        return user;
    }

    getUserByID(id){
        //return the user by id
        return this.usersArray.filter((element) => element.id === id)[0];
    }

    getUserByName(name){
        //return the user by id
        return this.usersArray.filter((element) => element.name === name)[0];
    }

    getUsersByRoom(room){
        return this.usersArray.filter((element) => element.room === room);
    }

    removeUser(id){
        var removedUser;
        this.usersArray = this.usersArray.filter((element) => {
            if(element.id != id) {
                return true;
            } else {
                removedUser = element;
                return false;
            }
        });
        return removedUser;
    }

    getUserList(room){
        //get all users names by room name like [Mike, Jen, Trucky]
        var users = this.usersArray.filter((element) => element.room === room);
        var namesArray = users.map((element) => element.name );
        return namesArray;
    }

    getRoomList(){
        var rooms = _.uniq(this.usersArray.map((user) => user.room));
        return rooms;
    }
}

module.exports = {
    Users
};