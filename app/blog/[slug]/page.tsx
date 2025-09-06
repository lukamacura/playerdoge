"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  title: string;
  slug: string;
  description?: string;
  seoDescription?: string;
  content: string;
  image?: string;
  author?: string;
  createdAt?: Timestamp;
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        const q = query(collection(db, "blogs"), where("slug", "==", params.slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setBlog(snapshot.docs[0].data() as BlogPost);
        } else {
          setBlog(null);
        }
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [params.slug]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-10 px-4">Loading…</div>;
  }

  if (!blog) {
    // prosta klijentska 404
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mt-16 mb-4">Post not found</h1>
        <Link href="/blog" className="underline">Back to Blog</Link>
      </div>
    );
  }

  const createdAt = blog.createdAt?.toDate?.() as Date | undefined;
  const formattedDate = createdAt ? format(createdAt, "dd.MM.yyyy") : "N/A";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-2 mt-16">{blog.title}</h1>
      <p className="text-sm text-gray-400 mb-4">Author: {blog.author} · {formattedDate}</p>

      {blog.image && (
        <div className="mb-6">
          <Image
            src={blog.image}
            alt={blog.title || "Blog image"}
            width={1600}
            height={900}
            className="rounded-md w-full object-cover max-h-[600px]"
            priority={false}
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none blog-content">
        <ReactMarkdown
          components={{
            br: () => null,
            p: ({ children }) => <p className="mb-6">{children}</p>,
          }}
        >
          {blog.content}
        </ReactMarkdown>
      </div>

      <Link href="/blog" className="inline-block">
        <button className="mt-10 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
          Back to Blog
        </button>
      </Link>
    </div>
  );
}
