// src/components/WorkSceneClient.tsx
"use client";
import dynamic from "next/dynamic";

const WorkScene = dynamic(() => import("./WorkScene"), {
  ssr: false,
  loading: () => <div className="h-64 md:h-80 rounded-xl border bg-mist animate-pulse" />,
});

// DO NOT CHANGE PUBLIC PROPS
// TODO(siawsh): Keep wrapper props transparent to `WorkScene`; replace `any` with exported `WorkSceneProps` if added.
export default function WorkSceneClient(props: any) {
  return <WorkScene {...props} />;
}
