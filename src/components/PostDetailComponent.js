import {Component} from 'react';
import {Card, CardBody, CardSubtitle, CardText, CardTitle} from 'reactstrap';
import Comment from './CommentComponent';
import CommentForm from './CommentFormComponent';
import Option from './OptionComponent';
import { ErrorNotification } from '../utils/notification';
import history from '../utils/history';
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * PostDetail component will recive a post object and render it to the page. 
 * 
 */
class PostDetail extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if(!this.props.post) {
            ErrorNotification("Post doesn't exist!");
            history.push('/home');
        }
    }

    handleClick(e) {
        if(e.target !== e.currentTarget) return;
        window.location = this.props.post.content;
    }

    render() {

        // Make url post's title clickable
        const renderTitle = () => {
            if(this.props.post.isText) {
                return (<CardTitle className="post-title">{this.props.post.title}</CardTitle>);
            } else {
                return (<CardTitle className="post-title" onClick={this.handleClick}>{this.props.post.title}<span className="span-icon"> <FontAwesomeIcon icon={faLink}/> </span></CardTitle>);
            }
        }

        // Don't display the content of url post
        const renderText = () => {
            if(this.props.post.isText) {
                return (<CardText>{this.props.post.content}</CardText>);
            }
        }

        // If logged in, show comment option
        const commentOption = () => {
            if(this.props.cookies.get('user')) {
                return(
                    <CommentForm create postId={this.props.post._id} cookies={this.props.cookies} createComment={this.props.createComment}></CommentForm>
                );
            }
        }

        const renderPost = () => {
            if(this.props.isLoading) {
                return (<h4>Loading ...</h4>);
            } 
            else if(this.props.errMsg) {
                return(<h4>{this.props.errMsg}</h4>);
            }
            else if(this.props.post) {

                return(
                    <ul className="post-item">
                        <Card>
                            <CardBody>
                                {renderTitle()}
                                <CardSubtitle>
                                    <Option 
                                        cookies={this.props.cookies}
                                        post={this.props.post}
                                        removePost={this.props.removePost}
                                    />                                    
                                </CardSubtitle>
                                {renderText()}
                                {commentOption()}
                                <hr/>
                                {renderComments(this.props.post._id, this.props.post.comments)}
                            </CardBody>
                        </Card>                        
                    </ul>
                );                
            }
            else {
                return <div></div>
            }
        }

        const renderComments = (postId, comments) => {
            return(
                comments.map((comment, index) => (
                    <ul className="comment-item" key={index}>
                        <Comment postId={postId} comment={comment} cookies={this.props.cookies} updateComment={this.props.updateComment} removeComment={this.props.removeComment}/>
                    </ul>
                ))
            );
        }

        return(
            <div className="container">
                {renderPost()}
            </div>
        )
    }
}

export default PostDetail;