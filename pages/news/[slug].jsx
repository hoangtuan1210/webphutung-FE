import Head from "next/head";
import ClientLayout from "@/layouts/ClientLayout";
import { newsList } from "@/data/news";
import DetailNews from "@/components/news/DetailNews";

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

  return (
    <ClientLayout>
      <Head>
        <title>{article.title} | Shop Phụ Tùng</title>
        <meta name="description" content={article.excerpt} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${article.title} | Shop Phụ Tùng`} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:url" content={`https://shopphutung.com/news/${article.slug}`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.image} />
      </Head>
      <DetailNews article={article} />
    </ClientLayout>
  );
}



export async function getServerSideProps({ params }) {
  const article = newsList.find((item) => item.slug === params.slug);

  return {
    props: {
      article: article || null,
    },
  };
}
