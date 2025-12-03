import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Join() {
  const navigate = useNavigate();

  const userId = useRef();
  const pwd = useRef();
  const nickName = useRef();
  const phone = useRef();
  const name = useRef();
  const birth = useRef();

  const handleJoin = async () => {
    const param = {
      userId: userId.current.value,
      pwd: pwd.current.value,
      nickName: nickName.current.value,
      phone: phone.current.value,
      name: name.current.value,
      birth: birth.current.value
    };

    const requiredFields = {
      userId: "ID",
      pwd: "Password",
      nickName: "Nickname",
      phone: "Phone",
      name: "Name",
      birth: "Birth"
    };

    for (const key in param) {
      if (!param[key]) {
        alert(`${requiredFields[key]}을(를) 입력해주세요.`);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3015/user/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(param)
      });

      if (!response.ok) {
        alert("다시 한 번 확인해 주세요.");
        return;
      }

      const data = await response.json();
      if (data.result === "success") {
        alert("회원가입 성공!");
        navigate("/");
      } else {
        alert(data.msg || "입력값을 다시 확인해주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f2f5, #e0e5ea)', // 은은한 회색+약간 블루톤
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0px 6px 18px rgba(0,0,0,0.1)'
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 'bold',
              color: '#444444',
              letterSpacing: 1
            }}
          >
            회원가입
          </Typography>

          {[userId, pwd, nickName, phone, name, birth].map((ref, index) => {
            const labels = ["ID", "Password", "Nickname", "Phone(- 없이)", "Name", "Birth"];
            const type = index === 1 ? "password" : index === 5 ? "date" : "text";
            const InputLabelProps = type === "date" ? { shrink: true } : undefined;

            return (
              <TextField
                key={index}
                inputRef={ref}
                label={labels[index]}
                type={type}
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={InputLabelProps}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  '& label': { color: '#555555' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cccccc' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999999' },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#66c1ba' }, // 민트색 강조
                }}
              />
            );
          })}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(to right,  #457b9d)', // 부드러운 민트+블루
              color: '#fff',
              fontWeight: 'bold',
              letterSpacing: 1,
              
            }}
            onClick={handleJoin}
          >
            회원가입
          </Button>

          <Typography variant="body2" sx={{ mt: 2, color: '#555555' }}>
            이미 회원이라면?{' '}
            <Link to="/" style={{ color: '#457b9d', textDecoration: 'none', fontWeight: 'bold' }}> {/* 링크 강조 */}
              로그인
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Join;