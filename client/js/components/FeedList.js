import "css/FeedList.css!";
import React from "react";
import { Link } from "react-router";

import FeedItem from "./FeedItem";

export default class FeedList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { feeds: [] };
    }

    componentDidMount()
    {
        fetch("/api/feeds")
        .then((feeds) => feeds.json())
        .then((feeds) => this.setState({feeds}));
    }

    render()
    {
        var { active } = this.props;

        var feeds = this.state.feeds.map((feed) =>
            <FeedItem
                key={feed.id}
                selected={feed.id === active}
                data={feed}/>
        );

        return <div className="feedList">
            {feeds}
        </div>;
    }
}