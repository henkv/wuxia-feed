import "css/FeedItem.css!";
import React from "react";
import { Link } from "react-router";

export default class FeedItem extends React.Component
{
    render()
    {
        var { title, id } = this.props.data;
        var { selected } = this.props;

        var className = "feedItem";
        if (selected) className += " feedItem_selected";

        return <div className={className}>
            <Link to={`/edit/${id}`}>{title}</Link>
        </div>;
    }
}