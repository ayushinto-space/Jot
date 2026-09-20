import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Ensures fresh posts load on every request

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Jot</h1>
        <Link
          href="/write"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Write Post
        </Link>
      </div>

      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="p-4 border rounded-md shadow-sm hover:border-gray-400">
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts published yet.</p>
        )}
      </div>
    </main>
  );
}