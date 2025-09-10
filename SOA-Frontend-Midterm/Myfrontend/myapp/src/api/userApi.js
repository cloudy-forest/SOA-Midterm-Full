// const mockUsers = [
//      { 
//     username: '01',
//     password: '1',
//     fullname: 'Nguyễn Văn A',
//     studentId: 'SV001',
//     phone: '0987654321',
//     address: '123, ABC Street, HCM, VietNam',
//     email: 'nguyenvana@example.com',
//     available_balance: 20000000,
//     tuition: [
//       { id: 1, title: "Học phí HK1 2025", amount: 5000000, paid: false },
//       { id: 2, title: "Học phí HK2 2025", amount: 6000000, paid: false },
//     ]
//   },
//   { 
//     username: 'user02',
//     password: 'password2',
//     fullname: 'Trần Thị B',
//     studentId: 'SV002',
//     phone: '0912345678',
//     address: '456, XYZ Street, HN, VietNam',
//     email: 'tranthib@example.com',
//     available_balance: 10000000,
//     tuition: [
//       { id: 1, title: "Học phí HK1 2025", amount: 4000000, paid: true },
//       { id: 2, title: "Học phí HK2 2025", amount: 5500000, paid: false },
//     ]
//   },
//   { 
//     username: 'user03',
//     password: 'password3',
//     fullname: 'Lê Văn C',
//     studentId: 'SV003',
//     phone: '0909090909',
//     address: '789, DEF Street, DN, VietNam',
//     email: 'levanc@example.com',
//     available_balance: 15000000,
//     tuition: [
//       { id: 1, title: "Học phí HK1 2025", amount: 6000000, paid: false },
//       { id: 2, title: "Học phí HK2 2025", amount: 6500000, paid: false },
//     ]
//   },
// ];

// /**
//  * @name loginUser
//  * @description Mocks a backend API call to log in a user.
//  * @param {string} username - The user's username.
//  * @param {string} password - The user's password.
//  * @returns {Promise<object>} A promise that resolves with the user data or rejects with an error.
//  */
// export const loginUser = (username, password) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = mockUsers.find(
//         (u) => u.username === username && u.password === password
//       );
//       if (user) {
//         resolve(user);
//       } else {
//         reject(new Error('Tên đăng nhập hoặc mật khẩu không chính xác.'));
//       }
//     }, 500); // Simulate network delay
//   });
// };


// /**
//  * @name findUserByStudentId
//  * @description Tìm user theo MSSV (studentId).
//  */
// export const findUserByStudentId = (studentId) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = mockUsers.find((u) => u.studentId === studentId);
//       if (user) {
//         resolve(user);
//       } else {
//         reject(new Error('Không tìm thấy sinh viên với MSSV này.'));
//       }
//     }, 500);
//   });
// };

// export const loginUser = async (username, password) => {
//   const formData = new URLSearchParams();
//   formData.append("username", username);
//   formData.append("password", password);

//   const response = await fetch("http://localhost:8000/auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     body: formData
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || "Đăng nhập thất bại");
//   }

//   const data = await response.json();
//   return data; // chứa access_token và refresh_token
// };
// export const getCurrentUser = async () => {
//   const token = localStorage.getItem("access_token");

//   const response = await fetch("http://localhost:8000/users/me", {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   if (!response.ok) {
//     throw new Error("Không thể lấy thông tin người dùng");
//   }

//   return await response.json();
// };

const BASE_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Đăng nhập thất bại");
  }

  const data = await response.json();
  return data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin người dùng");
  }

  return await response.json();
};
