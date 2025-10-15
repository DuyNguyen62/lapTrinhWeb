'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/app/components/Toast';

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const router = useRouter();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Gọi API logout
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Xóa token và thông tin user khỏi localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        showToast('✅ Đăng xuất thành công!', 'success');
        
        // Redirect về trang chủ sau 2 giây
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        showToast(`❌ ${data.message}`, 'error');
      }
    } catch (error) {
      // Ngay cả khi API lỗi, vẫn xóa token local
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      showToast('✅ Đã đăng xuất khỏi thiết bị này', 'success');
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Kiểm tra xem user có đăng nhập không
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng xuất
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bạn có chắc chắn muốn đăng xuất khỏi Blog Website?
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Xác nhận đăng xuất'}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={isLoggingOut}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy bỏ
          </button>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-500">
            ← Quay về trang chủ
          </Link>
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
  );
}
