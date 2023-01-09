const jwt = require('jsonwebtoken');
const {ACCESS_SECRET_KEY} = require('../configs/config');
const {Role} = require('../app/models/user.model');

const Authorization = {

    verifyToken : (req, res, next) => {
        const token = req.rawHeaders[1];
      
        if(token){
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, ACCESS_SECRET_KEY, (err, user) => {
                if(err)
                    return res.status(403).json('token is not valid');
                req.user = user;
                return next();
            });
        }
        else return res.status(401).json('you are not authenticated');

    },

    verifyAdmin : (req, res, next) => {
        Authorization.verifyToken(req, res, () => {
            if(req.user.role === Role.ADMIN){
                return next();
            }

            return res.status(403).json('you are not allowed');
        });
    },

    verifyUser : (req, res, next) => {
        Authorization.verifyToken(req, res, () => {
            if(req.user.role === Role.USER){
                return next();
            }

            return res.status(403).json('you are not allowed');
        });
    },

    requestUser : (req, res) => {
        Authorization.verifyToken(req, res, () => {});
        return req.user.id;
    }

}

module.exports = Authorization;