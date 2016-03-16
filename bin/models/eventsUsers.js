/* api.optics
 * /bin/models/eventsUsers.js - sequelize model for eventsUsers
 * started @ 01/12/2015
 */

"use strict";

module.exports = function( oSequelize, DataTypes ) {

    var oColumns, oProperties;

    oColumns = {
        "user_id": {
            "type": DataTypes.INTEGER
        }
    };

    oProperties = {
        "tablename": "eventsUsers",
        "paranoid": true,
        "underscored": true
    };

    return oSequelize.define( "EventUser", oColumns, oProperties );

};
