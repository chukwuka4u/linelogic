import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Loader2 } from "lucide-react";

type CreateStatus = "idle" | "loading" | "error" | "success";

interface CreateQueueForm {
  name: string;
  location: string;
  description: string;
  capacity: string; // kept as string for controlled input, parsed on submit
  openImmediately: boolean;
}

const INITIAL_FORM: CreateQueueForm = {
  name: "",
  location: "",
  description: "",
  capacity: "",
  openImmediately: true,
};

export default function CreateQueuePage(): React.JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateQueueForm>(INITIAL_FORM);
  const [status, setStatus] = useState<CreateStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const updateField = <K extends keyof CreateQueueForm>(
    key: K,
    value: CreateQueueForm[K]
  ): void => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setErrorMsg("");

    const capacityNumber = Number(form.capacity);
    if (!form.name.trim()) {
      setStatus("error");
      setErrorMsg("Give your queue a name before creating it.");
      return;
    }
    if (!form.capacity || Number.isNaN(capacityNumber) || capacityNumber <= 0) {
      setStatus("error");
      setErrorMsg("Enter a valid capacity greater than zero.");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      // Demo only — replace with your real "create queue" API call.
      setStatus("success");
      setTimeout(() => navigate("/manage"), 900);
    }, 1000);
  };

  return (
    <div>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-lyne-purple-700">
        Create
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Start a new queue
      </h1>
      <p className="mt-2 max-w-md font-body text-sm text-lyne-muted">
        Set it up in under a minute — you can edit these details any time.
      </p>

      <Card className="mt-8 max-w-lg rounded-3xl border-lyne-divider my-2">
        <CardContent className="p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body text-sm font-medium text-lyne-ink">
                Queue name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Riverside Clinic"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("name", e.target.value)
                }
                className="rounded-xl border-lyne-border py-5 font-body focus-visible:ring-lyne-purple-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-body text-sm font-medium text-lyne-ink">
                Location <span className="text-lyne-muted">(optional)</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g. Front desk · Window 3"
                value={form.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("location", e.target.value)
                }
                className="rounded-xl border-lyne-border py-5 font-body focus-visible:ring-lyne-purple-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="font-body text-sm font-medium text-lyne-ink">
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                placeholder="e.g. 40"
                value={form.capacity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("capacity", e.target.value)
                }
                className="rounded-xl border-lyne-border py-5 font-body focus-visible:ring-lyne-purple-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-body text-sm font-medium text-lyne-ink">
                Description <span className="text-lyne-muted">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Anything people joining should know."
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateField("description", e.target.value)
                }
                className="min-h-[88px] rounded-xl border-lyne-border font-body focus-visible:ring-lyne-purple-700"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-lyne-surface-muted px-4 py-3">
              <div>
                <p className="font-body text-sm font-medium text-lyne-ink">
                  Open immediately
                </p>
                <p className="font-body text-xs text-lyne-muted">
                  People can start joining as soon as it's created.
                </p>
              </div>
              <Switch
                checked={form.openImmediately}
                onCheckedChange={(checked: boolean) =>
                  updateField("openImmediately", checked)
                }
                className="data-[state=checked]:bg-lyne-purple-700"
              />
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-3.5 py-2.5 font-body text-sm text-red-600"
              >
                {errorMsg}
              </p>
            )}

            {status === "success" && (
              <p className="flex items-center gap-2 rounded-xl bg-lyne-surface-muted px-3.5 py-2.5 font-body text-sm font-medium text-lyne-purple-700">
                <Check className="h-4 w-4" />
                Queue created — taking you to Manage.
              </p>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-lyne-purple-700 py-6 font-body text-sm font-semibold text-white hover:bg-lyne-purple-900 disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating queue…
                </>
              ) : (
                <>
                  Create queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}