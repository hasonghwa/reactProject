import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Toolbar, ListItemIcon } from '@mui/material';
import { Home, Add, AccountCircle, ExitToApp } from '@mui/icons-material'; // 🌟 ExitToApp 아이콘 추가
import { Link, useNavigate } from 'react-router-dom'; // 🌟 useNavigate Hook 추가
import Mui from './mui'; // Mui 컴포넌트 임포트 유지

function Menu() {
  const navigate = useNavigate(); // useNavigate Hook 사용 선언
  
  // 🌟 로그아웃 처리 함수 정의
  const handleLogout = () => {
    const isConfirmed = window.confirm("로그아웃 하시겠습니까?");

    if(isConfirmed){
       // 1. 로컬 저장소에서 사용자 인증 토큰 제거
    localStorage.removeItem("token");
    
    // 2. 알림 메시지 출력
    
    alert("로그아웃 되었습니다.");
    
    // 3. 로그인 페이지 또는 홈 페이지로 리디렉션
    navigate("/"); 
    
  }else{
    return;
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
        },
      }}
    >
      <Toolbar />
      <Typography variant="h6" component="div" sx={{ p: 2 }}>
        SNS 메뉴
      </Typography>
      <List>
        {/* 친구의 피드 */}
        <ListItem button component={Link} to="/feed">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="친구의 피드" />
        </ListItem>
        
        {/* 입을 옷 등록 */}
        <ListItem button component={Link} to="/register">
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="입을 옷 등록" />
        </ListItem>

        {/* 마이페이지 */}
        <ListItem button component={Link} to="/mypage">
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="마이페이지" />
        </ListItem>

        {/* 내가 입은 옷 (착장 기록 목록) */}
        <ListItem button component={Link} to="/ClothHistoryList">
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="내가 입은 옷" />
        </ListItem>
        
        {/* 🌟 로그아웃 메뉴 항목 (onClick 이벤트에 함수 연결) */}
        <ListItem 
          button 
          onClick={handleLogout} 
          // 시각적 구분을 위해 위쪽 여백과 선 추가
          sx={{ mt: 3, borderTop: '1px solid #eee' ,cursor : 'pointer'}} 
        >
          <ListItemIcon>
            <ExitToApp color="error" /> {/* 로그아웃 아이콘 */}
          </ListItemIcon>
          <ListItemText primary="로그아웃" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Menu;