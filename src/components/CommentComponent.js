import {Component} from 'react';
import {Card, CardBody, CardTitle,CardSubtitle} from 'reactstrap';
import CommentForm from './CommentFormComponent';
import TimeAgo from 'timeago-react';
import { faGripLinesVertical, faAt, faClock} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// To render a piece of comment with detailed options based on user's status
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

        // Show author options 
        const authorOption = () => {
            if(this.props.cookies.get('user') && this.props.cookies.get('user').username === this.props.comment.author.username) {
                return (
                    <>
                        <span className="span-icon"> <FontAwesomeIcon icon={faGripLinesVertical} size="xs"/> </span>
                        <span className="span-option" onClick={this.editComment}>edit</span>
                        <span className="span-icon"> <FontAwesomeIcon icon={faGripLinesVertical} size="xs"/> </span>
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
                        <span className="span-icon"> <FontAwesomeIcon icon={faAt} size="xs"/> </span>
                        <span className="span-option">{this.props.comment.author.username}</span>
                        <span className="span-info"> <FontAwesomeIcon icon={faClock} /> <TimeAgo datetime={this.props.comment.createdAt}/></span>
                        {authorOption()}
                    </CardSubtitle>
                </CardBody>
            </Card> 
        );
    }
}

export default Comment;