import ClientLayout from "@/layouts/ClientLayout";

export default function ShippingPolicy() {
  return (
    <ClientLayout>
      <main className="page" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
            Vận chuyển & Giao nhận
          </h1>
          
          <div style={{ lineHeight: 1.8, color: '#444' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Thời gian giao hàng</h2>
              <ul style={{ listStyle: 'disc inside', paddingLeft: '1rem' }}>
                <li><b>Khu vực nội thành:</b> Từ 1 - 2 ngày làm việc.</li>
                <li><b>Các tỉnh thành khác:</b> Từ 3 - 5 ngày làm việc tùy vùng miền.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Cước phí vận chuyển</h2>
              <p>Phí vận chuyển được tính tự động dựa trên trọng lượng đơn hàng và địa chỉ giao hàng. Chúng tôi thường xuyên có chương trình <b>FREESHIP</b> cho đơn hàng từ 1.000.000đ trở lên.</p>
            </section>

            <section>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Kiểm tra hàng hóa</h2>
              <p>Khách hàng khi nhận hàng có quyền kiểm tra hình thức bên ngoài của kiện hàng. Đối với các sản phẩm như ắc quy, động cơ, khuyến khích khách hàng quay clip unbox để được hỗ trợ tốt nhất nếu có sự cố.</p>
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
