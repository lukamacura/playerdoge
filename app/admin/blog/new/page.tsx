"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();
  const user = getAuth().currentUser;

  const handleSubmit = async () => {
if (!title.trim() || !slug.trim() || !content.trim() || !user){
      alert("Please fill out all required fields.");
      return;
    }

    await addDoc(collection(db, "blogs"), {
      title,
      slug,
      description,
      seoDescription,
      image,
      content,
      createdAt: serverTimestamp(),
      author: user.email,
    });

    alert("Blog post successfully published!");
    router.push("/admin");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mt-16 mb-6">New Blog Post</h1>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Slug (e.g. dark-war-guide)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Short description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="SEO meta description"
        value={seoDescription}
        onChange={(e) => setSeoDescription(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Image path (e.g. /images/blog/blog1.webp)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="mb-3"
      />

      <Textarea
        placeholder="Write your blog content here. Use Enter for new paragraphs and **bold** for emphasis."
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        rows={18}
        className="mb-4"
      />

      <Button onClick={handleSubmit}>Publish Blog</Button>
    </div>
  );
}
