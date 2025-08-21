"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const StudentEntryPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.userProfile) {
      router.push("/student/create-profile");
    }
  }, [router, session?.user?.userProfile]);

  return (<div>
    <h3>student dashboard</h3>
  </div>);
};

export default StudentEntryPage;
