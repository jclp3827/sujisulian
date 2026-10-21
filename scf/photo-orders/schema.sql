-- Provision once in a dedicated, explicitly authorized database. The SCF
-- account needs SELECT/INSERT/UPDATE on these tables, not DDL or root access.
-- MySQL 5.7+/8.0 compatible; InnoDB is REQUIRED for row locks and rollback.
CREATE TABLE IF NOT EXISTS photo_ai_orders (
  id CHAR(31) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  owner_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NULL,
  created_at BIGINT UNSIGNED NULL,
  payment VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NULL,
  refund VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NULL,
  result_deleted TINYINT UNSIGNED NOT NULL DEFAULT 0,
  payload JSON NULL,
  PRIMARY KEY (id),
  KEY photo_owner_recent (owner_hash, payment, refund, created_at, id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS photo_ai_daily_budget (
  id VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  call_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
  last_order CHAR(31) CHARACTER SET ascii COLLATE ascii_bin NULL,
  after_id CHAR(31) CHARACTER SET ascii COLLATE ascii_bin NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;
