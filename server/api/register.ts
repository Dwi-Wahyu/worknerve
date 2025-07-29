import { hashSync } from "bcrypt";
import prisma from "~/lib/prisma";
import { registerSchema, RegisterSchemaType } from "~/schema/auth";

export default defineEventHandler(async (event) => {
  let body: RegisterSchemaType;

  try {
    body = await readBody(event);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }

  try {
    await registerSchema.validate(body, { abortEarly: false });
  } catch (validationError: any) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validationError.errors,
    });
  }

  try {
    const hashedPassword = hashSync(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    console.log(user);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
});
