CREATE TABLE `cms_audit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int,
	`action` varchar(80) NOT NULL,
	`actor` varchar(320) NOT NULL,
	`revision` int,
	`snapshot` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`note` text NOT NULL,
	CONSTRAINT `cms_audit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cms_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(180) NOT NULL,
	`kind` enum('page','landing','article','news','case','video','material','banner') NOT NULL,
	`locale` enum('pt-BR','en','es') NOT NULL,
	`slug` varchar(220) NOT NULL,
	`status` enum('draft','review','published','archived') NOT NULL DEFAULT 'draft',
	`draftPayload` text NOT NULL,
	`publishedPayload` text,
	`revision` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cms_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_documents_key_locale_unique` UNIQUE(`key`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `cms_grants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('admin','editor') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cms_grants_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_grants_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `cms_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`url` varchar(2048) NOT NULL,
	`name` varchar(255) NOT NULL,
	`mime` varchar(100) NOT NULL,
	`size` int NOT NULL,
	`alt` varchar(300) NOT NULL DEFAULT '',
	`title` varchar(300) NOT NULL DEFAULT '',
	`hidden` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cms_media_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_media_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE INDEX `cms_audit_document_idx` ON `cms_audit` (`documentId`);--> statement-breakpoint
CREATE INDEX `cms_audit_created_idx` ON `cms_audit` (`createdAt`);--> statement-breakpoint
CREATE INDEX `cms_documents_status_idx` ON `cms_documents` (`status`);--> statement-breakpoint
CREATE INDEX `cms_documents_slug_locale_idx` ON `cms_documents` (`slug`,`locale`);--> statement-breakpoint
CREATE INDEX `cms_grants_role_idx` ON `cms_grants` (`role`);--> statement-breakpoint
CREATE INDEX `cms_media_hidden_idx` ON `cms_media` (`hidden`);