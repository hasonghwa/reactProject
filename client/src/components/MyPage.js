import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Avatar, 
    Grid, 
    Paper, 
    // 👇 추가된 항목
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Button, 
    TextField,
    IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // 수정 아이콘 추가
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:3015";

function MyPage() {
    let [user, setUser] = useState(null); // 초기 상태를 null로 설정
    let navigate = useNavigate();

    
    const [editOpen, setEditOpen] = useState(false);
    const [newIntro, setNewIntro] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null); // 토큰에서 추출한 userId 저장

    // --- 사용자 정보 로드 함수 ---
    const fetchUserData = (userId) => {
        fetch(`${API_BASE_URL}/user/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch user data');
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setNewIntro(data.user.INTRO || ''); // 현재 소개를 수정 텍스트 필드에 미리 채우기
            })
            .catch(error => {
                console.error("User data fetch error:", error);
                // 에러 처리
            });
    };

    // --- 초기 로드 및 토큰 확인 ---
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;
                setCurrentUserId(userId); // 현재 userId 저장
                fetchUserData(userId);
            } catch (e) {
                console.error("JWT decoding failed:", e);
                alert("토큰이 유효하지 않습니다.");
                navigate("/");
            }
        } else {
            alert("로그인 하십시오");
            navigate("/");
        }
    }, [navigate]);

    // --- 소개 수정 핸들러 ---

    const handleEditOpen = () => {
        setNewIntro(user?.INTRO || ''); // 현재 소개 내용을 모달에 로드
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleIntroSave = () => {
        if (!currentUserId) {
            alert("사용자 ID를 찾을 수 없습니다.");
            return;
        }
     

        // 🚨 중요: 백엔드에서 사용자 소개(INTRO)를 수정하는 PUT/PATCH API 경로가 필요합니다.


        const token = localStorage.getItem("token");
        console.log("Saving Intro. UserID:", currentUserId); // 👈 로그 1
    
        fetch(`${API_BASE_URL}/feed/intro`, {
            method: 'PUT', // 또는 PATCH
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 인증 토큰 포함
            },
            body: JSON.stringify({
                userId: currentUserId, // 백엔드에서 인증되지만, 명시적으로 포함
                newIntro: newIntro
            })
        })
        .then(res => {
            if (!res.ok) {
                
                throw new Error('소개 수정 실패');
            }
            return res.json();
        })
        .then(data => {
            if (data.result === 'success') {
                alert('소개가 성공적으로 업데이트되었습니다.');
                fetchUserData(currentUserId); // 업데이트된 데이터 다시 불러오기
                handleEditClose();
            } else {
                alert('소개 업데이트 실패: ' + (data.msg || '알 수 없는 오류'));
            }
        })
        .catch(error => {
            console.error('Update error:', error);
            alert(`소개 수정 중 오류 발생: ${error.message}`);
        });
    };


    if (!user) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 5 }}>
                <Typography>사용자 정보를 불러오는 중...</Typography>
            </Container>
        );
    }

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
                            src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" // 프로필 이미지 경로
                            sx={{ width: 100, height: 100, marginBottom: 2 }}
                        />
                        <Typography variant="h5">{user?.NICKNAME}</Typography>
                        @{user?.USERID}
                    </Box>
                    
                    {/* 팔로우/게시물 정보 */}
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={4} textAlign="center">
                            <Typography variant="h6">팔로워</Typography>
                            <Typography variant="body1">{user?.FOLLOWER || 0}</Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                            <Typography variant="h6">팔로잉</Typography>
                            <Typography variant="body1">{user?.FOLLOWING || 0}</Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                            <Typography variant="h6">게시물</Typography>
                            <Typography variant="body1">{user?.CNT || 0}</Typography>
                        </Grid>
                    </Grid>
                    
                    {/* 내 소개 섹션 (클릭 가능) */}
                    <Box sx={{ marginTop: 3, borderTop: '1px solid #eee', pt: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">내 소개</Typography>
                            <IconButton onClick={handleEditOpen} size="small" aria-label="edit intro">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        
                        {/* 👇 소개 내용 표시 */}
                        <Typography 
                            variant="body1" 
                            onClick={handleEditOpen} // 텍스트를 클릭해도 모달 열기
                            sx={{ cursor: 'pointer', mt: 1, p: 1, borderRadius: 1, backgroundColor: '#f9f9f9' }}
                        >
                            {user?.INTRO || "클릭하여 소개를 추가하세요."}
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            {/* 👇 [추가] 내 소개 수정 Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle>소개 수정</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="새 소개 내용"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={newIntro}
                        onChange={(e) => setNewIntro(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="error">취소</Button>
                    <Button onClick={handleIntroSave} variant="contained" color="primary">저장</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default MyPage;