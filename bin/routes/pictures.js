/* api.optics
 * /bin/routes/pictures.js - routes configuration for pictures
 * started @ 02/12/2015
 */

"use strict";

var fCheckConnect = require( "../core/express/middlewares.js" ).checkConnect;

exports.init = function( oApp ) {

    // add picture to an event
    oApp.post( "/pictures", fCheckConnect, require( "../controllers/pictures/add.js" ) );

    // Get pictures from an event
    oApp.get( "/pictures", fCheckConnect, require( "../controllers/pictures/list.js" ) );

    // Get picture from id
    //oApp.get( "/pictures/id", fCheckConnect, require( "../controllers/pictures/detail.js" ) );

    // Delete picture
    oApp.delete( "/pictures/:id", fCheckConnect, require( "../controllers/pictures/delete.js" ) );

};
