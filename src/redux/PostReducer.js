import * as ActionTypes from './ActionTypes';

/**
 * post: {
 *  id: '',
 *  type: '', // Text Blob, or link 
 *  author: '',
 *  last_activity_author: '',
 *  last_activity_type: '',
 *  last_activity_time: ''
 * }
 */
export const PostReducer = (state = {
    isLoading: false,
    errMsg: null,
    posts: []
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_POST:
            return {
                isLoading: false,
                errMsg: null, 
                posts: action.payload.concat(state.posts)
            };
        case ActionTypes.UPDATE_POST:
            return {
                isLoading: false,
                errMsg: null,
                posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post)
            };
        case ActionTypes.DELETE_POST: 
            return {
                isLoading: false,
                errMsg: null,
                posts: state.posts.filter(post => post._id !== action.payload)
            }
        case ActionTypes.LOAD_POST:
            return {
                isLoading: true,
                errMsg: null,
                posts: []
            };
        case ActionTypes.POST_FAILED:
            return {
                isLoading: false,
                errMsg: action.payload,
                posts: []
            }
        case ActionTypes.DELETE_COMMENT:
            return {
                isLoading: false,
                errMsg: null,
                posts: state.posts.map((post) => {
                    if(post._id === action.postId) {
                        post.comments = post.comments.filter(comment => comment._id !== action.commentId);
                        return post;
                    }
                    return post;
                })
            }
        default: 
            return state;
    }
};