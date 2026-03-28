import Image from "next/image";
import styles from "@/styles/client/home.module.css";

export default function NewsCard({ image, title, desc, date, category, size = "small" }) {
  const cardClass = `${styles.newsCard} ${
    size === "big" ? styles.newsBig : styles.newsSmall
  }`;

  return (
    <div className={cardClass}>
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width:768px) 100vw, 50vw"
        className={styles.newsImg}
      />

      <div className={styles.newsOverlay}></div>

      <div className={styles.newsText}>
        {size === "big" ? <h4>{title}</h4> : <h6>{title}</h6>}
        {(date || category) && (
          <div className={styles.newsMeta}>
            {date && <span>{date}</span>}
            {date && category && <span> • </span>}
            {category && <span>{category}</span>}
          </div>
        )}
        {desc && <p>{desc}</p>}
      </div>
    </div>
  );
}