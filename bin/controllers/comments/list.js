/* api.optics
 * /bin/controllers/comments/list.js - list all comments from pictures
 * started @ 15/12/2015
 */

"use strict";

var jsonMiddlewares = require( "../../core/express/middlewares.js" ).json,
    Comment = require( "../../core/sequelize.js" ).models.Comment,
    User = require( "../../core/sequelize.js" ).models.User;

// [GET] - /comments
module.exports = function( oRequest, oResponse ) {
    Comment
        .findAll( {
            "where": {
                "picture_id": +oRequest.headers.pictureid
            },
            "order": "updated_at DESC",
            "include": [ {
                "model": User
            } ]
        } )
        .catch( function( oError ) {
            return jsonMiddlewares.error( oRequest, oResponse, oError, 500 );
        } )
        .then( function( oComments ) {
            if( !oComments ) {
                return jsonMiddlewares.error( oRequest, oResponse, new Error( "NO_COMMENT_FOUND" ), 404 );
            }

            jsonMiddlewares.send( oRequest, oResponse, oComments.map( formatComment ) );
        } );
};

var formatComment = function( oComment ){
    return {
        "id": oComment.id,
        "comment": oComment.content,
        "author": oComment[ "User" ].login,
        "avatar": oComment[ "User" ].avatar,
        "user_id": oComment[ "User" ].id
    }
};
