import { defineEventHandler, getHeader, createError, sendRedirect } from "h3";

import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  if (["/api/login", "/"].includes(url.pathname)) {
    return;
  }

  const authHeader = getHeader(event, "Authorization");

  if (!authHeader) {
    sendRedirect(event, "/");
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authorization header is missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Token is missing from Authorization header.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "JWT_SECRET is not configured on the server.",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    event.context.user = decoded;
  } catch (err: any) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: err.message || "Invalid or expired token.",
    });
  }
});
