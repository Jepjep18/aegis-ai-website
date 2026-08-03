import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";

export default function SocialLogin() {
  return (
    <Button
      variant="outline"
      className="
        h-12
        w-full
        rounded-xl
        border-white/10
        bg-transparent
        hover:bg-white/5
      "
    >
      <FcGoogle className="mr-3 text-xl" />

      Continue with Google
    </Button>
  );
}