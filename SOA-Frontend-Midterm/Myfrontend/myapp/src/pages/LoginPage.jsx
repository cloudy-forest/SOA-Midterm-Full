import { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { loginUser } from "../api/userApi"; // 👈 nhớ đổi đường dẫn đúng tới file userApi.js

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
     // const user = await loginUser(form.username, form.password);
      const tokens = await loginUser(form.username, form.password);
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      // localStorage.setItem("studentId", user.studentId);
      // localStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(tokens); //  nếu login thành công thì gọi onLogin để App biết user đã login
    } catch (err) {
      setError(err.message); //  hiện lỗi từ userApi (VD: "Tên đăng nhập hoặc mật khẩu không chính xác.")
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Đăng nhập iBanking
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tên đăng nhập"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Mật khẩu"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" fullWidth>
              Đăng nhập
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
