/* api.optics
 * /bin/controllers/users/create.js - register a user
 * started @ 17/10/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    User = require( "../../core/sequelize.js" ).models.User;

// [POST] - /user/register
module.exports = function( oRequest, oResponse ) {

    var oPOST = oRequest.body,
        oUser = User.build();

    oUser.login = ( oPOST.login || "" ).trim();
    oUser.password = ( oPOST.password || "" ).trim();

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

};
