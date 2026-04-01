import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/data/product";
import { toSlug } from "@/utils/slug";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/admin/productPage.module.css";

const SORT_OPTIONS = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "name-asc", label: "Tên A → Z" },
];

export default function ProductsComponent() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activeBrand, setActiveBrand] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  const dynamicCategories = useMemo(() => {
    const categories = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)));
    return ["Tất cả", ...categories];
  }, []);

  const dynamicBrands = useMemo(() => {
    const brands = Array.from(new Set(MOCK_PRODUCTS.filter(p => !!p.brand).map(p => p.brand)));
    return ["Tất cả", ...brands];
  }, []);

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (activeCategory !== "Tất cả") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeBrand !== "Tất cả") {
      list = list.filter((p) => p.brand === activeBrand);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [activeCategory, sortBy, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeBrand, sortBy, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const hasMore = currentPage < totalPages;
  const pagedProducts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" />
          <span>Sản phẩm</span>
        </nav>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Sản phẩm</h1>
            <p className={styles.count}>
              Tìm thấy <b>{filtered.length}</b> sản phẩm
            </p>
          </div>
        </div>

        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>
                <i className="bi bi-grid-fill" /> Danh mục
              </h2>
              <div className={styles.categoryList}>
                {dynamicCategories.map((cat) => (
                  <div
                    key={cat}
                    className={`${styles.categoryItem} ${activeCategory === cat ? styles.categoryActive : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className={styles.filterCount}>
                      {cat === "Tất cả"
                        ? MOCK_PRODUCTS.length
                        : MOCK_PRODUCTS.filter((p) => p.category === cat).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>
                <i className="bi bi-funnel-fill" /> Thương hiệu
              </h2>
              <div className={styles.categoryList}>
                {dynamicBrands.map((brand) => (
                  <div
                    key={brand}
                    className={`${styles.categoryItem} ${activeBrand === brand ? styles.categoryActive : ""}`}
                    onClick={() => setActiveBrand(brand)}
                  >
                    <span>{brand}</span>
                    <span className={styles.filterCount}>
                      {brand === "Tất cả"
                        ? MOCK_PRODUCTS.length
                        : MOCK_PRODUCTS.filter((p) => p.brand === brand).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Area */}
          <div className={styles.productsArea}>
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <i className="bi bi-search" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className={styles.searchInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className={styles.clearSearch}
                    onClick={() => setSearch("")}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>

              <div className={styles.toolbarRight}>
                <select
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Dạng lưới"
                  >
                    <i className="bi bi-grid" />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="Dạng danh sách"
                  >
                    <i className="bi bi-list-ul" />
                  </button>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <i className="bi bi-search" />
                <p>Không tìm thấy sản phẩm nào</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("Tất cả");
                  }}
                  className={styles.resetBtn}
                >
                  Xoá bộ lọc
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className={styles.grid}>
                {pagedProducts.map((product) => (
                  <div key={product.id} className={styles.gridItem}>
                    <div className={styles.card}>
                      <Link
                        href={`/detail-product/${toSlug(product.name)}`}
                        className={styles.cardImgLink}
                      >
                        <div className={styles.cardImg}>
                          <Image
                            src={product.images[0]}
                            fill
                            alt={product.name}
                            className={styles.cardImgEl}
                            sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
                          />
                          {product.badge && (
                            <span className={styles.badge}>{product.badge}</span>
                          )}
                        </div>
                      </Link>

                      <div className={styles.cardInfo}>
                        <span className={styles.catTag}>{product.category}</span>
                        <Link
                          href={`/detail-product/${toSlug(product.name)}`}
                          className={styles.cardNameLink}
                        >
                          <h3 className={styles.cardName}>{product.name}</h3>
                        </Link>
                        <div className={styles.priceRow}>
                          <span className={styles.price}>
                            {product.price.toLocaleString("vi-VN")}đ
                          </span>
                          {product.oldPrice && (
                            <span className={styles.oldPrice}>
                              {product.oldPrice.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </div>
                        <button
                          className={styles.addBtn}
                          onClick={() =>
                            addToCart(
                              {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0],
                              },
                              1,
                            )
                          }
                        >
                          <i className="bi bi-cart3" /> Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.list}>
                {pagedProducts.map((product) => (
                  <div key={product.id} className={styles.listItem}>
                    <Link
                      href={`/detail-product/${toSlug(product.name)}`}
                      className={styles.listImgLink}
                    >
                      <div className={styles.listImg}>
                        <Image
                          src={product.images[0]}
                          fill
                          alt={product.name}
                          className={styles.listImgEl}
                          sizes="120px"
                        />
                        {product.badge && (
                          <span className={styles.badge}>{product.badge}</span>
                        )}
                      </div>
                    </Link>

                    <div className={styles.listInfo}>
                      <span className={styles.catTag}>{product.category}</span>
                      <Link
                        href={`/detail-product/${toSlug(product.name)}`}
                        className={styles.cardNameLink}
                      >
                        <h3 className={styles.listName}>{product.name}</h3>
                      </Link>
                      {product.desc && (
                        <p className={styles.listDesc}>{product.desc}</p>
                      )}
                    </div>

                    <div className={styles.listActions}>
                      <div className={styles.priceRow}>
                        <span className={styles.price}>
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                        {product.oldPrice && (
                          <span className={styles.oldPrice}>
                            {product.oldPrice.toLocaleString("vi-VN")}đ
                          </span>
                        )}
                      </div>
                      <button
                        className={styles.addBtn}
                        onClick={() =>
                          addToCart(
                            {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.images[0],
                            },
                            1,
                          )
                        }
                      >
                        <i className="bi bi-cart3" /> Thêm vào giỏ
                      </button>
                      <Link
                        href={`/detail-product/${toSlug(product.name)}`}
                        className={styles.detailBtn}
                      >
                        Xem chi tiết <i className="bi bi-arrow-right" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div className={styles.paginationArea}>
                {hasMore && (
                  <button
                    className={styles.loadMoreBtn}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Xem thêm
                  </button>
                )}

                <div className={styles.pageLinks}>
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      className={`${styles.pageLink} ${page === currentPage ? styles.pageLinkActive : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
