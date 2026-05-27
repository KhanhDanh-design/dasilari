import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClientPage";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.email !== "2212390@dlu.edu.vn") {
    redirect("/");
  }

  return <AdminClientPage />;
}
