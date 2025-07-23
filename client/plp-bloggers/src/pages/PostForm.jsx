import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, createPost, updatePost, getCategories, createCategory } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_UPLOAD = '/api/upload';
const API_IMAGE = '/uploads/';

const PostForm = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', content: '', category: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    if (id) {
      getPost(id).then(data => {
        if (!data.error) setForm({ title: data.title, content: data.content, category: data.category?.name || '', image: data.image || '' });
      });
    }
  }, [id, user, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(API_UPLOAD, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setUploading(false);
    if (data.filename) {
      setForm(f => ({ ...f, image: data.filename }));
      setImageFile(file);
    } else {
      setError(data.error || data.message || 'Image upload failed');
      toast.error(data.error || data.message || 'Image upload failed');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let categoryId = '';
    // Check if category exists, else create it
    const cats = await getCategories();
    const found = cats.find(cat => cat.name.toLowerCase() === form.category.trim().toLowerCase());
    if (found) {
      categoryId = found._id;
    } else {
      const newCat = await createCategory({ name: form.category }, token);
      if (newCat && newCat._id) categoryId = newCat._id;
      else {
        setLoading(false);
        setError('Failed to create category');
        toast.error('Failed to create category');
        return;
      }
    }
    let res;
    if (id) res = await updatePost(id, { ...form, category: categoryId }, token);
    else res = await createPost({ ...form, category: categoryId }, token);
    setLoading(false);
    if (res.error || res.message) {
      setError(res.error || res.message);
      toast.error(res.error || res.message);
    } else navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">{id ? 'Edit Post' : 'Create Post'}</h2>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required rows={6}
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="file" accept="image/*" onChange={handleImageChange}
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        {uploading && <span className="text-blue-500">Uploading...</span>}
        {form.image && (
          <div className="mb-4 flex justify-center">
            <img src={API_IMAGE + form.image} alt="Post" className="max-w-xs rounded" />
          </div>
        )}
        <button type="submit" disabled={loading}
          className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Saving...' : id ? 'Update' : 'Create'}
        </button>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default PostForm; 