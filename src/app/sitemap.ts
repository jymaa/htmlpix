import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://htmlpix.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/docs/quickstart`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/docs/authentication`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs/endpoints`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/docs/examples`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs/rate-limits`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs/image-storage`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs/errors`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs/faq`,
      lastModified: new Date(),
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/status`,
      lastModified: new Date(),
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      priority: 0.5,
    },
  ];
}
