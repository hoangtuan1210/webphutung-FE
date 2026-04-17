import Image from "next/image";
import Link from "next/link";
import usePromotionBanner from "@/hooks/usePromotionBanner";
import styles from "@/styles/client/promoBanner.module.css";

export default function PromoBanner({
  initialPromotions = [],
  position = "home_middle",
}) {
  const { promotions, loading } = usePromotionBanner({
    position,
    initialData: initialPromotions,
    enableRefetch: true,
  });

  if (loading && (!promotions || promotions.length === 0)) {
    return (
      <section className={styles.promoSection}>
        <div className={styles.promoContainer}>
          <div className={`${styles.skeleton} ${styles.skeletonSingle}`} />
        </div>
      </section>
    );
  }

  if (!promotions || promotions.length === 0) return null;

  return (
    <section className={styles.promoSection}>
      <div className={styles.promoContainer}>
        <div className={styles.promoList}>
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              href={promo.link || "/products"}
              className={styles.promoLink}
            >
              <Image
                src={promo.image || "/promotion-banner.jpg"}
                width={1920}
                height={400}
                alt={promo.title || "Promotion banner"}
                className={styles.promoImage}
                style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
                priority
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

