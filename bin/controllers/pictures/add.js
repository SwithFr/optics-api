/* api.optics
 * /bin/controllers/events/add.js - add a picture to an event
 * started @ 02/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    fs = require( "fs" ),
    Picture = require( "../../core/sequelize.js" ).models.Picture,
    Event = require( "../../core/sequelize.js" ).models.Event,
    zouti = require( "zouti" ),
    Validator = require( "../../core/validator.js" );

var incrementePicturesCount = function( oSavedPicture, oRequest, oResponse ) {
    Event
       .findOne( {
           "where": {
               "id": oSavedPicture.event_id
           }
       } )
       .catch( function( oError ) {
           return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
       } )
       .then( function( oEvent ) {
           oEvent.incrementPicturesCount();
           oEvent.save();

           jsonMiddlewares.send( oRequest, oResponse, {
               "title": oSavedPicture.title,
               "uuid": oSavedPicture.uuid,
               "event_id": oSavedPicture.event_id
           } );
       } );
};

var savePicture = function( oPicture, oRequest, oResponse ) {
    oPicture.save()
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oSavedPicture ) {
            oSavedPicture && incrementePicturesCount( oSavedPicture, oRequest, oResponse );
        } );
};

// [POST] - /pictures
module.exports = function( oRequest, oResponse ) {
    var oIsNotValid = Validator( [
        {
            "type": "data",
            "message": "Id de l'évènement manquant",
            "data": oRequest.body.eventId
        }
    ], oRequest, oResponse );

    if ( oIsNotValid ) {
        return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
    } else {
        var oPicture = Picture.build(),
            title = zouti.whirlpool( oRequest.body.eventId + new Date() ).substring( 0, 8 ) + ".jpg";

        fs.readFile( oRequest.files.file.path, "base64", function( oError, oData ) {
            var newPath = "./static/" + title;

            fs.writeFile( newPath, oData, "base64", function( oError ) {
                if( oError ) {
                    return jsonMiddlewares.error( oRequest, oResponse, oError );
                }

                oPicture.event_id = oRequest.body.eventId;
                oPicture.title = title;
                oPicture.user_id = oRequest.headers.userid;

                savePicture( oPicture, oRequest, oResponse );
            } );
        } );
    }
};
