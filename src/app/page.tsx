import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import ChatCard from "./chatCard";

export default async function Home() {
  const { userId } = await auth();

  if (userId !== null) redirect("/conversations");

  return (
    <div className="relative flex flex-col items-center h-screen">
      {/* Full-Screen Hero Section */}
      <section className="flex flex-col justify-center items-center px-6 text-center w-full h-full relative overflow-hidden">
        <header className="absolute top-6 left-0 right-0 z-50 mx-3">
          <nav className="rounded-full bg-white/80 backdrop-blur-md shadow-lg px-6 py-4 mx-auto max-w-2xl flex justify-between items-center">
            <Link href="/" className="text-lg font-semibold">
              Quick<span className="font-bold text-blue-600">Chat</span>
            </Link>
            <Button asChild variant="outline" className="rounded-full">
              <SignInButton />
            </Button>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto z-20">
          <div className="z-10 flex mb-8 items-center justify-center">
            <AnimatedGradientText>
              🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
                Introducing Custom Room
              </span>
              <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-800 leading-tight">
            Welcome to <span className="text-blue-600">QuickChat</span>
          </h1>
          <p className="text-base mb-10 max-w-md mx-auto text-gray-700 leading-relaxed">
            Connect with friends, create groups, and chat in custom rooms.
          </p>

          <div className="flex justify-center">
            <Button className="rounded-full px-9 py-5 text-md" asChild>
              <SignUpButton />
            </Button>
          </div>
        </div>

        {/* Decorative Gradient Circles */}
        <div className="absolute -bottom-10 -left-16 w-72 h-72 rounded-full bg-purple-300 opacity-30 blur-2xl"></div>
        <div className="absolute -top-10 -right-16 w-72 h-72 rounded-full bg-blue-300 opacity-30 blur-2xl"></div>
      </section>

      {/* Footer positioned at the bottom */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs flex items-center justify-center text-muted-foreground">
        <p>Brought to you by Suvaranjan</p>
        <ExternalLink className="ml-1 h-4 w-4" />
      </footer>
    </div>
  );
}
