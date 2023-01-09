const {User, UserDTO} = require('../app/models/user.model');

class UserService{
    
    getAll = async(conds) => {
    
        const users = await User.find(conds);
        for (let i in users)
            users[i] = new UserDTO(users[i]);
        
        return users;

    }

    update = async(acc) => {

        await User.findOneAndUpdate({_id: acc._id}, acc);
        const nAcc = await User.findById(acc._id);

        return nAcc ? new UserDTO(nAcc) : nAcc;

    }

    create = async(acc) => {

        const nAcc = await User.create(acc);

        return nAcc ? new UserDTO(nAcc) : nAcc;

    }

    checkEmail = async(param) => {

        return await User.exists({email: param});
    }

    checkPhoneNumber = async(param) => {

        return await User.exists({phoneNumber: param});
    }

    // dont need dto
    findUsername = async(username) => {

        const acc = await User.findOne({$or:[
            {email: username},
            {phoneNumber: username}
        ]});

        return acc ? acc.toObject() : acc;

    }

    findById = async(accId) => {

        const acc = await User.findById(accId);
        
        return acc ? new UserDTO(acc) : acc;

    }

    
}

module.exports = new UserService;