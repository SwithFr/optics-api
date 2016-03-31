/* api.optics
 * /bin/routes/events.js - routes configuration for events
 * started @ 30/11/2015
 */

"use strict";

var fCheckConnect = require( "../core/express/middlewares.js" ).checkConnect;

exports.init = function( oApp ) {

    // get settings from user
    oApp.post( "/events/create", fCheckConnect, require( "../controllers/events/create.js" ) );

    // get events from user
    oApp.get( "/events", fCheckConnect, require( "../controllers/events/list.js" ) );

    // join event
    oApp.get( "/events/join/:id", fCheckConnect, require( "../controllers/events/join.js" ) );

    // update an event
    oApp.patch( "/events/:id", fCheckConnect, require( "../controllers/events/update.js" ) );

    // Delete event
    oApp.delete( "/events/:id", fCheckConnect, require( "../controllers/events/delete.js" ) );

};
