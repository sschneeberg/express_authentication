'use strict';
const bcrypt = require('bcrypt');

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    user.init({
        name: {
            type: DataTypes.STRING,
            validate: {
                len: { args: [1, 99], msg: 'Name must be between 1 and 99 characters' }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: { msg: 'Invalid Email' }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: { args: [12, 99], msg: 'Password must be at least 12 characters' },
            }
        }
    }, {
        sequelize,
        modelName: 'user',
    });

    //password protection
    user.addHook('beforeCreate', (pendingUser) => {
        //Bcrypt make hash password
        let hashPassword = bcrypt.hashSync(pendingUser.password, 12);
        //replace password with hash
        pendingUser.password = hashPassword;
    })

    //validate user when logging in
    user.prototype.validPassword = function(passwordTyped) {
        let correctPassword = bcrypt.compareSync(passwordTyped, this.password)
    }

    //remove password before it get serialized in req
    user.prototype.toJSON = function() {
        let userData = this.get();
        delete userData.password;
        return userData;
    }

    return user;
};