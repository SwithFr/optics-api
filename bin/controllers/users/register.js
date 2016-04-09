/* api.optics
 * /bin/controllers/users/create.js - register a user
 * started @ 17/10/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User,
    Validator = require( "../../core/validator.js" );

// [POST] - /user/register
module.exports = function( oRequest, oResponse ) {
    var oUser = User.build();

    var sLogin = ( oRequest.body.login || "" ).trim(),
        sPassword = ( oRequest.body.password || "" ).trim();

        var oIsNotValid = Validator( [
            {
                "type": "data",
                "message": "Login manquant",
                "data": sLogin
            },
            {
                "type": "data",
                "message": "password manquant",
                "data": sPassword
            }
        ], oRequest, oResponse );

        if ( oIsNotValid ) {
            return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
        } else {
            oUser.login = sLogin;
            oUser.password = sPassword;

            oUser
                .validate()
                .then( function( oValidationReport ) {
                    if( oValidationReport ) {
                        return jsonMiddlewares.error( oRequest, oResponse, oValidationReport.errors, 400 );
                    }

                    oUser
                        .save()
                        .catch( function( oError ) {
                            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                        } )
                        .then( function( oSavedUser ) {
                            oSavedUser && jsonMiddlewares.send( oRequest, oResponse, {
                                "id": oSavedUser.id,
                                "avatar": oSavedUser.avatar
                            } );
                        } );
                } );
        }
};
