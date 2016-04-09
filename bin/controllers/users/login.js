/* api.optics
 * /bin/controllers/users/login.js - log user to API
 * started @ 17/11/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    zouti = require( "zouti" ),
    Validator = require( "../../core/validator.js" ),
    User = require( "../../core/sequelize.js" ).models.User;

// [POST] - /user/login
module.exports = function( oRequest, oResponse ) {

    // get post params
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
            User
            .findOne( {
                "where": {
                    "login": sLogin
                }
            } )
            .catch( function( oError ) {
                return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
            } )
            .then( function( oUser ) {
                if( !oUser || oUser.password !== zouti.whirlpool( sPassword ) ) {
                    return jsonMiddlewares.error( oRequest, oResponse, new Error( "UNKNOWN_USER" ), 404 );
                }

                oUser.token = zouti.sha256( oUser.id + "-" + oUser.updated_at.getTime() );
                oUser.save();
                return jsonMiddlewares.send( oRequest, oResponse, {
                    "id": oUser.id,
                    "token": oUser.token
                } );
            } );
        }

};
