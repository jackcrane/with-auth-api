/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: auth_nonces
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `auth_nonces` (
  `nonce` varchar(36) DEFAULT NULL,
  `customer` varchar(36) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  KEY `auth_nonces_customers_null_fk` (`customer`),
  CONSTRAINT `auth_nonces_customers_null_fk` FOREIGN KEY (`customer`) REFERENCES `customers` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: customers
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `customers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(18) DEFAULT NULL,
  `stripe_customerId` varchar(64) DEFAULT NULL,
  `INTERNAL_notes` text,
  `status` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_pk` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: events
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `events` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `owner` varchar(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `logo` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `visibility` varchar(255) DEFAULT 'UnifyEM.STANDARD',
  PRIMARY KEY (`id`),
  UNIQUE KEY `events_pk` (`id`),
  KEY `events_customers_null_fk` (`owner`),
  CONSTRAINT `events_customers_null_fk` FOREIGN KEY (`owner`) REFERENCES `customers` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: verifications
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `verifications` (
  `id` varchar(36) NOT NULL,
  `customer_id` varchar(36) DEFAULT NULL,
  `pin` int DEFAULT NULL,
  `type` varchar(36) DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `table_name_customers_null_fk` (`customer_id`),
  CONSTRAINT `table_name_customers_null_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: auth_nonces
# ------------------------------------------------------------

INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    'eb60e884-a4c1-4584-8452-97a46259aca2',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-13 09:20:53'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    '40a74fa2-8069-46b9-96be-b4f32fa05b1d',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-13 10:47:13'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    '17b1df85-80f4-4656-90bd-b5b9b375bc3d',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-13 16:52:29'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    '361d2f35-1e75-4606-9e7a-8a4345af362a',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-13 18:01:49'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    'a75b076f-9e43-4c72-965f-a1e78efb9224',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-14 20:46:38'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    '0c2b0788-6f8a-467d-aaba-3a54f5ba4c41',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-14 21:49:32'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    'b33b9f0f-1d3a-428c-8d43-a6f160265501',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-14 22:51:15'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    '5a09421e-5d9d-4301-b3f8-8b7a3407d9d3',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-14 23:06:25'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    '2bd62607-17a7-4f98-9339-14fe5ccb807b',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-15 00:12:07'
  );
INSERT INTO
  `auth_nonces` (`nonce`, `customer`, `expires_at`)
VALUES
  (
    '7a63bf66-d0f0-4d26-84f0-d55229e513ac',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    '2022-12-15 20:36:37'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: customers
# ------------------------------------------------------------

INSERT INTO
  `customers` (
    `id`,
    `name`,
    `email`,
    `phone`,
    `stripe_customerId`,
    `INTERNAL_notes`,
    `status`,
    `password`
  )
VALUES
  (
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    'Jack Crane',
    'jack@jackcrane.rocks',
    '5136289360',
    'cus_MyHBimY3no47nb',
    NULL,
    '[\"UnifyEM.AWAITINGPAYMENTINFO\",\"UnifyEM.AWAITINGEMAILCONFIRMATION\",\"UnifyEM.AWAITINGPHONECONFIRMATION\"]',
    '$2b$10$XRuDXL/9Tu3ktxQsPYC//OWsWe/vZttPZo.RNpWnlR.duotoQcXDm'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: events
# ------------------------------------------------------------

INSERT INTO
  `events` (
    `id`,
    `created_at`,
    `edited_at`,
    `owner`,
    `name`,
    `description`,
    `logo`,
    `url`,
    `visibility`
  )
VALUES
  (
    '3044514c-1260-4a19-b926-1e51e2fc7a95',
    '2022-12-13 15:34:49',
    '2022-12-15 05:21:08',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    'Ohio River Paddlefest',
    'Come participate in the world\'s largest canoe and kayak event',
    NULL,
    'https://ohioriverpaddlefest.org',
    'UnifyEM.STANDARD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: verifications
# ------------------------------------------------------------

INSERT INTO
  `verifications` (`id`, `customer_id`, `pin`, `type`, `expires_at`)
VALUES
  (
    '846a1ec5-c9ec-4dec-ba01-cbabe6e53178',
    'd7783d19-ec6a-4eb4-9347-2ef789c32486',
    347664,
    'sms',
    '2022-12-12 16:42:24'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
