import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  
} from "@mui/material";
import { CardMedia } from "@mui/material"; // 이 방법도 가능
// 서버 URL
const API_URL = "http://localhost:3015/feed";

// JWT에서 사용자 ID 추출 (custom decode) == 해시된 아이디를 가져옴
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload.userId || null;
  } catch (e) {
    console.error("Token decoding failed:", e);
    return null;
  }
};

function ClothHistoryList() {
  const ID = getUserIdFromToken(); // JWT에서 직접 사용자 ID 추출
  const [clothList, setClothList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ID) {
      setLoading(false);
      setError("사용자 ID가 없습니다. 로그인 후 이용해주세요.");
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/${ID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          setClothList(data.list);
        } else {
          setError("서버에서 데이터를 불러올 수 없습니다.");
          console.error("서버 에러:", data);
        }
      })
      .catch((err) => {
        setError("데이터 요청 중 오류 발생");
        console.error("Fetch Error:", err);
      })
      .finally(() => setLoading(false));
  }, [ID]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="body1">로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (clothList.length === 0) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6">저장된 옷 기록이 없습니다.</Typography>
        
      </Container>
    );
  }

 return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        내 착장 기록
      </Typography>
      <Grid container spacing={3}>
        {clothList.map((cloth) => (
          <Grid item xs={12} sm={6} md={4} key={cloth.HISTORY_ID}>
            <Card>
              {cloth.IMAGES.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={cloth.IMAGES[0]} // 첫 번째 이미지 표시
                  alt={cloth.TITLE}
                />
              )}
              <CardContent>
                <Typography variant="h6">{cloth.TITLE}</Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    스타일: {cloth.STYLE_NAME}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    색상: {cloth.COLOR_NAME}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    카테고리: {cloth.CATEGORY_NAME}
                  </Typography>
                </Box>
                <Typography variant="body2">{cloth.CONTENTS}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ClothHistoryList;