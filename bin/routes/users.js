/* api.optics
 * /bin/routes/users.js - routes configuration for users
 * started @ 17/10/2015
 */

"use strict";

var fCheckConnect = require( "../core/express/middlewares.js" ).checkConnect;

exports.init = function( oApp ) {

    // register new user
    oApp.post( "/users/register", require( "../controllers/users/register.js" ) );

    // login user
    oApp.post( "/users/login", require( "../controllers/users/login.js" ) );

    // list all users
    oApp.get( "/users", fCheckConnect, require( "../controllers/users/list.js" ) );

    // List all friends
    oApp.get( "/users/friends", fCheckConnect, require( "../controllers/users/friends.js" ) );

    // Search a friend
    oApp.get( "/users/friends/:friendName", fCheckConnect, require( "../controllers/users/friends.js" ) );

    // Add a friend
    oApp.post( "/users/friends/:id", fCheckConnect, require( "../controllers/users/addFriend.js" ) );

    // update user settings
    oApp.patch( "/users/:id", fCheckConnect, require( "../controllers/users/update.js" ) );

    // get settings from user
    oApp.get( "/users/settings", fCheckConnect, require( "../controllers/users/settings.js" ) );

};
