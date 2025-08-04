import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const q = query(collection(db, "blogs"), where("slug", "==", params.slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return {
      title: "Blog - Not Found",
      description: "This blog post does not exist.",
    };
  }

  const blog = snapshot.docs[0].data();

  return {
    title: blog.title,
    description: blog.seoDescription || blog.description || "",
    openGraph: {
      title: blog.title,
      description: blog.seoDescription || blog.description,
      images: [`https://www.playerdoge.com${blog.image}`],
    },
  };
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const q = query(collection(db, "blogs"), where("slug", "==", params.slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return notFound();

  const blog = snapshot.docs[0].data();
  const createdAt = blog.createdAt?.toDate?.() as Date | undefined;
  const formattedDate = createdAt ? format(createdAt, "dd.MM.yyyy") : "N/A";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-2 mt-16">{blog.title}</h1>

      <p className="text-sm text-gray-400 mb-4">
        Author: {blog.author} · {formattedDate}
      </p>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title || "Blog image"}
          className="mb-6 rounded-md w-full object-cover max-h-[600px]"
          loading="lazy"
        />
      )}

      <div className="prose prose-lg max-w-none">
<div className="prose prose-lg max-w-none whitespace-pre-wrap">
  <ReactMarkdown>{blog.content}</ReactMarkdown>
</div>
      </div>

      <Link href="/blog">
        <button className="mt-10 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
          Back to Blog
        </button>
      </Link>
    </div>
  );
}
