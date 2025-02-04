"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/schemas";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import CardWrapper from "@/components/common/card-wrapper";
import axios, { AxiosError } from "axios";
import VerifyUsername from "@/app/(auth)/verify/[username]/page";
import { useDebounceCallback } from "usehooks-ts";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ApiRepsonse } from "@/types/ApiResponse";

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [isApiCall, setIsApiCall] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // zod implementation

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/register", values);
      if (response?.data?.success) {
        form.reset();
        setUsernameMessage("");

        toast.success(response?.data?.message);
        setTimeout(() => {
          setOpen(true);
        }, 3000);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const debouncedCheckUsernameUnique = useDebounceCallback(
    async (username: string) => {
      if (username.length >= 3 && isApiCall) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          if (response.data.success) {
            setUsernameMessage("Username is unique");
            setSuggestedUsernames([]);
          } else {
            setUsernameMessage(response?.data?.message);
            setSuggestedUsernames(response.data.suggestedUsernames);
          }
          // const response = await axios.get(
          //   `/api/check-username-unique?username=${username}`
          // );
          // if (response.data?.success) {
          //   setUsernameMessage(response.data.message);
          //   const suggestedUsernamesResponse = await axios.post(
          //     `/api/suggest-usernames/`,
          //     { username }
          //   );
          //   const suggestedUsernames = suggestedUsernamesResponse.data.data
          //     .split("\n")
          //     .map((username: string) => username.trim());
          //   setSuggestedUsernames(suggestedUsernames);
          // }
        } catch (error) {
          const axiosError = error as AxiosError<ApiRepsonse>;
          setUsernameMessage(
            axiosError?.response?.data?.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    },
    500
  ); // Debounce for 500ms

  useEffect(() => {
    debouncedCheckUsernameUnique(username);
  }, [username, isApiCall]);

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account"
      backButtonHref="/login"
      secondaryHeading="Sign up to start your anonymous adventure"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  onChange={(e: any) => {
                    field.onChange(e);
                    setUsername(e.target.value);
                    setIsApiCall(true);
                  }}
                  placeholder="john.12_doe"
                  icon={
                    isCheckingUsername ? (
                      <Loader2 className="absolute right-2 top-2 animate-spin" />
                    ) : form.formState.errors.username ? null : (
                      username.length >= 3 &&
                      !isCheckingUsername &&
                      usernameMessage === "Username is unique" && (
                        <CheckCircledIcon className="text-green-500 mt-2 mr-2 h-5 w-5" />
                      )
                    )
                  }
                />

                {!isCheckingUsername &&
                  usernameMessage &&
                  (!usernameMessage.includes("unique") ? (
                    <p className="text-red-600">{usernameMessage}</p>
                  ) : (
                    ""
                  ))}

                {username.length > 0 && username.length < 3 ? (
                  <p className="text-red-600">
                    Username must be at least 3 characters
                  </p>
                ) : (
                  ""
                )}

                {suggestedUsernames?.length > 0 && (
                  <div
                    className="flex flex-col overflow-y-auto max-h-20 scrollbar-hide"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {suggestedUsernames.map((suggestedUsername) => (
                      <div
                        key={suggestedUsername}
                        className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setIsApiCall(false);
                          setUsernameMessage("");
                          setUsername(suggestedUsername);
                          form.setValue("username", suggestedUsername);
                          setSuggestedUsernames([]);
                        }}
                      >
                        {suggestedUsername}
                        <CheckCircledIcon className="text-green-500 mr-2 h-5 w-5" />
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  {...field}
                  name="email"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    field.onChange(e);
                    setEmail(e.target.value);
                  }}
                  placeholder="john.doe@example.com"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  disabled={isSubmitting}
                  placeholder="••••••"
                  onChange={(e) => {
                    field.onChange(e);
                    setPassword(e.target.value);
                  }}
                  icon={
                    showPassword === true ? (
                      <EyeOff
                        className="cursor-pointer mt-1 mr-2"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer mt-1 mr-2"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Please Wait..." : "Create Account"}
          </Button>
        </form>
      </Form>
      {open && (
        <VerifyUsername
          open={open}
          setOpen={setOpen}
          username={username}
          email={email}
          password={password}
        />
      )}
    </CardWrapper>
  );
};

export default RegisterForm;
