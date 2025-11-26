import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Join() {
  let navigate = useNavigate()
  let userId = useRef();
  let pwd = useRef();
  let nickName = useRef();
  let phone = useRef();
  let name = useRef();
  let birth = useRef();

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          회원가입
        </Typography>
        
        <TextField inputRef={userId} label="ID" variant="outlined" margin="normal" fullWidth />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          inputRef={pwd}
        />
        

        <TextField inputRef={nickName} label="Nickname" variant="outlined" margin="normal" fullWidth />
        <TextField inputRef={phone} label="phone(-빼고 입력)" variant="outlined" margin="normal" fullWidth />
        <TextField inputRef={name} label="name" variant="outlined" margin="normal" fullWidth />
        <TextField inputRef={birth} label="birth(ex: 2025-11-25)" variant="outlined" margin="normal" fullWidth />

        
        <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}
        
        onClick={()=>{
          let param = {
            userId : userId.current.value,
            pwd : pwd.current.value,
            nickName : nickName.current.value,
            phone : phone.current.value,
            name : name.current.value,
            birth : birth.current.value
          };

          fetch("http://localhost:3015/user/join", {
            method : "POST",
            headers : {
              "Content-Type" : "application/json"
            },
            body : JSON.stringify(param)
            })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              alert("회원가입 성공!");
              navigate("/");
        })
        }}>


            회원가입
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          이미 회원이라면? <Link to="/login">로그인</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Join;