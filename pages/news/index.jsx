import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { newsService } from "@/services/newsService";
import styles from "@/styles/client/newsPage.module.css";
import ClientLayout from "@/layouts/ClientLayout";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(dateString));
};

const CATEGORIES = ["Tất cả", "Kiến thức xe", "Tin tức", "Khuyến mãi", "Review"];

export default function NewsPage({ newsList, featuredList, totalCount, currentPage, pageSize }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const mapArticle = (article) => ({
    ...article,
    image: article.image || "",
    excerpt: article.summary || article.description || "",
    hot: article.isFeatured || article.featured || false,
    date: (article.created_at || article.createdAt) ? formatDate(article.created_at || article.createdAt) : "",
    readTime: "5 phút đọc",
    category: article.category?.name || article.category || "Tin tức",
  });

  const allNews = newsList.map(mapArticle);
  const featuredNews = featuredList.map(mapArticle)[0] || allNews[0];

  const filtered =
    activeCategory === "Tất cả"
      ? allNews
      : allNews.filter((n) => n.category === activeCategory);

  const rest = (featuredNews && currentPage === 1) ? filtered.filter(n => n.id !== featuredNews.id) : filtered;

  const totalPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    });
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tin tức & Blog | Phụ tùng Shop" />
        <meta name="twitter:description" content="Chia sẻ kinh nghiệm độ xe và tin tức phụ tùng chính hãng." />
        <meta name="twitter:image" content="https://feichi.htechsoft.vn/about-us.png" />
      </Head>

      <div className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Tin tức</h1>
            <p className={styles.subtitle}>
              Cập nhật kiến thức, xu hướng và ưu đãi mới nhất
            </p>
          </div>

          {/* <div className={styles.filterRow}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div> */}

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <i className="bi bi-newspaper" />
              <p>Chưa có bài viết nào trong danh mục này.</p>
            </div>
          ) : (
            <>
              {featuredNews && activeCategory === "Tất cả" && currentPage === 1 && (
                <Link
                  href={`/news/${featuredNews.slug}`}
                  className={styles.featured}
                >
                  <div className={styles.featuredImg}>
                    <Image
                      src={featuredNews.image}
                      fill
                      alt={featuredNews.title}
                      className={styles.featuredImgEl}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                    />
                    {featuredNews.hot && (
                      <span className={styles.hotBadge}>🔥 Hot</span>
                    )}
                  </div>
                  <div className={styles.featuredInfo}>
                    {/* <span className={styles.catTag}>{featuredNews.category}</span> */}
                    <h2 className={styles.featuredTitle}>{featuredNews.title}</h2>
                    <p className={styles.featuredExcerpt}>{featuredNews.excerpt}</p>
                    <div className={styles.meta}>
                      <span>
                        <i className="bi bi-calendar3" /> {featuredNews.date}
                      </span>
                      <span>
                        <i className="bi bi-clock" /> {featuredNews.readTime}
                      </span>
                    </div>
                    <span className={styles.readMore}>
                      Đọc tiếp <i className="bi bi-arrow-right" />
                    </span>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="row g-4 mt-2">
                  {rest.map((news) => (
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
                          {news.hot && (
                            <span className={styles.hotBadge}>🔥 Hot</span>
                          )}
                        </div>

                        <div className={styles.cardInfo}>
                          {/* <span className={styles.catTag}>{news.category}</span> */}
                          <h3 className={styles.cardTitle}>{news.title}</h3>
                          <p className={styles.cardExcerpt}>{news.excerpt}</p>
                          <div className={styles.meta}>
                            <span>
                              <i className="bi bi-calendar3" /> {news.date}
                            </span>
                            <span>
                              <i className="bi bi-clock" /> {news.readTime}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

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
  const limit = parseInt(query.limit || "12");

  try {
    const [newsRes, featuredRes] = await Promise.all([
      newsService.getPublicNews({ page, limit }),
      newsService.getFeaturedNews(),
    ]);

    let newsList = [];
    let totalCount = 0;

    if (newsRes?.success) {
      if (Array.isArray(newsRes.data)) {
        newsList = newsRes.data;
        totalCount = newsRes.total ?? newsRes.data.length;
      } else {
        newsList = newsRes.data?.items ?? newsRes.data?.data ?? [];
        totalCount = newsRes.data?.total ?? newsRes.total ?? newsList.length;
      }
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
    console.error("Error fetching news:", error);
    return {
      props: {
        newsList: [],
        featuredList: [],
        totalCount: 0,
        currentPage: page,
        pageSize: limit,
      },
    };
  }
}


