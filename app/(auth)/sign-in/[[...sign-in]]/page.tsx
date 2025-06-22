import { Loader2 } from "lucide-react";
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* left side of the screen */}
      <div className="h-full lg:flex flex-col items-center justify-center px-4 bg-[#FEFAF6]">
        <div className="text-center space-y-4 pt-16">
          <h1 className="text-4xl font-bold text-[#2E2A47]">- POS -</h1>
          <p className="text-lg text-[#7E8CA0]">
            Please sign in to continue using #POS admin privileges.
          </p>
          <div className="flex items-center justify-center mt-8">
            <ClerkLoaded>
              <SignIn />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin h-8 w-8 text-[#2E2A47]" />
            </ClerkLoading>
          </div>
        </div>
      </div>
      {/* right side of the screen */}
      <div className="h-full bg-black hidden lg:flex justify-center items-center">
        <Image src="/logo/logo.svg" height={100} width={100} alt="logo" />
      </div>
    </div>
  );
}
