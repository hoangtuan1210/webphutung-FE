import styles from "@/styles/client/home.module.css";
import Image from "next/image";

export default function WhyChooseUs({ imageSrc }) {
  return (
    <div className="container mt-5 pt-5 pb-5">
      <div className="row align-items-center g-5">
        <div className="col-12 col-md-6 order-2 order-md-1">
          <div className={styles.sectionHighlightContent}>
            <span className={styles.tagline}>Uy tín là vàng</span>
            <h2 className={styles.titleEmphasized}>Tại sao nên chọn<br /><span>Phụ tùng MyShop?</span></h2>
            <p className={styles.desc}>
              Chúng tôi không chỉ bán phụ tùng, chúng tôi cung cấp giải pháp an tâm tuyệt đối cho khách hàng.
              Tất cả linh kiện được kiểm tra nghiêm ngặt trước khi đến tay bạn.
            </p>
            
            <ul className={styles.highlightList}>
              <li>
                <div className={styles.highlightIcon}>
                  <i className="bi bi-star-fill" />
                </div>
                <div>
                  <h6>Kinh nghiệm lâu năm</h6>
                  <p>Hơn 10 năm kinh nghiệm trong lĩnh vực đồ chơi xe và phụ tùng cao cấp.</p>
                </div>
              </li>
              <li>
                <div className={styles.highlightIcon}>
                  <i className="bi bi-gear-wide-connected" />
                </div>
                <div>
                  <h6>Kho hàng đa dạng</h6>
                  <p>Luôn sẵn sàng hơn 5.000+ mã hàng từ Honda, Yamaha đến các dòng đồ chơi cao cấp.</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-4">
               <button className={styles.btnSecondaryOutline}>Tìm hiểu về chúng tôi</button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 order-1 order-md-2 text-center">
          <div className={styles.imageHighlightWrapper}>
              <div className={styles.decorationBox} />
              <div className={styles.mainImageFrame}>
                <Image 
                  src={imageSrc} 
                  alt="Về MyShop Store" 
                  width={600} 
                  height={450} 
                  className={styles.mainImage}
                />
              </div>
              <div className={styles.experienceBadge}>
                <span className={styles.badgeNum}>10+</span>
                <span className={styles.badgeText}>Năm kinh nghiệm</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
