import NewsForm from "../../../components/admin/news/NewsForm";
import AdminLayout from "@/layouts/AdminLayout";

export default function AddNewsPage() {
  return <NewsForm />;
}

AddNewsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
