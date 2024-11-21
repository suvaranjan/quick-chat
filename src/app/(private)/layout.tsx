import DesktopNavbar from "@/components/mycomps/DesktopNavbar";
import MobileNavbar from "@/components/mycomps/MobileNavbar";
import { ReactNode } from "react";

export default function PrivateRoutesMainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex">
      <DesktopNavbar />
      <div className="flex-1">{children}</div>
      <MobileNavbar />
    </div>
  );
}
