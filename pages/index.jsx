import Head from "next/head";
import ClientLayout from "@/layouts/ClientLayout";
import BannerCarousel from "@/components/home/BannerCarousel";
import ProductSection from "@/components/home/ProductSection";
import PromoBanner from "@/components/home/PromoBanner";
import NewsSection from "@/components/home/NewsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { newsService } from "@/services/newsService";
import { productService } from "@/services/productService";
import { bannerService } from "@/services/bannerService";


export default function Home({ news, featuredProducts, trendingProducts, banners }) {
  return (
    <ClientLayout>
      <Head>
        <title>Phụ tùng xe máy - xe điện chính hãng</title>
        <meta name="description" content="Chuyên cung cấp phụ tùng xe máy, xe điện chính hãng, đồ chơi xe cao cấp. Giao hàng toàn quốc, bảo hành uy tín tại Phụ tùng Shop." />
        <meta property="og:title" content="Phụ tùng Shop - Phụ tùng chính hãng" />
        <meta property="og:description" content="Khám phá ngay bộ sưu tập đồ chơi xe và phụ tùng chất lượng cao." />
        <meta property="og:image" content="https://feichi.htechsoft.vn/about-us.png" />
        <meta property="og:url" content="https://feichi.htechsoft.vn" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Phụ tùng Feichi - Phụ tùng chính hãng" />
        <meta name="twitter:description" content="Khám phá ngay bộ sưu tập đồ chơi xe và phụ tùng chất lượng cao." />
        <meta name="twitter:image" content="https://feichi.htechsoft.vn/about-us.png" />
      </Head>

      <BannerCarousel banners={banners} />
      <FeaturesSection />
      <ProductSection
        products={featuredProducts}
        title="Sản phẩm nổi bật"
      />

      <ProductSection
        products={trendingProducts}
        title="Sản phẩm xu hướng"
      />

      <PromoBanner />
      <WhyChooseUs imageSrc="/about-us.png" />
      {news && news.length > 0 && <NewsSection news={news} />}
    </ClientLayout>
  );
}

export async function getStaticProps() {
  let news = [];
  let featuredProducts = [];
  let trendingProducts = [];
  let banners = [];

  try {
    const [productsRes, trendingRes, bannersRes, newsRes] = await Promise.all([
      productService.getFeaturedProducts(8).catch(() => ({ success: false, data: [] })),
      productService.getTrendingProducts(8).catch(() => ({ success: false, data: [] })),
      bannerService.getBanners().catch(() => ({ success: false, data: [] })),
      newsService.getFeaturedNews({ limit: 3 }).catch(() => ({ success: false, data: [] })),
    ]);

    featuredProducts = productsRes?.success ? productsRes.data : [];
    trendingProducts = trendingRes?.success ? trendingRes.data : [];
    banners = bannersRes?.success ? bannersRes.data : [];

    if (newsRes?.success) {
      const allNews = Array.isArray(newsRes.data) ? newsRes.data : (newsRes.data?.data || []);
      news = allNews.slice(0, 3).map((article) => ({
        ...article,
        image: article.image || "",
        excerpt: article.summary || article.description || "",
        date: (article.created_at || article.createdAt) ? new Intl.DateTimeFormat("vi-VN").format(new Date(article.created_at || article.createdAt)) : "",
        category: article.category?.name || article.category || "Tin tức",
      }));
    }

    if (news.length === 0) {
      news = [];
    }
  } catch (error) {
    console.error("Home Page Data Fetch Error:", error);
    news = [];
  }

  return {
    props: {
      news,
      featuredProducts,
      trendingProducts,
      banners,
    },
    revalidate: 3600,
  };
}
