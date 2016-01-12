import "css/FeedEdit.css!";
import React from "react";

export default class FeedEdit extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            feed:
            {
                title: null,
                link: null,
                desc: null,
                next: null,
                id: null
            }
        };
    }

    componentDidMount()
    {
        this.getFeed();
    }

    componentDidUpdate(prevProps)
    {
        var prevId = prevProps.params.id;
        var newId = this.props.params.id;
        if (prevId !== newId) this.getFeed();
    }

    getFeed()
    {
        fetch("/api/feed/" + this.props.params.id)
        .then((feed) => feed.json())
        .then((feed) => this.setState({feed}));
    }

    handleInputChange(event)
    {
        var feed = this.state.feed;
        feed[event.target.name] = event.target.value;

        this.setState({ feed });
    }

    render()
    {
        var handlers = { onChange: this.handleInputChange.bind(this) };
        var feed = this.state.feed;
        return <div className="feedEdit">
            <input name="title" value={feed.title} {...handlers}/><br/>
            <input name="desc"  value={feed.desc}  {...handlers}/><br/>
            <input name="link"  value={feed.link}  {...handlers}/><br/>
            <input name="next"  value={feed.next}  {...handlers}/>
        </div>;
    }
}