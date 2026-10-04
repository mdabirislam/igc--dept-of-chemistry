"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";

import { useAssetGate } from "@/hooks/useAssetGate";

type TrackedImageProps = ImageProps & {
  /** Unique name; the splash screen waits for this image. */
  assetId: string;
};

export default function TrackedImage({
  assetId,
  onLoad,
  onError,
  alt,
  ...props
}: TrackedImageProps) {
  const done = useAssetGate(assetId);
  const ref = useRef<HTMLImageElement>(null);

  // The image may already be in the browser cache and finished loading
  // before React attached the onLoad handler.
  useEffect(() => {
    if (ref.current?.complete) done();
  }, [done]);

  return (
    <Image
      {...props}
      alt={alt}
      ref={ref}
      onLoad={(event) => {
        onLoad?.(event);
        done();
      }}
      onError={(event) => {
        onError?.(event);
        done();
      }}
    />
  );
}
