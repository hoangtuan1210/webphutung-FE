import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { newsService } from "@/services/newsService";
import styles from "@/styles/client/newsPage.module.css";
import ClientLayout from "@/layouts/ClientLayout";

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN").format(new Date(dateString));
  } catch (e) {
    return "";
  }
};

const mapArticle = (article) => ({
  ...article,
  image: article.image || "/placeholder.jpg",
  excerpt: article.summary || article.description || "",
  hot: !!(article.isFeatured || article.featured),
  date: (article.created_at || article.createdAt) ? formatDate(article.created_at || article.createdAt) : "",
  category: article.category?.name || article.category || "Tin tức",
});

export default function NewsPage({ newsList, featuredList, totalCount, currentPage, pageSize }) {
  const router = useRouter();

  const allNews = useMemo(() => (newsList || []).map(mapArticle), [newsList]);
  const featuredNews = useMemo(() => {
    if (featuredList?.length > 0) return mapArticle(featuredList[0]);
    return allNews[0] || null;
  }, [featuredList, allNews]);

  const displayNews = useMemo(() => {
    if (!featuredNews || currentPage !== 1) return allNews;
    return allNews.filter(n => n.id !== featuredNews.id);
  }, [allNews, featuredNews, currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    }, undefined, { scroll: true });
  };

  return (
    <ClientLayout>
      <Head>
        <title>Tin tức & Blog | Phụ tùng Shop</title>
        <meta name="description" content="Cập nhật kiến thức bảo dưỡng xe, xu hướng đồ chơi xe và các chương trình khuyến mãi mới nhất từ Phụ tùng Shop." />
        <meta property="og:title" content="Tin tức & Blog | Phụ tùng Feichi" />
        <meta property="og:description" content="Chia sẻ kinh nghiệm độ xe và tin tức phụ tùng chính hãng." />
        <meta property="og:url" content="https://feichi.htechsoft.vn/news" />
        <meta property="og:image" content="https://feichi.htechsoft.vn/about-us.png" />
        <meta property="og:type" content="website" />
      </Head>

      <div className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Tin tức</h1>
            <p className={styles.subtitle}>
              Cập nhật kiến thức, xu hướng và ưu đãi mới nhất
            </p>
          </div>

          {!allNews.length ? (
            <div className={styles.empty}>
              <i className="bi bi-newspaper" />
              <p>Chưa có bài viết nào.</p>
            </div>
          ) : (
            <>
              {featuredNews && currentPage === 1 && (
                <Link href={`/news/${featuredNews.slug}`} className={styles.featured}>
                  <div className={styles.featuredImg}>
                    <Image
                      src={featuredNews.image}
                      fill
                      alt={featuredNews.title}
                      className={styles.featuredImgEl}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                    />
                    {featuredNews.hot && <span className={styles.hotBadge}>🔥 Hot</span>}
                  </div>
                  <div className={styles.featuredInfo}>
                    <h2 className={styles.featuredTitle}>{featuredNews.title}</h2>
                    <p className={styles.featuredExcerpt}>{featuredNews.excerpt}</p>
                    <div className={styles.meta}>
                      <span><i className="bi bi-calendar3" /> {featuredNews.date}</span>
                    </div>
                    <span className={styles.readMore}>
                      Đọc tiếp <i className="bi bi-arrow-right" />
                    </span>
                  </div>
                </Link>
              )}

              {displayNews.length > 0 && (
                <div className="row g-4 mt-2">
                  {displayNews.map((news) => (
                    <div key={news.id} className="col-lg-4 col-md-6">
                      <Link href={`/news/${news.slug}`} className={styles.card}>
                        <div className={styles.cardImg}>
                          <Image
                            src={news.image}
                            fill
                            alt={news.title}
                            className={styles.cardImgEl}
                            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                          />
                          {news.hot && <span className={styles.hotBadge}>🔥 Hot</span>}
                        </div>
                        <div className={styles.cardInfo}>
                          <h3 className={styles.cardTitle}>{news.title}</h3>
                          <p className={styles.cardExcerpt}>{news.excerpt}</p>
                          <div className={styles.meta}>
                            <span><i className="bi bi-calendar3" /> {news.date}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className={styles.paginationArea}>
                  <div className={styles.pageLinks}>
                    <button
                      className={styles.pageLink}
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="bi bi-chevron-left" />
                    </button>

                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        className={`${styles.pageLink} ${page === currentPage ? styles.pageLinkActive : ""}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className={styles.pageLink}
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

export async function getServerSideProps({ query }) {
  const page = parseInt(query.page || "1");
  const limit = 12;

  try {
    const [newsRes, featuredRes] = await Promise.all([
      newsService.getPublicNews({ page, limit }),
      newsService.getFeaturedNews(),
    ]);

    let newsList = [];
    let totalCount = 0;

    if (newsRes?.success) {
      const data = newsRes.data;
      newsList = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
      totalCount = newsRes.total ?? data?.total ?? newsList.length;
    }

    return {
      props: {
        newsList,
        featuredList: featuredRes.success ? featuredRes.data : [],
        totalCount,
        currentPage: page,
        pageSize: limit,
      },
    };
  } catch (error) {
    return {
      props: { newsList: [], featuredList: [], totalCount: 0, currentPage: page, pageSize: limit },
    };
  }
}
