import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerService } from "@/services/bannerService";
import styles from "@/styles/client/promoBanner.module.css";

export default function PromoBanner() {
  const [lastBanner, setLastBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await bannerService.getBanners();
        if (res?.success && res.data?.length > 0) {
          const banner = res.data[res.data.length - 1];
          setLastBanner(banner);
        }

      } catch (err) {
        console.error("Lỗi khi tải banner thân trang:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className={styles.promoSection}>
        <div className={styles.promoContainer}>
          <div className={`${styles.skeleton} ${styles.skeletonSingle}`} />
        </div>
      </section>
    );
  }

  if (!lastBanner) return null;

  return (
    <section className={styles.promoSection}>
      <div className={styles.promoContainer}>
        <div className={styles.promoList}>
          <Link
            href={lastBanner.link || "/products"}
            className={styles.promoLink}
          >
            <Image
              src={lastBanner.image || "/promotion-banner.jpg"}
              width={1920}
              height={400}
              alt="Promotion banner"
              className={styles.promoImage}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
              priority
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

