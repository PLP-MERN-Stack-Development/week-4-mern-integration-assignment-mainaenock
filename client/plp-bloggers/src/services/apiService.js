const API_URL = '/api';

export async function getPosts(page = 1, limit = 5) {
  try {
    const res = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`);
    return await res.json();
  } catch {
    return { error: 'Network error' };
  }
}

export async function getPost(id) {
  try {
    const res = await fetch(`${API_URL}/posts/${id}`);
    return await res.json();
  } catch {
    return { error: 'Network error' };
  }
}

export async function createPost(data, token) {
  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { error: 'Network error' };
  }
}

export async function updatePost(id, data, token) {
  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { error: 'Network error' };
  }
}

export async function deletePost(id, token) {
  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return await res.json();
  } catch {
    return { error: 'Network error' };
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`);
    return await res.json();
  } catch {
    return { error: 'Network error' };
  }
}

export async function createCategory(data, token) {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { error: 'Network error' };
  }
} 