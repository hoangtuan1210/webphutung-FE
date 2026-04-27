import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/admin/productPage.module.css";

const findCategoryInTree = (tree, id) => {
  for (const cat of tree) {
    if (String(cat.id) === String(id)) return cat;
    if (cat.children?.length) {
      const found = findCategoryInTree(cat.children, id);
      if (found) return found;
    }
  }
  return null;
};

const CategoryItem = ({ cat, categoryId, onSelect, depth = 0, maxDepth = 2 }) => {
  const hasChildren = cat.children?.length > 0;
  const isActive = String(categoryId) === String(cat.id);

  const isChildActive = (children) => {
    for (const child of children || []) {
      if (String(categoryId) === String(child.id)) return true;
      if (child.children?.length && isChildActive(child.children)) return true;
    }
    return false;
  };

  const [open, setOpen] = useState(() => isChildActive(cat.children));

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <div>
      <div
        className={`${styles.categoryItem} ${isActive ? styles.categoryActive : ""} ${depth > 0 ? styles.categoryChild : ""}`}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        <span
          className={styles.categoryLabel}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </span>
        <div className={styles.categoryMeta}>
          {cat._count?.products > 0 && (
            <span className={styles.filterCount}>{cat._count.products}</span>
          )}
          {hasChildren && depth < maxDepth && (
            <button
              className={`${styles.toggleBtn} ${open ? styles.toggleOpen : ""}`}
              onClick={handleToggle}
              aria-label={open ? "Thu gọn" : "Mở rộng"}
            >
              <i className="bi bi-chevron-down" />
            </button>
          )}
        </div>
      </div>

      {hasChildren && open && depth < maxDepth && (
        <div className={styles.categoryChildren}>
          {cat.children.map((child) => (
            <CategoryItem
              key={child.id}
              cat={child}
              categoryId={categoryId}
              onSelect={onSelect}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component hiển thị toàn bộ cây danh mục
const CategoryTree = ({ categories, categoryId, onSelect }) => (
  <>
    {categories.map((cat) => (
      <CategoryItem
        key={cat.id}
        cat={cat}
        categoryId={categoryId}
        onSelect={onSelect}
        depth={0}
        maxDepth={2}
      />
    ))}
  </>
);

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name_asc", label: "Tên A → Z" },
  { value: "name_desc", label: "Tên Z → A" },
];
export default function ProductsComponent({
  initialProducts = [],
  categories = [],
  totalCount = 0,
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const {
    categoryId,
    search: urlSearch,
    sortBy: urlSortBy,
    sortOrder: urlSortOrder,
    page: urlPage,
  } = router.query;

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [products, setProducts] = useState(
    initialProducts || []
  );
  const [total, setTotal] = useState(
    totalCount || 0
  );
  const [viewMode, setViewMode] = useState("grid");

  const PAGE_SIZE = 12;

  useEffect(() => {
    setProducts(initialProducts || []);
    setTotal(totalCount || 0);
  }, [initialProducts, totalCount]);

  const handleFilterChange = (updates) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, ...updates, page: 1 },
      },
      undefined,
      { shallow: false }
    );
  };

  const handlePageChange = (newPage) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: false }
    );
  };

  const activeCategory = useMemo(() => {
    if (!categoryId) return "Tất cả";
    const cat = findCategoryInTree(categories, categoryId);
    return cat ? cat.name : "Tất cả";
  }, [categoryId, categories]);

  const currentPage = parseInt(urlPage || "1");
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [searchTerm, setSearchTerm] = useState(urlSearch || "");

  useEffect(() => {
    setSearchTerm(urlSearch || "");
  }, [urlSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (urlSearch || "")) {
        handleFilterChange({ search: searchTerm });
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    handleFilterChange({ search: "" });
  };

  const normalizeProduct = (product) => {
    const images = (product.images ?? []).map((img) =>
      typeof img === "string" ? img : img.url
    );
    const price = parseFloat(product.price) || 0;
    const comparePrice = parseFloat(product.comparePrice ?? product.oldPrice) || 0;
    const categoryName = product.category?.name ?? product.category ?? "";
    const categorySlug = product.category?.slug ?? "";
    const image = images[0] || product.image || "/placeholder.jpg";

    return { ...product, images, price, comparePrice, categoryName, categorySlug, image };
  };

  const normalizedProducts = useMemo(
    () => products.map(normalizeProduct),
    [products]
  );

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
            <h1 className={styles.title}>
              {urlSearch ? `Kết quả cho: "${urlSearch}"` : "Tất cả sản phẩm"}
            </h1>
            <p className={styles.count}>
              Tìm thấy <b>{total}</b> sản phẩm
              {activeCategory !== "Tất cả" && (
                <> trong danh mục <b>{activeCategory}</b></>
              )}
            </p>
          </div>
        </div>

        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h2
                className={styles.sidebarTitle}
                onClick={() => setIsCatOpen(!isCatOpen)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <i className="bi bi-grid-fill" /> Danh mục
                </div>
                <i className={`bi bi-chevron-${isCatOpen ? 'up' : 'down'} ${styles.catToggleIcon}`} />
              </h2>
              <div className={`${styles.categoryList} ${isCatOpen ? styles.categoryListOpen : ""}`}>
                <div
                  className={`${styles.categoryItem} ${!categoryId ? styles.categoryActive : ""}`}
                  onClick={() =>
                    handleFilterChange({
                      categoryId: "",
                    })
                  }
                >
                  <span>Tất cả</span>
                </div>
                <CategoryTree
                  categories={categories}
                  categoryId={categoryId}
                  onSelect={(id) => handleFilterChange({ categoryId: id })}
                />
              </div>
            </div>
          </aside>

          <div className={styles.productsArea}>
            {/* Thanh danh mục nằm ngang cho mobile */}
            <div className={styles.mobileCategoryNav}>
              <div
                className={`${styles.mobileCategoryChip} ${!categoryId ? styles.chipActive : ""}`}
                onClick={() => handleFilterChange({ categoryId: "" })}
              >
                Tất cả
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`${styles.mobileCategoryChip} ${String(categoryId) === String(cat.id) ? styles.chipActive : ""}`}
                  onClick={() => handleFilterChange({ categoryId: cat.id })}
                >
                  {cat.name}
                </div>
              ))}
            </div>

            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <i className="bi bi-search" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

              </div>

              <div className={styles.toolbarRight}>
                <select
                  className={styles.sortSelect}
                  value={`${urlSortBy || "createdAt"}-${urlSortOrder || "DESC"}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    handleFilterChange({ sortBy, sortOrder });
                  }}
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
                  >
                    <i className="bi bi-grid" />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <i className="bi bi-list-ul" />
                  </button>
                </div>
              </div>
            </div>

            {normalizedProducts.length === 0 ? (
              <div className={styles.empty}>
                <i className="bi bi-search" />
                <p>Không tìm thấy sản phẩm nào</p>
                <button
                  onClick={() => router.push("/products")}
                  className={styles.resetBtn}
                >
                  Xoá bộ lọc
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className={styles.grid}>
                {normalizedProducts.map((product) => (
                  <div key={product.id} className={styles.gridItem}>
                    <div className={styles.card}>
                      <Link
                        href={`/detail-product/${product.slug}`}
                        className={styles.cardImgLink}
                      >
                        <div className={styles.cardImg}>
                          <Image
                            src={product.image}
                            fill
                            alt={product.name}
                            className={styles.cardImgEl}
                            sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
                          />
                          {product.comparePrice > 0 && (
                            <span className={styles.badgeDiscount}>
                              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className={styles.cardInfo}>
                        <span className={styles.catTag}>{product.categoryName}</span>
                        <Link
                          href={`/detail-product/${product.slug}`}
                          className={styles.cardNameLink}
                        >
                          <h3 className={styles.cardName}>{product.name}</h3>
                        </Link>
                        <div className={styles.priceRow}>
                          <span className={styles.price}>
                            {product.price.toLocaleString("vi-VN")}đ
                          </span>
                          {product.comparePrice > 0 && (
                            <span className={styles.oldPrice}>
                              {product.comparePrice.toLocaleString("vi-VN")}đ
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
                                image: product.image,
                              },
                              1
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
                {normalizedProducts.map((product) => (
                  <div key={product.id} className={styles.listItem}>
                    <Link
                      href={`/detail-product/${product.slug}`}
                      className={styles.listImgLink}
                    >
                      <div className={styles.listImg}>
                        <Image
                          src={product.image}
                          fill
                          alt={product.name}
                          className={styles.listImgEl}
                          sizes="120px"
                        />
                      </div>
                    </Link>

                    <div className={styles.listInfo}>
                      <span className={styles.catTag}>{product.categoryName}</span>
                      <Link
                        href={`/detail-product/${product.slug}`}
                        className={styles.cardNameLink}
                      >
                        <h3 className={styles.listName}>{product.name}</h3>
                      </Link>
                      {product.description && (
                        <p className={styles.listDesc}>
                          {product.description.substring(0, 150)}...
                        </p>
                      )}
                    </div>

                    <div className={styles.listActions}>
                      <div className={styles.priceRow}>
                        <span className={styles.price}>
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                        {product.comparePrice > 0 && (
                          <span className={styles.oldPrice}>
                            {product.comparePrice.toLocaleString("vi-VN")}đ
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
                              image: product.image,
                            },
                            1
                          )
                        }
                      >
                        <i className="bi bi-cart3" /> Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {totalPages > 1 && (
              <div className={styles.paginationArea}>
                <div className={styles.pageLinks}>
                  <button
                    className={styles.pageLink}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="bi bi-chevron-left" />
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      className={`${styles.pageLink} ${page === currentPage ? styles.pageLinkActive : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className={styles.pageLink}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <i className="bi bi-chevron-right" />
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}