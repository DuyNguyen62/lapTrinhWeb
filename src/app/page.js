import Link from "next/link";

const posts = [
  { id: 1, title: "Bài viết đầu tiên", summary: "Giới thiệu về Next.js" },
  { id: 2, title: "Cách tạo Blog bằng Next.js", summary: "Bắt đầu từ cơ bản" },
];

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Trang chủ Blog</h1>
      {posts.map(post => (
        <div key={post.id} className="mb-4 border-b pb-2">
          <Link href={`/posts/${post.id}`} className="text-blue-600 text-xl">
            {post.title}
          </Link>
          <p>{post.summary}</p>
        </div>
      ))}
    </main>
  );
}
