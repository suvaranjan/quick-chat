import prisma from "../db";

export const findUserByClerkId = async (clerkUserId: string) => {
  return await prisma.user.findUnique({
    where: { clerkUserId },
  });
};

export const searchUsers = async (query: string, excludeUserId: string) => {
  return await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
      NOT: { clerkUserId: excludeUserId },
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
    },
  });
};

export const searchUsersPaginated = async (
  query: string,
  excludeUserId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const skip = (page - 1) * pageSize;

  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        NOT: { clerkUserId: excludeUserId },
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
      skip,
      take: pageSize,
    }),
    prisma.user.count({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        NOT: { clerkUserId: excludeUserId },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    users,
    totalPages,
    currentPage: page,
  };
};
