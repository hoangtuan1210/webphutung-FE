import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/client/detailProduct.module.css";
import { useCart } from "@/context/CartContext";

export default function DetailProduct({ productData, relatedProducts = [] }) {
  const product = productData;

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const { addToCart, setIsOpen } = useCart();

  const images = (product.images ?? []).map(img =>
    typeof img === "string" ? img : img.url
  );
  const fallbackImg = "/placeholder.jpg";

  const price = parseFloat(product.price) || 0;
  const comparePrice = parseFloat(product.comparePrice) || 0;

  const categoryName = product.category?.name ?? product.category ?? "";
  const categorySlug = product.category?.slug ?? "";

  const stock = product.stockQuantity ?? product.stock ?? 0;

  const description = product.description ?? product.desc ?? "";

  const specs = product.specs ?? [];
  const descDetails = product.descDetails ?? [];
  const descImages = product.descImages ?? [];

  const related = relatedProducts.length > 0 ? relatedProducts : (product.relatedProducts || []);

  const cartItem = {
    id: product.id,
    name: product.name,
    price,
    image: images[0] || fallbackImg,
  };


  const handleAddToCart = () => addToCart(cartItem, qty);
  const handleBuyNow = () => { addToCart(cartItem, qty); setIsOpen(true); };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" />
          <Link href="/products">Sản phẩm</Link>
          <i className="bi bi-chevron-right" />
          {product.category && (
            <>
              <Link href={`/products?categoryId=${product.category.id || product.categoryId}`}>{categoryName}</Link>
              <i className="bi bi-chevron-right" />
            </>
          )}
          <span>{product.name}</span>
        </nav>

        <div className={styles.main}>
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <Image
                src={images[activeImg] || fallbackImg}
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
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <Image
                    src={img || fallbackImg}
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
              <i className="bi bi-grid" /> {categoryName}
            </p>

            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>
                {price.toLocaleString("vi-VN")}đ
              </span>
              {comparePrice > 0 && (
                <>
                  <span className={styles.oldPrice}>
                    {comparePrice.toLocaleString("vi-VN")}đ
                  </span>
                  <span className={styles.discount}>
                    -{Math.round((1 - price / comparePrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <i className="bi bi-upc-scan" /> Mã SP: <b>{product.sku}</b>
              </span>
              <span className={styles.metaItem}>
                <i className="bi bi-box-seam" /> Còn <b>{stock}</b> sản phẩm
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Số lượng</span>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(stock, q + 1))}>+</button>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnCart} onClick={handleAddToCart}>
                <i className="bi bi-cart3" /> Thêm vào giỏ
              </button>
              <button className={styles.btnBuy} onClick={handleBuyNow}>
                Mua ngay
              </button>
            </div>

            <div className={styles.guarantees}>
              <div className={styles.guarantee}><i className="bi bi-shield-check" /><span>Hàng chính hãng 100%</span></div>
              <div className={styles.guarantee}><i className="bi bi-arrow-repeat" /><span>Đổi trả trong 7 ngày</span></div>
              <div className={styles.guarantee}><i className="bi bi-truck" /><span>Giao hàng toàn quốc</span></div>
              <div className={styles.guarantee}><i className="bi bi-headset" /><span>Hỗ trợ 24/7</span></div>
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
            {/* <button
              className={`${styles.tabBtn} ${activeTab === "specs" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("specs")}
            >
              Thông số kỹ thuật
            </button> */}
          </div>

          <div className={styles.tabContent}>
            {activeTab === "desc" && (
              <div className={styles.descContent}>
                <p className={styles.descText}>{description}</p>

                {descDetails.length > 0 && (
                  <div className={styles.descHighlights}>
                    <h6 className={styles.descSubtitle}>
                      <i className="bi bi-stars" /> Điểm nổi bật
                    </h6>
                    <ul className={styles.highlightList}>
                      {descDetails.map((point, i) => (
                        <li key={i}>
                          <i className="bi bi-check-circle-fill" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {descImages.length > 0 && (
                  <div>
                    <h6 className={styles.descSubtitle}>Hình ảnh thực tế</h6>
                    <div className={styles.descImgGrid}>
                      {descImages.map((img, i) => (
                        <div key={i} className={styles.descImgWrap}>
                          <Image src={img} fill alt={`Hình ảnh ${i + 1}`} className={styles.descImg} sizes="(max-width: 768px) 100vw, 50vw" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              specs.length > 0 ? (
                <table className={styles.specTable}>
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={i}>
                        <td className={styles.specLabel}>{s.label}</td>
                        <td className={styles.specValue}>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">Chưa có thông số kỹ thuật.</p>
              )
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className={styles.related}>
            <h4 className={styles.relatedTitle}>Sản phẩm cùng loại</h4>
            <div className="row g-3">
              {related.map((item) => {
                const itemImages = (item.images ?? []).map(img => typeof img === "string" ? img : img.url);
                const itemPrice = parseFloat(item.price) || 0;
                const itemOldPrice = parseFloat(item.comparePrice ?? item.oldPrice) || 0;

                return (
                  <div key={item.id} className="col-6 col-md-3">
                    <Link href={`/detail-product/${item.slug}`} className={styles.relatedCard}>
                      <div className={styles.relatedImg}>
                        <Image
                          src={itemImages[0] || fallbackImg}
                          fill
                          alt={item.name}
                          className={styles.relatedImgEl}
                          sizes="(max-width: 576px) 50vw, 25vw"
                        />
                        {item.badge && <span className={styles.relatedBadge}>{item.badge}</span>}
                      </div>
                      <div className={styles.relatedInfo}>
                        <p className={styles.relatedName}>{item.name}</p>
                        <div className={styles.relatedPriceRow}>
                          <span className={styles.relatedPrice}>{itemPrice.toLocaleString("vi-VN")}đ</span>
                          {itemOldPrice > 0 && (
                            <span className={styles.relatedOldPrice}>{itemOldPrice.toLocaleString("vi-VN")}đ</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}