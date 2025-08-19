"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const StudentEntryPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && session?.user?.userProfile) {
      router.push("/student/profile-view");
    } else {
      router.push("/student/create-profile");
    }
  }, [router, session?.user]);

  return <div>Redirecting ...</div>;
};

export default StudentEntryPage;
