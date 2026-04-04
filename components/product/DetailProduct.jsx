import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/client/detailProduct.module.css";
import { useCart } from "@/context/CartContext";
import { toSlug } from "@/utils/slug";
import { MOCK_PRODUCTS } from "@/data/product";
import { toast } from "react-hot-toast";

export default function DetailProduct({ productData }) {
  const product = productData || MOCK_PRODUCTS[0];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const images = product.images ?? [product.image];
  const { addToCart, setIsOpen } = useCart();

  const related = MOCK_PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
      },
      qty,
    );
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
      },
      qty,
    );
    setIsOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" />
          <Link href="/products">Sản phẩm</Link>
          <i className="bi bi-chevron-right" />
          <span>{product.name}</span>
        </nav>

        <div className={styles.main}>
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <Image
                src={product.images[activeImg]}
                fill
                alt={product.name}
                className={styles.mainImgEl}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.badge && (
                <span className={styles.badge}>{product.badge}</span>
              )}
            </div>

            <div className={styles.thumbs}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <Image
                    src={img}
                    fill
                    alt={`thumb ${i}`}
                    className={styles.thumbImg}
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.category}>
              <i className="bi bi-grid" /> {product.category}
            </p>

            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.oldPrice && (
                <span className={styles.oldPrice}>
                  {product.oldPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
              {product.oldPrice && (
                <span className={styles.discount}>
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <i className="bi bi-upc-scan" /> Mã SP: <b>{product.sku}</b>
              </span>
              <span className={styles.metaItem}>
                <i className="bi bi-box-seam" /> Còn <b>{product.stock}</b> sản
                phẩm
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Số lượng</span>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className={styles.qtyNum}>{qty}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnCart} onClick={handleAddToCart}>
                <i className="bi bi-cart3" /> Thêm vào giỏ
              </button>
              <button
                className={styles.btnBuy}
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
            </div>

            <div className={styles.guarantees}>
              <div className={styles.guarantee}>
                <i className="bi bi-shield-check" />
                <span>Hàng chính hãng 100%</span>
              </div>
              <div className={styles.guarantee}>
                <i className="bi bi-arrow-repeat" />
                <span>Đổi trả trong 7 ngày</span>
              </div>
              <div className={styles.guarantee}>
                <i className="bi bi-truck" />
                <span>Giao hàng toàn quốc</span>
              </div>
              <div className={styles.guarantee}>
                <i className="bi bi-headset" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>


        <div className={styles.tabs}>
          <div className={styles.tabList}>
            <button
              className={`${styles.tabBtn} ${activeTab === "desc" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("desc")}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "specs" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("specs")}
            >
              Thông số kỹ thuật
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "desc" && (
              <div className={styles.descContent}>
                <p className={styles.descText}>{product.desc}</p>

                {product.descDetails?.length > 0 && (
                  <div className={styles.descHighlights}>
                    <h6 className={styles.descSubtitle}>
                      <i className="bi bi-stars" /> Điểm nổi bật
                    </h6>
                    <ul className={styles.highlightList}>
                      {product.descDetails.map((point, i) => (
                        <li key={i}>
                          <i className="bi bi-check-circle-fill" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.descImages?.length > 0 && (
                  <div>
                    <h6 className={styles.descSubtitle}>Hình ảnh thực tế</h6>
                    <div className={styles.descImgGrid}>
                      {product.descImages.map((img, i) => (
                        <div key={i} className={styles.descImgWrap}>
                          <Image
                            src={img}
                            fill
                            alt={`Hình ảnh ${i + 1}`}
                            className={styles.descImg}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "specs" && (
              <table className={styles.specTable}>
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={i}>
                      <td className={styles.specLabel}>{s.label}</td>
                      <td className={styles.specValue}>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className={styles.related}>
            <h4 className={styles.relatedTitle}>Sản phẩm cùng loại</h4>
            <div className="row g-3">
              {related.map((item) => (
                <div key={item.id} className="col-6 col-md-3">
                  <Link
                    href={`/detail-product/${toSlug(item.name)}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedImg}>
                      <Image
                        src={item.images[0]}
                        fill
                        alt={item.name}
                        className={styles.relatedImgEl}
                        sizes="(max-width: 576px) 50vw, 25vw"
                      />
                      {item.badge && (
                        <span className={styles.relatedBadge}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={styles.relatedInfo}>
                      <p className={styles.relatedName}>{item.name}</p>
                      <div className={styles.relatedPriceRow}>
                        <span className={styles.relatedPrice}>
                          {item.price.toLocaleString("vi-VN")}đ
                        </span>
                        {item.oldPrice && (
                          <span className={styles.relatedOldPrice}>
                            {item.oldPrice.toLocaleString("vi-VN")}đ
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
