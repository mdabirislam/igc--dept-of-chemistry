"use client";

import { useCallback, useEffect } from "react";

import { addPending, donePending } from "@/lib/loadingGate";

/**
 * Registers an asset the splash screen should wait for.
 * Call the returned function when the asset has loaded (or failed).
 */
export function useAssetGate(id: string) {
  useEffect(() => {
    addPending(id);

    return () => donePending(id);
  }, [id]);

  return useCallback(() => donePending(id), [id]);
}
