// route.ts

import { NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import prisma from "@/db/db";

export async function GET() {
  console.log("Running NEW USER CREATION Route");

  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get user's information from Clerk
  const user = await currentUser();
  if (!user) {
    return new NextResponse("User does not exist", { status: 404 });
  }

  // Check if the user already exists in the database
  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  // If the user does not exist, create a new user in the database
  if (!dbUser) {
    try {
      // Generate a unique username with the first letter capitalized
      let username = capitalizeFirstLetter(
        user.username || `${user.firstName}`
      );

      let isUsernameTaken = await prisma.user.findFirst({
        where: { username: { equals: username, mode: "insensitive" } },
      });

      // If the username is taken, append a number to make it unique
      let attempt = 1;
      while (isUsernameTaken) {
        const newUsername = capitalizeFirstLetter(`${username}${attempt}`);
        isUsernameTaken = await prisma.user.findFirst({
          where: { username: { equals: newUsername, mode: "insensitive" } },
        });
        if (!isUsernameTaken) {
          username = newUsername;
          break;
        }
        attempt++;
      }

      // Create the new user with the unique username
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: user.id,
          username,
          email: user.emailAddresses[0].emailAddress,
          avatar: user.imageUrl,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return new NextResponse("Failed to create user", { status: 500 });
    }
  }

  // Perform any additional logic or redirect the user to the dashboard
  return NextResponse.redirect("http://localhost:3000/conversations");
}

function capitalizeFirstLetter(username: string) {
  return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
}
