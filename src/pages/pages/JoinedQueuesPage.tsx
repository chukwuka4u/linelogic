import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Clock, Users, Trash2 } from "lucide-react";
import type { JoinedQueue } from "@/pages/types/queue";

const INITIAL_JOINED: JoinedQueue[] = [
  {
    id: "q1",
    name: "Riverside Clinic",
    location: "Front desk · Window 3",
    peopleInQueue: 12,
    estimatedWaitMinutes: 24,
    status: "open",
    position: 4,
  },
  {
    id: "q3",
    name: "Blue Sky Bank",
    location: "Customer service",
    peopleInQueue: 5,
    estimatedWaitMinutes: 9,
    status: "open",
    position: 2,
  },
];

interface JoinedQueueCardProps {
  queue: JoinedQueue;
  onLeave: (id: string) => void;
}

function JoinedQueueCard({
  queue,
  onLeave,
}: JoinedQueueCardProps): React.JSX.Element {
  return (
    <Card className="rounded-3xl border-lyne-divider my-2">
      <CardContent className="flex items-center gap-4 p-5">
        <button
          type="button"
          onClick={() => onLeave(queue.id)}
          aria-label={`Leave ${queue.name}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lyne-muted hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-lyne-ink">
              {queue.name}
            </p>
            <p className="truncate font-body text-sm text-lyne-muted">
              {queue.location}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 font-body text-xs font-medium text-lyne-body">
                <Clock className="h-3.5 w-3.5 text-lyne-purple-700" />
                ~{queue.estimatedWaitMinutes} min wait
              </span>
              <span className="flex items-center gap-1.5 font-body text-xs font-medium text-lyne-body">
                <Users className="h-3.5 w-3.5 text-lyne-purple-700" />
                {queue.peopleInQueue} waiting
              </span>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-lyne-surface-muted px-3 py-2 text-center">
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.1em] text-lyne-purple-700">
              Position
            </p>
            <p className="font-mono text-lg font-bold text-lyne-purple-700">
              #{queue.position}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JoinedQueuesPage(): React.JSX.Element {
  const [joined, setJoined] = useState<JoinedQueue[]>(INITIAL_JOINED);

  const handleLeave = (id: string): void => {
    // Demo only — wire this up to your real "leave queue" API call.
    setJoined((current) => current.filter((q) => q.id !== id));
  };

  return (
    <div>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-lyne-purple-700">
        Your queues
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Queues you've joined
      </h1>
      <p className="mt-2 max-w-md font-body text-sm text-lyne-muted">
        Track your live position, or leave a queue if your plans change.
      </p>

      <div className="mt-8 space-y-3">
        {joined.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-lyne-border">
            <CardContent className="p-10 text-center">
              <p className="font-body text-sm text-lyne-muted">
                You haven't joined any queues yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          joined.map((queue) => (
            <JoinedQueueCard key={queue.id} queue={queue} onLeave={handleLeave} />
          ))
        )}
      </div>
    </div>
  );
}