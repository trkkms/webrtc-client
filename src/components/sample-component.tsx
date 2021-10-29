/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { range } from '../util/list';

export interface Props {
  text: string;
}

const SampleComponent = ({ text }: Props) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        css={{ minWidth: 200 }}
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        {`Count: ${count}`}
      </button>
      <ul
        css={css({
          listStyleType: 'none',
          display: 'flex',
          margin: 0,
          padding: 0,
          flexWrap: 'wrap',
        })}
      >
        {Array.from(range(count)).map((v) => (
          <li key={v}>{text}</li>
        ))}
      </ul>
    </div>
  );
};

export default SampleComponent;
