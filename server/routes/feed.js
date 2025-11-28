const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");
// 1. 패키지 추가
const multer = require('multer');



// 2. 저장 경로 및 파일명
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });
// 3. api 호출
router.post('/upload', upload.array('file'), async (req, res) => {
    let { feedId } = req.body;
    const files = req.files;
    // const filename = req.file.filename; 
    // const destination = req.file.destination; 
    try {
        let results = [];
        let host = `${req.protocol}://${req.get("host")}/`;
        for (let file of files) {
            let filename = file.filename;
            let destination = file.destination;
            let query = "INSERT INTO TBL_FEED_IMG VALUES(NULL, ?, ?, ?)";
            let result = await db.query(query, [feedId, filename, host + destination + filename]);
            results.push(result);
        }
        res.json({
            message: "result",
            result: results
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

// router.get("/:ID", async (req, res) => {
//     console.log(`${req.protocol}://${req.get("host")}`);
//     let { ID } = req.params;
//     console.log(ID);

//     try {
//         let sql = "SELECT * FROM TBL_FEED F INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID WHERE F.USERID = ?"
//         let [list] = await db.query(sql, [ID]);
//         res.json({
//             result: "success",
//             list: list

//         });
//     } catch (error) {
//         console.log(error);
//     }
// })

router.delete("/:historyId", authMiddleware, async (req, res) => {
    let { historyId } = req.params;
    try {
        let sql = "DELETE FROM CLOTHHISTORY WHERE HISTORY_ID = ?";
        let result = await db.query(sql, [historyId]);
        res.json({
            result: result,
            msg: "삭제 완료"
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

// 입을 옷 등록 (완성)
router.post("/register", async (req, res) => {
    try {
        let { style, id, categoryId, parts, title, content, userId } = req.body;

        // 🌟 핵심 수정: parts (배열)를 문자열로 변환 (DB의 KIND_STRING 컬럼용)
        const kindString = Array.isArray(parts) && parts.length > 0
            ? parts.join(',') // 예: [1, 2] -> "1,2"
            : null;

        let sql = `
      INSERT INTO CLOTHHISTORY
      (STYLE_ID, COLOR_ID, CATEGORY_ID,  PART_ID, TITLE, CONTENTS, USERID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        let params = [
            style || null,
            id || null,
            categoryId || null,
            kindString,          // 4. KIND_STRING (문자열로 변환된 parts)
            title || null,
            content || null,
            userId,


        ];
        console.log("CLOTHHISTORY INSERT Params:", params);
        let [historyResult] = await db.query(sql, params);
        const newHistoryId = historyResult.insertId;

        res.json({
            result: [{ insertId: newHistoryId }],
            msg: "success: 착장 기록 등록 완료"
        });

    } catch (error) {
        console.error("착장 기록 등록 실패:", error);


    }
});


// //내가 입은 옷 
router.get("/:ID", async (req, res) => {
    console.log(`${req.protocol}://${req.get("host")}`);
    let { ID } = req.params;
    console.log(ID);

    try {
        let sql =
            `
            SELECT 
                CH.HISTORY_ID,
                S.STYLE AS STYLE_NAME,
                C.CATEGORY AS CATEGORY_NAME,
                CO.COLOR AS COLOR_NAME,
                P.PART AS PART_NAME,
                CH.TITLE,
                CH.CONTENTS,
                GROUP_CONCAT(FI.imgPath) AS IMAGES
            FROM CLOTHHISTORY CH
            INNER JOIN STYLE S ON CH.STYLE_ID = S.STYLE_ID
            INNER JOIN CATEGORY C ON CH.CATEGORY_ID = C.CATEGORY_ID
            INNER JOIN COLOR CO ON CH.COLOR_ID = CO.COLOR_ID
            LEFT JOIN PART P ON CH.PART_ID = P.PART_ID
            LEFT JOIN TBL_FEED_IMG FI ON FI.FEEDID = CH.HISTORY_ID
            WHERE CH.USERID = 'test2'
            GROUP BY CH.HISTORY_ID
            ORDER BY CH.HISTORY_ID DESC
        `;
        let [list] = await db.query(sql, [ID]);
        // IMAGES 문자열을 배열로 변환
        list = list.map((item) => ({
            ...item,  // 기존 필드 유지(ex 상의, 빨간색, 캐주얼..)
            IMAGES: item.IMAGES ? item.IMAGES.split(',') : [],  //["uploads/1.jpg", "uploads/2.jpg"] or [이미지 없음] 
        }));
        res.json({
            result: "success",
            list: list

        });
    } catch (error) {
        console.log(error);
    }
})

//색상 추가 
router.post("/regColor", async (req, res) => {
    let { colorName, userId, categoryId } = req.body;
    console.log(userId);

    try {
        let sql = "INSERT INTO INSERTCOLOR(COLOR_NAME, USERID, CATEGORY_ID ) VALUES ( ?, ?,? )";
        let result = await db.query(sql, [colorName, userId, categoryId]);
        // console.log("dd");
        res.json({
            result,
            msg: "success"

        });
    } catch (error) {
        console.log(error);
    }
})


router.get("/", async (req, res) => {
    // 클라이언트로부터 받은 필터링 변수들을 사용하지 않습니다.
     

    // SQL 쿼리: WHERE 조건 없이 모든 데이터를 JOIN하여 가져옵니다.
    let sql = `SELECT F.FEED_ID,                 
        S.STYLE, 
        CO.COLOR, 
        CA.CATEGORY, 
        P.PART, 
        F.TITLE, 
        F.CONTENTS, 
        F.USERID
    FROM FRIENDSFEED F 
    INNER JOIN STYLE S ON F.STYLE_ID = S.STYLE_ID
    INNER JOIN COLOR CO ON F.COLOR_ID = CO.COLOR_ID
    INNER JOIN CATEGORY CA ON F.CATEGORY_ID = CA.CATEGORY_ID
    INNER JOIN PART P ON F.PART_ID = P.PART_ID`; // (선택 사항) 최근 등록된 순서로 정렬 (ID 또는 등록일 기준)
     let [list] = await db.query(sql);
    // db.query의 두 번째 인자는 빈 배열 [] 또는 아예 생략하여 바인딩할 값이 없음을 명시합니다.
    
    
    try {
       
        
        // 결과 반환
        res.json({
            result: "success",
            list: list
        });
    } catch (error) {
         
        console.error("DB Query Error:", error); 
        res.status(500).json({ 
            success: false,
            message: "전체 목록을 불러오는 중 오류가 발생했습니다."
        });
    }
});


module.exports = router;