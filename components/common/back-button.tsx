import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
}

const BackButton = ({ href, label}: BackButtonProps) => {
  if (!href) return;
  return (
      <Button className="flex items-center justify-center gap-2 w-full" variant="link" >
      {/* <span >{label}</span> */}
        <Link href={href} >{label}</Link>
      </Button>
  );
};

export default BackButton;
