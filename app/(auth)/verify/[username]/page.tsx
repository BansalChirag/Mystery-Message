import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { sendVerificationEmail } from "@/sendVerificationEmail";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, {  useState } from "react";
import OTPInput from "react-otp-input";
import { toast } from "sonner";

const VerifyUsername = ({ open, setOpen, username, email,password}: any) => {
  
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleOpenModal = () => {
    setOpen(!open);
  };

  

  const verifyEmail = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username,
        code: otp,
      });
      if (response.data?.success) {
        toast.success(`${response.data?.message + " Redirecting you to the dashboard in a few moments."}`);
        const loginResponse = await signIn("credentials", {
          redirect: false,
          identifier:email,
          password,
        });

        if (loginResponse?.error === null) {
          // setTimeout(()=>{
            router.replace("/dashboard");
            // window.location.href='/dashboard';
          //   setOpen(false);
          // },3000)
        }
      } else {
        setIsSubmitting(false);
        toast.error(response?.data?.message);
      }
    } catch (err: any) {
      toast.error(err);
      setIsSubmitting(false);
    }
  };

  const handleResendCodeEmail = async()=>{
    try {
      const response  = await axios.post('/api/send-verification-email',{
        email,
        username
      })

      if(response?.data?.success){
        return toast.success(response?.data?.message)
      }
      return toast.error(response?.data?.message)
    } catch (error) {
      toast.error("Something went wrong!")
    }    
  }


  return (
    <Dialog open={open} onOpenChange={() => toggleOpenModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Enter Verification code
          </DialogTitle>
          <DialogDescription>
            {/* Enter the 4-digit code that we sent to your
            {email && (
              <>
                {email[0]}
                {"*".repeat(email.indexOf("@") - 2)}
                {email[email.indexOf("@") - 1]}
                {email.slice(email.indexOf("@"))}
              </>
            )}
            email. Be careful not to share the code with anyone */}
            <p className="text-center mb-10">We've sent a code to {email}</p>
            <div className="flex justify-center mb-6">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<div className="pl-[0.69rem]"></div>}
                renderInput={(props: any) => (
                  <input
                    {...props}
                    disabled={isSubmitting}
                    className="border-[1.75px] border-[#E4E7EC] focus:!outline-primary  !w-[3rem] !h-[3rem] md:!w-[4rem] md:!h-[4rem] text-black rounded-sm md:rounded-[1rem] font-bold md:text-[1.5rem]"
                  />
                )}
                shouldAutoFocus
              />
            </div>
            <p className="text-center text-black">
              Didn't get a code?
              <span className="font-bold ml-2 cursor-pointer" onClick={handleResendCodeEmail} >Click to resend.</span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogFooter>
          {/* <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel> */}
          <Button
            onClick={verifyEmail}
            className="w-full"
            disabled={isSubmitting || otp.length < 4}
          >
            {
              isSubmitting ? 
              "Verifying..."
              : "Verify"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyUsername;
