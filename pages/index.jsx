import Head from "next/head";
import ClientLayout from "@/layouts/ClientLayout";
import BannerCarousel from "@/components/home/BannerCarousel";
import ProductSection from "@/components/home/ProductSection";
import PromoBanner from "@/components/home/PromoBanner";
import NewsSection from "@/components/home/NewsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { newsList } from "@/data/news";
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
        <meta property="og:image" content="/about-us.png" />
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
      <NewsSection news={news} />
    </ClientLayout>
  );
}

export async function getStaticProps() {
  let news = [];
  let featuredProducts = [];
  let trendingProducts = [];
  let banners = [];

  try {
    const [productsRes, trendingRes, bannersRes] = await Promise.all([
      productService.getFeaturedProducts(8).catch(() => ({ success: false, data: [] })),
      productService.getTrendingProducts(8).catch(() => ({ success: false, data: [] })),
      bannerService.getBanners().catch(() => ({ success: false, data: [] })),
    ]);

    featuredProducts = productsRes?.success ? productsRes.data : [];
    trendingProducts = trendingRes?.success ? trendingRes.data : [];
    banners = bannersRes?.success ? bannersRes.data : [];
    news = newsList.slice(0, 4);
  } catch (error) {
    console.error("Home Page Data Fetch Error:", error);
    news = newsList.slice(0, 4);
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