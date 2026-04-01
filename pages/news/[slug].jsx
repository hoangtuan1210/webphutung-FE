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
        <title>{article.title} | Phụ tùng Anh Hậu</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
      </Head>
      <DetailNews article={article} />
    </ClientLayout>
  );
}


export async function getStaticPaths() {
  const paths = newsList.map((item) => ({
    params: { slug: item.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = newsList.find((item) => item.slug === params.slug);

  return {
    props: {
      article: article || null,
    },
    revalidate: 3600,
  };
}
