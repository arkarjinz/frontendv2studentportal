import {useState} from "react";

import { Editor, EditorState } from 'draft-js';
export default function TextEditor(){
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);
    };

    console.log('=================',editorState.getCurrentContent().getPlainText());

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}>
            <Editor
                editorState={editorState}
                onChange={handleEditorChange}
            />
        </div>
    );
}