import { ayurvedaHeroPoints, ayurvedaSections, blogPosts, wellnessCollections } from "@/lib/data/content";

export const getBlogPosts = async () =>
  [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const getBlogPostBySlug = async (slug: string) =>
  blogPosts.find((post) => post.slug === slug) ?? null;

export const getRelatedBlogPosts = async (slug: string, category: string) =>
  blogPosts.filter((post) => post.slug !== slug && post.category === category).slice(0, 3);

export const getAyurvedaContent = async () => ({
  heroPoints: ayurvedaHeroPoints,
  sections: ayurvedaSections,
  collections: wellnessCollections,
});
