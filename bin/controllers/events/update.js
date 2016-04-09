/* api.optics
 * /bin/controllers/events/update.js - update an event
 * started @ 31/03/2016
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Event = require( "../../core/sequelize.js" ).models.Event,
    EventUser = require( "../../core/sequelize.js" ).models.EventUser,
    Validator = require( "../../core/validator.js" );

// [PATCH] - /events/:id
module.exports = function( oRequest, oResponse ) {

    var oPOST = oRequest.body;

    var oIsNotValid = Validator( [
        {
            "type": "param",
            "message": "Id de l'évènement manquant",
            "data": oRequest.params.id
        },
        {
            "type": "data",
            "message": "Titre l'évènement manquant",
            "data": oPOST.title.trim()
        },
        {
            "type": "data",
            "message": "Description l'évènement manquant",
            "data": oPOST.description.trim()
        }
    ], oRequest, oResponse );

    if ( oIsNotValid ) {
        return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
    } else {
        Event
            .findOne( {
                "where": {
                    "uuid": oRequest.params.id
                }
            } )
            .catch( function( oError ) {
                return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
            } )
            .then( function( oEvent ) {

                if ( oEvent ) {
                    oEvent.title = oPOST.title;
                    oEvent.description = oPOST.description;

                    oEvent
                        .save()
                        .catch( function( oError ) {
                            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                        } )
                        .then( function( oUpdatedEvent ) {
                            return jsonMiddlewares.send( oRequest, oResponse, oUpdatedEvent );
                        } )
                } else {
                    return jsonMiddlewares.error( oRequest, oResponse, "NO_EVENT_FOUND", 404 );
                }
            } );
    }
};
