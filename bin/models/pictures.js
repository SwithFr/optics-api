/* api.optics
 * /bin/models/pictures.js - sequelize model for Picture
 * started @ 02/12/2015
 */

"use strict";

module.exports = function( oSequelize, DataTypes ) {

    var oColumns, oProperties;

    oColumns = {
        "title": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "comments_count": {
            "type": DataTypes.INTEGER,
            "defaultValue": 0
        }
    };

    oProperties = {
        "tablename": "pictures",
        "paranoid": true,
        "underscored": true,
        "instanceMethods": {
            "incrementCommentsCount": function() {
                return this.comments_count = this.comments_count + 1;
            }
        }
    };

    return oSequelize.define( "Picture", oColumns, oProperties );

};
