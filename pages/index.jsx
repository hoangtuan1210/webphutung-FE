import Head from "next/head";
import ClientLayout from "@/layouts/ClientLayout";
import BannerCarousel from "@/components/home/BannerCarousel";
import ProductSection from "@/components/home/ProductSection";
import PromoBanner from "@/components/home/PromoBanner";
import NewsSection from "@/components/home/NewsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BrandScrolling from "@/components/home/BrandScrolling";
import { newsList } from "@/data/news";

export default function Home({ news }) {
  return (
    <ClientLayout>
  
      <Head>
        <title>Phụ tùng xe máy - xe điện chính hãng</title>
        <meta name="description" content="Chuyên cung cấp phụ tùng xe máy, xe điện chính hãng, đồ chơi xe cao cấp. Giao hàng toàn quốc, bảo hành uy tín tại Phụ tùng Anh Hậu." />
        <meta property="og:title" content="Phụ tùng Anh Hậu - Phụ tùng chính hãng" />
        <meta property="og:description" content="Khám phá ngay bộ sưu tập đồ chơi xe và phụ tùng chất lượng cao." />
        <meta property="og:image" content="/about-us.png" />
      </Head>

      <BannerCarousel />

      <FeaturesSection />

      <ProductSection />

      <PromoBanner />

      <WhyChooseUs imageSrc="/about-us.png" />

      <NewsSection news={news} />

      <BrandScrolling />


    </ClientLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      news: newsList.slice(0, 4),
    },
    revalidate: 3600,
  };
}
