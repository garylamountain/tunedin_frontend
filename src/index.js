import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from './registerServiceWorker';

class MyApp extends React.Component {

    state = {
        preview_url: ""
    }

    changePreviewUrl = preview_url => {
        this.setState({preview_url})
    }

    render(){
        document.querySelector('audio').src = this.state.preview_url
        return(
        <Router>
            <App preview_url={this.state.preview_url} changePreviewUrl={this.changePreviewUrl}/>
        </Router>
        );
    }
}


ReactDOM.render(<MyApp />, document.getElementById('root'));
registerServiceWorker();
