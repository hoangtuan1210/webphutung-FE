"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../../styles/client/navbar.module.css";
import { useCart } from "@/context/CartContext";
import { NAV_ITEMS } from "@/section/navbar_item";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";

export default function Navbar() {
  const router = useRouter();
  const cart = useCart();
  const totalQty = cart?.totalQty ?? 0;
  const setIsOpen = cart?.setIsOpen;

  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [topBannerVisible, setTopBannerVisible] = useState(true);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopNavRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setCurrentUser({
            name: `${u.lastName || ""} ${u.firstName || ""}`.trim() || u.email || "Tài khoản",
            avatar: u.avatar || "/default-avatar.png",
            role: u.role,
          });
        } catch (e) {}
      }
      
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data?.slice(0, 8) || []);
      } catch (err) {}
    };

    fetchInitialData();

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target)) setActiveDropdown(null);
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserMenuOpen(false);
    };

    const handleScroll = () => setTopBannerVisible(window.scrollY === 0);
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        setShowSuggestions(true);
        const res = await productService.getProducts({ limit: 6, search: searchQuery });

        let list = [];
        if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res?.data?.data?.data)) list = res.data.data.data;

        setSuggestions(list);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 350);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((p) => !p);
    setSearchQuery("");
    setShowSuggestions(false);
  }, []);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((p) => !p), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setShowSuggestions(false);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const renderSuggestions = () => {
    if (!showSuggestions || !searchQuery.trim()) return null;

    return (
      <div className={styles.suggestionList}>
        {loadingSearch ? (
          <div className={styles.noResult}>Đang tìm...</div>
        ) : suggestions.length > 0 ? (
          <>
            <div className={styles.suggestionHeader}>Sản phẩm gợi ý</div>
            {suggestions.map((p) => (
              <Link
                key={p.id}
                href={`/detail-product/${p.slug}`}
                className={styles.suggestionItem}
                onClick={() => {
                  setShowSuggestions(false);
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                <div className={styles.suggestionImage}>
                  <img
                    src={p.images?.[0]?.url || "/placeholder.jpg"} // ✅ fix
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className={styles.suggestionInfo}>
                  <span className={styles.suggestionName}>{p.name}</span>
                  <span className={styles.suggestionPrice}>
                    {Number(p.price).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </Link>
            ))}
          </>
        ) : (
          <div className={styles.noResult}>Không thấy sản phẩm phù hợp</div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.navbarWrapper}>
      <div className={`${styles.topBanner} ${topBannerVisible ? styles.topBannerVisible : ""}`}>
        <div className={styles.topBannerContent}>
          <span className={styles.topBannerItem}>
            <i className="bi bi-lightning-charge-fill" /> Phụ tùng xe máy - xe điện chính hãng
          </span>
        </div>
      </div>

      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="Logo" width={140} height={45} priority className={styles.logoImg} />
          </Link>

          <div className={styles.searchContainer} ref={searchRef}>
            <form className={styles.searchDesktop} onSubmit={handleSearchSubmit}>
              <div className={styles.searchInputWrapper}>
                <i className={`bi bi-search ${styles.searchIconInside}`} />
                <input
                   className={styles.searchInput}
                   type="text"
                   placeholder="Tìm kiếm phụ tùng, đồ chơi xe..."
                   value={searchQuery}
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     if (e.target.value.trim().length >= 2) {
                       setShowSuggestions(true);
                     } else {
                       setShowSuggestions(false);
                     }
                   }}
                   onFocus={() => {
                     if (searchQuery.trim().length >= 2) setShowSuggestions(true);
                   }}
                   onKeyDown={(e) => {
                     if (e.key === "Escape") {
                       setShowSuggestions(false);
                       setSearchQuery("");
                     }
                   }}
                />
                {searchQuery && (
                  <button type="button" className={styles.clearSearchBtn} onClick={() => setSearchQuery("")}>
                    <i className="bi bi-x-circle-fill" />
                  </button>
                )}
              </div>
            </form>
            {renderSuggestions()}
          </div>


          <div className={styles.desktopNavWrapper} ref={desktopNavRef}>
            <ul className={styles.desktopNavList}>
              {NAV_ITEMS.filter(item => item.label !== "Đơn hàng").map((item, i) => (
                <li
                  key={i}
                  className={styles.desktopNavItem}
                  onMouseEnter={() => item.label === "Sản phẩm" && setActiveDropdown(item.label)}
                  onMouseLeave={() => item.label === "Sản phẩm" && setActiveDropdown(null)}
                >
                  <Link href={item.href} className={`${styles.desktopNavLink} ${activeDropdown === item.label ? styles.active : ""}`}>
                    {item.label}
                    {item.label === "Sản phẩm" && <i className={`bi bi-chevron-down ${styles.chevron}`} />}
                  </Link>

                  {item.label === "Sản phẩm" && (
                    <div className={`${styles.categoryDropdown} ${activeDropdown === "Sản phẩm" ? styles.categoryDropdownOpen : ""}`}>
                      <div className={styles.categoryInner}>
                        <div className={styles.categoryGrid}>
                          {categories.map((cat) => (
                            <Link key={cat.id} href={`/products?categoryId=${cat.id}`} className={styles.categoryLink} onClick={() => setActiveDropdown(null)}>
                              {cat.name}
                            </Link>
                          ))}
                          <Link href="/products" className={`${styles.categoryLink} ${styles.viewAllCategories}`} onClick={() => setActiveDropdown(null)}>
                            Xem tất cả sản phẩm <i className="bi bi-arrow-right" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.rightIcons}>
            <button className={`${styles.iconBtn} ${styles.searchToggle}`} onClick={toggleSearch} aria-label="Tìm kiếm">
              <i className="bi bi-search" />
            </button>

            <button className={`${styles.iconBtn} ${styles.cartBtn}`} onClick={() => setIsOpen?.(true)} aria-label="Giỏ hàng">
              <i className="bi bi-cart3" />
              {totalQty > 0 && <span className={styles.cartBadge}>{totalQty > 99 ? "99+" : totalQty}</span>}
            </button>

            {currentUser ? (
              /* Đã đăng nhập: hiển thị avatar + dropdown */
              <div className={styles.userMenuWrapper} ref={userRef}>
                <button className={styles.avatarBtn} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} aria-label="Tài khoản">
                  <div className={styles.avatarImgWrapper}>
                    <Image src={currentUser.avatar || "/default-avatar.png"} alt="Avatar" width={32} height={32} />
                  </div>
                </button>

                <div className={`${styles.userDropdown} ${isUserMenuOpen ? styles.userDropdownOpen : ""}`}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{currentUser.name}</p>
                    <p className={styles.userRole}>
                      {currentUser.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                    </p>
                  </div>
                  <div className={styles.userLinks}>
                    {currentUser.role === "admin" && (
                      <Link href="/admin/dashboard" className={styles.userLink} onClick={() => setIsUserMenuOpen(false)}>
                        <i className="bi bi-speedometer2" /> Trang quản trị
                      </Link>
                    )}
                    <Link href="/profile" className={styles.userLink} onClick={() => setIsUserMenuOpen(false)}>
                      <i className="bi bi-person" /> Thông tin tài khoản
                    </Link>
                    <Link href="/order" className={styles.userLink} onClick={() => setIsUserMenuOpen(false)}>
                      <i className="bi bi-box-seam" /> Đơn hàng của tôi
                    </Link>
                    <div className={styles.userDivider} />
                    <button
                      className={`${styles.userLink} ${styles.logoutBtn}`}
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setCurrentUser(null);
                        setIsUserMenuOpen(false);
                        window.location.href = "/";
                      }}
                    >
                      <i className="bi bi-box-arrow-right" /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Chưa đăng nhập: hiển thị nút Đăng nhập / Đăng ký */
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.loginBtn}>
                  Đăng nhập
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                  Đăng ký
                </Link>
              </div>
            )}

            <button className={`${styles.iconBtn} ${styles.hamburger}`} onClick={toggleMobileMenu} aria-label="Menu">
              <i className={`bi ${isMobileMenuOpen ? "bi-x-lg" : "bi-list"} fs-5`} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`${styles.mobileSearch} ${isSearchOpen ? styles.mobileSearchOpen : ""}`}>
        <div className={styles.mobileSearchInner} ref={mobileSearchRef}>
          <form className={styles.mobileSearchForm} onSubmit={handleSearchSubmit}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              autoFocus
            />
            <button className={styles.searchBtn} type="submit"><i className="bi bi-search" /></button>
            <button className={styles.closeSearch} type="button" onClick={() => setIsSearchOpen(false)}><i className="bi bi-x-lg" /></button>
          </form>
          {renderSuggestions()}
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <ul className={styles.mobileNavList}>
          {NAV_ITEMS.map((item, i) => (
            <li key={i} className={styles.mobileNavItem}>
              {item.label === "Sản phẩm" ? (
                <>
                  <div className={styles.mobileNavLink} onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)} style={{ justifyContent: 'space-between' }}>
                    <span>{item.label}</span>
                    <i className={`bi bi-chevron-${isMobileProductsOpen ? 'up' : 'down'}`} />
                  </div>
                  <div className={`${styles.mobileSubMenu} ${isMobileProductsOpen ? styles.mobileSubMenuOpen : ""}`}>
                    {categories.map((cat) => (
                      <Link key={cat.id} href={`/products?categoryId=${cat.id}`} className={styles.mobileSubNavLink} onClick={closeMobileMenu}>
                        {cat.name}
                      </Link>
                    ))}
                    <Link href="/products" className={`${styles.mobileSubNavLink} ${styles.viewAllMobile}`} onClick={closeMobileMenu}>Tất cả sản phẩm</Link>
                  </div>
                </>
              ) : (
                <Link href={item.label === "Đơn hàng" ? "/order" : item.href} className={styles.mobileNavLink} onClick={closeMobileMenu}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
