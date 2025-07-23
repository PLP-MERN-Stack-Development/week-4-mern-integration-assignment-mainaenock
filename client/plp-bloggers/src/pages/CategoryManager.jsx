import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCategories, createCategory } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CategoryManager = () => {
  const { user, token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    getCategories().then(data => {
      if (!data.error) setCategories(data);
    });
  }, [user, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await createCategory({ name }, token);
    setLoading(false);
    if (res.error || res.message) {
      setError(res.error || res.message);
      toast.error(res.error || res.message);
    } else {
      setCategories([...categories, res]);
      setName('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">Manage Categories</h2>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" required
            className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button type="submit" disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat._id} className="bg-gray-100 dark:bg-gray-900 rounded px-4 py-2 text-gray-800 dark:text-gray-100">{cat.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager; 