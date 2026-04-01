export const CATEGORIES = ["Tất cả", "Công nghệ", "Thị trường", "Sản phẩm", "Sự kiện", "Hướng dẫn"];
export const STATUS_LIST = ["Tất cả", "Đã đăng", "Nháp", "Ẩn"];

export const PAGE_SIZE = 8;

export const MOCK_NEWS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: [
    "Ra mắt bộ sưu tập mùa hè 2025 với thiết kế độc đáo",
    "Top 10 xu hướng thời trang được yêu thích nhất năm nay",
    "Hướng dẫn chọn size quần áo chuẩn cho từng dáng người",
    "Flash sale cuối tuần — Giảm đến 50% toàn bộ sản phẩm",
    "Câu chuyện thương hiệu: Hành trình 10 năm phát triển",
  ][i % 5],
  category: ["Sản phẩm", "Thị trường", "Hướng dẫn", "Sự kiện", "Công nghệ"][i % 5],
  status: ["Đã đăng", "Nháp", "Đã đăng", "Ẩn", "Đã đăng"][i % 5],
  author: ["Admin", "Biên tập viên A", "Biên tập viên B"][i % 3],
  views: Math.floor(Math.random() * 5000) + 100,
  date: `${String((i % 28) + 1).padStart(2, "0")}/06/2025`,
  thumbnail: `https://picsum.photos/seed/${i + 10}/80/80`,
}));
