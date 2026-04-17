import { useState, useEffect, useCallback } from "react";
import { bannerService } from "@/services/bannerService";


const ENABLE_PROMOTION_API = true;

const FALLBACK_PROMOTIONS = [
  {
    id: "fallback-1",
    title: "",
    description: "",
    image: "/promotion-banner.jpg",
    link: "/products",
    position: "home_middle",
    isActive: true,
    sortOrder: 1,
  },
];


export default function usePromotionBanner({
  position = "home_middle",
  initialData = null,
  enableRefetch = true,
  fallback = FALLBACK_PROMOTIONS,
} = {}) {
  const [promotions, setPromotions] = useState(() => {
    const rawData = (initialData && initialData.length > 0) ? initialData : fallback;
    if (rawData && rawData.length > 0) {
      return [{
        ...rawData[0],
        title: "",
        description: "",
      }];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromotions = useCallback(async () => {
    if (!ENABLE_PROMOTION_API) return;

    setLoading(true);
    setError(null);
    try {
      const res = await bannerService.getPromotionBanners(position);

      if (res?.success && res.data?.length > 0) {
        const firstItem = res.data[0];
        const promotion = {
          ...firstItem,
          title: "",
          description: "",
        };
        setPromotions([promotion]);
      }
    } catch (err) {
      console.warn("Promotion banner fetch failed, using fallback:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [position]);

  useEffect(() => {
    if (enableRefetch) {
      fetchPromotions();
    }
  }, [enableRefetch, fetchPromotions]);

  return {
    promotions,
    loading,
    error,
    refetch: fetchPromotions,
  };
}
