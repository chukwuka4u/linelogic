import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, MoreVertical, Users, Check } from "lucide-react";
import type { Queue } from "@/pages/types/queue";

const OPEN_QUEUES: Queue[] = [
  {
    id: "q1",
    name: "Riverside Clinic",
    location: "Front desk · Window 3",
    peopleInQueue: 12,
    estimatedWaitMinutes: 24,
    status: "open",
  },
  {
    id: "q2",
    name: "City Passport Office",
    location: "Walk-in queue",
    peopleInQueue: 34,
    estimatedWaitMinutes: 55,
    status: "open",
  },
  {
    id: "q3",
    name: "Blue Sky Bank",
    location: "Customer service",
    peopleInQueue: 5,
    estimatedWaitMinutes: 9,
    status: "open",
  },
];

interface HomeQueueCardProps {
  queue: Queue;
  joinedId: string | null;
  onJoin: (id: string) => void;
}

function HomeQueueCard({
  queue,
  joinedId,
  onJoin,
}: HomeQueueCardProps): React.JSX.Element {
  const justJoined = joinedId === queue.id;

  return (
    <Card className="rounded-3xl border-lyne-divider my-2">
      <CardContent className="flex items-center justify-between gap-4 p-5">
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

        <div className="flex shrink-0 items-center gap-2">
          {justJoined && (
            <Badge className="rounded-full bg-lyne-surface-muted px-2.5 py-1 font-body text-xs font-semibold text-lyne-purple-700 hover:bg-lyne-surface-muted">
              <Check className="mr-1 h-3 w-3" />
              Joined
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Queue options"
                className="rounded-full text-lyne-muted hover:bg-lyne-surface-muted hover:text-lyne-purple-700"
              >
                <MoreVertical className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem
                onClick={() => onJoin(queue.id)}
                className="font-body text-sm text-lyne-ink"
              >
                Join queue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage(): React.JSX.Element {
  const [joinedId, setJoinedId] = useState<string | null>(null);

  const handleJoin = (id: string): void => {
    setJoinedId(id);
    // Demo only — wire this up to your real "join queue" API call.
    setTimeout(() => setJoinedId((current) => (current === id ? id : current)), 0);
  };

  return (
    <div>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-lyne-purple-700">
        Browse
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Open queues near you
      </h1>
      <p className="mt-2 max-w-md font-body text-sm text-lyne-muted">
        Join a queue and track your position live — no app to download.
      </p>

      <div className="mt-8 space-y-3">
        {OPEN_QUEUES.map((queue) => (
          <HomeQueueCard
            key={queue.id}
            queue={queue}
            joinedId={joinedId}
            onJoin={handleJoin}
          />
        ))}
      </div>
    </div>
  );
}