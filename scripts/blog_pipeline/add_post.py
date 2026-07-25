#!/usr/bin/env python3
"""
Add or update a REJESHA Journal blog post.

Reads a draft JSON file (title, excerpt, category, body, relatedSlugs),
optionally fetches a hero image from Unsplash or Pixabay, and writes the
post into src/data/blog-posts.json, the same file the Next.js site reads.

Usage:
    python3 scripts/blog_pipeline/add_post.py --draft drafts/my-post.json
    python3 scripts/blog_pipeline/add_post.py --draft drafts/my-post.json --image-query "kenya nairobi skyline"
    python3 scripts/blog_pipeline/add_post.py --draft drafts/my-post.json --no-image --dry-run

Draft JSON shape (image and relatedSlugs are optional):
{
  "slug": "how-to-open-a-us-bank-account-from-kenya",
  "title": "How to Open a US Bank Account from Kenya",
  "excerpt": "...",
  "category": "money",
  "body": [
    {"type": "heading", "text": "What You'll Need"},
    {"type": "paragraph", "content": ["Plain text segment, then a link: ", {"text": "Chase", "href": "https://chase.com", "external": true}, "."]},
    {"type": "paragraph", "content": ["Another paragraph as plain text."]}
  ],
  "relatedSlugs": ["how-kenyans-abroad-can-send-money-home-cheaply"]
}

API keys (put these in .env.local at the project root, never pass them on
the command line or commit them):
    UNSPLASH_ACCESS_KEY=...
    PIXABAY_API_KEY=...
"""

import argparse
import json
import os
import sys
from pathlib import Path
from urllib.parse import quote

import requests

REPO_ROOT = Path(__file__).resolve().parents[2]
POSTS_JSON = REPO_ROOT / "src" / "data" / "blog-posts.json"
IMAGES_DIR = REPO_ROOT / "public" / "images" / "blog"
VALID_CATEGORIES = {"relocation", "money", "travel", "lifestyle", "investing"}


def load_env_file(path: Path) -> None:
    """Minimal .env.local loader so this script has no hard dependency on python-dotenv."""
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def load_posts() -> list[dict]:
    if not POSTS_JSON.exists():
        return []
    return json.loads(POSTS_JSON.read_text())


def save_posts(posts: list[dict]) -> None:
    POSTS_JSON.write_text(json.dumps(posts, indent=2) + "\n")


def validate_draft(draft: dict) -> None:
    required = ["slug", "title", "excerpt", "category", "body"]
    missing = [key for key in required if key not in draft]
    if missing:
        raise ValueError(f"Draft is missing required field(s): {', '.join(missing)}")
    if draft["category"] not in VALID_CATEGORIES:
        raise ValueError(
            f"Unknown category '{draft['category']}'. Must be one of: {', '.join(sorted(VALID_CATEGORIES))}"
        )
    if not isinstance(draft["body"], list) or not draft["body"]:
        raise ValueError("'body' must be a non-empty list of blocks")
    for block in draft["body"]:
        if not isinstance(block, dict) or block.get("type") not in ("heading", "paragraph"):
            raise ValueError("each body block must be {'type': 'heading', 'text': ...} or {'type': 'paragraph', 'content': [...]}")


def fetch_unsplash_image(query: str) -> bytes | None:
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:
        return None
    url = f"https://api.unsplash.com/search/photos?query={quote(query)}&per_page=1&orientation=landscape"
    resp = requests.get(url, headers={"Authorization": f"Client-ID {key}"}, timeout=15)
    resp.raise_for_status()
    results = resp.json().get("results", [])
    if not results:
        return None
    image_url = results[0]["urls"]["regular"]
    image_resp = requests.get(image_url, timeout=15)
    image_resp.raise_for_status()
    return image_resp.content


def fetch_pixabay_image(query: str) -> bytes | None:
    key = os.environ.get("PIXABAY_API_KEY")
    if not key:
        return None
    url = f"https://pixabay.com/api/?key={key}&q={quote(query)}&image_type=photo&orientation=horizontal&per_page=3"
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    hits = resp.json().get("hits", [])
    if not hits:
        return None
    image_url = hits[0]["largeImageURL"]
    image_resp = requests.get(image_url, timeout=15)
    image_resp.raise_for_status()
    return image_resp.content


def fetch_hero_image(slug: str, query: str) -> str | None:
    """Tries Unsplash first, falls back to Pixabay. Returns the site-relative image path, or None."""
    image_bytes = fetch_unsplash_image(query)
    source = "Unsplash"
    if image_bytes is None:
        image_bytes = fetch_pixabay_image(query)
        source = "Pixabay"
    if image_bytes is None:
        print(f"  no image found on Unsplash or Pixabay for query '{query}'; skipping image")
        return None

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    dest = IMAGES_DIR / f"{slug}.jpg"
    dest.write_bytes(image_bytes)
    print(f"  saved hero image from {source} -> {dest.relative_to(REPO_ROOT)}")
    return f"/images/blog/{slug}.jpg"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--draft", required=True, type=Path, help="Path to the draft JSON file")
    parser.add_argument("--image-query", help="Search query for the hero image (defaults to the post title)")
    parser.add_argument("--no-image", action="store_true", help="Skip image fetching entirely")
    parser.add_argument("--dry-run", action="store_true", help="Print what would happen without writing files")
    args = parser.parse_args()

    load_env_file(REPO_ROOT / ".env.local")

    draft = json.loads(args.draft.read_text())
    validate_draft(draft)

    posts = load_posts()
    existing_index = next((i for i, p in enumerate(posts) if p["slug"] == draft["slug"]), None)

    # Default to keeping whatever image the existing post already has, so a
    # content-only update doesn't blow away a good image already on disk.
    image_path = draft.get("image") or (posts[existing_index]["image"] if existing_index is not None else None)
    if not args.no_image and not args.dry_run:
        query = args.image_query or draft["title"]
        image_path = fetch_hero_image(draft["slug"], query) or image_path

    post = {
        "slug": draft["slug"],
        "title": draft["title"],
        "excerpt": draft["excerpt"],
        "category": draft["category"],
        "image": image_path,
        "body": draft["body"],
        "relatedSlugs": draft.get("relatedSlugs", []),
    }

    action = "update" if existing_index is not None else "add"
    print(f"About to {action} post '{post['slug']}' ({post['title']})")

    if args.dry_run:
        print(json.dumps(post, indent=2))
        print("Dry run, nothing was written.")
        return 0

    if existing_index is not None:
        posts[existing_index] = post
    else:
        posts.append(post)

    save_posts(posts)
    print(f"Wrote {POSTS_JSON.relative_to(REPO_ROOT)}")
    print("Review the diff, then commit and push when you're ready:")
    print(f"  git add {POSTS_JSON.relative_to(REPO_ROOT)}" + (f" {IMAGES_DIR.relative_to(REPO_ROOT)}/{post['slug']}.jpg" if image_path else ""))
    title = post["title"]
    print(f'  git commit -m "Add blog post: {title}"')
    return 0


if __name__ == "__main__":
    sys.exit(main())
