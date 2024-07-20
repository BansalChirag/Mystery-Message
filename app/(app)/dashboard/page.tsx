"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useCurrentUser } from "@/hooks";
import MessageCard from "@/components/common/message-card";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ApiRepsonse } from "@/types/ApiResponse";

const page = () => {
  const user = useCurrentUser();


  const username = user?.username || user?.email;

  const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>([]);


  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data?.messages || []);
        if (refresh) {
          toast.success('Refreshed Messages', {
            description: 'Showing latest messages',
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiRepsonse>;
        
        toast.error(axiosError?.response?.data.message ?? 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },[setIsLoading,setMessages]
  )

  const getMessageStatus = async () => {
    try {
      const response = await axios.get("/api/message-status");
      setIsAcceptingMessages(response.data?.isAcceptingMessages);
    } catch (error) {}
  };

  const uniqueProfileLink = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueProfileLink);
    toast.success('URL Copied!', {
      description: 'Profile URL has been copied to clipboard.',
    })
  };

  const handleSwitchChange = async () => {
    setIsAcceptingMessages(!isAcceptingMessages);
    try {
      const response = await axios.post("/api/message-status", {
        acceptMessages: !isAcceptingMessages,
      });
      setIsAcceptingMessages(response.data?.updatedUser.isAcceptingMessages);
      toast.success(response.data?.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiRepsonse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to update message settings')
    } finally {
      setIsSwitchLoading(false);
    }
  };

  

  useEffect(() => {
    if (!user) return;
    fetchMessages();
    getMessageStatus();
  }, [user]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message: any) => message._id !== messageId));
  };



  return (
    <div className="container max-w-4xl p-6 my-8">
      <h1 className="text-center font-bold text-3xl md:text-4xl mb-6">
        User Dashboard
      </h1>
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
      <div className="flex items-center justify-center mb-2">
        <input
          type="text"
          value={uniqueProfileLink}
          disabled
          // className="w-full p-2"
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>

      <Switch
        className="mb-4"
        checked={isAcceptingMessages}
        onCheckedChange={handleSwitchChange}
      />
      <span className="ml-2">
        Accept Messages: {isAcceptingMessages ? "On" : "Off"}
      </span>
      <Separator className="mb-2" />

      {/* <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>  */}
      {isLoading ? (
        // <svg
        //   width="15"
        //   height="15"
        //   viewBox="0 0 15 15"
        //   fill="none"
        //   className="animate-spin"
        //   xmlns="http://www.w3.org/2000/svg"
        // >
        //   <path
        //     d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z"
        //     fill="currentColor"
        //     fillRule="evenodd"
        //     clipRule="evenodd"
        //   ></path>
        // </svg>
        <Loader2 className="h-4 w-4 animate-spin mb-2" />
      ) : (
        // refresh button
        //  isAcceptingMessages &&
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {/* <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg> */}
          <RefreshCcw className="h-4 w-4" />
        </Button>
      )}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message: any) => (
            <MessageCard
              key={message?.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  );
};

export default page;
