import {Component} from 'react';
import {Card, CardBody, CardTitle,CardSubtitle} from 'reactstrap';
import CommentForm from './CommentFormComponent';

class Comment extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            editable: false,
        }

        this.editComment = this.editComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }


    editComment() {
        this.setState({
            editable: !this.state.editable
        })
    }

    deleteComment() {
        this.props.removeComment(this.props.cookies, this.props.postId, this.props.comment._id);
    }

    render() {

        const authorOption = () => {
            if(this.props.cookies.get('user') && this.props.cookies.get('user').username === this.props.comment.author.username) {
                return (
                    <>
                        <span className="span-divider"> | </span>
                        <span className="span-option" onClick={this.editComment}>edit</span>
                        <span className="span-divider"> | </span>
                        <span className="span-option" onClick={this.deleteComment}>delete</span>                          
                    </>
                );
            }
        }

        const renderComment = () => {
            if(this.state.editable) {
                return (<CommentForm update cookies={this.props.cookies} postId={this.props.postId} comment={this.props.comment} updateComment={this.props.updateComment} />);
            } else {
                return this.props.comment.comment;
            }
        }
        
        return(
            <Card> 
                <CardBody>
                    <CardTitle>
                        {renderComment()}                    
                    </CardTitle>
                    <CardSubtitle>
                        <span className="span-option">by {this.props.comment.author.username}</span>
                        {authorOption()}
                    </CardSubtitle>
                </CardBody>
            </Card> 
        );
    }
}

export default Comment;