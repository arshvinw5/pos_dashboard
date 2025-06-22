"use client";

import { usePathname } from "next/navigation";
import { NavButton } from "./nav_button";

const routes = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/transactions", label: "Transactions" },
  { href: "/team", label: "Team" },
  { href: "/categories", label: "Categories" },
  { href: "/settings", label: "Settings" },
];

const Navigation = () => {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;
