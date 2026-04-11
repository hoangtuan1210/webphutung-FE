import ClientLayout from "@/layouts/ClientLayout";
import styles from "@/styles/client/about.module.css";

export default function About() {
  return (
    <ClientLayout>
      <main className="page" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
          <section style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111', marginBottom: '0.75rem' }}>
              Về chúng tôi
            </h1>
            <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1rem' }}>
              Cửa hàng phụ tùng xe máy & xe điện hàng đầu, chuyên cung cấp linh kiện chất lượng
              cao cho mọi dòng xe. Với nhiều năm kinh nghiệm và đội ngũ chuyên viên tận tâm,
              chúng tôi cam kết mang đến trải nghiệm mua sắm an tâm từ lựa chọn sản phẩm đến
              hậu mãi.
            </p>
          </section>

          <section className={styles.gridSection}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '0.6rem' }}>
                Sứ mệnh
              </h2>
              <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1rem' }}>
                Giúp người dùng dễ dàng tiếp cận phụ tùng chính hãng, tương thích và giá tốt nhất.
                Chúng tôi xây dựng nhà cung cấp tin cậy cho mạng lưới sửa chữa cũng như khách hàng
                cá nhân, hướng tới vận hành an toàn và bền vững.
              </p>
            </div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
              <img
                src="/bo-cong-tac.jpg"
                alt="Sứ mệnh"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </section>

          <section className={styles.gridSection}>
            <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
              <img
                src="/cum-tang-toc.jpg"
                alt="Giá trị cốt lõi"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '0.6rem' }}>
                Giá trị cốt lõi
              </h2>
              <ul style={{ listStyle: 'disc inside', color: '#555', lineHeight: 1.7 }}>
                <li>Chất lượng: Sản phẩm được kiểm định khắt khe, bảo hành rõ ràng.</li>
                <li>Uy tín: Chăm sóc khách hàng tận tâm, xử lý yêu cầu nhanh chóng.</li>
                <li>Giá cả công bằng: Tối ưu giá bán, thường xuyên khuyến mại.</li>
                <li>Đa dạng: Phụ tùng cho cả xe máy xăng và xe điện, từ bánh xe đến ắc quy.</li>
                <li>Tiện lợi: Giao hàng nhanh, hỗ trợ lắp đặt (nếu có) và tư vấn kỹ thuật.</li>
              </ul>
            </div>
          </section>


          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '0.6rem' }}>
              Liên hệ
            </h2>
            <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1rem' }}>
              Email: support@phutungxe.com<br />
              Hotline: 1900 1234<br />
              Địa chỉ: 123 Phố Hà Nội, Quận 1, TP.HCM
            </p>
          </section>
        </div>
      </main>
    </ClientLayout>
  );
}
