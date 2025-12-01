import React, { useState } from "react";
import { Container, TextField, Button, MenuItem, Typography } from "@mui/material";

const RegisterColor = () => {
  const [colorName, setColor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const token = localStorage.getItem("token");
  const currentUserId = token; // 토큰 자체가 userId 값이라고 임시 가정
  const handleSubmit = async () => {
    if (!colorName || !categoryId) {
      alert("색상명과 카테고리를 모두 입력하세요.");
      return;
    }


    if (!currentUserId) {
      alert("로그인 정보(토큰)가 없습니다.");
      return;
    }

    try {     // 🌟 경로를 서버의 색상 등록 라우트 (/feed/regColor)로 수정합니다.
      const res = await fetch("http://localhost:3015/feed/regColor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          colorName,
          userId: currentUserId, // 🌟 수정: 정의된 currentUserId 사용
          categoryId,

        }),
      });

      const data = await res.json();
      // console.log(data);

      alert("색상 등록 성공!");
      setColor("");
      setCategoryId("");

    } catch (error) {
      console.error(error);
      alert("서버 오류 발생!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        색상 추가
      </Typography>

      <TextField
        fullWidth
        label="색상명 입력"
        value={colorName}
        onChange={(e) => setColor(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        select
        fullWidth
        label="카테고리 선택"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="1">기본 색상</MenuItem>
        <MenuItem value="2">인기 색상</MenuItem>
        <MenuItem value="3">트렌디·특수</MenuItem>
      </TextField>

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        색상 저장
      </Button>
    </Container>
  );
};

export default RegisterColor;