import Head from "next/head";
import DetailProduct from "@/components/product/DetailProduct";
import ClientLayout from "@/layouts/ClientLayout";
import { MOCK_PRODUCTS } from "@/data/product";
import { toSlug } from "@/utils/slug";

export default function DetailProductPage({ product }) {
  if (!product) return <div className="p-5 text-center">Sản phẩm không tồn tại</div>;

  const pageTitle = `${product.name} | Phụ tùng Anh Hậu`;
  const pageDesc = product.desc?.substring(0, 160) || "Phụ tùng chính hãng, chất lượng cao.";
  const pageImage = product.images?.[0] || "/logo.png";

  return (
    <ClientLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={`https://phutunganhhau.com/detail-product/${toSlug(product.name)}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImage} />
      </Head>

      <DetailProduct productData={product} />
    </ClientLayout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const product = MOCK_PRODUCTS.find((p) => toSlug(p.name) === slug) || null;
  return {
    props: {
      product,
    },
  };
}
