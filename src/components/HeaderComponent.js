import {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {Navbar, Collapse, NavbarToggler, NavItem, Nav, Modal, Button, ModalHeader, ModalBody, Form, FormGroup, Col, Input, Label} from 'reactstrap';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Header extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isNavOpen: false,
            isLoginModalOpen: false,
            isSignupModalOpen: false
        }

        this.toggleNav = this.toggleNav.bind(this);

        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.toggleSignupModal = this.toggleSignupModal.bind(this);

        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleLoginModal() {
        this.setState({
            isLoginModalOpen: !this.state.isLoginModalOpen
        });
    }

    toggleSignupModal() {
        this.setState({
            isSignupModalOpen: !this.state.isSignupModalOpen
        });
    }

    handleLogin(e) {
        e.preventDefault();
        this.props.login(this.props.cookies, this.username.value, this.password.value);
        this.toggleLoginModal();
    }

    handleSignUp(e) {
        e.preventDefault();
        this.props.signup(this.props.cookies, this.username.value, this.password.value);
        this.toggleSignupModal();
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.logout(this.props.cookies);
    }

    render() {

        // Submit navbar shows up only if the user is logged in
        const submitStatus = () => {
            if(this.props.cookies.get('user')) {
                return(
                    <NavItem>
                        <NavLink className="nav-link" to='/submit'>submit</NavLink>
                    </NavItem>                                         
                );
            }
        }

        // Check if the user is logged in 
        const loginStatus = () => {
            if(this.props.cookies.get('user')) {
                return (
                    <Nav navbar>
                        <NavItem>
                            <Button outline> <FontAwesomeIcon icon={faUser}/> {this.props.cookies.get('user').username}</Button>
                        </NavItem>
                        <NavItem>
                            <Button outline onClick={this.handleLogout}>Logout</Button>
                        </NavItem>
                    </Nav>
                );
            } else {
                return(                
                    <Nav navbar>
                        <NavItem> 
                            <Button outline onClick={this.toggleLoginModal} > Login </Button>
                        </NavItem>
                        <NavItem>
                            <Button outline onClick={this.toggleSignupModal} > Sign Up </Button>
                        </NavItem>
                    </Nav>
                );
            }
        }

        return (
            <>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarToggler onClick={this.toggleNav} />
                    <Collapse isOpen={this.state.isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to='/home'>home</NavLink>
                            </NavItem>
                            {submitStatus()}
                        </Nav>
                    </Collapse>

                    {loginStatus()}
                </div>
            </Navbar>

            <Modal className="login-modal" isOpen={this.state.isLoginModalOpen} toggle={this.toggleLoginModal}>
                <ModalHeader> Login </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.handleLogin}>
                        <FormGroup row>
                            <Label htmlFor="username" md={2}>username</Label>
                            <Col md={10}>
                                <Input type="text" id="username" name="username" innerRef={(input) => this.username = input} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="password" md={2}>password</Label>
                            <Col md={10}>
                                <Input type="password" id="password" name="password" innerRef={(input) => this.password = input}/>
                            </Col>
                        </FormGroup>
                        <Button type="submit" value="login">Login</Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal className="signup-modal" isOpen={this.state.isSignupModalOpen} toggle={this.toggleSignupModal}>
                <ModalHeader> Sign Up </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.handleSignUp}>
                        <FormGroup row>
                            <Label htmlFor="username" md={2}>username</Label>
                            <Col md={10}>
                                <Input type="text" id="username" name="username" innerRef={(input) => this.username= input} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="password" md={2}>password</Label>
                            <Col md={10}>
                                <Input type="password" id="password" name="password" innerRef={(input) => this.password = input}/>
                            </Col>
                        </FormGroup>
                        <Button type="submit" value="signup">Signup</Button>
                    </Form>
                </ModalBody>
            </Modal>
            </>
        );
    }
}

export default Header;