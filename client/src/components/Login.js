import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  let userId = useRef();
  let pwd = useRef();
  let navigate = useNavigate();

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
          로그인
        </Typography>
        <TextField inputRef={userId} label="Id" variant="outlined" margin="normal" fullWidth />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          inputRef={pwd}
        />
        <Button onClick={() => {
          let self = this;
          let param = {
                userId : userId.current.value,
                pwd : pwd.current.value
              };

         fetch("http://localhost:3015/user/login", {
            method : "POST",
            
            headers : {
              "Content-Type" : "application/json"
              
            },
            body : JSON.stringify(param)
            })
            .then(res => res.json())
            .then(data => {
              
              console.log(data);
             alert(data.msg);
              if(data.result == "success"){
                localStorage.setItem("token",data.token);
                navigate("/feed");
          
              }else{
                alert("로그인 실패!");
              }
        })

          
        }} variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          로그인</Button>

        <Typography variant="body2" style={{ marginTop: '10px' }}>
          회원이 아니시라면 <Link to="/join">회원가입</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
