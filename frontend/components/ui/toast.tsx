"use client";

import { toast, ToastMessage } from "@/lib/hooks/toast";
import { useEffect, useState } from "react";

export function ToastViewport() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((msg) => {
      setItems((prev) => [...prev, msg]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== msg.id));
      }, 4500);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={
            "min-w-[280px] max-w-sm rounded-lg shadow px-4 py-3 border " +
            (item.level === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : item.level === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-gray-50 border-gray-200 text-gray-800")
          }
        >
          {item.title && (
            <div className="font-semibold mb-0.5">{item.title}</div>
          )}
          <div className="text-sm">{item.message}</div>
        </div>
      ))}
    </div>
  );
}
