import type { ReactNode } from "react";

export function Accent({ text, phrase }: { text: string; phrase: string }) {
  const start = text.indexOf(phrase);
  if (start < 0) return text;

  return <>{text.slice(0, start)}<span className="text-accent">{phrase}</span>{text.slice(start + phrase.length)}</>;
}

export function Slashes({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`slashes ${className}`} />;
}

export function SectionHeading({ label, children, description, centered = false }: {
  label: string;
  children: ReactNode;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <p className={`eyebrow ${centered ? "eyebrow-center" : ""}`}>
        <Slashes />
        {label}
      </p>

      <h2 className="section-title mt-5 ">{children}</h2>
      
      {description && <p className={`body-copy text-[clamp(0.9rem,1.2vw,1.3rem)] mt-4 ${centered ? "mx-auto max-w-5xl" : ""}`}>{description}</p>}
    </div>
  );
}
