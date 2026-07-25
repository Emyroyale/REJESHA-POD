import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";

export default function BlogSection() {
  return (
    <section className="bg-[#f5f5f5] px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <h2 className="flex-1 text-center font-display text-3xl tracking-wide text-rejesha-black sm:text-4xl">
            REJESHA Journal
          </h2>
          <div className="flex flex-1 justify-end">
            <Link
              href="/blog"
              className="text-xs font-semibold uppercase tracking-widest text-rejesha-red hover:underline"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
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
              <h3 className="mt-5 font-display text-lg leading-snug text-rejesha-black group-hover:text-rejesha-red">
                {post.title}
              </h3>
              <p className="mt-3 text-sm text-rejesha-gray">{post.excerpt}</p>
              <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-rejesha-black/40">
                Read article
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
