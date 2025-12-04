type ToastLevel = "info" | "success" | "error";

export interface ToastMessage {
  id: number;
  level: ToastLevel;
  title?: string;
  message: string;
}

type Subscriber = (msg: ToastMessage) => void;

let subscribers: Subscriber[] = [];
let counter = 0;

export const toast = {
  subscribe(fn: Subscriber) {
    subscribers.push(fn);
    return () => {
      subscribers = subscribers.filter((s) => s !== fn);
    };
  },
  show(level: ToastLevel, message: string, title?: string) {
    const msg: ToastMessage = { id: ++counter, level, message, title };
    subscribers.forEach((s) => s(msg));
  },
  info(message: string, title?: string) {
    toast.show("info", message, title);
  },
  success(message: string, title?: string) {
    toast.show("success", message, title);
  },
  error(message: string, title?: string) {
    toast.show("error", message, title);
  },
};
