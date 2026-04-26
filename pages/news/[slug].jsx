import Head from "next/head";
import ClientLayout from "@/layouts/ClientLayout";
import { newsService } from "@/services/newsService";
import DetailNews from "@/components/news/DetailNews";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(dateString));
};

export default function NewsDetailPage({ article }) {
  if (!article) {
    return (
      <ClientLayout>
        <div className="page" style={{ padding: "2rem 0 4rem" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <h1>Không tìm thấy tin tức</h1>
            <p>Tin tức bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const mappedArticle = {
    ...article,
    image: article.image || "https://feichi.htechsoft.vn/about-us.png",
    excerpt: article.summary || article.description || "",
    hot: article.isFeatured || article.featured || false,
    date: (article.created_at || article.createdAt) ? formatDate(article.created_at || article.createdAt) : "",
    readTime: "5 phút đọc",
    category: article.category?.name || article.category || "Tin tức",
  };

  return (
    <ClientLayout>
      <Head>
        <title>{`${mappedArticle.title} | Shop Feichi`}</title>
        <meta name="description" content={mappedArticle.excerpt} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${mappedArticle.title} | Shop Feichi`} />
        <meta property="og:description" content={mappedArticle.excerpt} />
        <meta property="og:image" content={mappedArticle.image?.startsWith('/') ? `https://feichi.htechsoft.vn${mappedArticle.image}` : mappedArticle.image} />
        <meta property="og:url" content={`https://feichi.htechsoft.vn/news/${mappedArticle.slug}`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={mappedArticle.title} />
        <meta name="twitter:description" content={mappedArticle.excerpt} />
        <meta name="twitter:image" content={mappedArticle.image?.startsWith('/') ? `https://feichi.htechsoft.vn${mappedArticle.image}` : mappedArticle.image} />
      </Head>
      <DetailNews article={mappedArticle} />
    </ClientLayout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await newsService.getNewsBySlug(params.slug);

    return {
      props: {
        article: res.success ? res.data : null,
      },
    };
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return {
      props: {
        article: null,
      },
    };
  }
}

