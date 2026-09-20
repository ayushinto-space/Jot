'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { supabase } from '@/lib/supabase';

export default function WritePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: '<p>Start writing your post here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[350px] p-4 text-slate-900',
      },
    },
  });

  // Handle direct file uploads to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cover-images/${fileName}`;

    const { error } = await supabase.storage
      .from('post-media')
      .upload(filePath, file);

    if (error) {
      alert(`Image upload failed: ${error.message}`);
      setIsUploading(false);
      return;
    }

    // Get public URL of the uploaded image
    const { data } = supabase.storage
      .from('post-media')
      .getPublicUrl(filePath);

    setCoverImage(data.publicUrl);
    setIsUploading(false);
  };

  const handlePublish = async () => {
    if (!title.trim() || !editor) {
      alert('Please enter a title and post content.');
      return;
    }

    setIsSaving(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const { error } = await supabase.from('posts').insert([
      {
        title,
        slug,
        content: editor.getHTML(),
        cover_image: coverImage || null,
        published: true,
      },
    ]);

    setIsSaving(false);

    if (error) {
      alert(`Error publishing post: ${error.message}`);
    } else {
      router.push(`/posts/${slug}`);
    }
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-10">
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to Feed
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving || isUploading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full text-sm transition shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>

        {/* Inputs Section */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl md:text-4xl font-extrabold text-slate-900 border-none outline-none placeholder:text-slate-300"
          />

          {/* Image Uploader Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase">Cover Image</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              {isUploading && <span className="text-xs text-indigo-600 animate-pulse">Uploading file...</span>}
            </div>

            {/* Preview loaded image */}
            {coverImage && (
              <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-slate-200">
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Tiptap Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-slate-100 rounded-lg mb-4 text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded transition ${editor.isActive('bold') ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-200'}`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded transition ${editor.isActive('italic') ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-200'}`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded transition ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-200'}`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded transition ${editor.isActive('heading', { level: 3 }) ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-200'}`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded transition ${editor.isActive('bulletList') ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-200'}`}
          >
            Bullet List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1.5 rounded transition ${editor.isActive('blockquote') ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-200'}`}
          >
            Quote
          </button>
        </div>

        {/* Text Area */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}