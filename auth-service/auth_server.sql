/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80039 (8.0.39)
 Source Host           : localhost:3306
 Source Schema         : auth_server

 Target Server Type    : MySQL
 Target Server Version : 80039 (8.0.39)
 File Encoding         : 65001

 Date: 25/01/2025 17:05:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for client
-- ----------------------------
DROP TABLE IF EXISTS `client`;
CREATE TABLE `client`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `clientId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `clientSecret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `redirectUris` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_6ed9067942d7537ce359e172ff`(`clientId` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of client
-- ----------------------------
INSERT INTO `client` VALUES ('6ed3f90b-07bb-422f-9672-da2ba224e790', 'a104a39440813200069bcfce0f5dbd63', 'f5a4a1f015bb29087318400737f6b4a6b8db13f01bc151c03fefa0b3269d5e5d', 'http://192.168.31.123:666/', 'http://192.168.31.123:666/callback', 1);
INSERT INTO `client` VALUES ('877f24f2-e79b-4292-bf8a-df3dade66007', 'b18435d1422126729da9cb3e0c04bbeb', 'cfaeec187ba1b7de577b99eaa251cbc33eed1efe23d0ac7fd4398bbd025af3f6', 'http://localhost:666/', 'http://localhost:666/callback', 1);
INSERT INTO `client` VALUES ('9085b3a2-fb13-45e1-bba6-71ba0d43e92a', '2952dba5684f51bb4168d9005aa28af0', '19ddec14d7d54611a598a66863c7789a498ce3600a8701219ac11d8b495feb9d', 'http://192.168.31.123:1332/', 'http://192.168.31.123:1332/callback', 1);
INSERT INTO `client` VALUES ('c5db91ba-d326-4f53-9004-38ba78ee2a5e', 'b1a88e08b66e1a15b9efbf7c650cfa27', '3e1237b5f1318ab3ae944834cb939514a9039aee7072c4ef5bc41d3fc9dfaa16', 'http://192.168.31.123:1333/', 'http://192.168.31.123:1333/callback,http://192.168.31.123:5173/callback', 1);

-- ----------------------------
-- Table structure for operation
-- ----------------------------
DROP TABLE IF EXISTS `operation`;
CREATE TABLE `operation`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `allowedRoleIds` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `routeId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_59beb68b0b40c77a26193c0ca02`(`routeId` ASC) USING BTREE,
  CONSTRAINT `FK_59beb68b0b40c77a26193c0ca02` FOREIGN KEY (`routeId`) REFERENCES `route` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operation
-- ----------------------------
INSERT INTO `operation` VALUES (1, '新增', '', 1);
INSERT INTO `operation` VALUES (2, '删除', '', NULL);
INSERT INTO `operation` VALUES (3, '编辑', '', NULL);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_ae4578dcaed5adff96595e6166`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (4, 'admin');
INSERT INTO `role` VALUES (1, 'super');
INSERT INTO `role` VALUES (2, 'user');

