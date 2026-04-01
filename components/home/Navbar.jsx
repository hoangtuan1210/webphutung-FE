"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../../styles/client/navbar.module.css";
import { useCart } from "@/context/CartContext";
import { NAV_ITEMS } from "@/section/navbar_item";
import { MOCK_PRODUCTS } from "@/data/product";

export default function Navbar() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [topBannerVisible, setTopBannerVisible] = useState(true);

  // Search Suggestion Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const cart = useCart();
  const totalQty = cart?.totalQty ?? 0;
  const setIsOpen = cart?.setIsOpen;

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((p) => !p);
    setSearchQuery("");
    setShowSuggestions(false);
  }, []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((p) => !p), []);
  const toggleDropdown = useCallback(() => setIsDropdownOpen((p) => !p), []);
  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Dropdown menu close
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
      // Suggestions close
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        // setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY === 0;
      setTopBannerVisible(isTop);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dropdownRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products with search query
      // router.push(`/products?search=${searchQuery}`);
      setShowSuggestions(false);
      setIsSearchOpen(false);
    }
  };

  const renderSuggestions = () => {
    if (!showSuggestions || !searchQuery.trim()) return null;

    return (
      <div className={styles.suggestionList}>
        {suggestions.length > 0 ? (
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
                  <img src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className={styles.suggestionInfo}>
                  <span className={styles.suggestionName}>{p.name}</span>
                  <span className={styles.suggestionPrice}>{p.price.toLocaleString("vi-VN")}₫</span>
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

      <div
        className={`${styles.topBanner} ${topBannerVisible ? styles.topBannerVisible : ""}`}
      >
        <div className={styles.topBannerContent}>
          <span className={styles.topBannerItem}>
            <i className="bi bi-lightning-charge-fill" /> Phụ tùng xe máy - xe
            điện chính hãng
          </span>
        </div>
      </div>

      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={45}
              priority
              className={styles.logoImg}
            />
          </Link>

          <div className={styles.searchWrapper} ref={searchRef}>
            <form className={styles.searchDesktop} onSubmit={handleSearchSubmit}>
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
              />
              <button className={styles.searchBtn} type="submit">
                <i className="bi bi-search" />
              </button>
            </form>
            {renderSuggestions()}
          </div>

          <div className={styles.rightIcons}>
            <button
              className={`${styles.iconBtn} ${styles.searchToggle}`}
              onClick={toggleSearch}
              aria-label="Tìm kiếm"
            >
              <i className="bi bi-search" />
            </button>

            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                className={`${styles.iconBtn}`}
                onClick={toggleDropdown}
                aria-label="Menu"
                aria-expanded={isDropdownOpen}
              >
                <i
                  className={`bi ${isDropdownOpen ? "bi-x-lg" : "bi-list"} fs-5`}
                />
              </button>
              <ul
                className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownMenuOpen : ""}`}
              >
                {NAV_ITEMS.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className={styles.dropdownItem}
                      onClick={closeDropdown}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`${styles.iconBtn} ${styles.cartBtn}`}
              onClick={() => setIsOpen?.(true)}
              aria-label="Giỏ hàng"
            >
              <i className="bi bi-cart3" />
              {totalQty > 0 && (
                <span className={styles.cartBadge}>
                  {totalQty > 99 ? "99+" : totalQty}
                </span>
              )}
            </button>

            <button
              className={`${styles.iconBtn} ${styles.hamburger}`}
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <i
                className={`bi ${isMobileMenuOpen ? "bi-x-lg" : "bi-list"} fs-5`}
              />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`${styles.mobileSearch} ${isSearchOpen ? styles.mobileSearchOpen : ""}`}
      >
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
            <button className={styles.searchBtn} type="submit">
              <i className="bi bi-search" />
            </button>
            <button
              className={styles.closeSearch}
              type="button"
              onClick={() => setIsSearchOpen(false)}
            >
              <i className="bi bi-x-lg" />
            </button>
          </form>
          {renderSuggestions()}
        </div>
      </div>

      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}
      >
        <ul className={styles.mobileNavList}>
          {NAV_ITEMS.map((item, i) => (
            <li key={i} className={styles.mobileNavItem}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
