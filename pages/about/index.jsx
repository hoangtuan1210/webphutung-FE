import Head from "next/head";
import ClientLayout from "@/layouts/ClientLayout";
import styles from "@/styles/client/policy.module.css";

export default function About() {
  const pageTitle = "Giới thiệu FEICHI - Công ty TNHH Thương Mại Quốc Tế FEICHI";
  const pageDescription = "Công ty TNHH Thương Mại Quốc Tế FEICHI chuyên cung cấp phụ tùng xe máy và xe điện chính hãng, giá thành hợp lý, nguồn cung từ nhà máy Trung Quốc.";
  
  return (
    <ClientLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              GIỚI THIỆU CÔNG TY <br/>
              <span className={styles.titleHighlight}>TNHH THƯƠNG MẠI QUỐC TẾ FEICHI</span>
            </h1>
            <p className={styles.intro}>
              FEICHI là doanh nghiệp chuyên cung cấp phụ tùng xe máy và xe điện tại Việt Nam, mang đến giải pháp chất lượng ổn định và giá thành cạnh tranh nhất thị trường.
            </p>
          </header>

          <div className={styles.contentCard}>
            <section className={styles.section}>
              <div className="row align-items-center g-5">
                <div className="col-lg-7">
                  <h2 className={styles.sectionTitle}>Tầm nhìn & Sứ mệnh</h2>
                  <p>
                    Công ty FEICHI hoạt động với mục tiêu cung cấp sản phẩm chất lượng ổn định, giá thành hợp lý và nguồn cung lâu dài cho các cửa hàng sửa chữa, đại lý và người tiêu dùng trên toàn quốc.
                  </p>
                  <p>
                    Với lợi thế có nhà máy sản xuất và công ty mẹ tại Trung Quốc, FEICHI trực tiếp nhập khẩu và phân phối sản phẩm. Điều này giúp chúng tôi chủ động về nguồn hàng, kiểm soát chất lượng nghiêm ngặt và đảm bảo khả năng cung ứng ổn định.
                  </p>
                </div>
                <div className="col-lg-5">
                  <div className="p-4 rounded-4 bg-light border">
                    <h3 className="h5 fw-bold mb-3 border-bottom pb-2">Thông tin doanh nghiệp</h3>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2"><strong>Mã số thuế:</strong> 0319034606</li>
                      <li className="mb-2"><strong>Lĩnh vực:</strong> Phân phối phụ tùng xe</li>
                      <li className="mb-2"><strong>Hình thức:</strong> Bán sỉ và bán lẻ</li>
                      <li className="mb-2"><strong>Thị trường:</strong> Toàn quốc</li>
                      <li><strong>Địa chỉ:</strong> 64 Đường 1A, KDC Vĩnh Lộc, P. Bình Tân, TP. HCM</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>🔧</span>
                Sản phẩm và dịch vụ
              </h2>
              <div className="row g-4">
                {[
                  { icon: "bi-gear-wide-connected", title: "Phụ tùng truyền động", items: ["Nhông sên dĩa", "Xích cam / Sên cam"] },
                  { icon: "bi-lightning-charge", title: "Phụ tùng xe điện", items: ["Bộ điều khiển (Controller)", "Cục sạc xe điện"] },
                  { icon: "bi-engine", title: "Phụ tùng động cơ", items: ["Bình xăng con (Carburetor)"] },
                  { icon: "bi-volume-up", title: "Điện & Còi xe", items: ["Còi xe (Horn)", "Vòng bi (Bearings)"] },
                ].map((cat, idx) => (
                  <div key={idx} className="col-md-3">
                    <div className="p-3 text-center h-100 rounded-3 bg-light">
                      <i className={`bi ${cat.icon} fs-2 text-danger`} />
                      <h4 className="h6 fw-bold mt-2">{cat.title}</h4>
                      <ul className="list-unstyled small text-muted mb-0">
                        {cat.items.map((it, i) => <li key={i}>{it}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="row g-4 mb-5">
              <div className="col-lg-6">
                <section>
                  <h2 className={styles.sectionTitle}>Cánh tay nối dài từ nhà máy</h2>
                  <div className={styles.returnsBox} style={{ background: '#fdfdfd', borderStyle: 'solid', borderColor: '#eee' }}>
                    <ul className={styles.iconList}>
                      <li className={styles.iconListItem}><i className="bi bi-check-circle-fill text-success"/> Nguồn hàng trực tiếp từ nhà máy công ty mẹ</li>
                      <li className={styles.iconListItem}><i className="bi bi-check-circle-fill text-success"/> Giá thành cạnh tranh tuyệt đối cho khách sỉ</li>
                      <li className={styles.iconListItem}><i className="bi bi-check-circle-fill text-success"/> Danh mục sản phẩm đa dạng, phân phối toàn quốc</li>
                    </ul>
                  </div>
                </section>
              </div>
              <div className="col-lg-6">
                <section>
                  <h2 className={styles.sectionTitle}>Định hướng phát triển</h2>
                  <ul className={styles.iconList}>
                    <li className={styles.iconListItem}><i className="bi bi-rocket-takeoff text-danger"/> Mở rộng nhiều dòng phụ tùng xe máy & điện mới</li>
                    <li className={styles.iconListItem}><i className="bi bi-people text-danger"/> Phát triển hệ thống đại lý vững mạnh</li>
                    <li className={styles.iconListItem}><i className="bi bi-award text-danger"/> Trở thành đơn vị cung cấp uy tín hàng đầu</li>
                  </ul>
                </section>
              </div>
            </div>

            <div className={styles.commitmentBox}>
              <h2 className={styles.commitmentTitle}>CAM KẾT TỪ FEICHI</h2>
              <div className={styles.commitmentIcons}>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-shield-check" />
                  <span className="fw-bold">Chất lượng ổn định</span>
                </div>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-cash-stack" />
                  <span className="fw-bold">Giá cả hợp lý</span>
                </div>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-headset" />
                  <span className="fw-bold">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}


