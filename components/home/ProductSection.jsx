import React, { useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import styles from "@/styles/client/home.module.css";

export default function ProductSection({ products: apiProducts = [], title = "Sản phẩm nổi bật" }) {
  const products = useMemo(() => {
    const list = apiProducts || [];
    return list.map(p => ({
      ...p,
      image: p.images?.[0]?.url || p.image || "/placeholder.jpg"
    }));
  }, [apiProducts]);

  return (
    <div className="container mt-5" id="products">
      <h3 className={styles.productTitle}>{title}</h3>
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