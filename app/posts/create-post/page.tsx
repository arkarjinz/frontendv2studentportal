// pages/index.tsx
import React from 'react';
import TinyMCEEditor from './TinyMCEEditor'

const Home: React.FC = () => {
    return (
        <div className="container mx-auto">
            <h1>Create Post</h1>
            <TinyMCEEditor />
        </div>
    );
};

export default Home;
