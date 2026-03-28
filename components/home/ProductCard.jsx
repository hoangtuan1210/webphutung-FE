import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/client/home.module.css";
import { toSlug } from "@/utils/slug";

export default function ProductCard({ product }) {
  return (
    <div className="col-lg-4 col-md-6">
      <Link
        href={`/detail-product/${toSlug(product.name)}`}
        className="text-decoration-none h-100"
        style={{ display: "block", color: "inherit" }}
      >
        <div className={`${styles.productCard} h-100`}>

          <div className={styles.productImage}>
            <Image
              src={product.image}
              width={400}
              height={300}
              alt={product.name}
            />
          </div>

          <div className={styles.productInfo}>
            <h6 className={styles.productName}>{product.name}</h6>

            <p className={styles.productPrice}>
              {product.price.toLocaleString("vi-VN")}đ
            </p>

            <button className="btn btn-dark btn-sm w-100">Xem Chi Tiết</button>
          </div>

        </div>
      </Link>
    </div>
  );
}