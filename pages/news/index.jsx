import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { newsList as staticNewsList, categories } from "@/data/news";
import styles from "@/styles/client/newsPage.module.css";
import ClientLayout from "@/layouts/ClientLayout";

export default function NewsPage({ newsList }) {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const filtered =
    activeCategory === "Tất cả"
      ? newsList
      : newsList.filter((n) => n.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <ClientLayout>
      <Head>
        <title>Tin tức & Blog | Phụ tùng Anh Hậu</title>
        <meta name="description" content="Cập nhật kiến thức bảo dưỡng xe, xu hướng đồ chơi xe và các chương trình khuyến mãi mới nhất từ Phụ tùng Anh Hậu." />
        <meta property="og:title" content="Tin tức & Blog | Phụ tùng Anh Hậu" />
        <meta property="og:description" content="Chia sẻ kinh nghiệm độ xe và tin tức phụ tùng chính hãng." />
      </Head>

      <div className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Tin tức</h1>
            <p className={styles.subtitle}>
              Cập nhật kiến thức, xu hướng và ưu đãi mới nhất
            </p>
          </div>

          <div className={styles.filterRow}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <i className="bi bi-newspaper" />
              <p>Chưa có bài viết nào trong danh mục này.</p>
            </div>
          ) : (
            <>
              {featured && (
                <Link
                  href={`/news/${featured.slug}`}
                  className={styles.featured}
                >
                  <div className={styles.featuredImg}>
                    <Image
                      src={featured.image}
                      fill
                      alt={featured.title}
                      className={styles.featuredImgEl}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                    />
                    {featured.hot && (
                      <span className={styles.hotBadge}>🔥 Hot</span>
                    )}
                  </div>
                  <div className={styles.featuredInfo}>
                    <span className={styles.catTag}>{featured.category}</span>
                    <h2 className={styles.featuredTitle}>{featured.title}</h2>
                    <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                    <div className={styles.meta}>
                      <span>
                        <i className="bi bi-calendar3" /> {featured.date}
                      </span>
                      <span>
                        <i className="bi bi-clock" /> {featured.readTime}
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
                          <span className={styles.catTag}>{news.category}</span>
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
            </>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      newsList: staticNewsList,
    },
    revalidate: 3600,
  };
}
