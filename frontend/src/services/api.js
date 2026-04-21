const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tasknest_user');
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isOnAuthPage = authPages.some((p) => window.location.pathname.startsWith(p));
  if (!isOnAuthPage) {
    window.location.href = '/login';
  }
};

const fetchWithAuth = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  const contentType = res.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = { msg: await res.text() };
  }

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    throw new Error(data.msg || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Authentication failed.');
      return data;
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Registration failed.');
      return data;
    },
    forgotPassword: async (email) => {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Request failed.');
      return data;
    },
    resetPassword: async (token, newPassword) => {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Password reset failed.');
      return data;
    },
  },
  assignments: {
    getAll: () => fetchWithAuth(`${API_BASE_URL}/assignments`),
    create: (data) => fetchWithAuth(`${API_BASE_URL}/assignments`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => fetchWithAuth(`${API_BASE_URL}/assignments/${id}`, { method: 'DELETE' }),
    update: (id, data) => fetchWithAuth(`${API_BASE_URL}/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  submissions: {
    // All submissions (faculty = all, student = own)
    getAll: () => fetchWithAuth(`${API_BASE_URL}/submissions`),
    // Submissions for a specific assignment (faculty only)
    getByAssignment: (assignmentId) => fetchWithAuth(`${API_BASE_URL}/submissions/assignment/${assignmentId}`),
    // Submit an assignment
    submit: (data) => fetchWithAuth(`${API_BASE_URL}/submissions`, { method: 'POST', body: JSON.stringify(data) }),
    // Grade a submission
    evaluate: (id, data) => fetchWithAuth(`${API_BASE_URL}/submissions/evaluate/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  groups: {
    getAll: () => fetchWithAuth(`${API_BASE_URL}/groups`),
    create: (data) => fetchWithAuth(`${API_BASE_URL}/groups`, { method: 'POST', body: JSON.stringify(data) }),
    addMember: (groupId, data) => fetchWithAuth(`${API_BASE_URL}/groups/${groupId}/add-member`, { method: 'POST', body: JSON.stringify(data) }),
  },
  classrooms: {
    getAll: () => fetchWithAuth(`${API_BASE_URL}/classrooms`),
    create: (data) => fetchWithAuth(`${API_BASE_URL}/classrooms`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => fetchWithAuth(`${API_BASE_URL}/classrooms/${id}`, { method: 'DELETE' }),
    addStudent: (id, data) => fetchWithAuth(`${API_BASE_URL}/classrooms/${id}/add-student`, { method: 'POST', body: JSON.stringify(data) }),
    removeStudent: (id, userId) => fetchWithAuth(`${API_BASE_URL}/classrooms/${id}/remove-student/${userId}`, { method: 'DELETE' }),
    getMembers: (id) => fetchWithAuth(`${API_BASE_URL}/classrooms/${id}/members`),
  },
  users: {
    getAllStudents: () => fetchWithAuth(`${API_BASE_URL}/auth/students`),
  },
  notes: {
    getByClassroom: (classroomId) => fetchWithAuth(`${API_BASE_URL}/notes/${classroomId}`),
    upload: (data) => fetchWithAuth(`${API_BASE_URL}/notes`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchWithAuth(`${API_BASE_URL}/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchWithAuth(`${API_BASE_URL}/notes/${id}`, { method: 'DELETE' }),
  },
  exams: {
    getAll: () => fetchWithAuth(`${API_BASE_URL}/exams`),
    create: (data) => fetchWithAuth(`${API_BASE_URL}/exams`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchWithAuth(`${API_BASE_URL}/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchWithAuth(`${API_BASE_URL}/exams/${id}`, { method: 'DELETE' }),
  },
};
