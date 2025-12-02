import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import { CardMedia } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";

// 서버 URL
const API_URL = "http://localhost:3015/feed";

// JWT에서 사용자 ID 추출
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
  const ID = getUserIdFromToken();
  const [clothList, setClothList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 상세보기 모달 상태
  const [open, setOpen] = useState(false);
  const [selectedCloth, setSelectedCloth] = useState(null);

  // 목록 불러오기 함수
  const fetchClothList = () => {
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
  };

  useEffect(() => {
    fetchClothList();
  }, [ID]);

  // 상세보기 모달 열기
  const handleClickOpen = (cloth) => {
    setSelectedCloth(cloth);
    setOpen(true);
  };

  // 상세보기 모달 닫기
  const handleClose = () => {
    setOpen(false);
    setSelectedCloth(null);
  };

  // 로딩, 에러 처리
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

  // 이미지 있는 / 없는 피드 분리
  const clothWithImages = clothList.filter(
    (cloth) => cloth.IMAGES && cloth.IMAGES.length > 0
  );
  const clothWithoutImages = clothList.filter(
    (cloth) => !cloth.IMAGES || cloth.IMAGES.length === 0
  );

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        내 착장 기록
      </Typography>

      {/* 이미지 있는 피드 */}
      {clothWithImages.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            📸 이미지 있는 피드
          </Typography>
          <Grid container spacing={3}>
            {clothWithImages.map((cloth) => (
              <Grid item xs={12} sm={6} md={4} key={cloth.HISTORY_ID}>
                <Card
                  onClick={() => handleClickOpen(cloth)}
                  style={{ cursor: "pointer" }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={cloth.IMAGES[0]}
                    alt={cloth.TITLE}
                  />
                  <CardContent>
                    <Typography variant="h6">{cloth.TITLE}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      스타일: {cloth.STYLE_NAME}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* 이미지 없는 피드 */}
      {clothWithoutImages.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
            ❌ 이미지 없는 피드
          </Typography>
          <Grid container spacing={3}>
            {clothWithoutImages.map((cloth) => (
              <Grid item xs={12} sm={6} md={4} key={cloth.HISTORY_ID}>
                <Card
                  onClick={() => handleClickOpen(cloth)}
                  style={{ cursor: "pointer" }}
                >
                  <CardContent>
                    <Typography variant="h6">{cloth.TITLE}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      스타일: {cloth.STYLE_NAME}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      이미지가 없습니다.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* 상세보기 모달 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedCloth?.TITLE}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            {selectedCloth?.IMAGES?.length > 0 ? (
              <img
                src={selectedCloth.IMAGES[0]}
                alt={selectedCloth.TITLE}
                style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
              />
            ) : (
              <Typography
                variant="subtitle2"
                color="text.disabled"
                align="center"
                sx={{ p: 3, border: "1px dashed #ccc" }}
              >
                등록된 이미지가 없습니다.
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>
            {selectedCloth?.CONTENTS}
          </Typography>

          <Box sx={{ mt: 2, p: 1, borderTop: "1px solid #eee" }}>
            <Typography variant="body2" color="text.secondary">
              스타일: {selectedCloth?.STYLE_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              옷 부위: {selectedCloth?.PART_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              색상: {selectedCloth?.COLOR_NAME}
            </Typography>
          </Box>
        </DialogContent>

        {/* 삭제 버튼 */}
        <Box sx={{ p: 2 }}>
          <Button
            onClick={() => {
              const historyIdToDelete = selectedCloth?.HISTORY_ID;
              if (!historyIdToDelete) {
                alert("삭제할 항목의 ID를 찾을 수 없습니다.");
                return;
              }

              fetch(`${API_URL}/${historyIdToDelete}`, {
                method: "DELETE",
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              })
                .then((res) => {
                  if (!res.ok) throw new Error("삭제 실패");
                  return res.json();
                })
                .then((data) => {
                  alert("삭제되었습니다!");
                  setOpen(false);
                  fetchClothList(); // 목록 갱신
                })
                .catch((err) => {
                  console.error("삭제 오류:", err);
                  alert("삭제 중 오류가 발생했습니다.");
                });
            }}
            variant="contained"
            color="primary"
          >
            삭제
          </Button>
        </Box>
      </Dialog>
    </Container>
  );
}

export default ClothHistoryList;