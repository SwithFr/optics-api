/* api.optics
 * /bin/controllers/users/friends.js - list all users' friends
 * started @ 28/04/2016
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User,
    FriendsRelation = require( "../../core/sequelize.js" ).models.FriendsRelation;

// [GET] - /users/friends
module.exports = function( oRequest, oResponse ) {

    var sResearch = oRequest.params.friendName || "",
        oConditions = {
            "include": [ {
                "model": FriendsRelation,
                "where": {
                    "friend_id": +oRequest.headers.userid
                }
            } ]
        } ;

    if ( sResearch ) {
        oConditions.where = {
            "login": sResearch
        };
    }

    User
        .findAll( oConditions )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oFriends ) {
            if( !oFriends ) {
                return jsonMiddlewares.error( oRequest, oResponse, new Error( "NO_USER_FOUND" ), 404 );
            }

            jsonMiddlewares.send( oRequest, oResponse, oFriends );
        } );
};
