/* api.optics
 * /bin/controllers/pictures/list.js - list all pictures from event
 * started @ 08/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Picture = require( "../../core/sequelize.js" ).models.Picture,
    User = require( "../../core/sequelize.js" ).models.User,
    Comment = require( "../../core/sequelize.js" ).models.Comment,
    Validator = require( "../../core/validator.js" ),
    fs = require( "fs" );

// [GET] - /pictures
module.exports = function( oRequest, oResponse ) {

    var oIsNotValid = Validator( [
        {
            "type": "header",
            "message": "Id de l'évènement manquant",
            "data": oRequest.headers.eventid
        }
    ], oRequest, oResponse );

    if ( oIsNotValid ) {
        return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
    } else {
        var eventid = oRequest.headers.eventid;

        Picture
            .findAll( {
                "where": {
                    "event_id": eventid
                },
                "order": "updated_at DESC",
                "include": [ {
                    "model": User
                } ]
            } )
            .catch( function( oError ) {
                return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
            } )
            .then( function( oPictures ) {
                if( !oPictures ) {
                    return jsonMiddlewares.error( oRequest, oResponse, new Error( "NO_PICTURE_FOUND" ), 404 );
                }

                jsonMiddlewares.send( oRequest, oResponse, oPictures.map( function( oPicture ) {
                    return {
                        "id": oPicture.id,
                        "title": oPicture.title,
                        "author": oPicture[ "User" ].login,
                        "avatar": oPicture[ "User" ].avatar,
                        "user_id": oPicture[ "User" ].id,
                        "date": oPicture.created_at,
                        "comments": oPicture.comments_count,
                        "event_id": eventid
                    }
                } ) );
            } );
    }
};
