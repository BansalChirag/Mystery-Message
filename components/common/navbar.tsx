"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const user = useCurrentUser();
  const router = useRouter()
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center ">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0 flex items-center gap-2">
          Mystery Message 
        </Link>
        {user ? (
          <>
            <span>Welcome,{user?.username || user?.email}</span>
            <Button
              onClick={() => signOut()}
              variant='outline'
              className="w-full md:w-auto bg-slate-100 text-black"
            >
              Logout
            </Button>
          </>
        ) : (
            <Button variant='outline' className="w-full md:w-auto bg-slate-100 text-black" onClick={()=>router.replace('/login')} >Login</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
