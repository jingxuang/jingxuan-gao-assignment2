import {Component} from 'react';
import {Card, CardBody, CardText, CardTitle} from 'reactstrap';
import Comment from './CommentComponent';
import CommentForm from './CommentFormComponent';
/**
 * PostDetail component will recive a post object and render it to the page. 
 * 
 */
class PostDetail extends Component {

    render() {

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
                                <CardTitle>{this.props.post.title}</CardTitle>
                                <CardText>{this.props.post.content}</CardText>
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