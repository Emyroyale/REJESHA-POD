import postsData from "@/data/blog-posts.json";

export type BlogCategory =
  | "relocation"
  | "money"
  | "travel"
  | "lifestyle"
  | "investing";

export type BlogPillar = {
  slug: BlogCategory;
  label: string;
  navLabel: string;
  description: string;
};

export const blogPillars: BlogPillar[] = [
  {
    slug: "relocation",
    label: "Relocation & Immigration",
    navLabel: "Relocation",
    description:
      "Visas, moving logistics, and everything Kenyans need to know before relocating abroad.",
  },
  {
    slug: "money",
    label: "Money & Financial Planning",
    navLabel: "Money",
    description:
      "Sending money home, banking, taxes, and building financial security in the diaspora.",
  },
  {
    slug: "travel",
    label: "Travel Between Kenya & Abroad",
    navLabel: "Travel",
    description:
      "Flights, packing, and everything to know about traveling between Kenya and your new home.",
  },
  {
    slug: "lifestyle",
    label: "Kenyan Lifestyle & Community Abroad",
    navLabel: "Lifestyle",
    description:
      "Staying connected to Kenyan culture, food, and community, wherever you live.",
  },
  {
    slug: "investing",
    label: "Investing & Returning Home",
    navLabel: "Invest",
    description:
      "Land, property, SACCOs, and planning a move back home from the diaspora.",
  },
];

export type ContentSegment =
  | string
  | { text: string; href: string; external?: boolean };

export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; content: ContentSegment[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  image: string | null;
  body: ContentBlock[];
  relatedSlugs?: string[];
};

export const blogPosts: BlogPost[] = postsData as BlogPost[];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  if (!post.relatedSlugs) return [];
  return post.relatedSlugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p));
}
