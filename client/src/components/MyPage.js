import React, { useEffect, useState } from 'react';
import { 
    Container, Typography, Box, Avatar, Paper, 
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = "http://localhost:3015";

function MyPage() {
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [newIntro, setNewIntro] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    const navigate = useNavigate();

    // --- 토큰에서 userId 추출 & 초기 데이터 로드 ---
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/");

        try {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            setCurrentUserId(userId);
            fetchUserData(userId);
        } catch (e) {
            console.error("JWT decoding failed:", e);
            navigate("/");
        }
    }, [navigate]);

    const fetchUserData = (userId) => {
        fetch(`${API_BASE_URL}/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.user);
                setUser(data.user);
                // setAvatarUrl(data.user.imgPath);
                if (data.user.PROFILE_IMG) {
                    setAvatarUrl(`${API_BASE_URL}/${data.user.PROFILE_IMG}?t=${new Date().getTime()}`);
                } else {
                    setAvatarUrl("");
                }
                setNewIntro(data.user.INTRO || "");
            })
            .catch(err => console.error("Fetch user error:", err));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleUploadAvatar = async () => {
        if (!selectedFile) return alert("파일을 선택해주세요.");

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/feed/putImage`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error("업로드 실패");

            const data = await res.json();
            if (data.result === "success") {
                alert("프로필 이미지가 업데이트되었습니다.");
                setSelectedFile(null);
                setAvatarUrl(`${API_BASE_URL}/${data.imgPath}?t=${new Date().getTime()}`);
                if (currentUserId) fetchUserData(currentUserId);
            } else {
                alert("프로필 업로드 실패");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("업로드 중 오류 발생");
        }
    };

    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    const handleIntroSave = async () => {
        if (!currentUserId) return alert("사용자 ID가 없습니다.");

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/feed/intro`, {
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
                fetchUserData(currentUserId);
                handleEditClose();
            } else {
                alert("소개 수정 실패");
            }
        } catch (err) {
            console.error("Intro update error:", err);
            alert("소개 수정 중 오류 발생");
        }
    };

    if (!user) return <Container sx={{ textAlign: "center", mt: 5 }}><Typography>로딩중...</Typography></Container>;

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4, mt: 5, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
                
                {/* 프로필 이미지 */}
                <Box sx={{ mb: 3 }}>
                    
                    <Avatar 
                        key={avatarUrl}
                        alt="프로필 이미지"
                        src={user.imgPath || "https://via.placeholder.com/100"}
                        sx={{ width: 100, height: 100, mb: 2, mx: 'auto' }}
                    /> 
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ borderRadius: 2 , color : '#457b9d' }}
                        >
                            이미지 선택
                            <input 
                                type="file" 
                                accept="image/*" 
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: 2 , background : '#457b9d'}}
                            onClick={handleUploadAvatar}
                            disabled={!selectedFile}
                        >
                            업로드
                        </Button>
                    </Stack>
                </Box>

                {/* 유저 정보 */}
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.NICKNAME}</Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>@{user.USERID}</Typography>

                {/* 소개 */}
                <Box sx={{ mt: 3, borderTop: "1px solid #eee", pt: 2, textAlign: 'left' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">내 소개</Typography>
                        <IconButton onClick={handleEditOpen} color="primary">
                            <EditIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                        {user.INTRO || "소개를 추가하세요."}
                    </Typography>
                </Box>
            </Paper>

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
                    <Button onClick={handleEditClose} color="error" variant="outlined" sx={{ borderRadius: 2 }}>취소</Button>
                    <Button onClick={handleIntroSave} variant="contained" color="primary" sx={{ borderRadius: 2 }}>저장</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default MyPage;