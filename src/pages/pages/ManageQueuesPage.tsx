import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Trash2, Users } from "lucide-react";
import type { ManagedQueue } from "@/pages/types/queue";

const INITIAL_MANAGED: ManagedQueue[] = [
  {
    id: "q1",
    name: "Riverside Clinic",
    location: "Front desk · Window 3",
    peopleInQueue: 12,
    estimatedWaitMinutes: 24,
    status: "open",
    createdAt: "2026-06-02",
  },
  {
    id: "q2",
    name: "City Passport Office",
    location: "Walk-in queue",
    peopleInQueue: 34,
    estimatedWaitMinutes: 55,
    status: "open",
    createdAt: "2026-05-18",
  },
  {
    id: "q4",
    name: "Downtown Barbershop",
    location: "Weekend walk-ins",
    peopleInQueue: 0,
    estimatedWaitMinutes: 0,
    status: "closed",
    createdAt: "2026-04-30",
  },
];

interface ManageQueueCardProps {
  queue: ManagedQueue;
  onOpen: (id: string) => void;
  onRequestDelete: (queue: ManagedQueue) => void;
}

function ManageQueueCard({
  queue,
  onOpen,
  onRequestDelete,
}: ManageQueueCardProps): React.JSX.Element {
  return (
    <Card
      onClick={() => onOpen(queue.id)}
      className="cursor-pointer rounded-3xl border-lyne-divider transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(43,15,77,0.25)] my-2"
    >
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-base font-semibold text-lyne-ink">
              {queue.name}
            </p>
            <Badge
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                queue.status === "open"
                  ? "bg-lyne-surface-muted text-lyne-purple-700 hover:bg-lyne-surface-muted"
                  : "bg-lyne-divider text-lyne-muted hover:bg-lyne-divider"
              }`}
            >
              {queue.status === "open" ? "Open" : "Closed"}
            </Badge>
          </div>
          <p className="truncate font-body text-sm text-lyne-muted">
            {queue.location}
          </p>
          <span className="mt-2 flex items-center gap-1.5 font-body text-xs font-medium text-lyne-body">
            <Users className="h-3.5 w-3.5 text-lyne-purple-700" />
            {queue.peopleInQueue} currently waiting
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Queue options"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="shrink-0 rounded-full text-lyne-muted hover:bg-lyne-surface-muted hover:text-lyne-purple-700"
            >
              <MoreVertical className="h-4.5 w-4.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={() => onRequestDelete(queue)}
              className="font-body text-sm text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete queue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}

export default function ManageQueuesPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [queues, setQueues] = useState<ManagedQueue[]>(INITIAL_MANAGED);
  const [pendingDelete, setPendingDelete] = useState<ManagedQueue | null>(null);

  const handleOpen = (id: string): void => {
    navigate(`/manage/${id}`);
  };

  const confirmDelete = (): void => {
    if (!pendingDelete) return;
    // Demo only — wire this up to your real "delete queue" API call.
    setQueues((current) => current.filter((q) => q.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-lyne-purple-700">
            Manage
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Your queues
          </h1>
        </div>
      </div>
      <p className="mt-2 max-w-md font-body text-sm text-lyne-muted">
        Tap a queue to see who's waiting and call the next person.
      </p>

      <div className="mt-8 space-y-3">
        {queues.map((queue) => (
          <ManageQueueCard
            key={queue.id}
            queue={queue}
            onOpen={handleOpen}
            onRequestDelete={setPendingDelete}
          />
        ))}
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open : boolean) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete "{pendingDelete?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This closes the queue for everyone currently waiting and can't
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full font-body">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-full bg-red-600 font-body hover:bg-red-700"
            >
              Delete queue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}