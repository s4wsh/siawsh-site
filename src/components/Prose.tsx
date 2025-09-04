// src/components/Prose.tsx
import { PropsWithChildren } from "react";

export default function Prose({ children }: PropsWithChildren) {
  return (
    <div className="prose prose-zinc max-w-none
                    prose-headings:scroll-mt-20
                    prose-p:leading-relaxed
                    prose-img:rounded-xl
                    prose-figure:text-center
                    dark:prose-invert">
      {children}
    </div>
  );
}
