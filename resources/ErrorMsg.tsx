export const ErrorMsg = {
  // Auth errors
  loginFailed: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.',
  registerFailed: 'Đăng ký thất bại. Vui lòng kiểm tra lại.',
  logoutFailed: 'Đăng xuất thất bại.',
  sessionExpired: 'Vui lòng đăng nhập lại.',
  loadAuthDataFailed: 'Không thể tải dữ liệu người dùng. Đang chuyển hướng đến trang đăng nhập.',

  // Location errors
  locationAccessDenied: 'Quyền truy cập vị trí đã bị từ chối',
  fetchLocation: 'Lỗi khi lấy dữ liệu vị trí',

  // Not found route
  notFoundRoute: 'Opps! Màn hình này không tồn tại',
  backToHome: 'Quay về trang chủ',

  // Unhandled err
  unhandledError: 'Đã xảy ra sự cố, vui lòng thử lại sau.',
};

export const ErrorTitle = {
  default: 'Lỗi',
  sessionExpired: 'Phiên đã hết hạn',
  notFoundRoute: 'Trang không tồn tại',
};
