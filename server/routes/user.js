const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db");
const jwt = require('jsonwebtoken');

// 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.
const JWT_KEY = "server_secret_key";





router.post("/join", async (req, res) => {
    let { userId, pwd, nickName, phone, name, birth } = req.body;

    try {
        //let hashPwd = 담아두는 곳
        let hashPwd = await bcrypt.hash(pwd, 10);
        // console.log("해시된 비번",hashPwd);
        let sql = "INSERT INTO USER"
            + " (USERID, PWD, NICKNAME, PHONE, NAME, BIRTH) "
            + " VALUES (?, ?, ?, ?, ?, ?)";
        let result = await db.query(sql, [userId, hashPwd, nickName, phone, name, birth]);
        res.json({
            result: "success",
            msg: "회원 가입성공!",
           
        })
       
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "서버 에러" });

    }

})

router.get("/:userId", async (req, res) => {
    let { userId } = req.params;
    // console.log("아아디",userId);

    try {
        let sql =
            "SELECT U.*, P.*, IFNULL(T.CNT,0) CNT" +
            " FROM USER U " +
            "INNER JOIN PROFILE_IMG P ON P.USERID = U.USERID " +
            "LEFT JOIN ( " +
            "SELECT USERID, COUNT(*) CNT " +
            "FROM TBL_FEED " +
            "GROUP BY USERID " +
            ") T ON U.USERID = T.USERID " +
            "WHERE U.USERID = ?";
        let [list] = await db.query(sql, [userId]);
        res.json({
            result: "success",
            user: list[0]

        });
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    let { userId, pwd } = req.body;
    console.log(req.body);
    try {
        let sql = "SELECT * FROM USER WHERE USERID =?";
        let [list] = await db.query(sql, [userId]);
        let msg = "";
        let result = "fail";
        let token = null;

        if (list.length > 0) {
            //아이디 존재
            let match = await bcrypt.compare(pwd, list[0].PWD);
            if (match) {
                msg = list[0].NICKNAME + "님 환영합니다.";
                result = "success";
                

                let user = {
                    userId: list[0].USERID,
                    name: list[0].NAME,
                    status: "A" ,
                    nickName: list[0].NICKNAME, // <- 여기 추가
                    // 권한 등 필요한 정보 추가
                };

                token = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });
                console.log(token);

            } else {
                msg = "비밀번호가 틀렸습니다.";
            }
        } else {
            msg = "존재하지 않는 아이디입니다.";
        }
        res.json({
            result: result,
            msg: msg,
            token: token

        });
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;