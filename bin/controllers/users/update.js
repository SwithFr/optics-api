/* api.optics
 * /bin/controllers/users/update.js - update user settings
 * started @ 30/03/2016
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User,
    Validator = require( "../../core/validator.js" );

// [UPDATE] - /users
module.exports = function( oRequest, oResponse ) {

    var oPOST = oRequest.body,
        iUserId = oRequest.headers.userid;

        var oIsNotValid = Validator( [
            {
                "type": "data",
                "message": "login manquant",
                "data": ( oPOST.login || "" ).trim()
            },
            {
                "type": "param",
                "message": "Id de l'utilisateur manquant",
                "data": oRequest.params.id
            }
        ], oRequest, oResponse );

        if ( oIsNotValid ) {
            return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
        } else {
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

                    oUser.login = oPOST.login;
                    if ( ( oPOST.password || "" ).trim() ) {
                        oUser.password = oPOST.password;
                    }

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
        }
};
