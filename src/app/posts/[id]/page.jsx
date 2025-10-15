'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/app/components/Toast';

export default function PostDetailPage() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const router = useRouter();
  const params = useParams();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Lấy chi tiết bài viết
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setPost(data.data);
        } else {
          showToast(`❌ ${data.message}`, 'error');
          if (response.status === 404) {
            setTimeout(() => {
              router.push('/posts');
            }, 2000);
          }
        }
      } catch (error) {
        showToast('❌ Lỗi khi tải bài viết', 'error');
        console.error('Fetch post error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, router]);

  const handleLike = () => {
    showToast(`👍 Đã like bài viết "${post?.Title}"`, 'success');
  };

  const handleComment = () => {
    showToast(`💬 Đã comment bài viết "${post?.Title}"`, 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.Title,
        text: post?.Content?.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Đã copy link bài viết', 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h2>
          <Link 
            href="/posts"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Quay lại danh sách bài viết
          </Link>
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
                href="/posts" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Danh sách bài viết
              </Link>
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Trang chủ
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết bài viết</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header bài viết */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.Title}</h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
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
          </div>

          {/* Thumbnail */}
          {post.ThumbnailUrl && (
            <div className="px-6 py-4">
              <img 
                src={post.ThumbnailUrl} 
                alt={post.Title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Nội dung */}
          <div className="px-6 py-4">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.Content}
              </p>
            </div>
          </div>

          {/* Video */}
          {post.VideoUrl && (
            <div className="px-6 py-4">
              <video 
                src={post.VideoUrl} 
                controls 
                className="w-full h-64 object-cover rounded-lg"
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLike}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                👍 Like
              </button>
              <button
                onClick={handleComment}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                💬 Comment
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                🔗 Share
              </button>
            </div>
          </div>
        </article>
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
