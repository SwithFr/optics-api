/* api.optics
 * /bin/controllers/users/update.js - update user settings
 * started @ 30/03/2016
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User;

// [UPDATE] - /users
module.exports = function( oRequest, oResponse ) {

    var oPOST = oRequest.body,
        iUserId = oRequest.headers.userid;

        console.log( oRequest.body );
        console.log( oRequest.params );

    // TODO: check data

    User
        .findOne( {
            "where": {
                "id": oRequest.params.id
            }
        } )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oUser ) {
            if( !oUser ) {
                return jsonMiddlewares.error( oRequest, oResponse, new Error( "UNKNOWN_USER" ), 404 );
            }

            oUser.login = ( oPOST.login || "" ).trim();
            oUser.password = ( oPOST.password || "" ).trim();

            oUser
                .save()
                .catch( function( oError ) {
                    return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                } )
                .then( function( oSavedUser ) {
                    oSavedUser && jsonMiddlewares.send( oRequest, oResponse, {
                        "id": oSavedUser.id,
                        "newLogin": oSavedUser.login
                    } );
                } );
        } );
};
