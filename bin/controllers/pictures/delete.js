/* api.optics
 * /bin/controllers/pictures/delete.js - delete a picture
 * started @ 09/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Picture = require( "../../core/sequelize.js" ).models.Picture,
    fs = require( "fs" );

// [delete] - /pictures/:id
module.exports = function( oRequest, oResponse ) {

    var iPictureId = oRequest.params.id;

    console.log(iPictureId);

    Picture
        .findById( iPictureId )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oPicture ) {
            if( oPicture ) {
                if( oPicture.user_id !== +oRequest.headers.userid ) {
                    return jsonMiddlewares.error( oRequest, oResponse, new Error( "FORBIDDEN_PICTURE" ), 401 );
                }

                fs.unlinkSync( "./static/" + oPicture.title );

                oPicture
                    .destroy()
                    .then( function() {
                        return jsonMiddlewares.send( oRequest, oResponse, {
                            "id": iPictureId,
                            "deleted": true
                        } );
                    } );
            }
        } );

};
