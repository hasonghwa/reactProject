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

router.delete("/:feedId", authMiddleware, async (req, res) => {
    let { feedId } = req.params;
    try {
        let sql = "DELETE FROM TBL_FEED WHERE ID = ?";
        let result = await db.query(sql, [feedId]);
        res.json({
            result: result,
            msg: "삭제 완료"
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

// 입을 옷 등록 (완성)
router.post("/", async (req, res) => {
    try {
        let { style, id, categoryId, title, content, userId, parts,     } = req.body;

        let sql = `
      INSERT INTO CLOTHHISTORY
      (STYLE_ID, COLOR_ID, CATEGORY_ID,  TITLE, CONTENTS, USERID, PART_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        let params = [
            style || null,          // STYLE_ID
            id || null,          // COLOR_ID
            categoryId || null,         // CATEGORY_ID
            title || null,
            content || null,
            userId,
            parts || null,          // KIND_STRING
            
            
            
        ];

        let [historyResult] = await db.query(sql, params);
        const newHistoryId = historyResult.insertId;

        res.json({
            result: [{ insertId: newHistoryId }],
            msg: "success: 착장 기록 등록 완료"
        });

    } catch (error) {
        console.error("착장 기록 등록 실패:", error);
        res.status(500).json({
            msg: "error: 착장 기록 등록 실패"
        });
    }
});


//내가 입은 옷 
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
                CH.TITLE,
                CH.CONTENTS,
                GROUP_CONCAT(FI.imgPath) AS IMAGES
            FROM CLOTHHISTORY CH
            INNER JOIN STYLE S ON CH.STYLE_ID = S.STYLE_ID
            INNER JOIN CATEGORY C ON CH.CATEGORY_ID = C.CATEGORY_ID
            INNER JOIN COLOR CO ON CH.COLOR_ID = CO.COLOR_ID
            LEFT JOIN TBL_FEED_IMG FI ON FI.FEEDID = CH.HISTORY_ID
            WHERE CH.USERID = ?
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
router.post("/:ID", async (req, res) => {
    let { colorName, userId, categoryId } = req.body;
    
    
    try {
        let sql = "INSERT INTO INSERTCOLOR VALUES ( ?, ?,? )";
        let result = await db.query(sql, [colorName, userId, categoryId ]);
        console.log(result);
        res.json({
            result,
            msg : "success"

        });
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;