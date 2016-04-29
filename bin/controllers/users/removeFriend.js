/* api.optics
 * /bin/controllers/users/removeFriends.js - Remove a friend
 * started @ 29/04/2016
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    FriendsRelation = require( "../../core/sequelize.js" ).models.FriendsRelation;

// [DELETE] - /users/friends/:id
module.exports = function( oRequest, oResponse ) {

    var iId = oRequest.params.id || "";

    //TODO: Validation

    FriendsRelation
        .findOne( {
            "where": {
                "friend_id": oRequest.headers.userid,
                "user_id": iId
            }
        } )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, "NO_RELATION_FOUND", 404 );
        } )
        .then( function( oFriendRelation ) {
            if( oFriendRelation ) {
                oFriendRelation
                    .destroy()
                    .then( function() {
                        return jsonMiddlewares.send( oRequest, oResponse, oFriendRelation );
                    } );
            }
        } );
};
