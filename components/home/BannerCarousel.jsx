import Image from "next/image";
import styles from "@/styles/client/banner.module.css";
import Link from "next/link";

const SLIDES = [
  {
    src: "/banner-1.jpg",
    tag: "Hàng mới về",
    title: "Phụ tùng chính hãng\nchất lượng cao",
    desc: "Đa dạng phụ tùng xe máy, xe điện các thương hiệu lớn",
    btn: "Xem ngay",
    href: "/products",
  },
  {
    src: "/banner-2.jpg",
    tag: "Ưu đãi tháng này",
    title: "Giảm đến 30%\nđồ chơi xe",
    desc: "Hàng ngàn sản phẩm độ xe giá tốt, giao hàng toàn quốc",
    btn: "Mua ngay",
    href: "/products",
  },
  {
    src: "/banner-3.jpg",
    tag: "Bảo hành 12 tháng",
    title: "Linh kiện xe điện\nchính hãng",
    desc: "Cam kết 100% hàng xịn, đổi trả trong 7 ngày",
    btn: "Khám phá",
    href: "/products",
  },
];

export default function BannerCarousel() {
  return (
    <div className="banner-full-width p-0 ">
      <div
        id="bannerCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div className="carousel-indicators">
          {SLIDES.map((_, i) => (
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
          {SLIDES.map((slide, i) => (
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
