import ClientLayout from "@/layouts/ClientLayout";

export default function PrivacyPolicy() {
  return (
    <ClientLayout>
      <main className="page" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
            Chính sách bảo mật
          </h1>
          
          <div style={{ lineHeight: 1.8, color: '#444' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Thu thập thông tin</h2>
              <p>Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt hàng hoặc đăng ký nhận tin từ Web Phụ Tùng. Các thông tin bao gồm: Tên, Email, Số điện thoại và Địa chỉ giao hàng.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Sử dụng thông tin</h2>
              <p>Thông tin của bạn được sử dụng để: Xử lý đơn hàng, thông báo tình trạng vận chuyển, cung cấp các ưu đãi mới nhất và cải thiện trải nghiệm mua sắm của bạn trên website.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Bảo mật dữ liệu</h2>
              <p>Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng. Thông tin được lưu trữ an toàn và chỉ cung cấp cho các bên liên quan trực tiếp đến việc xử lý đơn hàng (như đơn vị vận chuyển).</p>
            </section>

            <section>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Quyền của bạn</h2>
              <p>Bạn có quyền yêu cầu chỉnh sửa, xoá bỏ thông tin cá nhân bất kỳ lúc nào bằng cách đăng nhập vào tài khoản hoặc liên hệ trực tiếp với bộ phận hỗ trợ khách hàng của chúng tôi.</p>
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
