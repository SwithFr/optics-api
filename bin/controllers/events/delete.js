/* api.optics
 * /bin/controllers/events/delete.js - delete an event
 * started @ 02/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Event = require( "../../core/sequelize.js" ).models.Event,
    Validator = require( "../../core/validator.js" );

// [delete] - /events/:id
module.exports = function( oRequest, oResponse ) {

    var oIsNotValid = Validator( [
        {
            "type": "param",
            "message": "Id de l'évènement manquant",
            "data": oRequest.params.id
        }
    ], oRequest, oResponse );

    if ( oIsNotValid ) {
        return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
    } else {
        var sEventID = oRequest.params.id;

        Event
            .findOne( {
                "where": {
                    "uuid": sEventID
                }
            } )
            .catch( function( oError ) {
                return jsonMiddlewares.error( oRequest, oResponse, "NO_EVENT_FOUND", 404 );
            } )
            .then( function( oEvent ) {
                if( oEvent ) {
                    if( oEvent.user_id !== +oRequest.headers.userid ) {
                        return jsonMiddlewares.error( oRequest, oResponse, new Error( "FORBIDDEN_EVENT" ), 401 );
                    }

                    oEvent
                        .destroy()
                        .then( function() {
                            return jsonMiddlewares.send( oRequest, oResponse, {
                                "uuid": sEventID,
                                "deleted": true
                            } );
                        } );
                }
            } );
    }
};
