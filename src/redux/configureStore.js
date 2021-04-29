import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {PostReducer} from './PostReducer';

export const configureStore = () => {
    const store = createStore(combineReducers({
        posts: PostReducer,
        // user: UserReducer
    }), applyMiddleware(logger, thunk));
    return store;
}