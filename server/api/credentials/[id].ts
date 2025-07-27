import prisma from "~/lib/prisma";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Credential ID is required.",
    });
  }

  try {
    const credential = await prisma.credential.findFirst({
      where: {
        id: parseInt(id as string),
      },
    });

    if (!credential) {
      throw createError({
        statusCode: 404,
        statusMessage: "Credential not found.",
      });
    }

    return {
      success: true,
      credential,
    };
  } catch (error: any) {
    console.error("Error fetching credential:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to fetch credential",
      data: error.data || error,
    });
  } finally {
    await prisma.$disconnect();
  }
});