-- ----------------------------
-- Table structure for route
-- ----------------------------
DROP TABLE IF EXISTS `route`;
CREATE TABLE `route`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requiredRoles` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `parentId` int NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `redirect` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_1050f1bce08c8eb606e1a8607d`(`path` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of route
-- ----------------------------
INSERT INTO `route` VALUES (1, '/', '1,4,2', NULL, 'index', '/overview', NULL, NULL);
INSERT INTO `route` VALUES (2, '/overview', '1,2', 1, 'Overview', NULL, 'LineChartOutlined', 'pages.dashboard.overview.title');
INSERT INTO `route` VALUES (3, '/site', '1,2', 1, 'Site', NULL, 'EnvironmentOutlined', 'pages.site.title');
INSERT INTO `route` VALUES (4, '/route', '1,2', 1, 'Route', NULL, 'RollbackOutlined', 'pages.route.title');
INSERT INTO `route` VALUES (5, '/intelligent', '1,2', 1, 'intelligent', '/intelligent/batch', 'PictureOutlined', 'pages.intelligent.title');
INSERT INTO `route` VALUES (6, '/intelligent/batch', '1,2', 5, 'batch', NULL, 'ClusterOutlined', 'pages.intelligent.batch.title');
INSERT INTO `route` VALUES (7, '/intelligent/wait', '1,2', 5, 'wait', NULL, 'FormatPainterOutlined', 'pages.intelligent.wait.title');
INSERT INTO `route` VALUES (8, '/intelligent/diy', '1,2', 5, 'diy', NULL, 'EditOutlined', 'pages.intelligent.diy.title');
INSERT INTO `route` VALUES (9, '/system', '1,2', 1, 'system', '/system/master', 'SettingOutlined', 'pages.system.title');
INSERT INTO `route` VALUES (10, '/system/master', '1,2', 9, 'master', NULL, 'GatewayOutlined', 'pages.system.master.title');
INSERT INTO `route` VALUES (11, '/system/size', '1,2', 9, 'size', NULL, 'ExpandAltOutlined', 'pages.system.size.title');
INSERT INTO `route` VALUES (12, '/system/screen', '1,2', 9, 'screen', NULL, 'GroupOutlined', 'pages.system.screen.title');
INSERT INTO `route` VALUES (13, '/system/landmark', '1,2', 9, 'landmark', NULL, 'BankOutlined', 'pages.system.landmark.title');
INSERT INTO `route` VALUES (14, '/system/street', '1,2', 9, 'street', NULL, 'SisternodeOutlined', 'pages.system.street.title');
INSERT INTO `route` VALUES (15, '/system/other', '1,2', 9, 'other', NULL, 'ControlOutlined', 'pages.system.other.title');
INSERT INTO `route` VALUES (16, '/user', '4,1', 1, 'user', '/user/users', 'UserOutlined', 'pages.user.title');
INSERT INTO `route` VALUES (17, '/user/users', '4,1', 16, 'users', NULL, 'UserOutlined', 'pages.users.title');
INSERT INTO `route` VALUES (18, '/user/role', '4,1', 16, 'role', NULL, 'TeamOutlined', 'pages.role.title');
INSERT INTO `route` VALUES (19, '/user/oplog', '4,1', 16, 'oplog', NULL, 'BranchesOutlined', 'pages.oplog.title');

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of test
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `lang` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'zh-CN',
  PRIMARY KEY (`userId`) USING BTREE,
  UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (5, 'admin', '$2b$10$0kMYioHxOlDoMHfRpQRUcuDaZ.BOXLqV7M6CVtzKElpvGt8XQvBiq', 'admin@admin.com', NULL, 'zh-CN');
INSERT INTO `user` VALUES (6, 'user', '$2b$10$bG0OLeyLsZxQUe8N3hqVAu1SAaR14SmNAn.hSswNnm2EjUOv3iY1.', NULL, NULL, 'zh-CN');
INSERT INTO `user` VALUES (10, 'useradmin', '$2b$10$LIu/RthogHRbR3dU2BDQtezZOXGfdI3NJ5QCnIUUonJIIP4RR6.DO', NULL, NULL, 'zh-CN');

-- ----------------------------
-- Table structure for user_roles_role
-- ----------------------------
DROP TABLE IF EXISTS `user_roles_role`;
CREATE TABLE `user_roles_role`  (
  `userUserId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userUserId`, `roleId`) USING BTREE,
  INDEX `IDX_0bd606ba8531dd93b457b8486d`(`userUserId` ASC) USING BTREE,
  INDEX `IDX_4be2f7adf862634f5f803d246b`(`roleId` ASC) USING BTREE,
  CONSTRAINT `FK_0bd606ba8531dd93b457b8486d9` FOREIGN KEY (`userUserId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles_role
-- ----------------------------
INSERT INTO `user_roles_role` VALUES (5, 1);
INSERT INTO `user_roles_role` VALUES (6, 2);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'songth1ef', '$2b$10$h58FWDt8cVD3raL7PEzsweBbn5FRR2BKwMfjvruy5oS4Hn1YiLpXO');

SET FOREIGN_KEY_CHECKS = 1;
