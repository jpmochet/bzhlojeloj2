'use client';

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SearchParamsClient() {
  const params = useSearchParams();

  const cityParam = params.get("city") || "";

  const queryCities = useMemo(() => {
    return cityParam
      ? cityParam.split(',').map((c) => c.trim()).filter(Boolean).map((c) => c.toLowerCase())
      : [];
  }, [cityParam]);

  return queryCities;
}
