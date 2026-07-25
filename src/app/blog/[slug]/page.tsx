import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogPillars,
  blogPosts,
  getPostBySlug,
  getRelatedPosts,
  type ContentBlock,
  type ContentSegment,
} from "@/lib/blog-posts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — REJESHA Journal`,
    description: post.excerpt,
  };
}

function Segment({ segment }: { segment: ContentSegment }) {
  if (typeof segment === "string") return <>{segment}</>;
  return (
    <Link
      href={segment.href}
      className="text-rejesha-red underline decoration-rejesha-red/40 underline-offset-2 hover:decoration-rejesha-red"
      target={segment.external ? "_blank" : undefined}
      rel={segment.external ? "noopener noreferrer" : undefined}
    >
      {segment.text}
    </Link>
  );
}

function Block({ block, index }: { block: ContentBlock; index: number }) {
  if (block.type === "heading") {
    return (
      <h2
        key={index}
        className="font-display mt-10 text-xl text-rejesha-black sm:text-2xl"
      >
        {block.text}
      </h2>
    );
  }
  return (
    <p key={index}>
      {block.content.map((segment, j) => (
        <Segment key={j} segment={segment} />
      ))}
    </p>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const pillar = blogPillars.find((p) => p.slug === post.category);
  const related = getRelatedPosts(post);

  return (
    <div className="bg-rejesha-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href={pillar ? `/blog?category=${pillar.slug}` : "/blog"}
          className="text-xs font-semibold uppercase tracking-widest text-rejesha-red"
        >
          {pillar?.label ?? "Journal"}
        </Link>

        <h1 className="font-display mt-4 text-3xl leading-tight text-rejesha-black sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base text-rejesha-gray">{post.excerpt}</p>

        {post.image ? (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-rejesha-black">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        ) : (
          <div className="mt-6 flex aspect-[16/9] w-full items-center justify-center bg-rejesha-black">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Coming Soon
            </span>
          </div>
        )}

        <div className="font-editorial mt-10 space-y-6 text-lg leading-relaxed text-rejesha-black/90">
          {post.body.map((block, i) => (
            <Block key={i} block={block} index={i} />
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-rejesha-line pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-rejesha-black/60">
              Related Reading
            </h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="font-display text-lg text-rejesha-black hover:text-rejesha-red"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/blog"
            className="text-xs font-semibold uppercase tracking-widest text-rejesha-gray hover:text-rejesha-black"
          >
            ← Back to the Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
