/* api.optics
 * /bin/controllers/users/addFriends.js - Add a friend
 * started @ 28/04/2016
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User,
    FriendsRelation = require( "../../core/sequelize.js" ).models.FriendsRelation;

// [POST] - /users/friends/:id
module.exports = function( oRequest, oResponse ) {

    var iId = oRequest.params.id || "",
        oFriendRelation = FriendsRelation.build();

    oFriendRelation.friend_id = oRequest.headers.userid;
    oFriendRelation.user_id = iId;

    //TODO: Validation

    oFriendRelation
        .validate()
        .then( function( oValidationReport ){
            if( oValidationReport ) {
                return jsonMiddlewares.error( oRequest, oResponse, oValidationReport.errors, 400 );
            } else {
                oFriendRelation
                    .save()
                    .catch( function( oError ) {
                        return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                    } )
                    .then( function( oSavedRelation ) {
                        oSavedRelation && jsonMiddlewares.send( oRequest, oResponse, oSavedRelation );
                    } );
            }
        } );
};
