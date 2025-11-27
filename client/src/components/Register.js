import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
// import { jwtDecode } from "jwt-decode"; // ❌ 외부 패키지 import 오류로 제거

// ====================================================================
// [JWT 수동 디코딩 유틸리티] - jwt-decode 오류 해결을 위해 다시 추가
// ====================================================================

/**
 * JWT 토큰을 수동으로 디코딩하는 함수 (jwt-decode 대신 사용)
 * 토큰의 payload (가운데 부분)를 base64 디코딩하여 JSON 객체로 반환합니다.
 * @param {string} token - JWT 토큰 문자열
 * @returns {object | null} - 디코딩된 페이로드 객체
 */
const customJwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token decoding failed:", e);
    return null;
  }
};

// 1. 색상 데이터 정의 (정적 데이터)
const ALL_COLORS = [
  // 기본 색상 (번호 1-7, Category PK 1)
  { id: 1, logical: '흰색', physical: 'WHITE', categoryId: 1 },
  { id: 2, logical: '검정', physical: 'BLACK', categoryId: 1 },
  { id: 3, logical: '회색', physical: 'GRAY', categoryId: 1 },
  { id: 4, logical: '빨강', physical: 'RED', categoryId: 1 },
  { id: 5, logical: '파랑', physical: 'BLUE', categoryId: 1 },
  { id: 6, logical: '노랑', physical: 'YELLOW', categoryId: 1 },
  { id: 7, logical: '초록', physical: 'GREEN', categoryId: 1 },

  // 인기 색상 (번호 8-15, Category PK 2)
  { id: 8, logical: '네이비', physical: 'NAVY', categoryId: 2 },
  { id: 9, logical: '베이지', physical: 'BEIGE', categoryId: 2 },
  { id: 10, logical: '브라운', physical: 'BROWN', categoryId: 2 },
  { id: 11, logical: '핑크', physical: 'PINK', categoryId: 2 },
  { id: 12, logical: '퍼플', physical: 'PURPLE', categoryId: 2 },
  { id: 13, logical: '오렌지', physical: 'ORANGE', categoryId: 2 },
  { id: 14, logical: '민트', physical: 'MINT', categoryId: 2 },
  { id: 15, logical: '카키', physical: 'KHAKI', categoryId: 2 },

  // 트렌디/특수 색상 (번호 16-27, Category PK 3)
  { id: 16, logical: '파스텔 핑크', physical: 'PASTEL PINK', categoryId: 3 },
  { id: 17, logical: '파스텔 블루', physical: 'PASTEL BLUE', categoryId: 3 },
  { id: 18, logical: '파스텔 옐로우', physical: 'PASTEL YELLOW', categoryId: 3 },
  { id: 19, logical: '골드', physical: 'GOLD', categoryId: 3 },
  { id: 20, logical: '실버', physical: 'SILVER', categoryId: 3 },
  { id: 21, logical: '로즈골드', physical: 'ROSEGOLD', categoryId: 3 },
  { id: 22, logical: '네온그린', physical: 'NEONGREEN', categoryId: 3 },
  { id: 23, logical: '네온 핑크', physical: 'NEONPINK', categoryId: 3 },
  { id: 24, logical: '네온 오렌지', physical: 'NEONORANGE', categoryId: 3 },
  { id: 25, logical: '올리브', physical: 'OLIVE', categoryId: 3 },
  { id: 26, logical: '샌드', physical: 'SAND', categoryId: 3 },
  { id: 27, logical: '테라코타', physical: 'TERRACOTTA', categoryId: 3 },
];

