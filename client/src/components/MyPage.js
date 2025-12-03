import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Avatar, Grid, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [newIntro, setNewIntro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인 하십시오");
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);

    fetch("http://localhost:3015/user/" + decoded.userId)
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setNewIntro(data.user?.INTRO || "");
      })
      .catch(err => console.error("유저 정보 불러오기 오류:", err));
  }, [navigate]);

  // 소개 수정 모달 열기/닫기
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  // 소개 수정 요청
  const handleIntroSave = async () => {
    const token = localStorage.getItem("token");

    if (!user?.USERID) {
      alert("유저 정보가 없습니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3015/feed/intro", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newIntro })
      });

      const data = await res.json();

      if (data.result === "success") {
        alert("소개가 수정되었습니다.");
        
        // UI 업데이트
        setUser(prev => ({
          ...prev,
          INTRO: newIntro
        }));

        handleEditClose();
      } else {
        alert("소개 수정 실패");
      }
    } catch (err) {
      console.error("소개 수정 오류:", err);
      alert("소개 수정 도중 오류 발생");
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
        sx={{ padding: '20px' }}
      >
        <Paper elevation={3} sx={{ padding: '20px', borderRadius: '15px', width: '100%' }}>
          
          {/* 프로필 상단 */}
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
            <Avatar
              alt="프로필 이미지"
              src="https://via.placeholder.com/100" 
              sx={{ width: 100, height: 100, marginBottom: 2 }}
            />

            <Typography variant="h5">{user?.NAME}</Typography>
            @{user?.USERID}
            <Typography variant="body2" color="text.secondary"></Typography>
          </Box>

          {/* 팔로워 / 팔로잉 / 게시물 */}
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">팔로워</Typography>
              <Typography variant="body1">{user?.FOLLOWER}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">팔로잉</Typography>
              <Typography variant="body1">{user?.FOLLOWING}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">게시물</Typography>
              <Typography variant="body1">{user?.CNT}</Typography>
            </Grid>
          </Grid>

          {/* 소개 영역 */}
          <Box sx={{ marginTop: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">내 소개</Typography>
              <IconButton onClick={handleEditOpen} color="primary">
                <EditIcon />
              </IconButton>
            </Box>

            <Typography variant="body1" sx={{ marginTop: 1, whiteSpace: "pre-line" }}>
              {user?.INTRO || "소개가 없습니다."}
            </Typography>
          </Box>

        </Paper>
      </Box>

      {/* 소개 수정 다이얼로그 */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>소개 수정</DialogTitle>
        <DialogContent>
          <TextField
            label="새 소개"
            fullWidth
            multiline
            rows={4}
            value={newIntro}
            onChange={(e) => setNewIntro(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="error" variant="outlined">취소</Button>
          <Button onClick={handleIntroSave} variant="contained" color="primary">저장</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyPage;
