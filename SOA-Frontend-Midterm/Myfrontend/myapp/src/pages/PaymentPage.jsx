import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Card,
  CardContent,
  Avatar,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import { findUserByStudentId } from "../api/userApi";
import { getTuitionsByStudentId } from "../api/tuitionsApi";

import { addTransaction, verifyTransactionReal } from "../api/transactionApi";
import * as transactionApi from "../api/transactionApi";
console.log("Available exports:", transactionApi);

export default function PaymentPage({ currentUser }) {
  const [studentId, setStudentId] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [error, setError] = useState(""); 
  const [otpError, setOtpError] = useState(""); 
  const [successMsg, setSuccessMsg] = useState("");
  const [otpStage, setOtpStage] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Tra cứu học phí
  const handleSearch = async () => {
    setError("");
    setSuccessMsg("");
    setOtpError("");
    setTargetUser(null);

    if (!studentId) {
      setError("Vui lòng nhập mã sinh viên");
      return;
    }

    // const user = await findUserByStudentId(studentId);
    // if (!user) {
    //   setError("Không tìm thấy sinh viên");
    // } else {
    //   setTargetUser(user);
    // }

    const data = await getTuitionsByStudentId(studentId);
      if (!data || !data.tuitions || data.tuitions.length === 0) {
        setError("Không tìm thấy học phí cho sinh viên này");
      } else {
        setTargetUser({
          studentId: data.student_id,
          fullname: "Sinh viên " + data.student_id, // hoặc gọi thêm API /users/{id} nếu cần tên thật
          tuition: data.tuitions
      });
  }

};

  // Xác nhận OTP
  // const handleConfirmOtp = async () => {
  //   if (otpInput === "123456") {
  //     setOtpError(""); 

  //     currentUser.available_balance -= otpStage.amount;

  //     const updatedTuition = targetUser.tuition.map((t) =>
  //       t.id === otpStage.id ? { ...t, paid: true } : t
  //     );
  //     setTargetUser({ ...targetUser, tuition: updatedTuition });

  //     await addTransaction({
  //       studentId: targetUser.studentId,
  //       feeId: otpStage.id,
  //       fullname: targetUser.fullname,
  //       amount: otpStage.amount,
  //       description: otpStage.title,
  //       payer: currentUser.fullname,
  //     });

  //     setSuccessMsg(`Thanh toán thành công cho khoản ${otpStage.title}!`);
  //     setOtpStage(null);
  //     setOtpInput("");
  //     setAgreed(false);
  //   } else {
  //     setOtpError("Mã OTP không chính xác!");
  //   }
  // };

  const handleConfirmOtp = async () => {
  if (otpInput !== "123456") {
    setOtpError("Mã OTP không chính xác!");
    return;
  }

  try {
    const paymentResponse = await addTransaction(otpStage.id);
    const paymentId = paymentResponse.id || paymentResponse.payment_id;

    await verifyTransactionReal({
      email: currentUser.email,
      payment_id: paymentId,
      otp: otpInput
    });

    currentUser.available_balance -= otpStage.amount;

    const updatedTuition = targetUser.tuition.map((t) =>
      t.id === otpStage.id ? { ...t, paid: true } : t
    );
    setTargetUser({ ...targetUser, tuition: updatedTuition });

    setSuccessMsg(`Thanh toán thành công cho khoản ${otpStage.title}!`);
    setOtpStage(null);
    setOtpInput("");
    setAgreed(false);
    setOtpError("");
  } catch (err) {
    setOtpError(err.message);
  }
};
  

  // Thanh toán -> mở OTP
  const handlePayment = (fee) => {
    if (currentUser.available_balance < fee.amount) {
      setError("Số dư không đủ để thanh toán");
      return;
    }
    setOtpStage(fee);
    setOtpInput("");
    setOtpError("");
    setError("");
    setSuccessMsg("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Thanh toán học phí
      </Typography>

      {/* Thông tin tài khoản hiện tại */}
      <Card
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 3,
          boxShadow: 3,
          background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ bgcolor: "#3f51b5", width: 56, height: 56 }}
            >
              <AccountCircleIcon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentUser.fullname}
            </Typography>
            <Typography color="text.secondary">
              📞 {currentUser.phone}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <AccountBalanceWalletIcon sx={{ mr: 0.5, color: "green" }} />
              <Typography fontWeight="bold" color="green">
                {currentUser.available_balance.toLocaleString()} VND
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Form nhập mã SV */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Mã sinh viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Tra cứu
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {otpError && <Alert severity="error">{otpError}</Alert>}
      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      {/* Thông tin học phí */}
      {targetUser && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">
              Sinh viên: {targetUser.fullname}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {targetUser.tuition.map((fee) => (
              <Box
                key={fee.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography>{fee.title}</Typography>
                  <Typography color="text.secondary">
                    Số tiền: {fee.amount.toLocaleString()} VND
                  </Typography>
                  <Typography
                    color={fee.paid ? "green" : "red"}
                    fontWeight="bold"
                  >
                    {fee.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </Typography>
                </Box>
                {!fee.paid && (
                  <Button
                    variant="contained"
                    onClick={() => handlePayment(fee)}
                  >
                    Thanh toán
                  </Button>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Giao diện OTP */}
      {otpStage && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">
            Xác nhận thanh toán: {otpStage.title}
          </Typography>
          <Typography>
            Số tiền: {otpStage.amount.toLocaleString()} VND
          </Typography>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Nhập OTP (123456)"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            }
            label="Tôi đồng ý với điều khoản thanh toán"
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!agreed}
            onClick={handleConfirmOtp}
          >
            Xác nhận
          </Button>
        </Card>
      )}
    </Box>
  );
}
