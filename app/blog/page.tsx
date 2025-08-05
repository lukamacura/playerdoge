import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  author?: string;
  image?: string;
  createdAt?: any;
}


export default async function BlogListPage() {
  const snapshot = await getDocs(collection(db, "blogs"));


interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  author?: string;
  image?: string;
  createdAt?: Timestamp;
}

const posts: BlogPost[] = snapshot.docs.map((doc) => {
  const data = doc.data() as Omit<BlogPost, "id">;
  return {
    id: doc.id,
    ...data,
  };
});


  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 mt-16">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts found.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) =>
            post.slug && post.title ? (
              <div key={post.id} className="p-4 border rounded-lg">
                <h2 className="text-2xl font-extrabold font-montserrat">{post.title}</h2>
                <p className="text-gray-600 font-semibold pt-2 pb-6">{post.description}</p>
                <Link href={`/blog/${post.slug}`}>
                  <button className="w-full md:w-[300px] h-14 bg-[#FF7D29] hover:bg-[#e96e1b] text-white rounded-xl font-bold font-montserrat flex justify-center items-center transition duration-200 shadow-md hover:shadow-lg">
                    Read
                  </button>
                </Link>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
