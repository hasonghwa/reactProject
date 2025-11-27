import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// 💡 [패션 더미 데이터]
const DUMMY_CLOTHES_FEEDS = [
    {
        // 💡 필드명: HISTORY_ID로 변경 (옷 기록에 맞게)
        id: 201, 
        title: '가을 트렌치코트 룩',
        content: '클래식한 트렌치코트에 톤온톤 니트를 매치한 가을 데일리룩입니다. 브라운 컬러 조합이 차분해요.',
        imgPath: 'https://picsum.photos/id/169/800/600', // 트렌치코트 이미지
        style: '클래식/모던',
        tags: ['#트렌치코트', '#가을룩', '#톤온톤'],
        userID: 'fashionista_A'
    },
    {
        id: 202,
        title: '스트릿 무드의 오버핏 후드',
        content: '오버사이즈 후드티와 와이드 데님으로 캐주얼하고 활동적인 스트릿 룩을 연출했습니다.',
        imgPath: 'https://picsum.photos/id/240/800/600', // 스트릿 패션 이미지
        style: '스트릿/캐주얼',
        tags: ['#오버핏', '#후드티', '#와이드데님'],
        userID: 'street_B'
    },
    {
        id: 203,
        title: '페미닌한 플리츠 스커트',
        content: '데이트를 위한 플리츠 롱스커트 코디입니다. 블라우스와 매치하여 여성스러운 분위기를 냈어요.',
        imgPath: 'https://picsum.photos/id/400/800/600', // 스커트 이미지
        style: '페미닌/로맨틱',
        tags: ['#플리츠스커트', '#블라우스', '#데이트룩'],
        userID: 'fashionista_A' // 같은 사용자의 다른 피드
    },
    

// 기존 DUMMY_CLOTHES_FEEDS 배열에 아래 6개 객체를 추가하세요.

    {
        id: 204,
        title: '여름 바캉스 니트',
        content: '시원한 블루 계열의 니트와 반바지로 연출한 바캉스 룩. 바닷가에 딱 맞는 색감이에요.',
        imgPath: 'https://picsum.photos/id/444/800/600',
        style: '리조트/마린',
        tags: ['#여름니트', '#바캉스룩', '#블루'],
        userID: 'fashionista_A'
    },
    {
        id: 205,
        title: '포멀한 비즈니스 캐주얼',
        content: '자켓과 슬랙스 조합에 톤 다운된 넥타이를 매치하여 단정하지만 편안한 오피스 룩을 완성했습니다.',
        imgPath: 'https://picsum.photos/id/292/800/600',
        style: '비즈니스 캐주얼',
        tags: ['#자켓코디', '#슬랙스', '#오피스룩'],
        userID: 'manager_C'
    },
    {
        id: 206,
        title: '힙스터 빈티지 무드',
        content: '레더 자켓과 워싱 데님으로 힙하고 빈티지한 느낌을 살렸습니다. 개성 강한 스타일을 선호해요.',
        imgPath: 'https://picsum.photos/id/286/800/600',
        style: '빈티지/레트로',
        tags: ['#레더자켓', '#빈티지', '#워싱진'],
        userID: 'street_B'
    },
    {
        id: 207,
        title: '겨울 필수! 롱 패딩 코디',
        content: '추위를 이겨낼 수 있는 롱 패딩과 부츠의 조합입니다. 보온성이 최우선인 날씨에 딱이에요.',
        imgPath: 'https://picsum.photos/id/1055/800/600',
        style: '아웃도어/방한',
        tags: ['#롱패딩', '#겨울코디', '#방한'],
        userID: 'daily_D'
    },
    {
        id: 208,
        title: '청량한 봄 데님 셋업',
        content: '밝은 톤의 데님 자켓과 팬츠를 셋업으로 입었습니다. 봄에 가장 즐겨 입는 스타일입니다.',
        imgPath: 'https://picsum.photos/id/550/800/600',
        style: '심플',
        tags: ['#데님셋업', '#청청패션', '#봄코디'],
        userID: 'testUser1'
    },
    {
        id: 209,
        title: '러블리한 프릴 블라우스',
        content: '프릴 디테일이 포인트인 블라우스에 심플한 스커트를 매치하여 사랑스러운 느낌을 강조했어요.',
        imgPath: 'https://picsum.photos/id/405/800/600',
        style: '로맨틱',
        tags: ['#프릴블라우스', '#러블리', '#스커트'],
        userID: 'fashionista_A'
    }
];

const API_URL = "http://localhost:3015/cloth/feed"; 

// 토큰 디코딩 로직 (유지)
const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.userID || decoded.userId || null;
    } catch (e) {
        console.error("Token decoding failed:", e);
        return null;
    }
};


