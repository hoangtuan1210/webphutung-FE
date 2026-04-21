import { useState, useEffect } from "react";
import styles from "@/styles/client/home.module.css";
import Image from "next/image";
import Link from "next/link";
import { homeService } from "@/services/homeService";

export default function WhyChooseUs({ imageSrc }) {
  const [data, setData] = useState({
    videoUrl: "https://www.youtube.com/embed/jWjhlpMpetc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await homeService.getWhyChooseUs();
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error fetching WhyChooseUs data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <div className={styles.whyChooseUsWrapper}>
        <div className="row align-items-center g-5">
          <div className="col-12 col-md-6 order-2 order-md-1">
            <div className={styles.sectionHighlightContent}>
              <h2 className={styles.titleEmphasized}>Tại sao nên chọn<br /><span>Feichi</span></h2>
              <ul className={styles.highlightList}>
                <li>
                  <div className={styles.highlightIcon}>
                    <i className="bi bi-star-fill" />
                  </div>
                  <div>
                    <h6>Nguồn hàng trực tiếp từ nhà máy:</h6>
                    <p>Chúng tôi nhập khẩu trực tiếp từ công ty mẹ sản xuất, đảm bảo chủ động nguồn cung và chất lượng sản phẩm.</p>
                  </div>
                </li>
                <li>
                  <div className={styles.highlightIcon}>
                    <i className="bi bi-gear-wide-connected" />
                  </div>
                  <div>
                    <h6>Kho hàng đa dạng:</h6>
                    <p>Với nhiều loại phụ tùng và nhiều mẫu mã khác nhau, phù hợp với nhiều dòng xe phổ biến</p>
                  </div>
                </li>
                <li>
                  <div className={styles.highlightIcon}>
                    <i className="bi bi-gear-wide-connected" />
                  </div>
                  <div>
                    <h6>Kinh nghiệm lâu năm</h6>
                    <p>Hơn 10 năm kinh nghiệm trong lĩnh vực phụ tùng, linh kiện cao cấp</p>
                  </div>
                </li>
              </ul>

              <div className="mt-4">
                <Link href="/about">
                  <button className={styles.btnSecondaryOutline}>Tìm hiểu về chúng tôi</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 order-1 order-md-2 text-center">
            <div className={styles.mainImageFrame}>
              <div className={styles.videoContainer}>
                <iframe
                  src={`${data.videoUrl}?autoplay=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className={styles.videoIframe}
                ></iframe>
              </div>
              <div className={styles.experienceBadge}>
                <span className={styles.badgeNum}>10+</span>
                <span className={styles.badgeText}>Năm kinh nghiệm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
