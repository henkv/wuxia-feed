import "necolas/normalize.css";
import "/css/app.css!";

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router";
import createBrowserHistory from "history/lib/createBrowserHistory";

import FeedList from "./components/FeedList";
import FeedEdit from "./components/FeedEdit";

var history = createBrowserHistory();

class App extends React.Component
{
    render()
    {
        return <div className="app">
            <FeedList active={this.props.params.id}/>
            {this.props.children}
        </div>;
    }
}

ReactDOM.render(<Router history={history}>
    <Route path="/" component={App}>
        <Route path="edit/:id" component={FeedEdit}/>
    </Route>
</Router>, document.getElementById("app"));