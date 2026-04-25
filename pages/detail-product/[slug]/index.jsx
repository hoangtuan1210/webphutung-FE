import Head from "next/head";
import DetailProduct from "@/components/product/DetailProduct";
import ClientLayout from "@/layouts/ClientLayout";
import { productService } from "@/services/productService";

export default function DetailProductPage({ product, relatedProducts }) {
  if (!product) return <div className="p-5 text-center">Sản phẩm không tồn tại</div>;

  const pageTitle = `${product.name} | Phụ tùng Shop`;
  const pageDesc = product.metaDescription || product.description?.substring(0, 160) || "Phụ tùng chính hãng, chất lượng cao.";
  const pageImage = product.images?.[0]?.url || "/logo.png";

  return (
    <ClientLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={`/detail-product/${product.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImage} />
      </Head>

      <DetailProduct productData={product} relatedProducts={relatedProducts} />
    </ClientLayout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  
  try {
    const res = await productService.getProductBySlug(slug);
    console.log("Detail API Response for slug:", slug, JSON.stringify(res, null, 2));

    // Handle structured response { success, data: { ... } } or { success, data: { data: { ... } } }
    let product = null;
    if (res?.success) {
      product = res.data?.data || res.data || null;
    }

    let relatedProducts = [];
    if (product) {
      const categoryId = product.category?.id || product.categoryId;
      if (categoryId) {
        try {
          const relatedRes = await productService.getProducts({ categoryId, limit: 12 });
          if (relatedRes?.success) {
            const allItems = relatedRes.data?.items || relatedRes.data?.data || relatedRes.data || [];
            relatedProducts = allItems
              .filter((p) => p.id !== product.id)
              .sort(() => Math.random() - 0.5)
              .slice(0, 4);
          }
        } catch (relatedError) {
          console.error("Related Products Fetch Error:", relatedError);
        }
      }
    }

    return {
      props: {
        product: product,
        relatedProducts: relatedProducts,
      },
    };
  } catch (error) {
    console.error("Product Detail Page Error:", error);
    return {
      props: {
        product: null,
        relatedProducts: [],
      },
    };
  }
}


