"use client";

import dynamic from "next/dynamic";

const WealthAccelerator = dynamic(() => import("./WealthAccelerator"), { ssr: false });

export default function WealthAcceleratorWrapper() {
  return <WealthAccelerator />;
}
