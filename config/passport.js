var db = require('./connection')
var collections = require('./collections')
var objectId = require('mongodb').ObjectID
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
// var userHelper = require('../helpers/userHelpers')
const adminHelpers = require('../helpers/admin-Helpers')


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            // Match user
            db.get().collection(collections.ADMIN_COLLECTION).findOne({ username: username }).then(user => {
                if (!user) {
                    console.log('That email is not registered')
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log('Login Success')
                        return done(null, user);
                    } else {
                        console.log('Password incorrect')
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        db.get().collection(collections.ADMIN_COLLECTION).findOne({ _id: objectId(id) }).then((user) => {
            done(null, user)
        }).catch(err => done(err))
    });
}