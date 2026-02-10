"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { messageSchema } from "@/schemas/messageSchema";
import type { z } from "zod";
import type { ApiResponse } from "@/types/ApiResponse";

type MessageFormValues = z.infer<typeof messageSchema>;

const UserMessagePage = () => {
  const params = useParams<{ username?: string | string[] }>();
  const username = useMemo(() => {
    const raw = params?.username;
    if (!raw) return "";
    return Array.isArray(raw) ? raw[0] ?? "" : raw;
  }, [params]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
    mode: "onChange",
  });

  const content = form.watch("content") ?? "";
  const remaining = 300 - content.length;

  const onSubmit = async (values: MessageFormValues) => {
    if (!username) {
      toast.error("Invalid user link");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: values.content,
      });
      toast.success(res.data.message || "Message sent successfully");
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      const res = await axios.post<{ success: boolean; messages: string[] }>(
        "/api/suggest-message"
      );
      if (res.data.success) {
        setSuggestedMessages(res.data.messages ?? []);
      } else {
        setSuggestedMessages([]);
        toast.error("Failed to load suggested messages");
      }
    } catch {
      toast.error("Failed to load suggested messages");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-slate-50 to-white">
      <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-slate-900">
              Send an anonymous message
            </CardTitle>
            <CardDescription>
              To{" "}
              <span className="font-semibold text-slate-900">@{username}</span> —
              be kind, be honest, stay anonymous.
            </CardDescription>
          </CardHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="content">Your message</Label>
                <textarea
                  id="content"
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200"
                  {...form.register("content")}
                />

                <div className="flex items-center justify-between text-xs">
                  <p className="text-red-600">
                    {form.formState.errors.content?.message}
                  </p>
                  <p className={remaining < 0 ? "text-red-600" : "text-slate-500"}>
                    {Math.max(0, remaining)} characters left
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-end gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="min-w-32"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Not sure what to ask? Get some ideas.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchSuggestedMessages}
            >
              Suggest questions
            </Button>
          </div>

          {suggestedMessages.length > 0 && (
            <Card className="border-dashed border-slate-300 bg-slate-50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Suggested questions you can send
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tap a question to use it as your message.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-1 text-sm text-slate-800">
                  {suggestedMessages.map((q, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        className="w-full text-left rounded-md px-2 py-1.5 hover:bg-white hover:shadow-sm transition"
                        onClick={() => {
                          form.setValue("content", q, { shouldValidate: true });
                        }}
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-slate-500 text-center">
            Powered by Wisperly — your identity stays anonymous.
          </p>
        </div>
      </section>
    </main>
  );
};

export default UserMessagePage;
