import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const userId = useRef();
  const pwd = useRef();
  const navigate = useNavigate();

  const handleLogin = () => {
    const param = {
      userId: userId.current.value,
      pwd: pwd.current.value
    };

    fetch("http://localhost:3015/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
        if (data.result === "success") {
          localStorage.setItem("token", data.token);
          navigate("/feed");
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        alert("로그인 중 오류가 발생했습니다.");
      });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f2f5, #e0e5ea)', // 은은한 회색+약간 블루
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 'bold',
              color: '#444444', // 다크그레이
              letterSpacing: 1
            }}
          >
            로그인
          </Typography>

          <TextField
            inputRef={userId}
            label="ID"
            variant="outlined"
            margin="normal"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '& label': { color: '#555555' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cccccc' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999999' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#66c1ba' }, // 민트색 강조
            }}
          />
          <TextField
            inputRef={pwd}
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '& label': { color: '#555555' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cccccc' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999999' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#66c1ba' }, // 민트색 강조
            }}
          />

          <Button
            onClick={handleLogin}
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(to right,  #457b9d)', // 민트 → 블루 그라데이션
              color: '#fff',
              fontWeight: 'bold',
              letterSpacing: 1,
              
            }}
          >
            로그인
          </Button>

          <Typography variant="body2" sx={{ mt: 2, color: '#555555' }}>
            회원이 아니시라면{' '}
            <Link to="/join" style={{ color: '#457b9d', textDecoration: 'none', fontWeight: 'bold' }}>
              회원가입
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;