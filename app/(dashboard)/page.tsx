import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className=" font-bold text-white overflow-hidden ">
          This is an authenticated route
        </h1>
        <div>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
