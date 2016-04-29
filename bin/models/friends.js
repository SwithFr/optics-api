/* api.optics
 * /bin/models/friends.js - sequelize relation model for friends
 * started @ 28/04/2016
 */

"use strict";

module.exports = function( oSequelize, DataTypes ) {

    var oColumns, oProperties;

    oColumns = {
        "friend_id": {
            "type": DataTypes.INTEGER
        }
    };

    oProperties = {
        "tablename": "friends",
        "paranoid": true,
        "underscored": true
    };

    return oSequelize.define( "FriendsRelation", oColumns, oProperties );

};
