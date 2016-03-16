/* api.optics
 * /bin/core/sync.js - perform db & data syncing if needed
 * started @ 17/10/2015
 */

"use strict";

var fs = require( "fs" ),
    zouti = require( "zouti" );

var oSequelize = require( "./sequelize.js" ).db;

var fileExist = fs.statSync( "./db-sync.stub" ).isFile();

// sync
if( process.env.NODE_ENV !== "production" && !fileExist ) {

    oSequelize.options.logging = false;

    zouti.log( "syncing...", "panoptik:db", zouti.YELLOW );
    zouti.bench( "panoptik:db" );

    oSequelize
        .sync( {
            "force": true
        } )
        .catch( function( oError ) {
            zouti.log( oError, "panoptik:db:syncing", zouti.ERROR );
            zouti.bench( "panoptik:db" );
            process.exit( 1 );
        } )
        .then( function() {
            zouti.bench( "panoptik:db" );
            fs.writeFile( "./db-sync.stub", "1", {
                "encoding": "utf-8"
            } );
            oSequelize.options.logging = console.log;
        } );

}
