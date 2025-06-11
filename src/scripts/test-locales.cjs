const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../'); // путь к исходному коду
console.log('Source dir', SRC_DIR);
const LOCALES_DIR = path.join(__dirname, '../locales'); // путь к локалям
console.log('Locales dir', LOCALES_DIR);
const BASE_LOCALE = path.join(LOCALES_DIR, 'en/translation.json'); // имя базового файла
console.log('Base locale', BASE_LOCALE);

// Рекурсивный обход файлов
function walk(dir, ext = ['.js', '.ts', '.tsx', '.jsx']) {
  let files = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full, ext));
    } else if (ext.includes(path.extname(full))) {
      files.push(full);
    }
  }
  return files;
}

// Собираем все ключи, используемые в коде
function extractKeysFromFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  // Примитивно: ищет t('...') и t("...") и i18n.t('...')
  const regex = /\b(?:i18n\.)?t\((['"`])([^'"`]+?)\1/g;
  const keys = [];
  let match;
  while ((match = regex.exec(code))) {
    keys.push(match[2]);
  }
  return keys;
}

// Собираем все ключи из кода
function findAllKeys() {
  const files = walk(SRC_DIR);
  const allKeys = new Set();
  for (const file of files) {
    extractKeysFromFile(file).forEach(k => allKeys.add(k));
  }
  return allKeys;
}

// Рекурсивно собирает все ключи из локали (a.b.c)
function collectLocaleKeys(obj, prefix = '') {
  let keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(collectLocaleKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Сравниваем
function main() {
  const usedKeys = findAllKeys();
  const locale = JSON.parse(fs.readFileSync(BASE_LOCALE, 'utf8'));
  const availableKeys = new Set(collectLocaleKeys(locale));

  // Ключи, которые есть в коде, но нет в локали
  const missing = [...usedKeys].filter(k => !availableKeys.has(k));
  if (missing.length) {
    console.log('Отсутствуют в локалях, но есть в коде:');
    missing.forEach(k => console.log('  ' + k));
  } else {
    console.log('Все используемые в коде ключи есть в локали!');
  }

  // Ключи, которые есть в локали, но не используются в коде
  const unused = [...availableKeys].filter(k => !usedKeys.has(k));
  if (unused.length) {
    console.log('\nЕсть неиспользуемые ключи в локали:');
    unused.forEach(k => console.log('  ' + k));
  }
}

main();
