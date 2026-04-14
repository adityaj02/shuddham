import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/types";

/**
 * BlogCard — supports two variants:
 *  "magazine" (default): horizontal magazine-style card for the wisdom page article list
 *  "compact": vertical card for grid layouts and sidebar placements
 */
export const BlogCard = ({
  post,
  variant = "compact",
}: {
  post: BlogPost;
  variant?: "magazine" | "compact";
}) => {
  if (variant === "magazine") {
    return (
      <article className="grid md:grid-cols-10 gap-8 items-center group">
        <Link href={`/blogs/${post.slug}`} className="md:col-span-3 block">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-surface-container">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={500}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </Link>
        <div className="md:col-span-7 py-2">
          <span className="text-[10px] font-label uppercase tracking-widest text-primary/40 mb-3 block">
            {post.category}
          </span>
          <Link href={`/blogs/${post.slug}`}>
            <h4 className="text-2xl font-headline text-primary group-hover:text-tertiary transition-colors mb-3">
              {post.title}
            </h4>
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4 max-w-xl line-clamp-3">
            {post.excerpt}
          </p>
          <span className="text-xs font-label text-primary/60">{post.readTime}</span>
        </div>
      </article>
    );
  }

  /* ———————— compact variant (vertical card) ———————— */
  return (
    <article className="group bg-surface-container-lowest rounded-xl p-6 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(27,28,25,0.05)] hover:scale-[1.02]">
      <Link href={`/blogs/${post.slug}`}>
        <div className="aspect-[4/5] rounded-lg overflow-hidden mb-6 bg-surface-container">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={400}
            height={500}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </Link>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 bg-surface-container-high text-secondary rounded-full text-[10px] font-bold tracking-widest uppercase">
            {post.category}
          </span>
          <span className="text-on-surface-variant text-[11px]">{post.readTime}</span>
        </div>
        <Link href={`/blogs/${post.slug}`}>
          <h4 className="font-headline text-xl text-primary leading-snug group-hover:text-tertiary transition-colors">
            {post.title}
          </h4>
        </Link>
        <p className="text-on-surface-variant text-sm line-clamp-3">{post.excerpt}</p>
      </div>
    </article>
  );
};
