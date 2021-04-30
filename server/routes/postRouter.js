const express = require('express');

const postRouter = express.Router();
const Post = require('../models/post');
const authenticate = require('../authenticate');

postRouter.route('/')
    // Get list of all posts in the database
    .get((req, res, next) => {
        Post.find({}).sort({createdAt: 'desc'})
            .populate('author')
            .populate('comments.author')
            .then((posts) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(posts);
            }, (err) => {
                next(err);
            })
            .catch(err => next(err));
    })
    // Create a new post 
    .post(authenticate.verifyUser, (req, res, next) => {
        Post.create(req.body)
            .then((post) => {
                Post.findById(post._id)
                    .populate('author')
                    .populate('comments.author')
                    .then((post) => {
                        console.log('Post created', post);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(post);
                    }, (err) => next(err))
            })
            .catch((err) => next(err));
    })
    // Update an existing post
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /posts');
    })
    // Delete an existing post
    .delete(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /posts');
    });

postRouter.route('/:postId')
    .get((req, res, next) => {
        Post.findById(req.params.postId)
            .populate('author')
            .populate('comments.author')
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /posts/' + req.params.postId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Post.findByIdAndUpdate(req.params.postId, {
            $set: req.body
        }, {new: true})
            .populate('author')
            .populate('comments.author')
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Post.findByIdAndDelete(req.params.postId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

postRouter.route('/:postId/comments') 
    .get((req, res, next) => {
        Post.findById(req.params.postId)
            .populate('author')
            .populate('comments.author')
            .then((post) => {
                if(post !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post.comments);
                } else {
                    let err = new Error('Post ' + req.params.postId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Post.findById(req.params.postId)
            .then((post) => {
                if(post != null) {
                    //req.body.author = req.user._id;
                    post.comments.push(req.body);
                    post.save()
                        .then((post) => {
                            Post.findById(post._id)
                                .populate('author')
                                .populate('comments.author')
                                .then((post) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(post);
                                })
                        }, (err) => next(err));
                } else {
                    let err = new Error('Post ' + req.params.postId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /posts/' + req.params.postId + '/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /posts/' + req.params.postId + '/comments');
    });

postRouter.route('/:postId/comments/:commentId')
    .get((req, res, next) => {
        Post.findById(req.params.postId)
            .populate('author')
            .populate('comments.author')
            .then((post) => {
                if(post !== null && post.comments.id(req.params.commentId) !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post.comments.id(req.params.commentId));
                }
                else if(post === null) {
                    let err = new Error('Post ' + req.params.postId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /posts/' + req.params.postId + '/comments/' + req.params.commentId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Post.findById(req.params.postId)
            .then((post) => {
                if(post !== null && post.comments.id(req.params.commentId) !== null) {
                    // Check if the request from the author 
                    if(!req.user._id.equals(post.comments.id(req.params.commentId).author)) {
                        let error = new Error("You're not authorized to perfrom this operation!");
                        error.status(403);
                        return next(error);
                    }

                    if(req.body.comment) {
                        post.comments.id(req.params.commentId).comment = req.body.comment;
                    }

                    post.save()
                        .then((post) => {
                            Post.findById(post._id)
                                .populate('author')
                                .populate('comments.author')
                                .then((post) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(post);
                                })
                        }, (err) => next(err));
                }
                else if(post === null) {
                    let err = new Error('Post ' + req.params.postId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Post.findById(req.params.postId)
        .then((post) => {
            if(post !== null && post.comments.id(req.params.commentId) !== null) {
                // Check if the request from the author 
                // if(!req.user._id.equals(post.comments.id(req.params.commentId).author)) {
                //     let error = new Error("You're not authorized to perfrom this operation!");
                //     error.status(403);
                //     return next(error);
                // }

                post.comments.id(req.params.commentId).remove();
                post.save()
                    .then((post) => {
                        Post.findById(post._id)
                            .populate('author')
                            .populate('comments.author')
                            .then((post) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(post);
                            })
                    }, (err) => next(err));
            }
            else if(post === null) {
                let err = new Error('Post ' + req.params.postId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                let err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    });


module.exports = postRouter;