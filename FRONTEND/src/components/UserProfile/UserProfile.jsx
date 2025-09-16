import React from 'react';
import "./userProfile.css"

export default function UserProfile({ username, onClick }) {
    return (
        <div
            className="user-profile"
            onClick={onClick}
            title={`(@${username})`}
        >
            <div className="user-username">@{username}</div>
        </div>
    );
}