function Register() {
  const [files, setFile] = useState([]);
  const contentRef = useRef();
  const navigate = useNavigate();

  // 2. 추가된 필드 상태 관리
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [category, setCategory] = useState(''); // 계절 (현재 UI에 없음, 서버 전송용)
  const [parts, setParts] = useState([]); // 옷 부위 (중복선택)

  // 3. 색상 선택을 위한 상태 관리
  const [colorCategory, setColorCategory] = useState(''); // 선택된 색상 카테고리 (1, 2, 3)
  const [filteredColors, setFilteredColors] = useState([]); // 필터링된 색상 리스트
  const [selectedColor, setSelectedColor] = useState(''); // 최종 선택된 색상 ID (1 ~ 27)

  // PARTS 테이블 상단 선언
  // =========================
  const PARTS = [
    { id: 1, name: "상의" },
    { id: 2, name: "하의" },
    { id: 3, name: "모자" },
    { id: 4, name: "신발" },
  ];

  // 4. 색상 카테고리 변경 핸들러
  const handleColorCategoryChange = (event) => {
    // Select의 value는 문자열이므로 숫자로 변환합니다.
    const categoryId = Number(event.target.value);
    setColorCategory(categoryId);
    setSelectedColor(''); // 카테고리 변경 시 선택된 색상 초기화
  };

  // 5. 선택된 색상 변경 핸들러
  const handleSelectedColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  // 6. 옷 부위 체크박스 핸들러
  const handlePartsChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setParts([...parts, value]);
    } else {
      setParts(parts.filter((part) => part !== value));
    }
  };

  // 7. colorCategory 상태가 변경될 때마다 색상 필터링
  useEffect(() => {
    if (colorCategory) {
      const colors = ALL_COLORS.filter(
        // 주의: colorCategory가 Number 타입이므로 비교를 위해 color.categoryId도 Number로 변환합니다.
        (color) => color.categoryId === colorCategory
      );
      setFilteredColors(colors);
    } else {
      setFilteredColors([]);
    }
  }, [colorCategory]);

  // 기존 파일 첨부 핸들러
  const handleFileChange = (event) => {
    setFile(event.target.files);
  };

  //내가 입은 옷 으로 가기
  function fnClothHistory(){
    navigate("/ClothHistoryList");
  }

  // 기존 피드 추가 함수 (수정된 JWT 디코딩 함수 적용)
  function fnFeedAdd() {
    // if (files.length === 0) {
    //   alert("이미지 첨부");
    //   return;
    // }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    // 🌟 customJwtDecode 함수로 교체
    const decoded = customJwtDecode(token);
    if (!decoded || !decoded.userId) {
      alert("유효하지 않은 사용자 토큰입니다.");
      return;
    }

    // 데이터베이스에 전송할 param 객체 구성
    let param = {
      content: contentRef.current.value,
      userId: decoded.userId,
      title: title,
      style: style,
      parts: parts,
      categoryId: colorCategory, 
      id: selectedColor, 
    }

    //옷 추가 
    fetch("http://localhost:3015/feed/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(param)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Feed Insert Result:", data);
        // 🌟 파일이 있을 경우에만 업로드 함수를 호출하도록 변경
        if (files.length > 0) {
           fnUploadFile(data.result && data.result[0] ? data.result[0].insertId : null);
        } else {
           console.log("No files to upload.");
        }
        alert("추가되었습니다.");
        fnClothHistory();
      })
      
      .catch(err => {
        console.error("Feed Add Error:", err);
        alert("피드 등록 중 오류 발생!");
      });
  }

  // 기존 파일 업로드 함수
  const fnUploadFile = (feedId) => {
    if (!feedId) {
      console.error("Feed ID is missing, skipping file upload.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    formData.append("feedId", feedId);
    // 💡 참고: 파일 업로드 URL은 http://localhost:3010/feed/upload로 유지
    fetch("http://localhost:3015/feed/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("File Upload Result:", data);
        // navigate("/feed"); // 주석 해제하여 페이지 이동
      })
      .catch(err => {
        console.error("File Upload Error:", err);
      });
  }


  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
        sx={{ padding: '20px' }}
      >
        <Typography variant="h4" gutterBottom>
          착장 기록 등록
        </Typography>

        {/* 스타일 선택 (Style Selection) */}
        <FormControl fullWidth margin="normal">
          <InputLabel>스타일</InputLabel>
          <Select value={style} label="스타일(선택사항)" onChange={(e) => setStyle(e.target.value)}>
            <MenuItem value={1}>심플</MenuItem>
            <MenuItem value={2}>화려</MenuItem>
            <MenuItem value={3}>포멀(정장, 오피스룩)</MenuItem>
            <MenuItem value={4}>스포츠</MenuItem>
            <MenuItem value={5}>빈티지</MenuItem>
            <MenuItem value={6}>스트릿</MenuItem>
            <MenuItem value={7}>로맨틱(여성스러운)</MenuItem>
            <MenuItem value={8}>기타</MenuItem>
          </Select>
        </FormControl>


       {/* 옷 부위 (Parts Checkbox) */}
<FormControl component="fieldset" fullWidth margin="normal">
  <FormLabel component="legend">옷 부위(중복 가능)</FormLabel>
  <FormGroup row>
    {PARTS.map((part) => (
      <FormControlLabel
        key={part.id}
        control={
          <Checkbox
            checked={parts.includes(part.id)}
            onChange={(event) => {
              const partId = part.id;
              if (event.target.checked) {
                setParts([...parts, partId]);
              } else {
                setParts(parts.filter((id) => id !== partId));
              }
            }}
            value={part.id}
          />
        }
        label={part.name}
      />
    ))}
  </FormGroup>
</FormControl>

        {/* 🚀 1단계: 색상 카테고리 선택 */}
        <FormControl fullWidth margin="normal">
          <InputLabel>색상 카테고리</InputLabel>
          <Select
            value={colorCategory}
            label="색상 카테고리"
            onChange={handleColorCategoryChange}
          >
            <MenuItem value={1}>기본색상</MenuItem>
            <MenuItem value={2}>인기색상</MenuItem>
            <MenuItem value={3}>트렌디/특수</MenuItem>
          </Select>
        </FormControl>

        {/* 🚀 2단계: 필터링된 색상 선택 */}
        <FormControl fullWidth margin="normal" disabled={!colorCategory}>
          <InputLabel>색상 선택</InputLabel>
          <Select
            value={selectedColor}
            label="색상 선택"
            onChange={handleSelectedColorChange}
          >
            {filteredColors.length > 0 ? (
              filteredColors.map((color) => (
                <MenuItem key={color.id} value={color.id}>
                  {color.logical} ({color.physical})
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                카테고리를 먼저 선택해주세요.
              </MenuItem>
            )}
          </Select>
        </FormControl>


        {/* 제목 입력 */}
        <TextField
          label="제목"
          variant="outlined"
          margin="normal"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 내용 입력 */}
        <TextField
          inputRef={contentRef}
          label="내용"
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={4}
        />

        {/* 파일 첨부 */}
        <Box display="flex" alignItems="center" margin="normal" fullWidth>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            multiple
          />
          <label htmlFor="file-upload">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          {files.length > 0 && (
            <Avatar
              alt="첨부된 이미지"
              src={URL.createObjectURL(files[0])}
              sx={{ width: 56, height: 56, marginLeft: 2 }}
            />
          )}
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            {files.length > 0 ? files[0].name : '첨부할 파일 선택'}
          </Typography>
        </Box>

        {/* 등록 버튼 */}
        <Button onClick={fnFeedAdd} variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          등록하기
        </Button>
      </Box>
    </Container>
  );
}

export default Register;