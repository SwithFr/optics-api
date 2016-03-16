/* api.optics
 * /bin/controllers/events/list.js - list all events from user
 * started @ 30/11/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Event = require( "../../core/sequelize.js" ).models.Event,
    EventUser = require( "../../core/sequelize.js" ).models.EventUser;

// [GET] - /events
module.exports = function( oRequest, oResponse ) {

    Event
        .findAll( {
            "include": [ {
                "model": EventUser,
                "where": {
                    "user_id": +oRequest.headers.userid
                }
            } ],
            "order": "updated_at DESC"
        } )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oEvents ) {
            if( !oEvents ) {
                return jsonMiddlewares.error( oRequest, oResponse, new Error( "NO_EVENT_FOUND" ), 404 );
            }

            jsonMiddlewares.send( oRequest, oResponse, oEvents );
        } );

};
