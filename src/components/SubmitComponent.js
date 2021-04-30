import {Component} from 'react';
import {Form, FormGroup, Label, Input, Col, Button} from 'reactstrap';
import { ErrorNotification } from '../utils/notification';
import history from '../utils/history';

class Submit extends Component {


    constructor(props) {
        super(props);

        this.handleSumbit = this.handleSumbit.bind(this);
        this.state = {
            title: this.props.post ? this.props.post.title : "",
            url: this.props.post ? (this.props.post.isText ? "" : this.props.post.content) : "",
            text: this.props.post ? (this.props.post.isText ? this.props.post.content : "") : ""
        }
    }

    handleSumbit(e) {
        e.preventDefault();

        // Url and text cannot be set at the same time 
        if(this.state.url && this.state.text) {
            ErrorNotification("url and text cannot be filled at the same time.")
            return;
        }

        if(!this.state.url && !this.state.text) {
            ErrorNotification("Please fill out the url or the text part.");
            return;
        }

        if(!this.state.title) {
            ErrorNotification("title cannot be empty.")
            return;
        }

        if(this.props.createPost) {
            this.props.createPost(this.props.cookies, this.state.title, (this.state.text ? true : false), (this.state.text ? this.state.text : this.state.url), this.props.cookies.get('user').userId);
        } else if(this.props.updatePost) {
            this.props.updatePost(this.props.cookies, this.props.post._id, this.state.title, (this.state.text ? true : false), (this.state.text ? this.state.text : this.state.url), this.props.cookies.get('user').userId);
        }
    }

    render() {
        // If the user is logged in 
        if(this.props.cookies.get('user') && this.props.cookies.get('user').username) {
            return(
                <Form className="submit-form" onSubmit={this.handleSumbit}>
                    <FormGroup row>
                        <Label for="postTitle" md={1}>title</Label>
                        <Col md={11}>
                            <Input 
                                type="text" 
                                name="title" 
                                id="post-title" 
                                placeholder="Write a title here" 
                                value={this.state.title}
                                onChange={e => this.setState({title: e.target.value})}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="url" md={1}>url</Label>
                        <Col md={11}>
                            <Input 
                                type="url" 
                                name="url" 
                                id="post-url" 
                                placeholder="Write an url here" 
                                value={this.state.url}
                                onChange={e => this.setState({url: e.target.value})}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="text" md={1}>text</Label>
                        <Col md={11}>
                            <Input 
                                type="textarea" 
                                name="text" 
                                id="post-text" 
                                placeholder="Write text here"
                                value={this.state.text}
                                onChange={e => this.setState({text: e.target.value})}
                            />
                        </Col>
                    </FormGroup>                

                    <FormGroup row>
                        <Label md={1}></Label>
                        <Col md={11}>
                            <Button>submit</Button>
                        </Col>
                    </FormGroup>
                </Form>                
            );            
        } else {
            setTimeout(()=>history.push('/home'), 2000);

            return(
                <div>
                    <h4>Unauthorized! You have to login first to submit posts.</h4>
                </div>
                
            );
        }

    }
}

export default Submit;