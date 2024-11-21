"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { MessageSquareText, Settings, Users, PanelLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DesktopNavbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const navItems = [
    {
      icon: <MessageSquareText size={18} strokeWidth={2} />,
      label: "Chats",
      href: "/conversations",
    },
    {
      icon: <Users size={18} strokeWidth={2} />,
      label: "Friends",
      href: "/friends",
    },
    {
      icon: <Settings size={18} strokeWidth={2} />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div
      className={`hidden lg:flex flex-col ${
        isExpanded ? "w-48 px-2" : "w-14"
      } h-screen bg-background border-r transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4">
        <Link
          href="/"
          className={`${
            isExpanded ? "w-24" : "w-8"
          } h-8 flex items-center justify-between`}
        >
          <span className="text-sm font-semibold">
            {isExpanded ? "QuickChat" : "QC"}
          </span>
        </Link>
        {isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <PanelLeft size="18px" strokeWidth={2} />
          </Button>
        )}
      </div>

      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${
                    isExpanded ? "px-3" : "px-0 justify-center"
                  } ${pathname === item.href ? "bg-accent" : ""}`}
                >
                  {item.icon}
                  {isExpanded && (
                    <span className="ml-2 text-sm">{item.label}</span>
                  )}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        {isExpanded ? (
          <div className="flex items-center space-x-3">
            <UserButton />
            <span className="text-sm font-medium">
              {isLoaded && isSignedIn && user && user.firstName}
            </span>
          </div>
        ) : (
          <div className="flex flex-col-reverse items-center gap-3">
            <UserButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              <PanelLeft size="18px" strokeWidth={2} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { MessageSquareText, Settings, Users, PanelLeft } from "lucide-react";

// export default function DesktopNavbar() {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const pathname = usePathname();

//   const toggleSidebar = () => setIsExpanded(!isExpanded);

//   const navItems = [
//     {
//       icon: <MessageSquareText size={18} strokeWidth={2} />,
//       label: "Chats",
//       href: "/conversations",
//     },
//     {
//       icon: <Users size={18} strokeWidth={2} />,
//       label: "Friends",
//       href: "/friends",
//     },
//     {
//       icon: <Settings size={18} strokeWidth={2} />,
//       label: "Settings",
//       href: "/settings",
//     },
//   ];

//   return (
//     <div
//       className={`hidden lg:flex flex-col ${
//         isExpanded ? "w-48 px-2" : "w-14"
//       } h-screen bg-background border-r transition-all duration-300 ease-in-out`}
//     >
//       <div className="flex items-center justify-between p-4">
//         <Link
//           href="/"
//           className={`${
//             isExpanded ? "w-24" : "w-8"
//           } h-8 flex items-center justify-between`}
//         >
//           <span className="text-sm font-semibold">
//             {isExpanded ? "QuickChat" : "QC"}
//           </span>
//         </Link>
//         {isExpanded && (
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={toggleSidebar}
//             className="h-8 w-8"
//           >
//             <PanelLeft size="18px" strokeWidth={2} />
//           </Button>
//         )}
//       </div>

//       <nav className="flex-1 mt-4">
//         <ul className="space-y-1">
//           {navItems.map((item, index) => (
//             <li key={index}>
//               <Link href={item.href} className="block">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className={`w-full justify-start ${
//                     isExpanded ? "px-3" : "px-0 justify-center"
//                   } ${pathname === item.href ? "bg-accent" : ""}`}
//                 >
//                   {item.icon}
//                   {isExpanded && (
//                     <span className="ml-2 text-sm">{item.label}</span>
//                   )}
//                 </Button>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <div className="p-4">
//         {isExpanded ? (
//           <Link href="/profile" className="flex items-center space-x-3">
//             <Avatar className="h-8 w-8">
//               <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//               <AvatarFallback>JD</AvatarFallback>
//             </Avatar>
//             <span className="text-sm font-medium">John Doe</span>
//           </Link>
//         ) : (
//           <div className="flex flex-col-reverse items-center gap-3">
//             <Link href="/profile">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage
//                   src="https://github.com/shadcn.png"
//                   alt="@shadcn"
//                 />
//                 <AvatarFallback>JD</AvatarFallback>
//               </Avatar>
//             </Link>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleSidebar}
//               className="h-8 w-8"
//             >
//               <PanelLeft size="18px" strokeWidth={2} />
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
