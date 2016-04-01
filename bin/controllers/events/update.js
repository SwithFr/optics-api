/* api.optics
 * /bin/controllers/events/update.js - update an event
 * started @ 31/03/2016
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Event = require( "../../core/sequelize.js" ).models.Event,
    EventUser = require( "../../core/sequelize.js" ).models.EventUser;

// [PATCH] - /events/:id
module.exports = function( oRequest, oResponse ) {

    var oPOST = oRequest.body;

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
                oEvent.title = ( oPOST.title || "" ).trim();
                oEvent.description = ( oPOST.description || "" ).trim();

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
};
