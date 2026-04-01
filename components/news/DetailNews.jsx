import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/client/newsPage.module.css";

export default function DetailNews({ article }) {
  if (!article) return null;

  return (
    <article className={styles.detailWrapper}>
      <div className="container">
        <Link href="/news" className={styles.backBtn}>
          <i className="bi bi-arrow-left" /> Quay lại tin tức
        </Link>

        <header className={styles.detailHeader}>
          <div className={styles.detailMeta}>
            <span className={styles.catTag}>{article.category}</span>
            <span className={styles.date}>{article.date}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.readTime}>{article.readTime}</span>
          </div>
          <h1 className={styles.detailTitle}>{article.title}</h1>
          <p className={styles.detailExcerpt}>{article.excerpt}</p>
        </header>

        {article.image && (
          <div className={styles.detailImage}>
            <Image
              src={article.image}
              alt={article.title}
              width={1200}
              height={600}
              priority
              className={styles.detailImgEl}
            />
          </div>
        )}

        <div 
          className={styles.detailContent}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <footer className={styles.detailFooter}>
           <div className={styles.shareRow}>
              <span>Chia sẻ bài viết:</span>
              <div className={styles.shareIcons}>
                <a href="#"><i className="bi bi-facebook" /></a>
                <a href="#"><i className="bi bi-messenger" /></a>
                <a href="#"><i className="bi bi-link-45deg" /></a>
              </div>
           </div>
        </footer>
      </div>
    </article>
  );
}
