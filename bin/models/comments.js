/* api.optics
 * /bin/models/comments.js - sequelize model for Comment
 * started @ 15/12/2015
 */

"use strict";

module.exports = function( oSequelize, DataTypes ) {

    var oColumns, oProperties;

    oColumns = {
        "content": {
            "type": DataTypes.TEXT,
            "validate": {
                "max": 80
            }
        }
    };

    oProperties = {
        "tablename": "comments",
        "paranoid": true,
        "underscored": true
    };

    return oSequelize.define( "Comment", oColumns, oProperties );

};
