import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chào mừng đến với Blog Website
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Nơi bạn chia sẻ bài viết và học hỏi kiến thức thú vị
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/posts"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                📖 Xem bài viết
              </Link>
              <Link 
                href="/register"
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                ✨ Tham gia ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn Blog Website?
            </h2>
            <p className="text-lg text-gray-600">
              Nền tảng blog hiện đại với đầy đủ tính năng bạn cần
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Đăng bài viết dễ dàng
              </h3>
              <p className="text-gray-600">
                Giao diện thân thiện giúp bạn tạo và chia sẻ nội dung một cách nhanh chóng
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tìm kiếm thông minh
              </h3>
              <p className="text-gray-600">
                Tìm kiếm bài viết theo từ khóa, ngày đăng và danh mục một cách chính xác
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Giao diện đẹp mắt
              </h3>
              <p className="text-gray-600">
                Thiết kế hiện đại, responsive trên mọi thiết bị mang lại trải nghiệm tốt nhất
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình viết blog?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Tham gia cộng đồng người viết và chia sẻ kiến thức của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              🚀 Tạo tài khoản miễn phí
            </Link>
            <Link 
              href="/posts"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              📚 Khám phá bài viết
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
