import { compareSync } from "bcrypt";
import prisma from "~/lib/prisma";
import { loginSchema, LoginSchemaType } from "~/schema/auth";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  let body: LoginSchemaType;

  try {
    body = await readBody(event);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }

  try {
    await loginSchema.validate(body, { abortEarly: false });
  } catch (validationError: any) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validationError.errors,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Username atau Password salah",
        token: "",
        user: null,
      };
    }

    const passwordValid = compareSync(body.password, user.password);

    if (!passwordValid) {
      return {
        success: false,
        error: "Username atau Password salah",
        token: "",
        user: null,
      };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError({
        statusCode: 500,
        message: "JWT_SECRET is not configured.",
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      success: true,
      error: "",
      token,
      user: payload,
    };
  } catch (error) {
    return {
      success: false,
      error: "",
      token: "",
      user: null,
    };
  }
});
