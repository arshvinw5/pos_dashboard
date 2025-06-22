import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image src="/logo/logo.svg" alt="logo" height={70} width={70} />
        <p className="text-white font-semibold text-4xl ml-2.5">
          POS Dashboard
        </p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
