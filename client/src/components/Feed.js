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
  Alert,
  Button,
  CardMedia, // CardMedia를 import했습니다.
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

// ⚠️ 서버 URL 설정: 친구 피드 전체 목록 엔드포인트
const API_URL = "http://localhost:3015/feed"; 

function Feed() {
  const [feedList, setFeedList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 상세보기 모달 상태
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null); 

  
  /**
   * 👇 친구들의 전체 피드 목록을 백엔드에서 불러오는 함수
   */
  const fetchFeedList = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL); 

      if (!response.ok) {
        throw new Error(`네트워크 응답이 올바르지 않습니다. (HTTP Status: ${response.status})`);
      }
      
      const data = await response.json();

      // 💡 [수정] 서버 응답 형식 (result: "success")을 확인합니다.
      if (data.result === "success") { 
        setFeedList(data.list); 
      } else {
        // 서버가 에러 메시지를 포함하는 경우 (success: false) 또는 result가 없는 경우
        setError(data.message || "서버에서 전체 목록을 불러올 수 없습니다.");
        console.error("서버 에러:", data);
      }
    } catch (err) {
      setError(`데이터 요청 중 오류 발생: ${err.message}`);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchFeedList();
  }, []); 

  // 상세 보기 모달 열기
  const handleClickOpen = (feed) => {
    setSelectedFeed(feed);
    setOpen(true);
  };

  // 상세보기 모달 닫기
  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
  };


  // 3. 로딩, 에러, 데이터 없음 처리
  if (loading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="body1">친구 피드 로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Alert severity="error">
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (feedList.length === 0) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6">등록된 친구 피드 기록이 없습니다.</Typography>
      </Container>
    );
  }

  // 4. 데이터 표시 (렌더링)
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        👥 친구 착장 기록 전체 목록
      </Typography>

      
      <Grid container spacing={3}>
        {feedList.map((feed) => (
          // FEED_ID를 key로 사용합니다.
          <Grid item xs={12} sm={6} md={4} key={feed.FEED_ID}> 
            <Card
              onClick={() => handleClickOpen(feed)}
              style={{ cursor: 'pointer' }}
            >
              {/* 이미지 미리보기 추가: 첫 번째 이미지를 썸네일로 표시 */}
              {feed.IMAGES && feed.IMAGES.length > 0 && (
                  <CardMedia
                      component="img"
                      height="140"
                      image={feed.IMAGES[0]}
                      alt={feed.TITLE}
                      sx={{ objectFit: 'cover' }}
                  />
              )}
              <CardContent>
                
                <Typography variant="h6">{feed.TITLE}</Typography>
                
                <Box sx={{ mb: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    스타일: {feed.STYLE}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    옷 부위: {feed.PART}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    색상: {feed.COLOR}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    카테고리: {feed.CATEGORY}
                  </Typography> */}
                </Box>
                <Typography variant="body2">{feed.CONTENTS}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 상세보기 팝업(Dialog) */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedFeed?.TITLE}
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
            {/* 💡 [수정] 이미지 정보 확인 및 표시 */}
            {selectedFeed?.IMAGES && selectedFeed.IMAGES.length > 0 ? (
                <CardMedia
                    component="img"
                    height="auto" 
                    image={selectedFeed.IMAGES[0]} // 첫 번째 이미지 표시
                    alt={selectedFeed.TITLE}
                    sx={{ maxHeight: 400, objectFit: 'cover' }}
                />
            ) : (
                <Typography variant="subtitle2" color="text.disabled" align="center" sx={{p: 3, border: '1px dashed #ccc'}}>
                    등록된 이미지가 없습니다.
                </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>
            {selectedFeed?.CONTENTS}
          </Typography>

          <Box sx={{ mt: 2, p: 1, borderTop: '1px solid #eee'}}>
            <Typography variant="body2" color="text.secondary">
              스타일: {selectedFeed?.STYLE}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              옷 부위: {selectedFeed?.PART}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              색상: {selectedFeed?.COLOR}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              카테고리: {selectedFeed?.CATEGORY}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
              작성자: {selectedFeed?.USERID}
            </Typography>
          </Box>
        </DialogContent>
        <Box sx={{p:2, display:'flex', justifyContent:'flex-end'}}>
            <Button onClick={handleClose} color="primary" variant="outlined">닫기</Button>
        </Box>
      </Dialog>
    </Container>
  );
}

export default Feed;