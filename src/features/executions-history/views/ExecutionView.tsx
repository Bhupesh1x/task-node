"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";

import { ExecutionStatus } from "@/generated/prisma";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";

import { useSuspenseExecution } from "../hooks/useExecutions";

interface Props {
  executionId: string;
}

const executionIconMap: Record<ExecutionStatus, React.ReactNode> = {
  [ExecutionStatus.RUNNING]: (
    <Loader2Icon className="size-5 text-blue-600 animate-spin" />
  ),
  [ExecutionStatus.SUCCESS]: (
    <CheckCircle2Icon className="size-5 text-green-600" />
  ),
  [ExecutionStatus.FAILED]: <XCircleIcon className="size-5 text-red-600" />,
};

export function ExecutionView({ executionId }: Props) {
  const { data: execution } = useSuspenseExecution(executionId);

  const { open } = useSidebar();

  const [showStackTrace, setShowStackTrace] = useState(false);

  const StatusIcon = executionIconMap[execution?.status];

  const formattedStatus = useMemo(() => {
    return (
      execution?.status?.charAt(0) +
        execution?.status?.slice(1)?.toLowerCase() ||
      execution?.status ||
      ""
    );
  }, [execution?.status]);

  const duration = useMemo(() => {
    return execution?.completedAt
      ? Math.round(
          new Date(execution?.completedAt).getTime() -
            new Date(execution?.startedAt).getTime()
        ) / 1000
      : null;
  }, [execution?.completedAt, execution?.startedAt]);

  return (
    <div className="p-4 md:py-4 md:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <Card className="shadow-none overflow-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              {StatusIcon}

              <div className="">
                <CardTitle className="text-lg">{formattedStatus}</CardTitle>
                <CardDescription>
                  Execution for {execution?.workflow?.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div>
                <h4 className="text-muted-foreground text-sm font-medium">
                  Workflow
                </h4>
                <Link
                  prefetch
                  href={`/workflows/${execution?.workflow?.id}`}
                  className="text-sm hover:underline text-primary"
                >
                  {execution?.workflow?.name}
                </Link>
              </div>
              <div>
                <h4 className="text-muted-foreground text-sm font-medium">
                  Status
                </h4>
                <p className="text-sm">{formattedStatus}</p>
              </div>

              <div>
                <h4 className="text-muted-foreground text-sm font-medium">
                  Started
                </h4>
                <p className="text-sm">
                  {formatDistanceToNow(execution?.startedAt, {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {execution?.completedAt ? (
                <div>
                  <h4 className="text-muted-foreground text-sm font-medium">
                    Completed
                  </h4>
                  <p className="text-sm">
                    {formatDistanceToNow(execution?.completedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ) : null}

              {duration ? (
                <div>
                  <h4 className="text-muted-foreground text-sm font-medium">
                    Duration
                  </h4>
                  <p className="text-sm">{duration?.toFixed(2)}s</p>
                </div>
              ) : null}

              <div>
                <h4 className="text-muted-foreground text-sm font-medium">
                  Event Id
                </h4>
                <p
                  title={execution?.inngestEventId}
                  className="text-sm max-w-34 md:max-w-full truncate"
                >
                  {execution?.inngestEventId}
                </p>
              </div>
            </div>

            {!!execution?.error && (
              <div
                className={`mt-6 p-4 bg-red-50 rounded-md ${
                  open
                    ? "md:max-w-[calc(100vw-410px)]"
                    : "w-full md:w-[calc(100vw-210px)]"
                }`}
              >
                <p className="text-sm font-medium mb-2 text-red-800">Error</p>
                <p className="font-mono text-sm text-red-800">
                  {execution?.error}
                </p>

                {!!execution?.errorStack && (
                  <Collapsible
                    open={showStackTrace}
                    onOpenChange={setShowStackTrace}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="text-left p-0 font-medium text-red-900 text-sm my-2 hover:text-red-700 transition-colors"
                      >
                        {showStackTrace
                          ? "Hide stack trace"
                          : "Show stack trace"}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <pre className="text-xs overflow-auto bg-red-100 p-2">
                        {execution?.errorStack}
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )}

            {!!execution?.output && (
              <div className="mt-6 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Output</p>

                <pre className="text-xs overflow-auto">
                  {JSON.stringify(execution?.output, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
