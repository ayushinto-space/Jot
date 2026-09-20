import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) {
    notFound();
  }

  const renderContent = () => {
    if (!post.content) return null;

    if (typeof post.content === 'string') {
      return (
        <div
          className="prose max-w-none text-slate-800 leading-relaxed tiptap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      );
    }

    return (
      <div className="prose max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap">
        {post.content.text || JSON.stringify(post.content)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-2xl mx-auto py-12 px-4">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-900 hover:underline mb-6 inline-block transition-colors"
        >
          ← Back to all posts
        </Link>
        
        <h1 className="text-4xl font-extrabold mb-3 text-slate-900">
          {post.title}
        </h1>
        
        <p className="text-sm text-slate-500 mb-6">
          Published on {new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.cover_image && (
          <div className="w-full h-72 md:h-96 relative mb-8 rounded-xl overflow-hidden shadow-sm border border-slate-100">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {renderContent()}
      </article>
    </div>
  );
}