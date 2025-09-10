// let transactions = []; // Giả lập DB trong bộ nhớ

// /**
//  * @name addTransaction
//  * @description Lưu một giao dịch vào "database"
//  */
// export const addTransaction = (transaction) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       transactions.push({
//         ...transaction,
//         id: transactions.length + 1,
//         date: new Date().toLocaleString("vi-VN"), // thêm ngày giờ
//       });
//       resolve(true);
//     }, 300);
//   });
// };

// /**
//  * @name getTransactions
//  * @description Lấy lịch sử giao dịch theo studentId (nếu có)
//  */
// export const getTransactions = ({studentId = null, payer = null}= {})  => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // if (studentId) {
//       //   resolve(transactions.filter(t => t.studentId === studentId));
//       // } else {
//       //   resolve(transactions);
//       // }
//        let filtered = transactions; 
//       if (studentId) {
//         filtered = filtered.filter((t) => t.studentId === studentId);
//       }
//       if (payer) {
//         filtered = filtered.filter((t) => t.payer === payer);
//       }
//       resolve(filtered);
//     }, 300);
//   });
// };
const BASE_URL = process.env.REACT_APP_API_URL;
export const getTransactions = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/payments/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Không thể lấy lịch sử giao dịch");
  }

  return await response.json();
};

export const addTransaction = async (tuitionId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/payments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ tuition_id: tuitionId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Không thể tạo giao dịch");
  }

  return await response.json();
};

export const verifyTransactionReal = async ({ email, payment_id, otp }) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email, payment_id, otp })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Xác thực giao dịch thất bại");
  }

  return await response.json();
};
