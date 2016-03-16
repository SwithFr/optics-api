/* api.optics
 * /bin/controllers/users/settings.js - get settings from user
 * started @ 25/11/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User;

// [GET] - /user/settings
module.exports = function( oRequest, oResponse ) {

    // get post params
    var iUserId = oRequest.headers.userid;

    User
        .findById( iUserId )
        .then( function( oUser ) {
            if( !oUser ) {
                return jsonMiddlewares.error( oRequest, oResponse, new Error( "UNKNOWN_USER" ), 404 );
            }

            jsonMiddlewares.send( oRequest, oResponse, {
                "id": oUser.id,
                "avatar": oUser.avatar,
                "login": oUser.login
            } );
        } );
};
