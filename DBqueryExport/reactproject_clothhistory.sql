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
-- Table structure for table `clothhistory`
--

DROP TABLE IF EXISTS `clothhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clothhistory` (
  `HISTORY_ID` int NOT NULL AUTO_INCREMENT,
  `STYLE_ID` int NOT NULL,
  `COLOR_ID` int NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  `PART_ID` varchar(30) DEFAULT NULL,
  `TITLE` varchar(30) DEFAULT NULL,
  `CONTENTS` varchar(500) DEFAULT NULL,
  `USERID` varchar(50) NOT NULL,
  PRIMARY KEY (`HISTORY_ID`),
  KEY `STYLE_ID` (`STYLE_ID`),
  KEY `COLOR_ID` (`COLOR_ID`),
  KEY `CATEGORY_ID` (`CATEGORY_ID`),
  CONSTRAINT `clothhistory_ibfk_1` FOREIGN KEY (`STYLE_ID`) REFERENCES `style` (`STYLE_ID`),
  CONSTRAINT `clothhistory_ibfk_2` FOREIGN KEY (`COLOR_ID`) REFERENCES `color` (`COLOR_ID`),
  CONSTRAINT `clothhistory_ibfk_3` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothhistory`
--

LOCK TABLES `clothhistory` WRITE;
/*!40000 ALTER TABLE `clothhistory` DISABLE KEYS */;
INSERT INTO `clothhistory` VALUES (24,2,9,2,'2,3','test1','s','test2'),(25,3,17,3,'2,3','test2','fsf','test2'),(26,4,9,2,'4','test3','sdaf','test2'),(27,3,2,1,'1','test4','asfgd','test2'),(28,3,2,1,'2,3','test5','asf','test3'),(29,4,10,2,'2,3','ㅇㄹㅇㄴㅁㄹ','ㄴㄻㄴㅇㄹㄴ','test3'),(31,2,8,2,'2,4','테스트 ','테스트4','test6'),(37,3,10,2,'2,3','fsd','sdf','rkdmf'),(38,3,9,2,'1,2','fsdf','sf','rkdmf'),(39,1,2,1,'2,3','ㅇㄴㅁ','ㅇㅁㄴ','test1'),(42,3,9,2,'1,2','ㄴㄹㄴ','ㄴㄹㄴㅇ','dsf'),(43,4,10,2,'1,2','ㅇㄴㅇ','ㄴㅇ','dsf'),(44,4,17,3,'2','ㅇㄴㅁ','ㅁㄴㅇㅁㄴ','dsf'),(45,3,10,2,'2','ㅁㄴㅇㅁㄴ','ㅇㄴㅁ','dsf'),(46,4,9,2,'2','ㅁㄴㅇ','ㅁㄴㅇㄴㅁ','dsf'),(47,4,9,2,'2','ㄹㄴㅇㅁㄹ','ㄴㅁㄹㄴㅁㅇㄹ','dsf'),(50,8,12,2,'2','test','test','test1'),(52,3,1,1,'2,3','ㅇ','ㅇ','test5'),(55,3,1,1,'2,3','fdf','fdf','test1');
/*!40000 ALTER TABLE `clothhistory` ENABLE KEYS */;
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
