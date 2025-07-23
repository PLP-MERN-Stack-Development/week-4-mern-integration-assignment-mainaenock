import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_URL = '/api/posts';
const API_IMAGE = '/uploads/';

const PostDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPost(id).then(data => {
      if (data.error || data.message) setError(data.error || data.message);
      else setPost(data);
      setLoading(false);
    });
    fetch(`${API_URL}/${id}/comments`).then(res => res.json()).then(data => {
      if (!data.error) setComments(data);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    const res = await deletePost(id, token);
    if (res.error || res.message) {
      setError(res.error || res.message);
      toast.error(res.error || res.message);
    } else navigate('/');
  };

  const handleCommentSubmit = async e => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);
    const res = await fetch(`${API_URL}/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: commentText })
    });
    const data = await res.json();
    setCommentLoading(false);
    if (data.error || data.message) {
      setCommentError(data.error || data.message);
      toast.error(data.error || data.message);
    } else {
      setComments([data, ...comments]);
      setCommentText('');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-40 text-lg text-gray-600 dark:text-gray-300">Loading post...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
  if (!post) return <div className="text-center text-gray-500 mt-8">Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        {post.image && (
          <div className="mb-4 flex justify-center">
            <img src={API_IMAGE + post.image} alt="Post" className="max-w-xs rounded" />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{post.title}</h2>
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400"><b>Category:</b> {post.category?.name || 'Uncategorized'}</div>
        <div className="mb-4 text-gray-700 dark:text-gray-200">{post.content}</div>
        {user && (
          <div className="flex gap-4 mb-4">
            <Link to={`/posts/${id}/edit`} className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Edit</Link>
            <button onClick={handleDelete} className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600">Delete</button>
          </div>
        )}
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">Back to posts</Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Comments</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)} required rows={2} placeholder="Add a comment..."
              className="w-full mb-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button type="submit" disabled={commentLoading}
              className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
            {commentError && <div className="text-red-500 mt-2">{commentError}</div>}
          </form>
        ) : (
          <div className="mb-4"><Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link> to comment.</div>
        )}
        <ul className="space-y-4">
          {comments.length === 0 ? <li className="text-gray-500 dark:text-gray-400">No comments yet.</li> : comments.map(c => (
            <li key={c._id} className="bg-gray-100 dark:bg-gray-900 rounded p-3">
              <b className="text-blue-700 dark:text-blue-300">{c.user?.username || 'User'}:</b> {c.content}
              <span className="block text-xs text-gray-500 mt-1">{new Date(c.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostDetail; 