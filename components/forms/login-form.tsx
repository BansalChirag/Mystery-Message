"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import CardWrapper from "@/components/common/card-wrapper";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks";

const LoginForm = () => {
  // zod implementation
  const {data: session} = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const { identifier, password } = values;
    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });
      if (response?.error === null) {
        toast.success("Login Successfully.");
        form.reset();
        router.replace("/dashboard");
      } else if (response?.error) {
        toast.error(response?.error?.split(":")[1] as string);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      backButtonLabel="Don't have an account"
      backButtonHref="/register"
      secondaryHeading="Please enter your details to sign in."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Username or email address"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder="••••••"
                    type={showPassword ? "text" : "password"}
                    icon={
                      showPassword === false ? (
                        <Eye
                          className="cursor-pointer mt-1 mr-2"
                          onClick={() => setShowPassword(true)}
                        />
                      ) : (
                        <EyeOff
                          className="cursor-pointer mt-1 mr-2"
                          onClick={() => setShowPassword(false)}
                        />
                      )
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Link href='forgot-password' className="flex justify-end mt-2 hover:underline ">
              Forgot Password?
              </Link> */}
            <div className="w-full flex items-center justify-end mt-2 ml-2">
              {/* <Button variant="link"> */}
                <Link href="forgot-password">Forgot Password?</Link>
              {/* </Button> */}
            </div>
          </div>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
