import { useContext } from "react";
import AuthContext from "@/contexts/auth";

export const useUserAvatarUrl = (username: string): string => {
  const authCtx = useContext(AuthContext);
  return (
    window.location.origin +
    process.env.NEXT_PUBLIC_USER_CONTENT_BASE_URL +
    `avatar/${username}.png` +
    `?t=${authCtx.currentVisitTime}`
  );
};
