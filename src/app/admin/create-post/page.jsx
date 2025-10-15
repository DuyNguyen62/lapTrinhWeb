'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Toast from '@/app/components/Toast';

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    thumbnailUrl: '',
    videoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const router = useRouter();

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const categories = [
    'Công nghệ',
    'Đời sống', 
    'Tin tức',
    'Giáo dục',
    'Thể thao',
    'Du lịch',
    'Ẩm thực'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadProgress(100);
        
        if (type === 'thumbnail') {
          setFormData(prev => ({
            ...prev,
            thumbnailUrl: data.data.url
          }));
        } else if (type === 'video') {
          setFormData(prev => ({
            ...prev,
            videoUrl: data.data.url
          }));
        }
        
        showToast(`✅ Upload ${type} thành công!`, 'success');
      } else {
        showToast(`❌ Lỗi upload: ${data.message}`, 'error');
      }
    } catch (error) {
      showToast('❌ Lỗi kết nối server', 'error');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, 'thumbnail');
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, 'video');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dữ liệu
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập tiêu đề bài viết', 'error');
      return;
    }
    
    if (!formData.content.trim()) {
      showToast('Vui lòng nhập nội dung bài viết', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category || null,
          thumbnailUrl: formData.thumbnailUrl || null,
          videoUrl: formData.videoUrl || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('✅ Bài viết đã được đăng thành công!', 'success');
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          category: '',
          thumbnailUrl: '',
          videoUrl: ''
        });
        
        // Reset file inputs
        const thumbnailInput = document.getElementById('thumbnail');
        const videoInput = document.getElementById('video');
        if (thumbnailInput) thumbnailInput.value = '';
        if (videoInput) videoInput.value = '';
        
        // Redirect sau 2 giây
        setTimeout(() => {
          router.push('/posts');
        }, 2000);
      } else {
        showToast(`❌ Lỗi khi đăng bài: ${data.message}`, 'error');
      }
    } catch (error) {
      showToast('❌ Lỗi kết nối server', 'error');
      console.error('Create post error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  ← Trang chủ
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Đăng bài viết mới</h1>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Tiêu đề */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập tiêu đề bài viết..."
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Danh mục */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Chọn danh mục...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Ảnh thumbnail */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleThumbnailChange}
                disabled={isUploading}
              />
              
              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Đang upload...</p>
                </div>
              )}
              
              {/* Thumbnail Preview */}
              {formData.thumbnailUrl && (
                <div className="mt-2">
                  <img 
                    src={formData.thumbnailUrl} 
                    alt="Thumbnail Preview" 
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                  <p className="text-sm text-green-600 mt-1">✅ Đã upload thành công</p>
                </div>
              )}
            </div>

            {/* Video */}
            <div>
              <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                Video (tùy chọn)
              </label>
              <input
                type="file"
                id="video"
                name="video"
                accept="video/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleVideoChange}
                disabled={isUploading}
              />
              
              {/* Video Preview */}
              {formData.videoUrl && (
                <div className="mt-2">
                  <video 
                    src={formData.videoUrl} 
                    controls 
                    className="h-48 w-full object-cover rounded-md border"
                  />
                  <p className="text-sm text-green-600 mt-1">✅ Video đã upload thành công</p>
                </div>
              )}
            </div>

            {/* Nội dung */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung bài viết *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập nội dung bài viết..."
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>

            {/* Nút submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang đăng bài...' : 'Đăng bài'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Component */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </div>
    </ProtectedRoute>
  );
}
