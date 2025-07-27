import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: user.id,
      },
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching credentials:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch credentials",
      data: error,
    });
  }
});
