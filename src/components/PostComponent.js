import {Component} from 'react';
import { Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';
import history from '../utils/history';
import TimeAgo from 'timeago-react';

class Post extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.updatePost = this.updatePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        
        this.goComment = this.goComment.bind(this);
    }

    handleClick(e) {
        if(e.target !== e.currentTarget) return;

        if(this.props.post.isText) {
            history.push('/post/' + this.props.post._id);
        } else {
            window.location = this.props.post.content;
        }
    }

    updatePost() {
        history.push('/submit/' + this.props.post._id);
    }

    deletePost() {
        this.props.removePost(this.props.cookies, this.props.post._id);
    }

    goComment() {
        history.push('/post/' + this.props.post._id);
    }

    render() {

        const commentOption = () => {
            if(this.props.post.comments.length === 0) {
                return 'discuss';
            } else {
                return this.props.post.comments.length + ' comments';
            }
        }

        const authorOption = () => {
            if(this.props.cookies.get('user') && this.props.cookies.get('user').username === this.props.post.author.username) {
                return (
                    <>
                        <span className="span-info"> | </span>
                        <span className="span-option" onClick={this.updatePost}>edit</span>
                        <span className="span-info"> | </span>
                        <span className="span-option" onClick={this.deletePost}>delete</span>
                    </>
                );
            }
        }

        return(
            <Card> 
            <CardBody>
                <CardTitle className="post-title" onClick={this.handleClick}>
                    {this.props.post.title}
                </CardTitle>
                <CardSubtitle>
                        <span className="span-info"> by </span>
                        <span className="span-option">{this.props.post.author.username}</span>
                        <span className="span-info"> <TimeAgo datetime={this.props.post.createdAt}/></span>
                        {authorOption()}
                        <span className="span-info"> | </span>
                        <span className="span-option" onClick={this.goComment}> {commentOption()} </span>
                </CardSubtitle>
            </CardBody>
        </Card>  
        );
    }
}

export default Post;