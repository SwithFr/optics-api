/* optics
 * /bin/core/express/middlewares.js - global middleware configuration
 * started @ 23/10/2015
 */

"use strict";

var User = require( "../../core/sequelize.js" ).models.User;

var _json;

exports.log = function( oRequest, oResponse, fNext ) {
    var sDate = ( new Date() ).toTimeString();

    console.log( "(" + sDate + ") - [" + oRequest.method + "] - " + oRequest.url );
    fNext();
};

exports.json = _json = {
    "send": function( oRequest, oResponse, mData, iStatusCode ) {
        //console.log( "OK : [" + ( iStatusCode || 200 ) + "] - ", mData );
        oResponse.status( iStatusCode || 200 ).json( {
            "url": "[" + oRequest.method + "] - " + oRequest.url,
            "error": false,
            "data": mData
        } );
    },
    "error": function( oRequest, oResponse, oError, iStatusCode ) {
        console.log( "ERROR : [" + iStatusCode + "] - ", oError );
        oResponse.status( iStatusCode || 500 ).json( {
            "url": "[" + oRequest.method + "] - " + oRequest.url,
            "error":  oError.errors[ 0 ].message || oError.message || oError,
            "data": null
        } );
    }
};

exports.checkConnect = function( oRequest, oResponse, fNext ) {
    var iUserID = +oRequest.headers.userid,
        sUserToken = oRequest.headers.usertoken;

    if( !iUserID || !sUserToken ) {
        return _json.error( oRequest, oResponse, new Error( "UNAUTHORIZED" ), 401 );
    }

    // check db
    User
        .findById( iUserID )
        .then( function( oUser ) {
            if( oUser && oUser.token === sUserToken ) {
                oResponse.locals.user = oUser;
                fNext();
            } else {
                return _json.error( oRequest, oResponse, new Error( "INVALID_TOKEN" ), 401 );
            }
        } );
};
