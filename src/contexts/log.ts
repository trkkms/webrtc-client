import React, { useContext } from 'react';
import { LogLevel } from '../util/types';

const LoggerContext = React.createContext<(message: string, level?: LogLevel) => void>(() => {});

export const useLogger = (): ((message: string, level?: LogLevel) => void) => {
  return useContext(LoggerContext);
};

export default LoggerContext;
