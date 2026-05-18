-- Migration: Reordenar seleções conforme grupos do álbum da Copa do Mundo
-- Data: 2026-05-18
--
-- ATENÇÃO: As seleções do Grupo H abaixo NÃO existem no banco:
--   ESP (Espanha), CPV (Cabo Verde), KSA (Arábia Saudita), URU (Uruguai)
-- Adicione as figurinhas dessas seleções antes de atribuir section_order a elas.

-- Grupo A
UPDATE stickers SET section_order = 1  WHERE section = 'MEX';
UPDATE stickers SET section_order = 2  WHERE section = 'RSA';
UPDATE stickers SET section_order = 3  WHERE section = 'KOR';
UPDATE stickers SET section_order = 4  WHERE section = 'CZE';

-- Grupo B
UPDATE stickers SET section_order = 5  WHERE section = 'CAN';
UPDATE stickers SET section_order = 6  WHERE section = 'BIH';
UPDATE stickers SET section_order = 7  WHERE section = 'QAT';
UPDATE stickers SET section_order = 8  WHERE section = 'SUI';

-- Grupo C
UPDATE stickers SET section_order = 9  WHERE section = 'BRA';
UPDATE stickers SET section_order = 10 WHERE section = 'MAR';
UPDATE stickers SET section_order = 11 WHERE section = 'HAI';
UPDATE stickers SET section_order = 12 WHERE section = 'SCO';

-- Grupo D
UPDATE stickers SET section_order = 13 WHERE section = 'USA';
UPDATE stickers SET section_order = 14 WHERE section = 'PAR';
UPDATE stickers SET section_order = 15 WHERE section = 'AUS';
UPDATE stickers SET section_order = 16 WHERE section = 'TUR';

-- Grupo E
UPDATE stickers SET section_order = 17 WHERE section = 'GER';
UPDATE stickers SET section_order = 18 WHERE section = 'CUW';
UPDATE stickers SET section_order = 19 WHERE section = 'CIV';
UPDATE stickers SET section_order = 20 WHERE section = 'ECU';

-- Grupo F
UPDATE stickers SET section_order = 21 WHERE section = 'NED';
UPDATE stickers SET section_order = 22 WHERE section = 'JPN';
UPDATE stickers SET section_order = 23 WHERE section = 'TUN';
UPDATE stickers SET section_order = 24 WHERE section = 'SWE';

-- Grupo G
UPDATE stickers SET section_order = 25 WHERE section = 'BEL';
UPDATE stickers SET section_order = 26 WHERE section = 'EGY';
UPDATE stickers SET section_order = 27 WHERE section = 'IRN';
UPDATE stickers SET section_order = 28 WHERE section = 'NZL';

-- Grupo H (⚠️ seleções ainda não cadastradas no banco)
-- UPDATE stickers SET section_order = 29 WHERE section = 'ESP'; -- Espanha
-- UPDATE stickers SET section_order = 30 WHERE section = 'CPV'; -- Cabo Verde
-- UPDATE stickers SET section_order = 31 WHERE section = 'KSA'; -- Arábia Saudita
-- UPDATE stickers SET section_order = 32 WHERE section = 'URU'; -- Uruguai

-- Grupo I
UPDATE stickers SET section_order = 33 WHERE section = 'FRA';
UPDATE stickers SET section_order = 34 WHERE section = 'SEN';
UPDATE stickers SET section_order = 35 WHERE section = 'NOR';
UPDATE stickers SET section_order = 36 WHERE section = 'IRQ';

-- Grupo J
UPDATE stickers SET section_order = 37 WHERE section = 'ARG';
UPDATE stickers SET section_order = 38 WHERE section = 'AUT';
UPDATE stickers SET section_order = 39 WHERE section = 'ALG';
UPDATE stickers SET section_order = 40 WHERE section = 'JOR';

-- Grupo K
UPDATE stickers SET section_order = 41 WHERE section = 'POR';
UPDATE stickers SET section_order = 42 WHERE section = 'COL';
UPDATE stickers SET section_order = 43 WHERE section = 'UZB';
UPDATE stickers SET section_order = 44 WHERE section = 'COD';

-- Grupo L
UPDATE stickers SET section_order = 45 WHERE section = 'ENG';
UPDATE stickers SET section_order = 46 WHERE section = 'CRO';
UPDATE stickers SET section_order = 47 WHERE section = 'GHA';
UPDATE stickers SET section_order = 48 WHERE section = 'PAN';
