declare global {
  interface Window {
    tidioChatApi: {
      open: () => void;
      close: () => void;
      reset: () => void;
      setVisitorData: (data: { name?: string; email?: string }) => void;
      messageFromVisitor: (message: string) => void;
    };
  }
}

import { useCallback } from "react";

export function useTidio() {
  const openChatWithMessage = useCallback((message: string) => {
    if (typeof window !== "undefined" && window.tidioChatApi) {
      window.tidioChatApi.open();
      window.tidioChatApi.messageFromVisitor(message);
    } else {
      console.warn("Tidio API not ready yet.");
    }
  }, []);

  return { openChatWithMessage };
}
