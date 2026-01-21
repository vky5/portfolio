"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import("@/components/Admin/Editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  ),
});

export default function EditorPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Immediate check on mount
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin");
    } else {
      setIsAuthorized(true);
      setChecking(false);
    }
  }, [router]);

  // While checking or if not authorized (redirecting), show nothing or spinner
  if (checking || !isAuthorized) {
    return null;
  }

  // Only load the heavy Editor if authorized
  return <Editor />;
}
