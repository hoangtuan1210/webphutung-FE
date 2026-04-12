import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return null;
}

AdminIndex.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
