"use server";

import { auth } from "../auth";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import { cookies } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        password,
        email,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof APIError) {
      return error;
    }
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof APIError) {
      return error;
    }
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  return result;
};

export const updatePassword = async (
  newPassword: string,
  currentPassword: string,
) => {
  if (!newPassword || !currentPassword) {
    return { success: false, message: "All fields are required." };
  }

  const requestHeaders = await headers();
  const cookieSet = await cookies();
  try {
    await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      headers: requestHeaders,
    });

    cookieSet.set("password_updated", "1", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60,
    });

    return {
      success: true,
      message: "Password has been updated.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const updateName = async (newName: string) => {
  const lettersOnly = /^[A-Za-z ]+$/;
  if (!newName) {
    return {
      success: false,
      message: "Please provide a name.",
    };
  }
  if (!lettersOnly.test(newName)) {
    return {
      success: false,
      message: "Only letters are allowed for a name.",
    };
  }
  try {
    await auth.api.updateUser({
      body: {
        name: newName,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Name has been updated",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong!",
      };
    }
  }
};
