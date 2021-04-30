import {Component} from 'react';
import {Form, FormGroup, Input, Button} from 'reactstrap';
import {ErrorNotification} from '../utils/notification';


// Render a comment form inside the post detailPage 
class CommentForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comment: this.props.comment ? this.props.comment.comment : ""
        }
        this.handleSumbit = this.handleSumbit.bind(this);
    }

    handleSumbit(e) {
        e.preventDefault();

        if(!this.state.comment) {
            ErrorNotification("comment cannot be empty.")
            return;
        }

        if(this.props.update) {
            this.props.updateComment(this.props.cookies, this.props.postId, this.props.comment._id, this.state.comment);
        } else if(this.props.create) {
            this.props.createComment(this.props.cookies, this.props.postId, this.props.cookies.get('user').userId, this.state.comment);
        }
    }

    render() {


        const buttonValue = () => {
            return this.props.create ? "Add comment" : "Update comment";
        }

        return(
            <Form className="submit-form" onSubmit={this.handleSumbit}>
            <FormGroup>
                <Input 
                    type="textarea" 
                    name="comment" 
                    id="comment-text"
                    value={this.state.comment}
                    onChange={e => this.setState({comment: e.target.value})}
                />
            </FormGroup>
            <Button>{buttonValue()}</Button>
        </Form>
        );
    }
}

export default CommentForm;