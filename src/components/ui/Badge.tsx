import React from "react";

interface BadgeProps {
  text: string;
  subText?: string;
  color?: "accent" | "primary";
}

export default function Badge({ text, subText, color = "accent" }: BadgeProps) {
  return (
    <div className={`inline-flex flex-col items-center justify-center px-4 py-2 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
      color === "accent" ? "bg-accent text-black" : "bg-black text-white"
    }`}>
      <span className="text-xs font-bold tracking-widest leading-none">
        {text}
      </span>
      {subText && (
        <span className="text-[9px] uppercase mt-0.5 leading-none">
          {subText}
        </span>
      )}
    </div>
  );
}
