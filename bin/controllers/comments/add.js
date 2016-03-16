/* api.optics
 * /bin/controllers/comments/add.js add a comment to a picture
 * Created @ 15/11/2015
 */

 "use strict";

 var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
     fs = require( "fs" ),
     Comment = require( "../../core/sequelize.js" ).models.Comment,
     Picture = require( "../../core/sequelize.js" ).models.Picture,
     zouti = require( "zouti" );

 // [POST] - /comments
 module.exports = function( oRequest, oResponse ) {

     var oComment = Comment.build(),
         oCommentPosted = oRequest.body.comment,
         iPictureId = +oRequest.headers.pictureid;

     if ( !iPictureId ) {
         jsonMiddlewares.error( oRequest, oResponse, "INVALID_HEADERS", 400 );
     }

     oComment
         .validate()
         .then( function( oValidationReport ) {
             if( oValidationReport ) {
                 jsonMiddlewares.error( oRequest, oResponse, oValidationReport.errors, 400 );
                 return;
             }

             saveComment( oComment, oCommentPosted, iPictureId, oRequest, oResponse );

         } );
 };

 var saveComment = function( oComment, oCommentPosted, iPictureId, oRequest, oResponse ){
     oComment.user_id = +oRequest.headers.userid;
     oComment.picture_id = iPictureId;
     oComment.content = oCommentPosted;
     oComment.event_id = oRequest.headers.eventid;

     oComment.save()
         .catch( function( oError ) {
             jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
             return;
         } )
         .then( function( oSavedComment ) {
             incrementeCommentsCount( iPictureId, oSavedComment, oRequest, oResponse );
         } );
 };

 var incrementeCommentsCount = function( iPictureId, oSavedComment, oRequest, oResponse ){
     Picture
        .findOne( {
            "where": {
                "id": iPictureId
            }
        } )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oPicture ) {
            oPicture.commentsCount += 1;
            oPicture.save();

            oSavedComment && jsonMiddlewares.send( oRequest, oResponse, {
                "id": oSavedComment.id,
                "comment": oSavedComment.content
            } );
        } );
 };
