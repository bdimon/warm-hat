import fs from 'fs';
import path from 'path';
import {glob} from 'glob';

// Функция для получения всех ключей из объекта переводов
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = [...keys, ...getAllKeys(value as Record<string, unknown>, newKey)];
    } else {
      keys.push(newKey);
    }
  }
  
  return keys;
}

// Функция для поиска использования ключей в исходном коде
function findKeyUsageInCode(key: string): string[] {
  const sourceFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: 'src/scripts/**' });
  const usages: string[] = [];
  
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Ищем использование t('key') или t("key")
    const singleQuoteRegex = new RegExp(`t\\('${key.replace(/\./g, '\\.')}(\\.|'|\\s)`, 'g');
    const doubleQuoteRegex = new RegExp(`t\\("${key.replace(/\./g, '\\.')}(\\.|"|\\s)`, 'g');
    
    if (singleQuoteRegex.test(content) || doubleQuoteRegex.test(content)) {
      usages.push(file);
    }
  }
  
  return usages;
}

// Функция для поиска дублирующихся значений
function findDuplicateValues(translations: Record<string, unknown>): Record<string, string[]> {
  const valueToKeys: Record<string, string[]> = {};
  const allKeys = getAllKeys(translations);
  
  for (const key of allKeys) {
    const keyParts = key.split('.');
    let value = translations;
    
    for (const part of keyParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part] as Record<string, unknown>;
      } else {
        value = undefined;
        break;
      }
    }
    
    if (value !== undefined && typeof value === 'string') {
      if (!valueToKeys[value]) {
        valueToKeys[value] = [];
      }
      valueToKeys[value].push(key);
    }
  }
  
  // Оставляем только дубликаты
  return Object.fromEntries(
    Object.entries(valueToKeys).filter(([_, keys]) => keys.length > 1)
  );
}

// Основная функция проверки
async function checkTranslationsIntegrity() {
  const localesDir = path.resolve('src/locales');
  const languages = fs.readdirSync(localesDir);
  
  // Загружаем переводы для всех языков
  const translations: Record<string, Record<string, unknown>> = {};
  for (const lang of languages) {
    const translationPath = path.join(localesDir, lang, 'translation.json');
    
    if (fs.existsSync(translationPath)) {
      translations[lang] = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
    }
  }
  
  // Получаем все ключи для каждого языка
  const keysByLang: Record<string, string[]> = {};
  for (const [lang, trans] of Object.entries(translations)) {
    keysByLang[lang] = getAllKeys(trans);
  }
  
  // Проверяем наличие всех ключей во всех языках
  console.log('Checking for missing keys in translations...');
  const allKeys = new Set<string>();
  for (const keys of Object.values(keysByLang)) {
    for (const key of keys) {
      allKeys.add(key);
    }
  }
  
  for (const [lang, keys] of Object.entries(keysByLang)) {
    const keysSet = new Set(keys);
    const missingKeys = [...allKeys].filter(key => !keysSet.has(key));
    
    if (missingKeys.length > 0) {
      console.log(`❌ Missing keys in ${lang}:`);
      for (const key of missingKeys) {
        console.log(`  - ${key}`);
      }
    } else {
      console.log(`✅ ${lang}: All keys present`);
    }
  }
  
  // Проверяем использование ключей в коде
  console.log('\nChecking for unused keys...');
  const baseLanguage = languages[0]; // Используем первый язык как базовый
  const baseKeys = keysByLang[baseLanguage];
  
  for (const key of baseKeys) {
    const usages = findKeyUsageInCode(key);
    
    if (usages.length === 0) {
      console.log(`⚠️ Unused key: ${key}`);
    }
  }
  
  // Проверяем дублирующиеся значения
  console.log('\nChecking for duplicate values...');
  for (const [lang, trans] of Object.entries(translations)) {
    const duplicates = findDuplicateValues(trans);
    
    if (Object.keys(duplicates).length > 0) {
      console.log(`⚠️ Duplicate values in ${lang}:`);
      for (const [value, keys] of Object.entries(duplicates)) {
        console.log(`  "${value}" is used in keys:`);
        for (const key of keys) {
          console.log(`    - ${key}`);
        }
      }
    } else {
      console.log(`✅ ${lang}: No duplicate values`);
    }
  }
}

// Запускаем проверку
checkTranslationsIntegrity().catch(console.error);
