"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw,} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id.toString() !== messageId)
    );
  };
  const { data: session,status } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessage", response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to fetch accept messages status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(
          Array.isArray(response.data.message) ? response.data.message : []
        );
        if (refresh) {
          toast.success("Messages refreshed successfully");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch messages"
        );
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setMessages, setLoading, setIsSwitchLoading]
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    fetchAcceptMessages();
    fetchMessages();

    return () => {
      setMessages([]);
      setValue("acceptMessage", false);
    };
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        // backend expects `acceptMessage` in the request body
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessage", !acceptMessages);
      toast.success(
        response.data.message || "Updated accept messages status successfully"
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to update accept messages status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const Username = session?.user as User
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(`${window.location.protocol}//${window.location.host}`);
  }, []);

  const username = session?.user && "username" in session.user ? session.user.username: undefined;

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast.success("Profile URL copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy profile URL");
    });
  };

  if (!session || !username) {
    return <div>Please Login</div>;
  }
  else {
    return (
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy your Unique Link</h2>{' '}
          <div className="flex items-center">
            <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2"/>
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
        <div className="mb-4">
          <Switch {...register('acceptMessage')} checked={!!acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading}/>
          <span className="ml-2">
            Accept Message: {acceptMessages ? "Enabled" : "Disabled"}
          </span>
        </div>
        <Separator />

        <Button className="mt-4" variant="outline" onClick={(e)=>{e.preventDefault();fetchMessages(true)}}>
          {
            loading ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<RefreshCcw className="h-4 w-4 " />)
          }
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {
            messages.length > 0 ? (
              messages.map((message,index) =>(
                <MessageCard key={message._id.toString()} message={message} onMessageDelete={handleDeleteMessage}/>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center text-gray-500">
                No messages received yet.
              </div>
            )
          }
        </div>
      </div>
    );
  }
};

export default page;
