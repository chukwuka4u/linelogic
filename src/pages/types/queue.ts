export type QueueStatus = "open" | "closed";

export interface Queue {
  id: string;
  name: string;
  location: string;
  peopleInQueue: number;
  estimatedWaitMinutes: number;
  status: QueueStatus;
}

export interface ManagedQueue extends Queue {
  createdAt: string;
}

export interface JoinedQueue extends Queue {
  position: number;
}

export interface QueueMember {
  ticketId: string; // e.g. "A-001"
  position: number;
  name: string;
  phone: string;
}