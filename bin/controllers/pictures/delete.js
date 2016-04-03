/* api.optics
 * /bin/controllers/pictures/delete.js - delete a picture
 * started @ 09/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Picture = require( "../../core/sequelize.js" ).models.Picture,
    Event = require( "../../core/sequelize.js" ).models.Event,
    Validator = require( "../../core/validator.js" ),
    fs = require( "fs" );

var decrementPicturesCount = function( oPictureDestroyed, oRequest, oResponse ) {
    Event
       .findOne( {
           "where": {
               "id": oPictureDestroyed.event_id
           }
       } )
       .catch( function( oError ) {
           return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
       } )
       .then( function( oEvent ) {
           oEvent.decrementPicturesCount();
           oEvent.save();

           return jsonMiddlewares.send( oRequest, oResponse, {
               "id": oPictureDestroyed.id,
               "deleted": true
           } );
       } );
};

// [delete] - /pictures/:id
module.exports = function( oRequest, oResponse ) {

    var iPictureId = oRequest.params.id;

    var oIsNotValid = Validator( [
        {
            "type": "param",
            "message": "Id de l'image manquant",
            "data": iPictureId
        }
    ], oRequest, oResponse );

    if ( oIsNotValid ) {
        return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
    } else {
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
                        .then( function( oPictureDestroyed ) {
                            decrementPicturesCount( oPictureDestroyed, oRequest, oResponse );
                        } );
                }
            } );
    }

};
