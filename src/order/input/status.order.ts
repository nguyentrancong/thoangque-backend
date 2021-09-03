export enum OrderStatus {
  // 1 = Chờ xác nhận: đơn hàng đang trong giai đoạn xác nhận tính hợp lệ bởi hệ thống
  // 2 = Chờ lấy hàng: đơn hàng đã được chuyển thông tin tới Người bán để giao cho đơn vị vận chuyển
  // 3 = Đang giao: đơn hàng đang được giao tới Người mua
  // 4 = Đánh giá: đơn hàng đang chờ được đánh giá sản phẩm
  // 5 = Đã giao: đơn hàng đã được giao thành công tới Người mua
  // 6 = Đã hủy: đơn hàng đã được hủy thành công
  // 7 = Trả hàng: đơn hàng đã được trả hàng thành công
  SUCCESS = 5,
  CANCELLED = 6,
}
