# AWS Services & Terraform Workbench

Ứng dụng này giúp người dùng hình dung cách quản lý chi phí khi sử dụng AWS thông qua một môi trường mô phỏng trực quan. Người dùng có thể kéo thả các dịch vụ AWS lên bản đồ kiến trúc, chọn vùng triển khai, theo dõi chi phí ước tính và tạo cấu hình Terraform tương ứng.

## Mục tiêu

- Giúp người dùng hình dung cách quản lý chi phí khi vận hành hạ tầng trên AWS.
- Mô phỏng quá trình tính toán và quản lý các dịch vụ AWS như EC2, RDS, Load Balancer, S3, Lambda và DynamoDB.
- Dựa trên dữ liệu và mô hình giá tham khảo của AWS để cung cấp ước tính chi phí gần thực tế cho mục đích học tập và tư duy thiết kế.

## Tính năng chính

- Bản đồ kiến trúc AWS tương tác bằng cách kéo thả dịch vụ.
- Chọn vùng AWS khác nhau để thay đổi ngữ cảnh triển khai và ước tính chi phí.
- Theo dõi chi phí theo giờ và theo tháng cho từng thành phần.
- Mô phỏng chi phí thời gian thực khi kiến trúc được vận hành.
- Tạo mã Terraform cơ bản cho các tài nguyên AWS đã chọn.
- Cung cấp các mẫu kiến trúc phổ biến để người dùng nhanh chóng bắt đầu.

## Cách hoạt động

1. Chọn một dịch vụ AWS từ thanh bên.
2. Kéo dịch vụ lên canvas và kết nối với các thành phần khác.
3. Chọn vùng AWS phù hợp để điều chỉnh ngữ cảnh tính chi phí.
4. Xem chi phí ước tính ở chế độ theo giờ, theo tháng hoặc theo phiên mô phỏng.
5. Xuất hoặc xem mã Terraform để triển khai tiếp theo.

> Lưu ý: các số liệu phí được thiết kế để mô phỏng và minh họa, dựa trên mô hình giá tham khảo của AWS, không thay thế cho báo giá hoặc bảng giá chính thức từ AWS.

## Yêu cầu

- Node.js 18+
- npm

## Chạy local

1. Cài đặt phụ thuộc:
   ```bash
   npm install
   ```
2. Khởi động ứng dụng:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt tại địa chỉ hiển thị bởi Vite (thường là http://localhost:3000).

## Build

```bash
npm run build
```

## Công nghệ sử dụng

- React + TypeScript
- Vite
- Tailwind CSS
- Motion
- Terraform HCL generation

