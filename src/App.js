import {Component} from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from './utils/history';
import Main from './components/MainComponent';
import { configureStore } from './redux/configureStore';
import { CookiesProvider, withCookies } from 'react-cookie';
import ReactNotification from 'react-notifications-component';
import './App.css'

const store = configureStore();
class App extends Component {
    render() {
        return (
            <CookiesProvider>
                <Provider store={store}>
                    <Router history={history}>
                        <div className="App">
                            <ReactNotification />
                            <Main cookies={this.props.cookies}/>
                        </div>
                    </Router> 
                </Provider>                
            </CookiesProvider>
        );
    }
}

export default withCookies(App);