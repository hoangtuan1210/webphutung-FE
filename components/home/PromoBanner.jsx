import Image from "next/image";
import styles from "@/styles/client/home.module.css";

export default function PromoBanner() {
  return (
    <div className="container mt-5">
      <div className={styles.bannerWrapper}>
        <Image
          src="/promotion-banner.jpg"
          width={1200}
          height={200}
          alt="promo banner"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
