import Link from "next/link";
import NewsCard from "./NewsCard";
import styles from "@/styles/client/home.module.css";

export default function NewsSection({ news }) {
  const highlighted = news || [];

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Tin tức nổi bật</h3>

      <div className="row g-4">
        {highlighted[0] && (
          <div className="col-md-6">
            <Link href={`/news/${highlighted[0].slug}`} className={styles.newsLink}>
              <NewsCard {...highlighted[0]} size="big" />
            </Link>
          </div>
        )}

        <div className="col-md-6 d-flex flex-column gap-4">
          {highlighted.slice(1).map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className={styles.newsLink}>
              <NewsCard {...item} />
            </Link>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <Link href="/news" className={styles.viewMoreBtn}>
          Xem thêm <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
