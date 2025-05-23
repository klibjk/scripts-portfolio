import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ScriptDetail } from "@/components/ScriptDetail";
import { ScriptWithDetails } from "@shared/schema";
import { logAgentAction } from "@/lib/logging";

export default function ScriptDetailPage() {
  const [, params] = useRoute<{ key: string }>("/scripts/:key");
  const scriptKey = params?.key;

  const { data: script, isLoading, error } = useQuery<ScriptWithDetails>({
    queryKey: [`/api/scripts/key/${scriptKey}`],
    enabled: !!scriptKey,
  });

  useEffect(() => {
    if (script) {
      logAgentAction("Script View", `User viewed script: ${script.title} (${script.key})`);
    }
  }, [script]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error ? `Error loading script: ${(error as Error).message}` : `Script not found: ${scriptKey}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ScriptDetail script={script} />;
}
