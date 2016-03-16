/* api.optics
 * /bin/controllers/events/add.js - add a picture to an event
 * started @ 02/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    fs = require( "fs" ),
    Picture = require( "../../core/sequelize.js" ).models.Picture,
    zouti = require( "zouti" );

// [POST] - /pictures
module.exports = function( oRequest, oResponse ) {

    var oPicture = Picture.build(),
        title = zouti.whirlpool( oRequest.headers.id + new Date() ).substring( 0, 8 ) + ".jpg";

    fs.readFile( oRequest.files.file.path, "base64", function ( oError, oData ) {
        var newPath = "./static/" + title;

        fs.writeFile( newPath, oData, function ( oError ) {
            if( oError ) {
                return jsonMiddlewares.error( oRequest, oResponse, oError );
            }

            oPicture.event_id = oRequest.body.eventId;
            oPicture.title = title;
            oPicture.user_id = oRequest.headers.userid;
            oPicture.data = oData;
            oPicture.save()
                .catch( function( oError ) {
                    return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                } )
                .then( function( oSavedPicture ) {
                    oSavedPicture && jsonMiddlewares.send( oRequest, oResponse, {
                        "title": oRequest.files.file.name,
                        "uuid": oSavedPicture.uuid,
                        "event_id": oSavedPicture.event_id,
                    } );
                } );
        } );
    } );

};
