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
-- Table structure for table `friendsfeed`
--

DROP TABLE IF EXISTS `friendsfeed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendsfeed` (
  `FEED_ID` int NOT NULL AUTO_INCREMENT,
  `STYLE_ID` int NOT NULL,
  `COLOR_ID` int NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  `PART_ID` varchar(50) DEFAULT NULL,
  `TITLE` varchar(30) DEFAULT NULL,
  `CONTENTS` varchar(500) DEFAULT NULL,
  `USERID` varchar(50) NOT NULL,
  PRIMARY KEY (`FEED_ID`),
  KEY `STYLE_ID` (`STYLE_ID`),
  KEY `COLOR_ID` (`COLOR_ID`),
  KEY `CATEGORY_ID` (`CATEGORY_ID`),
  CONSTRAINT `friendsfeed_ibfk_1` FOREIGN KEY (`STYLE_ID`) REFERENCES `style` (`STYLE_ID`),
  CONSTRAINT `friendsfeed_ibfk_2` FOREIGN KEY (`COLOR_ID`) REFERENCES `color` (`COLOR_ID`),
  CONSTRAINT `friendsfeed_ibfk_3` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendsfeed`
--

LOCK TABLES `friendsfeed` WRITE;
/*!40000 ALTER TABLE `friendsfeed` DISABLE KEYS */;
INSERT INTO `friendsfeed` VALUES (17,3,10,1,'1,2','가을 트렌치코트 룩','클래식한 트렌치코트에 톤온톤 니트를 매치한 가을 데일리룩입니다. 브라운 컬러 조합이 차분해요.','fashionista_A'),(18,6,2,1,'1,2','스트릿 무드의 오버핏 후드','오버사이즈 후드티와 와이드 데님으로 캐주얼하고 활동적인 스트릿 룩을 연출했습니다.','street_B'),(19,7,16,3,'1,2','페미닌한 플리츠 스커트','데이트를 위한 플리츠 롱스커트 코디입니다. 블라우스와 매치하여 여성스러운 분위기를 냈어요.','fashionista_A'),(20,1,2,1,'1,2','심플한 여름 미니멀 룩','블랙 앤 화이트 조합의 미니멀 코디입니다. 여름철 시원하게 입을 수 있는 린넨 소재에요.','simple_C'),(21,5,5,1,'1,2','빈티지 감성 데님 오버롤','워싱이 예쁜 데님 오버롤과 루즈핏 티셔츠를 매치해 편안하면서도 개성 있는 빈티지 룩을 완성했어요.','street_B'),(22,3,3,2,'1,2,4','포멀한 셋업 슈트','격식을 갖춰야 하는 미팅에 입고 간 회색 셋업 슈트입니다. 셔츠 대신 깔끔한 니트를 매치해 너무 딱딱하지 않게 연출했어요.','fashionista_A'),(23,6,4,3,'1,2','힙한 레트로 컬러 조합','레트로 감성을 담은 쨍한 색상 조합의 코디입니다. 와이드 팬츠와 크롭 가디건으로 트렌디함도 놓치지 않았어요.','street_B'),(24,4,5,1,'1,2','부츠컷 데님 캐주얼','활동성과 스타일을 모두 잡은 데일리 캐주얼 룩입니다. 부츠컷 데님으로 다리가 길어 보이게 연출했어요. 기본 티와 가벼운 아우터 조합!','simple_C');
/*!40000 ALTER TABLE `friendsfeed` ENABLE KEYS */;
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
