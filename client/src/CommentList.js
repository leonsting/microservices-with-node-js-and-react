import React from "react";

export default ({ comments = [] }) => {
    const statusClass = (status) => {
        switch (status) {
            case "approved":
                return "text-success";
            case "pending":
                return "text-warning";
            case "rejected":
                return "text-danger";
            default:
                return "text-primary";
        }
    };
    const renderedComments = comments.map((comment) => {
        return (
            <li className={statusClass(comment.status)} key={comment.id}>
                {comment.content}
            </li>
        );
    });

    return <ul>{renderedComments}</ul>;
};
