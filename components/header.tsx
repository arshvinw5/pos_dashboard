import Image from "next/image";
import HeaderLogo from "./header_logo";
import Navigation from "./navigation";
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import WelcomeMsg from "./welcome_msg";

const Header = () => {
  return (
    <header className="relative h-[24vh] w-full md:w-full bg-zinc-700/90">
      <div>
        <Image
          src="/imgs/new_db.jpg"
          alt="hero_bg"
          fill={true}
          className="absolute w-full h-full object-cover overflow-hidden mix-blend-overlay"
        />
      </div>
      <div className="absolute flex items-center px-3 md:px-14 h-full pb-36 w-full">
        <div className="w-full mx-auto">
          <div className="w-full flex justify-between items-center mb-14">
            <div className="flex items-center lg:gap-x-20">
              <HeaderLogo />
              <Navigation />
            </div>
            <div className="ml-auto">
              <ClerkLoaded>
                <UserButton afterSignOutUrl="/" />
              </ClerkLoaded>
              <ClerkLoading>
                <Loader2 className="size-8 animate-spin text-slate-400" />
              </ClerkLoading>
            </div>
          </div>
          <WelcomeMsg />
        </div>
      </div>
    </header>
  );
};

export default Header;
