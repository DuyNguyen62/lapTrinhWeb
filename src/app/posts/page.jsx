'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/app/components/Toast';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const router = useRouter();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userInfo');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    try {
      setUserInfo(JSON.parse(user));
    } catch (error) {
      console.error('Error parsing user info:', error);
      router.push('/login');
    }
  }, [router]);

  // Lấy danh sách bài viết
  useEffect(() => {
    if (userInfo) {
      fetchPosts();
    }
  }, [userInfo]);

  const fetchPosts = async (searchParams = {}) => {
    try {
      setIsLoading(true);
      
      let url = '/api/posts';
      const params = new URLSearchParams();
      
      if (searchParams.query) params.append('query', searchParams.query);
      if (searchParams.date) params.append('date', searchParams.date);
      if (searchParams.category) params.append('category', searchParams.category);
      
      if (params.toString()) {
        url = `/api/posts/search?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data.posts || data.data);
      } else {
        showToast(`❌ ${data.message}`, 'error');
      }
    } catch (error) {
      showToast('❌ Lỗi khi tải danh sách bài viết', 'error');
      console.error('Fetch posts error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    await fetchPosts({
      query: searchQuery,
      date: searchDate,
      category: searchCategory
    });
    
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchDate('');
    setSearchCategory('');
    fetchPosts();
  };

  const handleLogout = () => {
    router.push('/logout');
  };

  const handleLike = (postId) => {
    showToast(`👍 Đã like bài viết #${postId}`, 'success');
  };

  const handleComment = (postId) => {
    showToast(`💬 Đã comment bài viết #${postId}`, 'success');
  };

  const categories = [
    'Công nghệ',
    'Đời sống', 
    'Tin tức',
    'Giáo dục',
    'Thể thao',
    'Du lịch',
    'Ẩm thực'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Trang chủ
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Danh sách bài viết</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Xin chào, <span className="font-medium">{userInfo?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Query */}
              <div>
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm theo tiêu đề
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập từ khóa..."
                />
              </div>

              {/* Search Date */}
              <div>
                <label htmlFor="searchDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm theo ngày
                </label>
                <input
                  type="date"
                  id="searchDate"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Search Category */}
              <div>
                <label htmlFor="searchCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm theo danh mục
                </label>
                <select
                  id="searchCategory"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Đang tìm kiếm...' : '🔍 Tìm kiếm'}
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium"
              >
                🗑️ Xóa bộ lọc
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy bài viết nào</h3>
            <p className="mt-1 text-sm text-gray-500">Hãy thử thay đổi từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div key={post.Id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link 
                        href={`/posts/${post.Id}`}
                        className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {post.Title}
                      </Link>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>👤 {post.AuthorName || 'Admin'}</span>
                        <span>📅 {new Date(post.CreatedAt).toLocaleDateString('vi-VN')}</span>
                        {post.Category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {post.Category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Thumbnail */}
                  {post.ThumbnailUrl && (
                    <div className="mt-4">
                      <img 
                        src={post.ThumbnailUrl} 
                        alt="Thumbnail" 
                        className="h-48 w-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <p className="mt-3 text-gray-600 line-clamp-3">
                    {post.Content}
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleLike(post.Id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        👍 Like
                      </button>
                      <button
                        onClick={() => handleComment(post.Id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        💬 Comment
                      </button>
                      <button
                        onClick={() => showToast(`🔗 Đã chia sẻ bài viết #${post.Id}`, 'success')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        🔗 Share
                      </button>
                    </div>
                    
                    <Link 
                      href={`/posts/${post.Id}`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      Đọc thêm →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Component */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </div>
  );
}