-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: reactproject
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `USERID` varchar(30) NOT NULL,
  `PWD` varchar(500) NOT NULL,
  `NICKNAME` varchar(30) NOT NULL,
  `PHONE` char(11) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `BIRTH` date NOT NULL,
  `FOLLOWER` int DEFAULT '0',
  `FOLLOWING` int DEFAULT '0',
  `INTRO` varchar(300) DEFAULT '안녕하세요?',
  PRIMARY KEY (`USERID`,`PWD`,`PHONE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('dsf','$2b$10$.gAZuuP4rZasFmo7rCzeXuHTWg9E2DqgsT5n75q0QhxHG03uJZqlu','피카츄','01056565656','김철수','2026-01-10',0,0,'안녕하세요?'),('dsf','$2b$10$6XSAyYa9OICMuiuwAEQTSeq9U92hHAHdI5cmufipXt86yw0qIHJB6','피카츄','01056565656','김철수','2025-12-05',0,0,'안녕하세요?'),('dsf','$2b$10$HxqNp0QgxApWIBvzIFnhHOYlRJZSQNroW2CRchs1XMIianLhGHkq2','피카츄','01056565656','김철수','2025-12-27',0,0,'안녕하세요?'),('dsf','$2b$10$ijXzSQ5LX9pHM.BjzZzvoe42PxyqjnXgbnv3iQ6.YUXBg0dO6..yW','피카츄','01056565656','김철수','2025-12-25',0,0,'안녕하세요?'),('dsf','$2b$10$QIPPkKONtOIE/I21BHYqxeBcxcNxZFSeXDsfT7KEgeDaPLJX5RgDi','피카츄','01056565656','김철수','2025-12-20',0,0,'안녕하세요?'),('opid','$2b$10$WdVhCRc5TalG61FwLLS8GO9W37GCVlbBJlsSHkbu9KO5jvJxMniia','오피드','01000000000','오피드','2025-12-11',0,0,'안녕하세요?'),('rkdmf','$2b$10$c5LPrzOKT88WA1E/8W1ys.biGZHf1/feBk4rDPrNbLtUdX2vPBL8y','rkdmf','01096357857','rkdmf','2025-12-27',0,0,'ㅎㅎ'),('rkdmf','$2b$10$iFbKLgg0C0d2AEcP4dJzSedVF6NRFUyUgddhTCXpQ8S.n4DLCtiaW','rkdmf','01096357857','rkdmf','2025-12-27',0,0,'안녕하세요?'),('sfa','$2b$10$PO5CSmAbqZEGeMLFaahYcuWTxiUTXYeolWBDWcrumsV1WFPfgLug2','스파','01089898989','스파','2025-12-10',0,0,'안녕하세요?'),('test1','$2b$10$PBq7VhJBwCav3.VWSS/L4.P.S4/avawxF9Y3eZIK5feRyrw6BSgAu','겨울','00000000000','뎌울','2025-12-12',0,0,'되겠지뭐d'),('test3','$2b$10$Tv8AugYJmPjrlImKUn0Tl.mH19aK06jGPESkMNM7e8VVn00ewBuRK','테스트','01023232323','김철수','2025-11-30',0,0,'아 된다'),('test4','$2b$10$KU5SypjFiRsjaJ.D/vq2S.FD84pKUhSK3FY9oQronqh1HJQEgTMAm','test4','01023232323','tets','2025-12-26',0,0,'안녕하세요?'),('test4','$2b$10$WqvGAEpPdaeaX3nytZRPH.jb0AbuDcPGXOMRJMY..vjSFzfwCx6uq','test4','01023232323','tets','2025-12-20',0,0,'안녕하세요?'),('test5','$2b$10$fCTx1yOd9Eetx92Ro8G2EOez/MXQqTjtePuwBPWqEDXiLDGycd/De','t5','01089898989','e','2025-12-26',0,0,'새로 가입함');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-03 10:55:42
