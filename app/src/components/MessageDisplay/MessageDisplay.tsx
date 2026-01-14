import { ReactNode } from 'react';

type MessageDisplayProps =
  | {
      message: null;
    }
  | {
      message: {
        type: 'success' | 'error' | 'info';
        text: ReactNode;
      };
    };

const MessageDisplay = ({ message }: MessageDisplayProps) => {
  if (!message) {
    return null;
  }

  return <div>{message.text}</div>;
};

export default MessageDisplay;
