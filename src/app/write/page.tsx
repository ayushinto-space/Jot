'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Editor from '@/components/Editor';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);

  const handlePublish = async () => {
    if (!title.trim() || !content) return alert('Please add a title and content.');
    setSaving(true);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { error } = await supabase.from('posts').insert([
      {
        title,
        slug,
        content,
        published: true,
      },
    ]);

    setSaving(false);

    if (error) {
      alert('Error publishing post: ' + error.message);
    } else {
      alert('Post published successfully!');
      setTitle('');
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Create a Jot</h1>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-semibold mb-4 p-2 border-b border-gray-300 focus:outline-none"
      />
      <Editor onChange={setContent} />
      <button
        onClick={handlePublish}
        disabled={saving}
        className="mt-6 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? 'Publishing...' : 'Publish Post'}
      </button>
    </main>
  );
}