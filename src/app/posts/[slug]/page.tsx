import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-2xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-slate-500 hover:underline mb-6 inline-block">
        ← Back to all posts
      </Link>
      <h1 className="text-4xl font-extrabold mb-3 text-slate-900">{post.title}</h1>
      <p className="text-sm text-slate-400 mb-6">
        Published on {new Date(post.created_at).toLocaleDateString()}
      </p>

      {/* Hero Cover Image */}
      {post.cover_image && (
        <div className="w-full h-72 md:h-96 relative mb-8 rounded-xl overflow-hidden shadow-sm">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg text-slate-800 leading-relaxed">
        {typeof post.content === 'string' ? (
          <p>{post.content}</p>
        ) : (
          <pre className="whitespace-pre-wrap font-sans">
            {JSON.stringify(post.content, null, 2)}
          </pre>
        )}
      </div>
    </article>
  );
}