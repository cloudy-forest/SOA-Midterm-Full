# Sử dụng Python làm base image
FROM python:3.10

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cài đặt các thư viện cần thiết
RUN pip install --no-cache-dir -r requirements.txt

# Chạy ứng dụng FastAPI bằng Uvicorn
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

COPY if.env ./

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD ["/wait-for-it.sh", "mysql:3306", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
