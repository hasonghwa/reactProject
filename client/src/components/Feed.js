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
  CardMedia,
  Stack
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const API_URL = "http://localhost:3015/feed";

function Feed() {
  const [feedList, setFeedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);

  const fetchFeedList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      if (data.result === "success") setFeedList(data.list);
      else setError(data.message || "피드를 불러올 수 없습니다.");
    } catch (err) {
      setError(`데이터 요청 오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedList();
  }, []);

  const handleClickOpen = (feed) => {
    setSelectedFeed(feed);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>친구 피드 로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (feedList.length === 0) {
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h6">등록된 친구 피드 기록이 없습니다.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        👥 친구 피드
      </Typography>

      <Grid container spacing={3}>
        {feedList.map((feed) => (
          <Grid item xs={12} sm={6} md={4} key={feed.FEED_ID}>
            <Card
              onClick={() => handleClickOpen(feed)}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                borderRadius: 3,
              }}
            >
              {feed.IMAGES?.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={feed.IMAGES[0]}
                  alt={feed.TITLE}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                />
              )}
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{feed.TITLE}</Typography>
                <Stack spacing={0.5} mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    스타일: {feed.STYLE}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    옷 부위: {feed.PART}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    색상: {feed.COLOR}
                  </Typography>
                </Stack>
                <Typography variant="body2" mt={1}>{feed.CONTENTS}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 상세보기 모달 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ p: 2, position: "relative" }}>
          {selectedFeed?.TITLE}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedFeed?.IMAGES?.length > 0 ? (
            <CardMedia
              component="img"
              image={selectedFeed.IMAGES[0]}
              alt={selectedFeed.TITLE}
              sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 2, mb: 2 }}
            />
          ) : (
            <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 2, mb: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.disabled">등록된 이미지가 없습니다.</Typography>
            </Box>
          )}

          <Typography variant="body1" mb={2}>{selectedFeed?.CONTENTS}</Typography>

          <Box sx={{ p: 2, borderTop: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">스타일: {selectedFeed?.STYLE}</Typography>
            <Typography variant="body2" color="text.secondary">옷 부위: {selectedFeed?.PART}</Typography>
            <Typography variant="body2" color="text.secondary">색상: {selectedFeed?.COLOR}</Typography>
            <Typography variant="body2" color="text.secondary">카테고리: {selectedFeed?.CATEGORY}</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>작성자: {selectedFeed?.USERID}</Typography>
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} variant="outlined">닫기</Button>
        </Box>
      </Dialog>
    </Container>
  );
}

export default Feed;
