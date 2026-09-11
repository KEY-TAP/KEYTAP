"use client";

import { createContext, useContext, type ReactNode } from "react";

type AdminAuthContextValue = {
  adminName: string;
};

const AdminAuthContext = createContext<AdminAuthContextValue>({ adminName: "" });

export function AdminAuthProvider({
  adminName,
  children,
}: {
  adminName: string;
  children: ReactNode;
}) {
  return (
    <AdminAuthContext.Provider value={{ adminName }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
