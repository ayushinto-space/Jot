import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, content, cover_image')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition">
            Jot<span className="text-indigo-600">.</span>
          </Link>
          <Link
            href="/write"
            className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition shadow-sm"
          >
            + Start Writing
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Thoughts, stories, and ideas.
          </h1>
          <p className="text-slate-600 text-lg">
            A minimalist space for publishing long-form writing.
          </p>
        </section>

        {/* Feed List */}
        <section className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="group p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col md:flex-row gap-6 items-start justify-between"
              >
                <div className="flex-1">
                  <Link href={`/posts/${post.slug}`}>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <time>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        Article
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition mb-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                      {typeof post.content === 'string'
                        ? post.content
                        : 'Click to read full article...'}
                    </p>
                  </Link>
                </div>

                {/* Render Cover Image if present */}
                {post.cover_image && (
                  <div className="w-full md:w-48 h-32 relative flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 mb-4">No stories published yet.</p>
              <Link
                href="/write"
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                Write your first story →
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}