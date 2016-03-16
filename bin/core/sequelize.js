/* api.optics
 * /bin/core/sequelize.js - sequelize setup
 * started @ 17/11/2015
 */

"use strict";

var Sequelize = require( "sequelize" );

var oSequelize, oModels;

// connexion
exports.db = oSequelize = new Sequelize( "optics", "optics", "optics", {
    "host": "postgres",
    "dialect": "postgres"
} );

// models
exports.models = oModels = {
    "User": oSequelize.import( "../models/user.js" ),
    "Event": oSequelize.import( "../models/events.js" ),
    "EventUser": oSequelize.import( "../models/eventsUsers.js" ),
    "Picture": oSequelize.import( "../models/pictures.js" ),
    "Comment": oSequelize.import( "../models/comments.js" )
};

// relations
oModels.Event.belongsTo( oModels.User );
oModels.Picture.belongsTo( oModels.Event );
oModels.Picture.belongsTo( oModels.User );
oModels.Event.hasMany( oModels.EventUser );
oModels.Comment.belongsTo( oModels.User );
oModels.Comment.belongsTo( oModels.Picture );
oModels.Comment.belongsTo( oModels.Event );
