export const newsList = [
  {
    id: 1,
    slug: "top-phu-tung-ban-chay-thang-3",
    title: "Top phụ tùng xe máy bán chạy nhất tháng 3/2026",
    excerpt: "Điểm qua những sản phẩm phụ tùng, đồ chơi xe được khách hàng tin tưởng lựa chọn nhiều nhất trong tháng vừa qua.",
    image: "/tin-tuc-1.jpg",
    category: "Tin tức",
    status: "Đã đăng",
    author: "Admin",
    date: "15/03/2026",
    readTime: "3 phút đọc",
    views: 1250,
    hot: true,
    content: `...`
  },
  {
    id: 2,
    slug: "huong-dan-chon-dia-phanh-xe-may",
    title: "Hướng dẫn chọn đĩa phanh xe máy phù hợp — tránh mua nhầm hàng kém chất lượng",
    excerpt: "Đĩa phanh là bộ phận quan trọng ảnh hưởng trực tiếp đến an toàn. Bài viết này giúp bạn chọn đúng loại cho xe.",
    image: "/tin-tuc-2.jpg",
    category: "Kinh nghiệm",
    status: "Đã đăng",
    author: "Biên tập viên A",
    date: "10/03/2026",
    readTime: "5 phút đọc",
    views: 890,
    content: `...`
  },
  {
    id: 3,
    slug: "xu-huong-do-xe-2026",
    title: "Xu hướng độ xe máy 2026 — phong cách nào đang thịnh hành?",
    excerpt: "Từ carbon fiber đến nhôm CNC anodized, giới độ xe đang chạy theo những xu hướng nào trong năm nay.",
    image: "/tin-tuc-3.jpg",
    category: "Xu hướng",
    status: "Đã đăng",
    author: "Admin",
    date: "05/03/2026",
    readTime: "4 phút đọc",
    views: 2100,
    content: `...`
  },
  {
    id: 4,
    slug: "bao-duong-xe-dien-dung-cach",
    title: "Bảo dưỡng xe điện đúng cách để kéo dài tuổi thọ pin",
    excerpt: "Pin xe điện chiếm phần lớn giá trị xe. Những thói quen đơn giản sau đây giúp pin bền hơn nhiều năm.",
    image: "/tin-tuc-4.jpg",
    category: "Kinh nghiệm",
    status: "Nháp",
    author: "Biên tập viên B",
    date: "01/03/2026",
    readTime: "6 phút đọc",
    views: 450,
    content: `...`
  },
  {
    id: 5,
    slug: "kiem-tra-cum-tang-toc",
    title: "Dấu hiệu nhận biết cùm tăng tốc cần thay — đừng bỏ qua",
    excerpt: "Cùm tăng tốc mòn có thể gây nguy hiểm khi vận hành. Nhận biết sớm để thay thế kịp thời.",
    image: "/tin-tuc-1.jpg",
    category: "Kinh nghiệm",
    status: "Đã đăng",
    author: "Admin",
    date: "25/02/2026",
    readTime: "3 phút đọc",
    views: 720,
    content: `...`
  },
  {
    id: 6,
    slug: "khuyen-mai-thang-4",
    title: "Chương trình khuyến mãi tháng 4 — giảm đến 25% toàn bộ đồ chơi xe",
    excerpt: "Nhân dịp kỷ niệm 5 năm thành lập, cửa hàng triển khai chương trình ưu đãi lớn nhất năm dành cho khách hàng thân thiết.",
    image: "/tin-tuc-2.jpg",
    category: "Khuyến mãi",
    status: "Ẩn",
    author: "Admin",
    date: "20/02/2026",
    readTime: "2 phút đọc",
    views: 3400,
    hot: true,
    content: `...`
  }
  
];

export const MOCK_NEWS = [
  ...newsList,
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 7,
    slug: `bai-viet-bo-sung-${i + 7}`,
    title: `Bài viết bổ sung số ${i + 7} về phụ tùng xe máy`,
    excerpt: `Mô tả ngắn gọn cho bài viết số ${i + 7} để hiển thị trên danh sách tin tức.`,
    image: `/tin-tuc-${(i % 4) + 1}.jpg`,
    category: ["Tin tức", "Kinh nghiệm", "Xu hướng", "Khuyến mãi"][i % 4],
    status: ["Đã đăng", "Nháp", "Ẩn"][i % 3],
    author: "Admin",
    date: "10/02/2026",
    readTime: "4 phút đọc",
    views: Math.floor(Math.random() * 1000),
    content: "<p>Nội dung đang được cập nhật...</p>"
  }))
];

export const categories = ["Tất cả", "Tin tức", "Kinh nghiệm", "Xu hướng", "Khuyến mãi"];
export const statusList = ["Tất cả", "Đã đăng", "Nháp", "Ẩn"];