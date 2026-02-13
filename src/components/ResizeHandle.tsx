"use client";

import { useCallback, useEffect, useRef } from "react";

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function ResizeHandle({ onResize, onDragStart, onDragEnd }: ResizeHandleProps) {
  const dragging = useRef(false);
  const startX = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      onDragStart();
    },
    [onDragStart]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      startX.current = e.clientX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      onDragEnd();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onResize, onDragEnd]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className="group absolute top-0 left-0 bottom-0 z-10 flex w-[7px] -translate-x-1/2 cursor-col-resize items-center justify-center"
    >
      <div className="h-8 w-[3px] rounded-full bg-b2 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
