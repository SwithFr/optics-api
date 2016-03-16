/* api.optics
 * /bin/core/express.js - express setup
 * started @ 17/10/2015
 */

"use strict";

var express = require( "express" ),
    bodyParser = require( "body-parser" ),
    multipart = require('connect-multiparty');

var oApp;

oApp = express();

// configure middlewares
    // body-parser
oApp.use( bodyParser.json() );
oApp.use( bodyParser.urlencoded( {
    "extended": true
} ) );
    // connect-multiparty
oApp.use( multipart() );
    // logging
oApp.use( require( "./express/middlewares" ).log );

// configure static
oApp.use( express.static( __dirname + "/../../static" ) );

// configure routes
require( "../routes/users.js" ).init( oApp );
require( "../routes/events.js" ).init( oApp );
require( "../routes/pictures.js" ).init( oApp );
require( "../routes/comments.js" ).init( oApp );

// listen
oApp.listen( process.env.APP_PORT );
