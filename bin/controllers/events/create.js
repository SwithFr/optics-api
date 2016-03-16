/* api.optics
 * /bin/controllers/events/create.js - add an event
 * started @ 30/11/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Event = require( "../../core/sequelize.js" ).models.Event,
    EventUser = require( "../../core/sequelize.js" ).models.EventUser;

// [POST] - /events/create
module.exports = function( oRequest, oResponse ) {

    var oPOST = oRequest.body,
        oEvent = Event.build(),
        oEventUser = EventUser.build();

    var iUserId = +oRequest.headers.userid;

    oEvent.title = ( oPOST.title || "" ).trim();
    oEvent.description = ( oPOST.description || "" ).trim();

    oEvent
        .validate()
        .then( function( oValidationReport ) {
            if( oValidationReport ) {
                return jsonMiddlewares.error( oRequest, oResponse, oValidationReport.errors, 400 );
            }

            setEvent( oEvent, iUserId )
                .save()
                .catch( function( oError ) {
                    return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                } )
                .then( function( oSavedEvent ) {
                    setEventUserRelation( oEventUser, iUserId, oSavedEvent.id )
                        .save()
                            .catch( function( oError ) {
                                return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
                            } )
                            .then( function() {
                                oSavedEvent && jsonMiddlewares.send( oRequest, oResponse, {
                                    "id": oSavedEvent.id,
                                    "title": oSavedEvent.title,
                                    "uuid": oSavedEvent.uuid,
                                    "user_id": oSavedEvent.user_id,
                                    "description": oSavedEvent.description
                                } );
                            } );
                } );
        } );
};

var setEventUserRelation = function( oEventUser, iUserId, iEventId ){
    oEventUser.user_id = iUserId;
    oEventUser.event_id = iEventId;
    return oEventUser;
};

var setEvent = function( oEvent, iUserId ){
    oEvent.uuid = generateFakeUuid();
    oEvent.user_id = iUserId;
    return oEvent;
};

var generateFakeUuid = function() {
    return require( "zouti" )
              .whirlpool( ( new Date() ).toString() )
              .substring( 0, 8 )
};
