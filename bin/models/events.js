/* api.optics
 * /bin/models/events.js - sequelize model for Events
 * started @ 30/11/2015
 */

"use strict";

module.exports = function( oSequelize, DataTypes ) {

    var oColumns, oProperties;

    oColumns = {
        "uuid": {
            "type": DataTypes.STRING,
            "unique": true
        },
        "title": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "description": {
            "type": DataTypes.TEXT
        },
        "users_count": {
            "type": DataTypes.INTEGER,
            "defaultValue": 1
        },
        "pictures_count": {
            "type": DataTypes.INTEGER,
            "defaultValue": 0
        }
    };

    oProperties = {
        "tablename": "events",
        "paranoid": true,
        "underscored": true
    };

    return oSequelize.define( "Event", oColumns, oProperties );

};
