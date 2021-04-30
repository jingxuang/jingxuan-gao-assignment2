import {Component} from 'react';
import TimeAgo from 'timeago-react';
import history from '../utils/history';
import { faGripLinesVertical, faAt, faClock} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// This is an option component for post
class Option extends Component {

    constructor(props) {
        super(props);

        this.updatePost = this.updatePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    updatePost() {
        history.push('/submit/' + this.props.post._id);
    }

    deletePost() {
        this.props.removePost(this.props.cookies, this.props.post._id);
    }

    render() {
        const authorOption = () => {
            if(this.props.cookies.get('user') && this.props.cookies.get('user').username === this.props.post.author.username) {
                return (
                    <>
                        <span className="span-icon"> <FontAwesomeIcon icon={faGripLinesVertical} size="xs"/> </span>
                        <span className="span-option" onClick={this.updatePost}>edit</span>
                        <span className="span-icon"> <FontAwesomeIcon icon={faGripLinesVertical} size="xs"/> </span>
                        <span className="span-option" onClick={this.deletePost}>delete</span>
                    </>
                );
            }
        }

        return(
            <>
                <span className="span-icon"> <FontAwesomeIcon icon={faAt} size="xs"/> </span>
                <span className="span-option">{this.props.post.author.username}</span>
                <span className="span-info"> <FontAwesomeIcon icon={faClock} /> <TimeAgo datetime={this.props.post.createdAt}/></span>
                {authorOption()}
            </>
        );
    }
}

export default Option;