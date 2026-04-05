import Image from "next/image";
import styles from "@/styles/client/banner.module.css";
import Link from "next/link";


export default function BannerCarousel({ banners = [] }) {
  const slidesToUse = banners.length > 0
    ? banners.map(b => ({
      src: b.image,
      tag: b.title,
      title: b.title,
      desc: b.description ,
      btn: "Xem ngay",
      href: b.link || "/products"
    }))
    : [];


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
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <Image
                src={slide.src}
                width={1920}
                height={720}
                quality={90}
                alt={slide.title}
                priority={i === 0}
                style={{
                  width: "100%",
                  height: "clamp(300px, 40vw, 550px)",
                  objectFit: "cover",
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
