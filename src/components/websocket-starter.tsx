import React, { useState } from 'react';

export interface Props {
  onWebsocketStart: (url: string) => void;
}

const WebsocketStarter = ({ onWebsocketStart }: Props) => {
  const [url, setURL] = useState('');
  return (
    <div>
      <label>
        <span>URL:</span>
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setURL(e.currentTarget.value);
          }}
        />
      </label>
      <button onClick={() => onWebsocketStart(url)}>Connect</button>
    </div>
  );
};

export default WebsocketStarter;
