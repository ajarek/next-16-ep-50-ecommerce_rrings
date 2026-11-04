"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  browserPopupRedirectResolver,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { syncUserProfile } from "@/lib/firebase/users";
import { clearServerSession, syncServerSession } from "@/lib/auth/session-client";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface RegisterInput {
  displayName: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAdmin: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (input: RegisterInput) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    isFirebaseConfigured ? "loading" : "unauthenticated",
  );
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const auth = getFirebaseAuth();

    const unsubscribe = onIdTokenChanged(auth, (nextUser) => {
      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "unauthenticated");

      if (!nextUser) {
        setIsAdmin(false);
        return;
      }

      void syncUserProfile(nextUser);
      void syncServerSession(nextUser).then((session) => {
        setIsAdmin(session.isAdmin);
      });
    });

    return unsubscribe;
  }, []);

  // Cookie musi powstać przed nawigacją — inaczej serwerowy guard /admin
  // zobaczyłby jeszcze niezalogowanego użytkownika.
  const refreshServerSession = useCallback(async (currentUser: User) => {
    const session = await syncServerSession(currentUser);
    setIsAdmin(session.isAdmin);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(
      getFirebaseAuth(),
      provider,
      browserPopupRedirectResolver,
    );

    await refreshServerSession(credential.user);
  }, [refreshServerSession]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      );

      await refreshServerSession(credential.user);
    },
    [refreshServerSession],
  );

  const registerWithEmail = useCallback(async (input: RegisterInput) => {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      input.email,
      input.password,
    );

    const displayName = input.displayName.trim();

    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }

    // Weryfikacja e-mailu nie może blokować utworzonego już konta.
    try {
      await sendEmailVerification(credential.user);
    } catch (error) {
      console.warn(
        "[auth] Nie udało się wysłać wiadomości weryfikacyjnej.",
        error instanceof Error ? error.message : "nieznany błąd",
      );
    }

    await syncUserProfile(credential.user);
    await refreshServerSession(credential.user);
  }, [refreshServerSession]);

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendPasswordResetEmail(getFirebaseAuth(), email);
  }, []);

  const signOut = useCallback(async () => {
    await clearServerSession();
    await firebaseSignOut(getFirebaseAuth());
    setIsAdmin(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAdmin,
      isConfigured: isFirebaseConfigured,
      signInWithGoogle,
      signInWithEmail,
      registerWithEmail,
      sendPasswordReset,
      signOut,
    }),
    [
      user,
      status,
      isAdmin,
      signInWithGoogle,
      signInWithEmail,
      registerWithEmail,
      sendPasswordReset,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth musi być użyte wewnątrz AuthProvider.");
  }

  return context;
}
