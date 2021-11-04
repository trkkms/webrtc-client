/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
export interface Props {
  children?: React.ReactElement | null;
}

const Layout = ({ children }: Props) => {
  return (
    <div
      css={css({
        display: 'flex',
        justifyContent: 'center',
      })}
    >
      {children}
    </div>
  );
};

export default Layout;
