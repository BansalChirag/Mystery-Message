"use client"
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
import FormError from "../common/form-error";
import { resetPasswordSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeOff,Eye } from "lucide-react";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword1, setShowPassword1] = useState<boolean>(false)
  const [showPassword2, setShowPassword2] = useState<boolean>(false)


  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword:""
    },
  });


  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    const data = {
      ...values,
      token
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/reset-password",data);
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        router.replace('/login')
        form.reset()
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error: any) {
      toast.error(error)
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Reset Your Password"
      secondaryHeading="Must be atleast 6 characters."
    >
      {
        !token ? <FormError message="Missing token!"/>
        :
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field}  type={showPassword1 === true ? 'text' : 'password'} disabled={isSubmitting} placeholder="••••••"
                  icon = {
                    showPassword1===true ? 
                    <EyeOff className="cursor-pointer mt-1 mr-2" onClick={() => setShowPassword1(false)} />
                    :
                    <Eye className="cursor-pointer mt-1 mr-2" onClick={() => setShowPassword1(true)} />
                  }
                  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmNewPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...field} type={showPassword2 === true ? 'text' : 'password'} disabled={isSubmitting} placeholder="••••••" 
                  icon = {
                    showPassword2===true ? 
                    <EyeOff className="cursor-pointer mt-1 mr-2" onClick={() => setShowPassword2(false)}  />
                    :
                    <Eye className="cursor-pointer mt-1 mr-2" onClick={() => setShowPassword2(true)} />
                  }
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={isSubmitting} >{isSubmitting ? "Resetting Your Password..." : "Reset Password"}</Button>
        </form>
      </Form>
    }
    </CardWrapper>
  );
};

export default ResetPasswordForm;
