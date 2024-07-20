"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas";
import { ApiRepsonse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const page = ({ params }: { params: { username: string } }) => {
  // const params = useParams<{username: string}>();
  const username = params?.username;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [messages, setMessages] = useState<string>("What's your favorite movie?||Do you have any pets?||What's your dream job?");

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = form.watch('content');  

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post(`/api/send-messages`, {
        ...data,
        username,
      });
      if(response.data?.success){
        toast.success(response?.data?.message)
      }else{
        toast.error(response?.data?.message)
      }
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiRepsonse>
      toast.error(axiosError.response?.data?.message ?? 'Failed to Send message')
    } finally {
      setIsLoading(false);
    }
  };


  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggesting(true);
      const response = await axios.post('/api/suggest-messages')
      setMessages(response?.data?.data);
      toast.success(response?.data?.message)
    } catch (error) {
      console.error("Error fetching messages:", error);
      const axiosError = error as AxiosError<ApiRepsonse>
      toast.error(axiosError.response?.data?.message ?? 'Something went wrong.')
    }
    finally{
      setIsSuggesting(false)
    };
      
  };

  const router = useRouter();
  const specialChar = "||";

  const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
  };

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };


  return (
    <div className="container max-w-4xl p-6 my-8">
      <h1 className="text-center font-bold text-3xl md:text-4xl mb-6">Public Profile Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @ {username} </FormLabel>
                <Textarea
                  className="resize-none"
                  placeholder="Write your anonymous message here"
                  {...field}
                />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
          <Button disabled={isLoading || !messageContent }>{isLoading ? "Sending Message..." : "Send Message"}</Button>
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-12">
        <Button onClick={fetchSuggestedMessages} disabled={isSuggesting} >{isSuggesting ? 
        <div className="flex items-center justify-center gap-2">
        Getting AI Generated Messages
        <Loader2 className="animate-spin"/>
        </div>
        : "Suggest New Messages"}</Button>
        <p>Click on any message below to select it.</p>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-medium">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {parseStringMessages(messages).map((message, index) => (
              <div className="border p-3 rounded-lg text-center cursor-pointer" key={index} onClick={()=>handleMessageClick(message)} >
                {message}
              </div>
            ))}
          </CardContent>
        </Card>
        <Separator />
        <div className="flex flex-col items-center justify-center gap-4">
        <p>Get your message board</p>
        <Button onClick={() => router.push("/register")}>
          Create Your Account
        </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
