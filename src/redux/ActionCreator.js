import * as ActionTypes from './ActionTypes';
import history from '../utils/history';
import {ErrorNotification} from '../utils/notification';

export const fetchPosts = () => (dispatch) => {
    dispatch(postLoading());

    return fetch('/api/posts')
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Error ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, (error) => {
            throw new Error(error.message);
        })
        .then(res => res.json())
        .then(posts => dispatch(addPosts(posts)))
        .catch(error => dispatch(postFailed(error.message)));
}

export const createPost = (cookies, title, isText, content, authorId) => (dispatch) => {
    const newPost = {
        title: title,
        content: content,
        isText: isText,
        author: authorId,
        comments: []
    }
    return fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + cookies.get('user').token
        }
    })
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, error => {return new Error(error.message)})
        .then(res => res.json())
        .then(post => { // If success, redirect
            dispatch(addPosts(post));
            history.push('/post/' + post._id);
        })
        .catch(error => {
            console.log('addPost Error: ' + error.message);
            ErrorNotification(error.message);
        });
}

export const updatePost = (cookies, postId, title, isText, content, authorId) => (dispatch) => {
    const nPost = {
        title: title,
        content: content,
        isText: isText,
        author: authorId,
    }

    return fetch('/api/posts/' + postId, {
        method: 'PUT',
        body: JSON.stringify(nPost),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + cookies.get('user').token
        }
    })
            .then(res => {
                if(res.ok) {
                    return res;
                } else {
                    let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                    error.response = res;
                    throw error;
                }
            }, error => {
                return new Error(error.message);
            })
            .then(res => res.json())
            .then(post => {
                dispatch(updatePosts(post));
                history.push('/post/' + post._id);
            })
            .catch(error => {
                console.log('updatePost Error: ' + error.message);
                ErrorNotification(error.message);
            });
}

export const removePost = (cookies, postId) => (dispatch) => {
    return fetch('/api/posts/' + postId, {
        method: 'DELETE',
        headers: {
            "Authorization": 'Bearer ' + cookies.get('user').token
        }
    })
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, error => {
            return new Error(error.message);
        })
        .then(res => res.json())
        .then(post => dispatch(deletePosts(post)))
        .catch(error => {
            console.log('removePost Error: ' + error.message);
            ErrorNotification('Delete post failed: ' + error.message);
        });
}

export const createComment = (cookies, postId, authorId, comment) => (dispatch) => {
    const newComment = {
        author: authorId,
        comment:  comment
    }

    return fetch('/api/posts/' + postId + '/comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + cookies.get('user').token
        }
    })
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, error => {
            return new Error(error.message);
        })
        .then(res => res.json())
        .then(post => dispatch(updatePosts(post)))
        .catch(error => {
            console.log('createComment Error: ' + error.message);
            ErrorNotification(error.message);
        });

}

export const updateComment = (cookies, postId, commentId, comment) => (dispatch) => {
    const nComment = {
        comment: comment
    }

    return fetch('/api/posts/' + postId + '/comments/' + commentId, {
        method: 'PUT',
        body: JSON.stringify(nComment),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + cookies.get('user').token
        }
    })
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, error => {
            return new Error(error.message);
        })
        .then(res => res.json())
        .then(post => dispatch(updatePosts(post)))
        .catch(error => console.log('updateComment Error: ' + error.message));
}

export const removeComment = (cookies, postId, commentId) => (dispatch) => {
    return fetch('/api/posts/' + postId + '/comments/' + commentId, {
        method: 'DELETE',
        headers: {
            "Authorization": 'Bearer ' + cookies.get('user').token
        }
    })
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, error => {
            return new Error(error.message);
        })
        .then(res => res.json())
        .then(() => dispatch(deleteComment(postId, commentId)))
        .catch(error => console.log('removeComment Error: ' + error.message));
}


export const signup = (cookies, username, password) => (dispatch) => {

        const newUser = {
            username: username,
            password: password
        }

        return fetch('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if(res.ok) { // Signup succeed, then login the user
                    return;
                } else {
                    let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                    error.response = res;
                    throw error;
                }
            }, error => {
                return new Error(error.message);
            })
            .then(() => dispatch(login(cookies, username, password)))
            .catch(error => {
                console.log('signup error: ' + error.message);
                ErrorNotification(error.message);
            })
}

export const login = (cookies, username, password) => (dispatch) => {
    const user = {
        username: username,
        password: password
    }

    return fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, error => {
            return new Error(error.message);
        })
        .then(res => res.json())
        .then(res => { // Login successfully, redirect to home page
            cookies.set('user', {username: username, token: res.token, userId: res.userId}, {path: '/'});
            //history.push('/home');
        })
        .catch(error => {
            console.log(error.message);
            ErrorNotification(error.message);
        })
}

export const logout = (cookies) => (dispatch) => {
    return fetch('/api/users/logout', {
        method: 'POST',
        headers: {
            "Authorization": 'Bearer ' + cookies.get('user').token
        }
    })
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                let error = new Error('Status: ' + res.status + ': ' + res.statusText);
                error.response = res;
                throw error;
            }
        }, error => {
            return new Error(error.message);
        })
        .then(() => cookies.remove('user'))
        .catch(error => {
            console.log(error.message);
            ErrorNotification(error.message);
        })
}



export const addPosts = (posts) => ({
    type: ActionTypes.ADD_POST,
    payload: posts
});

export const updatePosts = (post) => ({
    type: ActionTypes.UPDATE_POST,
    payload: post
});

export const deletePosts = (post) => ({
    type: ActionTypes.DELETE_POST,
    payload: post._id
});

export const postLoading = () => ({
    type: ActionTypes.LOAD_POST
});

export const postFailed = (errMsg) => ({
    type: ActionTypes.POST_FAILED,
    payload: errMsg
});

export const deleteComment = (postId, commentId) => ({
    type: ActionTypes.DELETE_COMMENT,
    postId: postId,
    commentId: commentId
});