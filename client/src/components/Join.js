import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
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

    // 필드명 매칭 오류 수정(PWD → pwd)
    const requiredFields = {
      userId: "ID",
      pwd: "Password",
      nickName: "Nickname",
      phone: "Phone",
      name: "Name",
      birth: "Birth"
    };

    // 공백 체크
    for (const key in param) {
      if (!param[key]) {
        alert(`${requiredFields[key]}을(를) 입력해주세요.`);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3015/user/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(param)
      });

      // 서버 오류 처리
      if (!response.ok) {
        alert("다시 한 번 확인해 주세요.");
        return;
      }

      const data = await response.json();

      // 🔥 서버 응답 메시지를 그대로 보여주도록 수정
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
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          회원가입
        </Typography>

        <TextField inputRef={userId} label="ID" variant="outlined" margin="normal" fullWidth />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          inputRef={pwd}
        />

        <TextField inputRef={nickName} label="Nickname" variant="outlined" margin="normal" fullWidth />
        <TextField inputRef={phone} label="Phone(- 빼고 입력)" variant="outlined" margin="normal" fullWidth />
        <TextField inputRef={name} label="Name" variant="outlined" margin="normal" fullWidth />

        <TextField
          inputRef={birth}
          label="Birth"
          variant="outlined"
          margin="normal"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '20px' }}
          onClick={handleJoin}
        >
          회원가입
        </Button>

        <Typography variant="body2" style={{ marginTop: '10px' }}>
          이미 회원이라면? <Link to="/login">로그인</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Join;