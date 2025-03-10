import React, { useState } from 'react';
import '../App.css';

function ToDo(){
    // variables
    const work = "it's work";

    const [content, setContent] = useState('content')

    function handleClick(){
        setContent('new content')
    }

    // frame
    return (
        <>
            <div>{work}</div>
            <div>{content}</div>
            <button onClick={handleClick}>button</button>
        </>
    )
}

export default ToDo;