function Feed() {
  const [currentUserId, setCurrentUserId] = useState(getUserIdFromToken() || 'testUser1'); // 💡 [수정] 더미 유저 ID 설정 (로그인 안 되어있을 시)
  const [open, setOpen] = useState(false);
  // 💡 [수정] selectedFeed 대신 selectedCloth로 필드명 변경
  const [selectedCloth, setSelectedCloth] = useState(null); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  // 💡 [수정] feeds 대신 clothFeeds로 필드명 변경
  let [clothFeeds, setClothFeeds] = useState([]); 
  let navigate = useNavigate();
  
  // 💡 [수정] 함수명 fnFeeds 대신 fnClothFeeds로 변경
  function fnClothFeeds() {
    if (!currentUserId) {
        alert("로그인 하십시오. (더미 데이터 로드)");
        setClothFeeds(DUMMY_CLOTHES_FEEDS); 
        return;
    }

    // 👇 더미 데이터 사용 (서버 통신 부분 주석 처리)
    setClothFeeds(DUMMY_CLOTHES_FEEDS);
  }

  useEffect(() => {
    fnClothFeeds();
  }, [currentUserId])

  // 💡 [수정] handleClickOpen의 파라미터 feed를 cloth로 변경
  const handleClickOpen = (cloth) => {
    setSelectedCloth(cloth);
    setOpen(true);
    setComments([
      { id: 'user1', text: '멋진 코디네요!' },
      { id: 'user2', text: '트렌치코트 정보 알려주세요!' },
    ]); 
    setNewComment(''); 
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCloth(null);
    setComments([]); 
  };

  const handleAddComment = () => {
    if (!currentUserId) {
        alert("댓글을 작성하려면 로그인해야 합니다.");
        return;
    }
    if (newComment.trim()) {
      setComments([...comments, { id: currentUserId, text: newComment }]);
      setNewComment('');
    }
  };


  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          {/* 💡 [수정] 제목을 'SNS' 대신 '패션 기록'으로 */}
          <Typography variant="h6">내 패션 기록 피드</Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        <Grid container spacing={3}> 
          {clothFeeds.length > 0 ? clothFeeds.map((cloth) => (
            <Grid item xs={12} sm={6} md={4} key={cloth.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  // 💡 [수정] feed.imgPath 대신 cloth.imgPath 사용
                  image={cloth.imgPath}
                  alt={cloth.title}
                  onClick={() => handleClickOpen(cloth)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography variant="h6">{cloth.title}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{mb: 1}}>
                    스타일: {cloth.style}
                  </Typography>
                  <Typography variant="caption" display="block" color="textSecondary">
                    작성자: {cloth.userID}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )) : (
            <Box sx={{ p: 3 }}>
                <Typography variant="body1">등록된 옷 기록이 없습니다. 기록을 등록해주세요.</Typography>
            </Box>
          )}
        </Grid>
      </Box>

      {/* ------------------- 상세 보기 모달 ------------------- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          {selectedCloth?.title}
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

        <DialogContent sx={{ display: 'flex' }}>
          {/* 옷 기록 내용 (왼쪽) */}
          <Box sx={{ flex: 1, pr: 2 }}> 
            <Typography variant="subtitle1" gutterBottom>
              스타일: {selectedCloth?.style}
            </Typography>
            <Typography variant="body1">{selectedCloth?.content}</Typography>
            {selectedCloth?.imgPath && (
              <img
                src={selectedCloth.imgPath}
                alt={selectedCloth.title}
                style={{ width: '100%', marginTop: '10px' }}
              />
            )}
            <Box sx={{mt: 2}}>
                <Typography variant="body2" color="primary">
                   태그: {selectedCloth?.tags?.join(' ')}
                </Typography>
            </Box>
          </Box>

          {/* 댓글 섹션 (오른쪽) */}
          <Box sx={{ width: '300px', marginLeft: '20px', borderLeft: '1px solid #eee', pl: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>댓글</Typography>
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {comments.map((comment, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemAvatar>
                    <Avatar>{comment.id.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={comment.text} secondary={comment.id} />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ pt: 2, borderTop: '1px solid #eee' }}>
                <TextField
                  label="댓글을 입력하세요"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                      e.preventDefault(); 
                    }
                  }}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddComment}
                  fullWidth
                >
                  댓글 추가
                </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* 💡 [수정] 삭제 버튼 조건: selectedCloth로 변경 */}
          {selectedCloth && selectedCloth.userID === currentUserId && (
            <Button onClick={() => {
                const clothIdToDelete = selectedCloth.id;
                
                // 더미 데이터 삭제 처리
                setClothFeeds(clothFeeds.filter(cloth => cloth.id !== clothIdToDelete));
                alert(`[더미 데이터] ID ${clothIdToDelete} 옷 기록이 삭제되었습니다.`);
                setSelectedCloth(null); // 삭제 후 선택된 기록 초기화
                setOpen(false);
                
            }} variant='contained' color="primary">삭제</Button>
          )}
          
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Feed;