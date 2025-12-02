import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Toolbar,
  ListItemIcon,
  Divider
} from '@mui/material';
import { Home, Add, AccountCircle, ExitToApp, Checkroom } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode }  from 'jwt-decode';

function Menu() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let nickName = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
      nickName = decoded.nickName || "";
    } catch (e) {
      console.error("JWT decoding failed:", e);
    }
  }

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token");
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5ff', // 연한 회색 배경
          borderRight: '1px solid #ddd',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Toolbar />

      <Typography
        variant="h6"
        component="div"
        sx={{
          p: 2,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          color: '#333', // 텍스트 짙은 회색
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        ᓚᘏᗢ 환영합니다! <br /> {nickName}님
      </Typography>

      <List sx={{ p: 2 }}>
        {/* 친구의 피드 */}
        <ListItem
          button
          component={Link}
          to="/feed"
          sx={{
            borderRadius: 3,
            mb: 1,
            transition: '0.3s',
            '&:hover': { backgroundColor: '#d0f0fd', transform: 'scale(1.02)' }, // 연한 블루 포인트
          }}
        >
          <ListItemIcon><Home sx={{ color: '#2196f3' }} /></ListItemIcon>
          <ListItemText primary="친구의 피드" sx={{ color: '#333' }} />
        </ListItem>

        {/* 마이페이지 */}
        <ListItem
          button
          component={Link}
          to="/mypage"
          sx={{
            borderRadius: 3,
            mb: 1,
            transition: '0.3s',
            '&:hover': { backgroundColor: '#f0e0fd', transform: 'scale(1.02)' }, // 연한 퍼플 포인트
          }}
        >
          <ListItemIcon><AccountCircle sx={{ color: '#9c27b0' }} /></ListItemIcon>
          <ListItemText primary="마이페이지" sx={{ color: '#333' }} />
        </ListItem>

        {/* 옷장 등록 */}
        <ListItem
          button
          component={Link}
          to="/register"
          sx={{
            borderRadius: 3,
            mb: 1,
            transition: '0.3s',
            '&:hover': { backgroundColor: '#fde0e0', transform: 'scale(1.02)' }, // 연한 핑크 포인트
          }}
        >
          <ListItemIcon><Add sx={{ color: '#f06292' }} /></ListItemIcon>
          <ListItemText primary="옷장 등록" sx={{ color: '#333' }} />
        </ListItem>

        {/* 내 옷장 */}
        <ListItem
          button
          component={Link}
          to="/ClothHistoryList"
          sx={{
            borderRadius: 3,
            mb: 1,
            transition: '0.3s',
            '&:hover': { backgroundColor: '#e0fde0', transform: 'scale(1.02)' }, // 연한 민트 포인트
          }}
        >
          <ListItemIcon><Checkroom sx={{ color: '#4caf50' }} /></ListItemIcon>
          <ListItemText primary="내 옷장" sx={{ color: '#333' }} />
        </ListItem>

        <Divider sx={{ my: 2, borderColor: '#ddd' }} />

        {/* 로그아웃 */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            transition: '0.3s',
            '&:hover': { backgroundColor: '#ffdada', transform: 'scale(1.02)' }, // 레드 포인트
          }}
        >
          <ListItemIcon><ExitToApp sx={{ color: '#d32f2f' }} /></ListItemIcon>
          <ListItemText primary="로그아웃" sx={{ color: '#333' }} />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Menu;
