/* api.optics
 * /bin/controllers/users/list.js - log user to API
 * started @ 17/11/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User;

// [GET] - /users
module.exports = function( oRequest, oResponse ) {

    User
        .findAll()
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oUsers ) {
            if( !oUsers ) {
                return jsonMiddlewares.error( oRequest, oResponse, new Error( "NO_USER_FOUND" ), 404 );
            }

            jsonMiddlewares.send( oRequest, oResponse, oUsers );
        } );
};
