/* api.optics
 * /bin/core/validator.js - Validate data, header or parameters
 * started @ 03/04/2016
 */

 "use strict";

 var jsonMiddlewares = require( "./express/middlewares.js" ).json;

 var validate = function( mData ) {
     if ( !mData ) {
         return false;
     }

     return true;
 };

module.exports = function( aData, oRequest, oResponse ) {
    var i,
        isValid,
        sType,
        iStatusCode = 400,
        sMessage;

    for ( i in aData ) {
        var current = aData[i];

        switch ( current.type ) {
            case "header":
                isValid = validate( current.data );
                sType = "INVALID_HEADERS";
                sMessage = current.message;
                break;
            case "param":
                isValid = validate( current.data );
                sType = "EMPTY_PARAMS";
                sMessage = current.message;
                break;
            case "data":
                isValid = validate( current.data );
                sType = "EMPTY_DATA";
                sMessage = current.message;
                break;
        }

        if ( !isValid ) {
            return {
                "type": sType,
                "message": sMessage
            };
        }
    }


    return false;
};
