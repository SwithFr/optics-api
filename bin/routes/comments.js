/* api.optics
 * /bin/routes/comments.js - routes configuration for comments
 * started @ 15/13/2015
 */

"use strict";

var fCheckConnect = require( "../core/express/middlewares.js" ).checkConnect;

exports.init = function( oApp ) {

    // Add comment
    oApp.post( "/comments", fCheckConnect, require( "../controllers/comments/add.js" ) );

    // Get all comments from picture
    oApp.get( "/comments", fCheckConnect, require( "../controllers/comments/list.js" ) );

};
