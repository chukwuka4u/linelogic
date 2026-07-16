import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, PhoneCall, UserX } from "lucide-react";
import type { QueueMember } from "@/pages/types/queue";

// Demo data keyed by queue id — replace with a real fetch by :queueId.
const MEMBERS_BY_QUEUE: Record<string, QueueMember[]> = {
  q1: [
    { ticketId: "A-041", position: 1, name: "Priya Menon", phone: "+234 803 555 0142" },
    { ticketId: "A-042", position: 2, name: "Tunde Johnson", phone: "+234 806 555 0198" },
    { ticketId: "A-043", position: 3, name: "Kemi Ojo", phone: "+234 701 555 0176" },
    { ticketId: "A-044", position: 4, name: "Sade Bello", phone: "+234 802 555 0120" },
  ],
  q2: [
    { ticketId: "B-201", position: 1, name: "Ifeoma Nwosu", phone: "+234 815 555 0111" },
    { ticketId: "B-202", position: 2, name: "Chidi Okafor", phone: "+234 909 555 0164" },
  ],
};

const QUEUE_NAMES: Record<string, string> = {
  q1: "Riverside Clinic",
  q2: "City Passport Office",
  q4: "Downtown Barbershop",
};

export default function AttendQueuePage(): React.JSX.Element {
  const { queueId } = useParams<{ queueId: string }>();
  const members = useMemo<QueueMember[]>(
    () => (queueId ? MEMBERS_BY_QUEUE[queueId] ?? [] : []),
    [queueId]
  );
  const queueName = (queueId && QUEUE_NAMES[queueId]) || "Queue";

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = members.length > 0 && selected.size === members.length;

  const toggleAll = (): void => {
    setSelected(allSelected ? new Set() : new Set(members.map((m) => m.ticketId)));
  };

  const toggleOne = (ticketId: string): void => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(ticketId)) {
        next.delete(ticketId);
      } else {
        next.add(ticketId);
      }
      return next;
    });
  };

  return (
    <div>
      <Link
        to="/manage"
        className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-lyne-purple-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Manage
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {queueName}
        </h1>
        <span className="font-body text-sm text-lyne-muted">
          {members.length} people waiting
        </span>
      </div>

      {selected.size > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-lyne-surface-muted px-4 py-3">
          <span className="font-body text-sm font-semibold text-lyne-purple-700">
            {selected.size} selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-lyne-border bg-white font-body text-xs font-semibold text-lyne-purple-700 hover:bg-white"
            >
              <PhoneCall className="mr-1.5 h-3.5 w-3.5" />
              Call selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-lyne-border bg-white font-body text-xs font-semibold text-red-600 hover:bg-white"
            >
              <UserX className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Table header — desktop/tablet only */}
      <div className="mt-6 hidden grid-cols-[auto_4rem_1fr_1fr_6rem] items-center gap-4 px-5 font-body text-xs font-semibold uppercase tracking-[0.1em] text-lyne-muted sm:grid">
        <Checkbox
          checked={allSelected}
          onCheckedChange={toggleAll}
          aria-label="Select all"
          className="border-lyne-border data-[state=checked]:border-lyne-purple-700 data-[state=checked]:bg-lyne-purple-700"
        />
        <span>Pos.</span>
        <span>Name</span>
        <span>Phone</span>
        <span>Ticket</span>
      </div>

      <div className="mt-2 space-y-2">
        {members.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-lyne-border">
            <CardContent className="p-10 text-center">
              <p className="font-body text-sm text-lyne-muted">
                No one is waiting in this queue right now.
              </p>
            </CardContent>
          </Card>
        ) : (
          members.map((member) => {
            const checked = selected.has(member.ticketId);
            return (
              <Card key={member.ticketId} className="rounded-2xl border-lyne-divider my-2">
                <CardContent className="grid grid-cols-[auto_1fr] items-center gap-4 p-4 sm:grid-cols-[auto_4rem_1fr_1fr_6rem]">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleOne(member.ticketId)}
                    aria-label={`Select ${member.name}`}
                    className="border-lyne-border data-[state=checked]:border-lyne-purple-700 data-[state=checked]:bg-lyne-purple-700"
                  />

                  {/* Mobile: stacked. Desktop: grid columns. */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:contents">
                    <span className="font-mono text-sm font-semibold text-lyne-purple-700 sm:text-left">
                      #{member.position}
                    </span>
                    <span className="col-span-2 font-body text-sm font-semibold text-lyne-ink sm:col-span-1">
                      {member.name}
                    </span>
                    <span className="col-span-2 font-body text-sm text-lyne-muted sm:col-span-1">
                      {member.phone}
                    </span>
                    <span className="font-mono text-xs font-semibold text-lyne-body">
                      {member.ticketId}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}