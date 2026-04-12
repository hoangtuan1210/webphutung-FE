import Head from "next/head";
import ClientLayout from "@/layouts/ClientLayout";
import styles from "@/styles/client/about.module.css";

export default function About() {
  const pageTitle = "Giới thiệu về Web Phụ Tùng - Phụ tùng xe máy chính hãng";
  const pageDescription = "Khám phá câu chuyện của Web Phụ Tùng - Địa chỉ uy tín chuyên cung cấp phụ tùng xe máy, đồ chơi xe và phụ kiện xe điện chất lượng cao. Chúng tôi cam kết mang lại giá trị tốt nhất cho xe của bạn.";
  const canonicalUrl = "https://webphutung.com/about";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Giới thiệu về Web Phụ Tùng",
    "description": pageDescription,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Web Phụ Tùng",
      "logo": {
        "@type": "ImageObject",
        "url": "https://webphutung.com/logo.png"
      }
    }
  };

  return (
    <ClientLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://webphutung.com/og-about.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="page" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <article className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111', marginBottom: '1rem' }}>
              Về Web Phụ Tùng
            </h1>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
              Cửa hàng phụ tùng xe máy & xe điện hàng đầu, chuyên cung cấp linh kiện chất lượng
              cao cho mọi dòng xe. Với nhiều năm kinh nghiệm và đội ngũ chuyên viên tận tâm,
              chúng tôi cam kết mang đến trải nghiệm mua sắm an tâm từ lựa chọn sản phẩm đến
              hậu mãi.
            </p>
          </header>

          <section className={styles.gridSection} style={{ marginBottom: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>
                Sứ mệnh của chúng tôi
              </h2>
              <p style={{ color: '#444', lineHeight: 1.8, fontSize: '1rem' }}>
                Giúp người dùng dễ dàng tiếp cận <strong>phụ tùng chính hãng</strong>, tương thích và giá tốt nhất.
                Chúng tôi xây dựng một hệ sinh thái cung cấp tin cậy cho mạng lưới sửa chữa cũng như khách hàng
                cá nhân, hướng tới vận hành an toàn và bền vững cho mọi phương tiện.
              </p>
            </div>
            <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <img
                src="/bo-cong-tac.jpg"
                alt="Đội ngũ Web Phụ Tùng làm việc tận tâm"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </section>

          <section className={styles.gridSection} style={{ marginBottom: '4rem' }}>
            <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <img
                src="/cum-tang-toc.jpg"
                alt="Sản phẩm phụ tùng xe máy chất lượng cao"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>
                Giá trị cốt lõi
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, color: '#444', lineHeight: 1.8 }}>
                <li style={{ marginBottom: '0.8rem' }}><i className="bi bi-check-circle-fill text-success me-2" /> <strong>Chất lượng:</strong> Sản phẩm được kiểm định khắt khe, bảo hành rõ ràng.</li>
                <li style={{ marginBottom: '0.8rem' }}><i className="bi bi-check-circle-fill text-success me-2" /> <strong>Uy tín:</strong> Chăm sóc khách hàng tận tâm, xử lý yêu cầu nhanh chóng.</li>
                <li style={{ marginBottom: '0.8rem' }}><i className="bi bi-check-circle-fill text-success me-2" /> <strong>Giá cả:</strong> Tối ưu giá bán, thường xuyên khuyến mại cho khách hàng thân thiết.</li>
                <li style={{ marginBottom: '0.8rem' }}><i className="bi bi-check-circle-fill text-success me-2" /> <strong>Đa dạng:</strong> Đầy đủ linh kiện từ xe máy xăng đến xe điện hiện đại.</li>
              </ul>
            </div>
          </section>

          <section style={{ backgroundColor: '#f9f9f9', padding: '3rem', borderRadius: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#111', marginBottom: '1.5rem' }}>
              Thông tin liên hệ chính thức
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                <i className="bi bi-envelope-at" style={{ fontSize: '2rem', color: '#dc3545' }} />
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Email</p>
                <p className="text-muted">support@webphutung.com</p>
              </div>
              <div>
                <i className="bi bi-telephone-inbound" style={{ fontSize: '2rem', color: '#dc3545' }} />
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Hotline</p>
                <p className="text-muted">0862 701 467</p>
              </div>
              <div>
                <i className="bi bi-geo-alt" style={{ fontSize: '2rem', color: '#dc3545' }} />
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Địa chỉ</p>
                <p className="text-muted">123 Đường Giải Phóng, Hai Bà Trưng, Hà Nội</p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </ClientLayout>
  );
}

