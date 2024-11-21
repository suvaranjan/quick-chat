"use client";

import React from "react";
import { MessageSquareText, Users, Settings } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function MobileNavbar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  const navItems = [
    {
      icon: <MessageSquareText size={22} />,
      label: "Chats",
      href: "/conversations",
    },
    { icon: <Users size={22} />, label: "Friends", href: "/friends" },
    { icon: <Settings size={22} />, label: "Settings", href: "/settings" },
  ];

  const isInChatRoom =
    pathname.startsWith("/conversations/") && pathname !== "/conversations";

  // Only render the navbar if we're on mobile and not in a chat room
  if (!isMobile || isInChatRoom) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href} className="flex-1">
            <div className="flex flex-col items-center justify-center space-y-1 h-full">
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </div>
          </Link>
        ))}
        <div className="flex-1 flex flex-col items-center justify-center space-y-1 h-full mx-0">
          <UserButton />
          <span className="text-xs">Profile</span>
        </div>
      </div>
    </nav>
  );
}

// "use client";

// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { MessageSquareText, Users, Settings } from "lucide-react";
// import { useMediaQuery } from "@/hooks/useMediaQuery";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { useUser } from "@clerk/nextjs"; // Import the useUser hook

// export default function MobileNavbar() {
//   const { isLoaded, isSignedIn, user } = useUser(); // Destructure useUser values
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const pathname = usePathname();

//   const navItems = [
//     {
//       icon: <MessageSquareText size={22} />,
//       label: "Chats",
//       href: "/conversations",
//     },
//     { icon: <Users size={22} />, label: "Friends", href: "/friends" },
//     { icon: <Settings size={22} />, label: "Settings", href: "/settings" },
//     {
//       icon: (
//         <Avatar className="h-6 w-6">
//           {isLoaded && isSignedIn && user ? (
//             <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
//           ) : (
//             <AvatarFallback>JD</AvatarFallback>
//           )}
//         </Avatar>
//       ),
//       label: "Profile",
//       href: "/user-profile",
//     },
//   ];

//   const isInChatRoom =
//     pathname.startsWith("/conversations/") && pathname !== "/conversations";

//   // Only render the navbar if we're on mobile and not in a chat room
//   if (!isMobile || isInChatRoom) {
//     return null;
//   }

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
//       <div className="flex justify-around items-center h-16">
//         {navItems.map((item, index) => (
//           <Link key={index} href={item.href} className="flex-1">
//             <div className="flex flex-col items-center space-y-1 h-full w-full">
//               {item.icon}
//               <span className="text-xs">{item.label}</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </nav>
//   );
// }
