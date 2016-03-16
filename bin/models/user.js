/* api.optics
 * /bin/models/users.js - sequelize model for Users
 * started @ 17/10/2015
 */

"use strict";

module.exports = function( oSequelize, DataTypes ) {

    var oColumns, oProperties;

    oColumns = {
        "login": {
            "type": DataTypes.STRING,
            "allowNull": false,
            "unique": true
        },
        "password": {
            "type": DataTypes.STRING,
            "allowNull": false,
            "validate": {
                "isAlphanumeric": true
            },
            "set": function( sValue ) {
                this.setDataValue( "password", sValue.trim() && require( "zouti" ).whirlpool( sValue ) );
            }
        },
        "token": {
            "type": DataTypes.STRING
        },
        "avatar": {
            "type": DataTypes.STRING,
            "get": function() {
                return this.getDataValue( "avatar" ) || "http://api.adorable.io/avatars/80/" + this.getDataValue( "login" ) + ".png";
            }
        }
    };

    oProperties = {
        "tablename": "users",
        "paranoid": true, // Quand on demande de supprimer, il ne va pas le faire, il va juste mettre à jour le deleted_at (ajouté automatiquement)
        "underscored": true
    };

    return oSequelize.define( "User", oColumns, oProperties );

};
