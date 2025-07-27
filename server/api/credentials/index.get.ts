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
    const credentials = await prisma.credential.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        id: "asc",
      },
    });

    return credentials;
  } catch (error) {
    console.error("Error fetching credentials:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch credentials",
      data: error,
    });
  }
});
