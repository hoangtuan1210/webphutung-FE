// footer.jsx
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/client/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* CỘT 1 — Logo + mô tả */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Anh Hậu Logo"
              width={160}
              height={50}
              className={styles.logoImg}
            />
          </div>
          <p className={styles.desc}>
            Chúng tôi cung cấp xe máy, xe điện chính hãng, chất lượng cao.
            Cam kết giá tốt, dịch vụ tận tâm và bảo hành chu đáo.
          </p>
        </div>

        {/* CỘT 2 — Quy định */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Quy định</h4>
          <ul className={styles.linkList}>
            <li><Link href="#">Chính sách quy định chung</Link></li>
            <li><Link href="#">Chính sách bảo mật</Link></li>
            <li><Link href="#">Chính sách bảo hành</Link></li>
            <li><Link href="#">Hình thức thanh toán</Link></li>
            <li><Link href="#">Chính sách giao nhận - cài đặt</Link></li>
            <li><Link href="#">Quy trình làm việc</Link></li>
          </ul>
        </div>

        {/* CỘT 3 — Link nhanh */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Link nhanh</h4>
          <ul className={styles.linkList}>
            <li><Link href="#">Blogs</Link></li>
            <li><Link href="/news">Tin tức</Link></li>
            <li><Link href="/about">Liên hệ</Link></li>
            <li><Link href="#">Tuyển dụng</Link></li>
            <li><Link href="/about">Thông tin về chúng tôi</Link></li>
          </ul>
        </div>

        {/* CỘT 4 — Liên hệ */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Liên hệ</h4>
          <ul className={styles.contactList}>
            <li>
              <i className="bi bi-telephone" />
              <span>0862 701 467</span>
            </li>
            <li>
              <i className="bi bi-envelope" />
              <span>myshop@gmail.com</span>
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
        <p>© 2026 MyShop Store. All rights reserved.</p>
      </div>
    </footer>
  );
}