"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  profileURL?: string;
}

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // Check if user exists in database
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // Save user to database
    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
      // Add other fields as needed
      // profileURL: "",
      // resumeURL: "",
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // Type narrowing to check if error has a 'code' property
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code: string }).code === "string"
    ) {
      const firebaseError = error as { code: string };

      if (firebaseError.code === "auth/email-already-exists") {
        return {
          success: false,
          message: "This email is already in use",
        };
      }
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // Verify the user exists
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    // Set the session cookie
    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Successfully signed in.",
    };
  } catch (error: unknown) {
    console.error("Sign-in error:", error);

    // Handle specific Firebase Auth errors
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code: string }).code === "string"
    ) {
      const firebaseError = error as { code: string };

      switch (firebaseError.code) {
        case "auth/user-not-found":
          return {
            success: false,
            message: "No account found with this email.",
          };
        case "auth/invalid-id-token":
          return {
            success: false,
            message: "Invalid authentication token.",
          };
        default:
          break;
      }
    }

    return {
      success: false,
      message: "Failed to sign in. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  
  return {
    success: true,
    message: "Successfully signed out.",
  };
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Get user info from database
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    
    if (!userRecord.exists) return null;

    const userData = userRecord.data();
    return {
      ...userData,
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}