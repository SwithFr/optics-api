/* api.optics
 * /bin/controllers/users/login.js - log user to API
 * started @ 17/11/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    zouti = require( "zouti" ),
    User = require( "../../core/sequelize.js" ).models.User;

// [POST] - /user/login
module.exports = function( oRequest, oResponse ) {

    // get post params
    var sLogin = ( oRequest.body.login || "" ).trim(),
        sPassword = ( oRequest.body.password || "" ).trim();

    // verify post params
    if( !sLogin.trim() || !sPassword.trim() ) {
        return jsonMiddlewares.error( oRequest, oResponse, new Error( "NO_EMPTY_PARAMS" ), 400 );
    }

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
            jsonMiddlewares.send( oRequest, oResponse, {
                "id": oUser.id,
                "token": oUser.token
            } );
        } );
};
