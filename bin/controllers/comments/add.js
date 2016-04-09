/* api.optics
 * /bin/controllers/comments/add.js add a comment to a picture
 * Created @ 15/11/2015
 */

 "use strict";

 var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
     fs = require( "fs" ),
     Comment = require( "../../core/sequelize.js" ).models.Comment,
     Picture = require( "../../core/sequelize.js" ).models.Picture,
     Validator = require( "../../core/validator.js" ),
     zouti = require( "zouti" );

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
            oPicture.incrementCommentsCount();
            oPicture.save();

            oSavedComment && jsonMiddlewares.send( oRequest, oResponse, {
                "id": oSavedComment.id,
                "comment": oSavedComment.content
            } );
        } );
 };

var saveComment = function( oComment, oCommentPosted, iPictureId, oRequest, oResponse ) {
    var oIsNotValid = Validator( [
        {
            "type": "header",
            "message": "Id de l'évènement manquant",
            "data": oRequest.headers.eventid
        }
    ], oRequest, oResponse );

    if ( oIsNotValid ) {
        return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
    } else {
        oComment.user_id = +oRequest.headers.userid;
        oComment.event_id = oRequest.headers.eventid;
        oComment.picture_id = iPictureId;
        oComment.content = oCommentPosted;

        oComment
            .save()
            .catch( function( oError ) {
                return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
            } )
            .then( function( oSavedComment ) {
                incrementeCommentsCount( iPictureId, oSavedComment, oRequest, oResponse );
            } );
    }

};

 // [POST] - /comments
 module.exports = function( oRequest, oResponse ) {

     var oComment = Comment.build(),
         oCommentPosted = oRequest.body.comment,
         iPictureId = +oRequest.headers.pictureid;

     var oIsNotValid = Validator( [
         {
             "type": "header",
             "message": "Id de l'image manquant",
             "data": iPictureId
         },
         {
             "type": "data",
             "message": "Contenu du commentaire vide",
             "data": oCommentPosted
         }
     ], oRequest, oResponse );

     if ( oIsNotValid ) {
         return jsonMiddlewares.error( oRequest, oResponse, oIsNotValid, 400 );
     } else {
         oComment.content = oCommentPosted;

         oComment
             .validate()
             .then( function( oValidationReport ) {
                 if( oValidationReport ) {
                     return jsonMiddlewares.error( oRequest, oResponse, {
                         "type": "VALIDATION_FAILED",
                         "message": "80 caractères max"
                     }, 400 );
                 }

                 saveComment( oComment, oCommentPosted, iPictureId, oRequest, oResponse );
             } );
     }
 };
