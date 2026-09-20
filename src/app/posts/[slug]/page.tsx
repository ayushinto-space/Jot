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
      <Link href="/" className="text-sm text-gray-500 hover:underline mb-4 inline-block">
        ← Back to all posts
      </Link>
      <h1 className="text-4xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-8">
        Published on {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="prose prose-lg">
        {/* Render content structured via Tiptap */}
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