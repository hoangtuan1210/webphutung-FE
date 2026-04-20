import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/client/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image
              src="/logo.tif"
              alt="Logo"
              width={280}
              height={90}
              quality={100}
              className={styles.logoImg}
            />
          </div>
          <p className={styles.desc}>
            Chuyên cung cấp phụ tùng xe máy và phụ kiện xe điện chính hãng. 
            Uy tín tạo nên thương hiệu - Chất lượng khẳng định vị thế.
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Hỗ trợ khách hàng</h4>
          <ul className={styles.linkList}>
            <li><Link href="/about">Giới thiệu về cửa hàng</Link></li>
            <li><Link href="/privacy-policy">Chính sách bảo mật</Link></li>
            <li><Link href="/warranty-policy">Chính sách bảo hành</Link></li>
            <li><Link href="/return-policy">Chính sách đổi trả</Link></li>
            <li><Link href="/payment-policy">Phương thức thanh toán</Link></li>
            <li><Link href="/shipping-policy">Vận chuyển & Giao nhận</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Liên kết nhanh</h4>
          <ul className={styles.linkList}>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/products">Sản phẩm</Link></li>
            <li><Link href="/news">Tin tức mới nhất</Link></li>
            <li><Link href="/about">Liên hệ hỗ trợ</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Thông tin liên hệ</h4>
          <ul className={styles.contactList}>
            <li>
              <i className="bi bi-geo-alt" />
              <span>64 Đường 1A, KDC Vĩnh Lộc, Bình Tân, TP. HCM</span>
            </li>
            <li>
              <i className="bi bi-telephone" />
              <span>Hotline: 0938884300</span>
            </li>
            <li>
              <i className="bi bi-envelope" />
              <span> Email:feichi2025.co@gmail.com</span>
            </li>
          </ul>

          <div className={styles.socials}>
            <a href="#" className={styles.socialBtn} aria-label="Telegram">
              <i className="bi bi-telegram" />
            </a>
            <a href="#" className={styles.socialBtn} aria-label="Messenger">
              <i className="bi bi-messenger" />
            </a>
            <a href="#" className={styles.socialBtn} aria-label="Facebook">
              <i className="bi bi-facebook" />
            </a>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© 2026 Công ty TNHH Thương Mại Quốc Tế FEICHI. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}