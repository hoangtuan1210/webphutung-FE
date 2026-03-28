import Link from "next/link";
import ProductCard from "./ProductCard";
import styles from "@/styles/client/home.module.css";

const products = [
  {
    id: 1,
    name: "Cùm tăng tốc GH-Racing",
    price: 250000,
    image: "/bao-tay.jpg",
  },
  {
    id: 2,
    name: "Đĩa KingSpeed 260mm mẫu mới 4 lỗ",
    price: 750000,
    image: "/bo-cong-tac.jpg",
  },
  {
    id: 3,
    name: "Gù Carbon fiber chống rung đầm tay lái",
    price: 420000,
    image: "/cum-tang-toc.jpg",
  },
  {
    id: 4,
    name: "Gù Carbon fiber chống rung, đầm tay lái cho AB 160, Vario",
    price: 1200000,
    image: "/day-curoa.jpg",
  },
  {
    id: 5,
    name: "Gù trung nhôm GH Racing",
    price: 390000,
    image: "/gu-carbon.jpg",
  },
  {
    id: 6,
    name: "Đĩa KingSpeed 260mm mẫu mới 4 lỗ",
    price: 180000,
    image: "/tay-thang.jpg",
  },
];

export default function ProductSection() {
  return (
    <div className="container mt-5" id="products">
      <h3 className={styles.productTitle}>Sản phẩm nổi bật</h3>

      <div className="row g-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="d-flex justify-content-end mt-4">
        <Link href="/products" className={styles.viewMoreBtn}>
          Xem thêm <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
