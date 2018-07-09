class Users{
    constructor(){
        this.usersArray = [];
    }

    addUser(id, name, room){
        var user = {id, name, room};
        this.usersArray.push(user);
        return user;
    }

    getUser(id){
        //return the user by id
        return this.usersArray.filter((element) => element.id === id)[0];
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
}

module.exports = {
    Users
};