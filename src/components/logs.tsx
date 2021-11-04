/** @jsxImportSource @emotion/react */
import React from 'react';
import { LogLevel } from '../util/types';
import { css } from '@emotion/react';

export interface Props {
  items: Array<{ message: string; level: LogLevel }>;
}

const LogColor: { [level in LogLevel]: string } = {
  log: 'gray',
  warn: 'darkorange',
  error: 'darkred',
};

const Logs = ({ items }: Props) => {
  return (
    <ul css={css({ listStyleType: 'none', margin: '0.5rem', padding: 0, height: '3rem', overflowY: 'scroll' })}>
      {items.map(({ message, level }, idx) => {
        return (
          <li
            key={idx}
            css={css({
              color: LogColor[level],
            })}
          >
            {message}
          </li>
        );
      })}
    </ul>
  );
};

export default Logs;
