import { authOptions } from "@/app/utils/authOptions";
import { getDashboardPathByRole } from "@/app/utils/roleRedirect";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { ScaleLoader } from "react-spinners";

export default async function Redirect() {
  const session: Session | null = await getServerSession(authOptions);
  const userRole = session?.user?.roles?.[0];

  if (session === null || !userRole) {
    redirect('/auth/login');
  }

  const redirectPath = getDashboardPathByRole(userRole);
  redirect(redirectPath);
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <ScaleLoader color="#1FAB89" />
    </div>
  );
}