import {Component} from 'react';
import Post from './PostComponent';

class Home extends Component {

    constructor(props) {
        super(props);
        this.renderPosts = this.renderPosts.bind(this);
    }
    
    renderPosts(posts, isLoading, errMsg) {
        // Loading
        if(isLoading) {
            return (<h4>Loading ... </h4>); 
        } 
        // Error 
        else if (errMsg) {
            return(<h4> {errMsg} </h4>)
        } 
        // Render posts 
        else {
            return(
                posts.map((post, index) => (
                    <ul className="post-item" key={index}>
                        <Post post={post} cookies={this.props.cookies} removePost={this.props.removePost}/>
                    </ul>
                ))
            )
        }
    }
    
    render() {
        return (
            <div className="post-container">
                {this.renderPosts(this.props.posts, this.props.isLoading, this.props.errMsg)}
            </div>
        );
    }
}

export default Home;