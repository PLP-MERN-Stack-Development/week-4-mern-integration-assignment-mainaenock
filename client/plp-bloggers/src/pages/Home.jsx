import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/apiService';
import { Link } from 'react-router-dom';

const API_IMAGE = '/uploads/';
const PAGE_SIZE = 5;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    getPosts(page, PAGE_SIZE).then(data => {
      if (data.error) setError(data.error);
      else {
        setPosts(data.posts || []);
        setPageCount(data.pageCount || 1);
        setTotal(data.total || 0);
      }
      setLoading(false);
    });
  }, [page]);

  if (loading) return <div className="flex justify-center items-center h-40 text-lg text-gray-600 dark:text-gray-300">Loading posts...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Blog Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post._id} className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow p-4 gap-4">
              {post.image && <img src={API_IMAGE + post.image} alt="thumb" className="w-16 h-16 object-cover rounded" />}
              <div>
                <Link to={`/posts/${post._id}`} className="text-lg font-semibold text-blue-700 dark:text-blue-300 hover:underline">{post.title}</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col items-center mt-8">
        <div className="mb-2 text-gray-700 dark:text-gray-300">
          <b>Page:</b> {page} / {pageCount} &nbsp; <b>Total:</b> {total}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
            className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Prev
          </button>
          <button onClick={() => setPage(p => Math.min(pageCount, p+1))} disabled={page === pageCount}
            className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 