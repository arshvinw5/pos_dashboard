import Image from "next/image";
import HeaderLogo from "./header_logo";
import Navigation from "./navigation";

const Header = () => {
  return (
    <header className="relative h-[24vh] w-full md:w-full bg-zinc-800/90">
      <div>
        <Image
          src="/imgs/new_db.jpg"
          alt="hero_bg"
          fill={true}
          className="absolute w-full h-full object-cover overflow-hidden mix-blend-overlay"
        />
      </div>
      <div className="absolute flex items-center px-3 md:px-14 h-full pb-36">
        <div className="max-w-screen mx-auto">
          <div className="flex items-center lg:gap-x-20">
            <HeaderLogo />
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
