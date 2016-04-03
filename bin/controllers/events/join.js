/* api.optics
 * /bin/controllers/events/join.js - join an event
 * started @ 01/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Event = require( "../../core/sequelize.js" ).models.Event,
    EventUser = require( "../../core/sequelize.js" ).models.EventUser;

var checkParams = function( param ) {
    if ( !param ) {
        jsonMiddlewares.error( oRequest, oResponse, new Error( "EMPTY_PARAM" ), 500 );
        return;
    }
};

var setEventUserRelation = function( oEventUser, iEventID, iUserID ) {
    oEventUser.event_id = iEventID;
    oEventUser.user_id = iUserID;
    
    return oEventUser;
};

var incrementUsersCount = function( oEvent ) {
    oEvent.users_count += 1;
    oEvent.save();
};

// [GET] - /events/join/{id}
module.exports = function( oRequest, oResponse ) {

    var iEventID = oRequest.params.id || false,
        iUserID = +oRequest.headers.userid;

    var oEventUser = EventUser.build();

    checkParams( iEventID );

    Event
        .findOne( {
            "where": {
                "uuid": iEventID
            }
        } )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oEvent ) {

            EventUser
                .findOne( {
                    "where": {
                        "event_id": oEvent.id,
                        "user_id": iUserID
                    }
                } )
                .then( function( oEventUserFound ) {
                    if ( oEventUserFound ) {
                        return jsonMiddlewares.error( oRequest, oResponse, "ALREADY_JOINED", 401 );
                    }

                    incrementUsersCount( oEvent );

                    setEventUserRelation( oEventUser, oEvent.id, iUserID )
                        .save()
                        .catch( function( oError ) {
                            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                        } )
                        .then( function( oSavedEventUser ) {
                            oSavedEventUser && jsonMiddlewares.send( oRequest, oResponse, oEvent );
                            return;
                        } );
                } );
        } );
};
