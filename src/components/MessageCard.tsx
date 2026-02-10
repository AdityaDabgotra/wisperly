"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id.toString());
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ?? "Failed to delete the message";
      toast.error(errMsg);
    }
  };

  const created =
    message.createdAt instanceof Date
      ? message.createdAt
      : new Date(message.createdAt as any);
  const formattedDate = created.toLocaleString();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start gap-3 pb-3 border-b border-slate-100">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              ✉
            </span>
            Message
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Received on <span className="font-medium">{formattedDate}</span>
          </CardDescription>
        </div>

        <CardAction className="flex items-start">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove this
                  message from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-4">
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {message.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
