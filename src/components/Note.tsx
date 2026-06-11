import React, { useState } from 'react';
import { FileEdit } from 'lucide-react';

const Note: React.FC = () => {
  const [text, setText] = useState('');

  const handleErase = () => {
    setText('');
  };

  return (
    <section className="panel note-panel glass">
      <div className="note-header">
        <div className="note-title-group">
          <FileEdit className="note-icon" size={24} />
          <h2>Temporary Note</h2>
        </div>
      </div>
      <p className="note-subtitle">
        Write something here for yourself. This space does not save or remember.
      </p>
      <div className="textarea-container">
        <textarea
          className="note-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type freely. Nothing here is permanent."
        />
      </div>
      <button className="note-erase-btn" type="button" onClick={handleErase}>
        Erase
      </button>
    </section>
  );
};

export default Note;
