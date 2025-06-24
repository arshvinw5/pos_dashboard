"use client";

import { useUser } from "@clerk/nextjs";

const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();
  return (
    <div className="text-white space-y-2 mb-4">
      <h2 className="text-2xl lg:text-4xl font-medium">
        Welcome back{isLoaded ? ", " : " "}
        {user?.firstName || "User"}
      </h2>
      <p className="text-sm lg:text-base text-[#a7a7a7]">
        This is your POS overview report and dashboard
      </p>
    </div>
  );
};

export default WelcomeMsg;
