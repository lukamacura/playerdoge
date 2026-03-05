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
    if (typeof window === "undefined") return;

    const open = () => {
      window.tidioChatApi.open();
      window.tidioChatApi.messageFromVisitor(message);
    };

    if (window.tidioChatApi) {
      open();
    } else {
      document.addEventListener("tidioChat-ready", open, { once: true });
    }
  }, []);

  return { openChatWithMessage };
}
