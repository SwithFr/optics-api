/* api.optics
 * /bin/server.js - main entry point
 * started @ 17/10/2015
 */

"use strict";

var zouti = require( "zouti" );

zouti.clearConsole();
zouti.log( "launching...", "panoptik:server", zouti.YELLOW );

zouti.bench( "panoptik:server" );

// load & configure all
require( "./core/sequelize.js" );
require( "./core/express.js" );

// sync models with db
require( "./core/sync.js" );

zouti.bench( "panoptik:server" );
