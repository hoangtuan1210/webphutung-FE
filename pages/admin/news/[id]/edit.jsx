import NewsForm from "../../../../components/admin/news/NewsForm";
import AdminLayout from "@/layouts/AdminLayout";
import { MOCK_NEWS } from "../../../../constants/news";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

export default function EditNewsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (id) {
      const newsItem = MOCK_NEWS.find((n) => n.id === Number(id));
      if (newsItem) {
        setEditData(newsItem);
      }
    }
  }, [id]);

  if (!id) return null;

  if (id && !editData) {
    return <Box padding={4}>Không tìm thấy bài viết.</Box>;
  }

  return <NewsForm editData={editData} />;
}

EditNewsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
