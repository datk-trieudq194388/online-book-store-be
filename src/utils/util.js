const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, BCRYPT_SALT} = require('../configs/config');
const {Gender, BookStatus} = require('../configs/global');

class Util {

    generateAccessToken = (data) => {
        return jwt.sign({
            _id: data._id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            name: data.name,
            role: data.role,
        }, ACCESS_SECRET_KEY, { expiresIn: 3*24*60 });
    }

    generateRefreshToken = (data) => {
        return jwt.sign({
            _id: data._id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            name: data.name,
            role: data.role,
        }, REFRESH_SECRET_KEY, { expiresIn: 30*24*60*60 });
    }

    setCookie = (res, cookieName, cookieData) => {
        res.cookie(cookieName, cookieData, {
            httpOnly: false, // fix later
             secure: false, // true if in deployment env
            path: '/',
            sameSite: 'strict',
        });
    }

    formatGender = (gender) => {
        if(gender == Gender.MALE) 
            return Gender.MALE;
        else if(gender == Gender.FEMALE) 
            return Gender.FEMALE;
        else return Gender.OTHER;
    }

    formatStatus = (res, status) => {
        if(status == BookStatus.AVAILABLE)
            return BookStatus.AVAILABLE;
        else if(status == BookStatus.SOLD)
            return BookStatus.SOLD;
        else if(status == BookStatus.PENDING)
            return BookStatus.PENDING;
        else return res.status(400).json({message: 'config failed'});
    }

    hashPwd = async (pwd) => {
        const salt = await bcrypt.genSalt(BCRYPT_SALT);
        return await bcrypt.hash(pwd, salt);
    }

    throwError = (res, err) => {
        console.log(err);
        return res.status(400).json({error: err.message});
    }

}

module.exports = new Util; 