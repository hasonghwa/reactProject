import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,

  //추가
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button, //삭제버튼용

} from "@mui/material";
import { CardMedia } from "@mui/material"; // 이 방법도 가능
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom"; //로그인 이동용
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

  const navigate = useNavigate();

  //상세보기 모달
  const [open, setOpen] = useState(false);
  const [selectedCloth, setselectedCloth] = useState(null);


  // 👇 [추가] 수정 모달 상태 및 데이터
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);


  // 👇 목록을 불러오는 함수 분리 (재사용을 위해)
  const fetchClothList = () => {
    if (!ID) {
      setLoading(false);
      setError("사용자 ID가 없습니다. 로그인 후 이용해주세요.");
      // navigate("/"); // 주석 처리: useEffect에서 처리
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
    if (!ID) {
      setLoading(false);
      setError("사용자 ID가 없습니다. 로그인 후 이용해주세요.");
      // navigate("/"); // 로그인 페이지 이동이 필요하면 활성화
      return;
    }
    fetchClothList();
  }, [ID, navigate]);

  //상세 보기 모달 열기
  const handleClickOpen = (cloth) => {
    setselectedCloth(cloth);
    setOpen(true);
  };

  //상세보기 모달 닫기
  const handleClose = () => {
    setOpen(false);
    setselectedCloth(null);
  };



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
  }, [ID, navigate]);


  //로딩, 에러, 데이터 없음 처리
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



      <Grid container spacing={3} xs={{ cursor: 'pointer' }}>
        {clothList.map((cloth) => (
          <Grid item xs={12} sm={6} md={4} key={cloth.HISTORY_ID}>
            <Card
              onClick={() => handleClickOpen(cloth)}
              style={{ cusor: 'pointer' }}
            >
              {cloth.IMAGES.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={cloth.IMAGES[0]} // 첫 번째 이미지 표시
                  alt={cloth.TITLE}
                  style={{ cursor: 'pointer' }}
                />

              )}
              <CardContent>
                <Typography variant="h6">{cloth.TITLE}</Typography>
                <Box sx={{ mb: 1, cursor: 'pointer' }}>
                  <Typography variant="body2" color="text.secondary">
                    스타일: {cloth.STYLE_NAME}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    옷 부위: {cloth.PART_NAME}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    색상: {cloth.COLOR_NAME}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    카테고리: {cloth.CATEGORY_NAME}
                  </Typography> */}
                </Box>
                {/* <Typography variant="body2">{cloth.CONTENTS}</Typography> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 상세보기 팝업(Dialog) */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedCloth?.TITLE}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>


        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            {/* 이미지 표시 (모든 이미지 순회 가능하도록 변경 고려) */}
            {selectedCloth?.IMAGES?.length > 0 ? (
              <img
                src={selectedCloth.IMAGES[0]} // 첫 번째 이미지
                alt={selectedCloth.TITLE}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
              />
            ) : (
              <Typography variant="subtitle2" color="text.disabled" align="center" sx={{ p: 3, border: '1px dashed #ccc' }}>
                등록된 이미지가 없습니다.
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>
            {selectedCloth?.CONTENTS}
          </Typography>

          <Box sx={{ mt: 2, p: 1, borderTop: '1px solid #eee' }}>
            <Typography variant="body2" color="text.secondary">
              스타일: {selectedCloth?.STYLE_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              옷 부위: {selectedCloth?.PART_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              색상: {selectedCloth?.COLOR_NAME}
            </Typography>
            {/* <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 1 }}>
                            기록 ID: {selectedCloth?.HISTORY_ID}
                        </Typography> */}
          </Box>
        </DialogContent>

        {/* 여기에 삭제/수정 버튼 등을 추가할 수 있습니다. */}
        <Box>
          {/* <Button onClick={()=> {
             // 1. HISTORY_ID 추출
          const historyIdToDelete = selectedCloth?.HISTORY_ID;

          // 🚨 HISTORY_ID 콘솔 출력 위치 🚨
          console.log("수정할 HISTORY_ID:", historyIdToDelete);
          


          }}>수정</Button> */}




          <Button onClick={() => {
            // 1. HISTORY_ID 추출
            const historyIdToDelete = selectedCloth?.HISTORY_ID;

            // 🚨 HISTORY_ID 콘솔 출력 위치 🚨
            console.log("삭제할 HISTORY_ID:", historyIdToDelete);

            if (!historyIdToDelete) {
              alert("삭제할 항목의 ID를 찾을 수 없습니다.");
              return;
            }

            // 2. 삭제 요청
            fetch(`${API_URL}/${historyIdToDelete}`, { // HISTORY_ID를 URL 경로에 포함
              method: "DELETE",
              headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
              }
            })
              .then(res => {
                if (!res.ok) {
                  throw new Error('서버 응답 오류로 삭제 실패');
                }
                return res.json();
              })
              .then(data => {
                alert("삭제되었습니다!");

                setOpen(false); // 모달 닫기

                // 3. 목록 갱신
                fetchClothList(); // 👈 수정된 목록 갱신 함수 호출
              })
              .catch(error => {
                console.error("삭제 중 오류 발생:", error);
                alert("삭제 중 오류가 발생했습니다.");
              });
          }} variant='contained' color="primary">삭제</Button>
        </Box>
      </Dialog>
    </Container>
  );
}

export default ClothHistoryList;