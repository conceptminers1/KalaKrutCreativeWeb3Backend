import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LogEntry {
  timestamp: string;
  message: string;
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [{ timestamp, message }, ...prevLogs]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};