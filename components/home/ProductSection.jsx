import React, { useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import styles from "@/styles/client/home.module.css";
import { MOCK_PRODUCTS } from "@/data/product";

export default function ProductSection() {
  const products = useMemo(() => {
    return MOCK_PRODUCTS.slice(0, 8).map(p => ({
      ...p,
      image: p.images?.[0] || "/placeholder.jpg"
    }));
  }, []);

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
