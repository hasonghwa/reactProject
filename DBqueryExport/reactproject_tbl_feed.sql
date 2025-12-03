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
-- Table structure for table `tbl_feed`
--

DROP TABLE IF EXISTS `tbl_feed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) DEFAULT NULL,
  `content` text,
  `cdatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed`
--

LOCK TABLES `tbl_feed` WRITE;
/*!40000 ALTER TABLE `tbl_feed` DISABLE KEYS */;
INSERT INTO `tbl_feed` VALUES (1,'test1','오늘 날씨가 정말 좋네요!','2024-10-20 00:30:00'),(2,'test2','새로운 프로젝트를 시작했어요. 열심히 해야겠어요!','2024-10-20 01:15:00'),(3,'test3','맛있는 커피 한 잔과 함께 여유로운 아침을 보내고 있어요.','2024-10-20 02:00:00'),(4,'test1','주말엔 산책이 최고인 것 같아요!','2024-10-20 04:45:00'),(5,'test2','친구들과 맛있는 저녁을 먹었어요. 정말 즐거운 시간이었어요.','2024-10-19 09:30:00'),(6,'test3','책을 읽다 보면 시간 가는 줄 몰라요.','2024-10-18 05:25:00'),(7,'test1','오늘은 운동을 열심히 했어요. 뿌듯하네요!','2024-10-17 11:00:00'),(8,'test1','드디어 휴가! 이번엔 멀리 여행을 갈 거예요.','2024-10-16 00:50:00'),(9,'test2','오랜만에 친구를 만났어요. 정말 반가웠어요!','2024-10-15 08:00:00');
/*!40000 ALTER TABLE `tbl_feed` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-03 10:55:43
