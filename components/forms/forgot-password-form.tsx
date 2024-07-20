"use client";
import React, { useState } from "react";
import CardWrapper from "../common/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

const ForgotPasswordForm = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });


  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    const {email} = values
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/forgot-password", {email});
      if (response?.data?.success) {
        form.reset();
        toast.success(response?.data?.message)
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Forgot Password?"
      backButtonHref="/login"
      backButtonLabel="<- Back to Login"
      secondaryHeading="No worries, we'will send you a reset link."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="john.doe@example.com" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "Sending Email..." : "Send Email"}</Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgotPasswordForm;
