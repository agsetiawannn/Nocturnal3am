ALTER TABLE clients ADD COLUMN active_until DATE DEFAULT NULL AFTER status;

ALTER TABLE client_progress ADD COLUMN alacarte JSON DEFAULT NULL AFTER sprint;
ALTER TABLE client_progress MODIFY client_view ENUM('none', 'onboard', 'presprint', 'sprint', 'alacarte') DEFAULT 'none';
