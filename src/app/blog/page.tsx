import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BlogHero from "@/components/BlogHero";
import { blogPillars, blogPosts, type BlogCategory } from "@/lib/blog-posts";

export const metadata: Metadata = { title: "Blog — REJESHA" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activePillar = blogPillars.find((pillar) => pillar.slug === category);
  const posts = activePillar
    ? blogPosts.filter((post) => post.category === (activePillar.slug as BlogCategory))
    : blogPosts;

  return (
    <div className="bg-rejesha-cream">
      <BlogHero />

      <div id="journal-posts" className="scroll-mt-20 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest">
            <Link
              href="/blog"
              className={`border px-4 py-2 transition-colors ${
                !activePillar
                  ? "border-rejesha-black bg-rejesha-black text-rejesha-white"
                  : "border-rejesha-line text-rejesha-gray hover:border-rejesha-black hover:text-rejesha-black"
              }`}
            >
              All Stories
            </Link>
            {blogPillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/blog?category=${pillar.slug}`}
                className={`border px-4 py-2 transition-colors ${
                  activePillar?.slug === pillar.slug
                    ? "border-rejesha-black bg-rejesha-black text-rejesha-white"
                    : "border-rejesha-line text-rejesha-gray hover:border-rejesha-black hover:text-rejesha-black"
                }`}
              >
                {pillar.navLabel}
              </Link>
            ))}
          </div>

          {activePillar && (
            <p className="font-editorial mb-10 max-w-2xl text-2xl text-rejesha-black">
              {activePillar.description}
            </p>
          )}

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                {post.image ? (
                  <div className="relative aspect-[6/5] w-full overflow-hidden bg-rejesha-black">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[6/5] w-full items-center justify-center bg-rejesha-black">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                      Coming Soon
                    </span>
                  </div>
                )}
                <span className="mt-5 inline-block text-[0.65rem] font-semibold tracking-widest text-rejesha-red uppercase">
                  {blogPillars.find((p) => p.slug === post.category)?.navLabel}
                </span>
                <h2 className="mt-2 font-display text-lg leading-snug text-rejesha-black group-hover:text-rejesha-red">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm text-rejesha-gray">{post.excerpt}</p>
                <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-rejesha-black/40">
                  Read article
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
