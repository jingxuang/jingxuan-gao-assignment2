import {Component} from 'react';
import { Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';
import history from '../utils/history';
import { faLink, faGripLinesVertical} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Option from './OptionComponent';

class Post extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
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

        const postIcon = () => {
            if(!this.props.post.isText) {
                return (<span className="span-icon"><FontAwesomeIcon icon={faLink}/></span>);
            }
        }

        return(
            <Card> 
            <CardBody>
                <CardTitle className="post-title" onClick={this.handleClick}>
                    {this.props.post.title} {postIcon()}
                </CardTitle>
                <CardSubtitle>
                        <Option 
                            cookies={this.props.cookies}
                            post={this.props.post}
                            removePost={this.props.removePost}
                        />
                        <span className="span-icon"> <FontAwesomeIcon icon={faGripLinesVertical}  size="xs"/> </span>
                        <span className="span-option" onClick={this.goComment}> {commentOption()} </span>
                </CardSubtitle>
            </CardBody>
        </Card>  
        );
    }
}

export default Post;