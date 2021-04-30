import {Component} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import {createComment, createPost, fetchPosts, removeComment, removePost, updateComment, updatePost, login, logout, signup} from '../redux/ActionCreator';
import Submit from './SubmitComponent';
import PostDetail from './PostDetailComponent';

const mapStateToProps = (state, ownProps) => ({
    posts: state.posts,
    cookies: ownProps.cookies
})

const mapDispatchToProps = dispatch => ({
    fetchPosts: () => {dispatch(fetchPosts())},
    createPost: (cookies, title, isText, content, authorId) => {dispatch(createPost(cookies, title, isText, content, authorId))},
    updatePost: (cookies, postId, title, isText, content, authorId) => {dispatch(updatePost(cookies, postId, title, isText, content, authorId))},
    removePost: (cookies, postId) => {dispatch(removePost(cookies, postId))},

    createComment: (cookies, postId, authorId, comment) => {dispatch(createComment(cookies, postId, authorId, comment))},
    updateComment: (cookies, postId, commentId, comment) => {dispatch(updateComment(cookies, postId, commentId, comment))},
    removeComment: (cookies, postId, commentId) => {dispatch(removeComment(cookies, postId, commentId))},

    signup: (cookies, username, password) => {dispatch(signup(cookies, username, password))},
    login: (cookies, username, password) => {dispatch(login(cookies, username, password))},
    logout: (cookies) => {dispatch(logout(cookies))}
})

class Main extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }

    render() {
        const Homepage = () => {
            return (<Home 
                posts={this.props.posts.posts}
                isLoading={this.props.posts.isLoading}
                errMsg={this.props.posts.errMsg}
                createPost={this.props.createPost}
                removePost={this.props.removePost}
                cookies={this.props.cookies}
            />);
        }
        const PostThread = ({match}) => {
            return (
                <PostDetail 
                    isLoading={this.props.posts.isLoading}
                    errMsg={this.props.posts.errMsg}
                    post={this.props.posts.posts.filter((post) => post._id === match.params.postId)[0]}
                    removePost={this.props.removePost}
                    updateComment={this.props.updateComment}
                    createComment={this.props.createComment}
                    removeComment={this.props.removeComment}
                    cookies={this.props.cookies}
                />
            );
        }

        const PostEditPage = ({match}) => {
            return (
                <Submit 
                    edit
                    cookies={this.props.cookies}
                    updatePost={this.props.updatePost}
                    post={this.props.posts.posts.filter((post) => post._id === match.params.postId)[0]}
                />
            );
        }

        return (
            <div>
                <Header cookies={this.props.cookies} signup={this.props.signup} login={this.props.login} logout={this.props.logout}/>
                <Switch>
                    <Route exact path='/home' component={Homepage}/>
                    <Route exact path='/post/:postId' component={PostThread} />
                    <Route exact path='/submit' component={() => <Submit cookies={this.props.cookies} createPost={this.props.createPost} />}/>
                    <Route exact path='/submit/:postId' component={PostEditPage} />
                    <Redirect to='/home' />
                </Switch>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

