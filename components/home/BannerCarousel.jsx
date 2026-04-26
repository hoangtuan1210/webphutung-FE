import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/client/banner.module.css";
import Link from "next/link";


export default function BannerCarousel({ banners = [] }) {
  const slidesToUse = banners.length > 0
    ? banners.map(b => ({
      src: b.image || "https://placehold.co/1920x720/png?text=Phu+Tung+Shop",
      tag: b.title || "Khuyến mãi",
      title: b.title || "Ưu đãi",
      desc: b.description || "",
      btn: "Xem ngay",
      href: b.link || "/products"
    }))
    : [
      {
        src: "https://placehold.co/1920x720/png?text=Phu+Tung+Shop",
        tag: "Khuyến mãi",
        title: "Ưu đãi đặc biệt",
        desc: "Khám phá ngay các ưu đãi hấp dẫn tại Phụ Tùng Shop.",
        btn: "Xem ngay",
        href: "/products"
      }
    ];


  return (
    <div className="banner-full-width p-0 ">
      <div
        id="bannerCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div className="carousel-indicators">
          {slidesToUse.map((_, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#bannerCarousel"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner overflow-hidden">
          {slidesToUse.map((slide, i) => (
            <BannerSlide key={i} slide={slide} index={i} />
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#bannerCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" />
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#bannerCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" />
        </button>
      </div>
    </div>
  );
}

// Tách thành component riêng để quản lý loading state mỗi slide độc lập
function BannerSlide({ slide, index }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
      {/* Skeleton hiển thị ngay lập tức khi ảnh chưa tải xong */}
      {!loaded && (
        <div
          className={styles.skeleton}
          style={{ height: "clamp(300px, 40vw, 550px)" }}
          aria-hidden="true"
        />
      )}

      <Image
        src={slide.src}
        width={1920}
        height={720}
        quality={75}
        alt={slide.title}
        priority={index === 0}  // Chỉ preload ảnh đầu tiên
        loading={index === 0 ? "eager" : "lazy"}  // Lazy load các ảnh còn lại
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "clamp(300px, 40vw, 550px)",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.tag}>{slide.tag}</span>
        <h2 className={styles.title}>
          {slide.title.split("\n").map((line, j) => (
            <span key={j}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <p className={styles.desc}>{slide.desc}</p>
        <Link href={slide.href} className={styles.btn}>
          {slide.btn} <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
