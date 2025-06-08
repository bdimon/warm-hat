import fs from 'fs';
import path from 'path';
import {glob} from 'glob';

// Карта соответствия старых ключей новым
const keyMappings: Record<string, string> = {
  // Общие действия
  'adminProducts.delete': 'common.actions.delete',
  'adminUsers.delete': 'common.actions.delete',
  'adminOrderDetail.deleteConfirmCancel': 'common.actions.cancel',
  'adminProducts.edit': 'common.actions.edit',
  
  // Статусы
  'adminOrderDetail.statuses.new': 'orderStatuses.new',
  'adminOrderDetail.statuses.pending': 'orderStatuses.pending',
  'adminOrderDetail.statuses.paid': 'orderStatuses.paid',
  'adminOrderDetail.statuses.delivered': 'orderStatuses.delivered',
  
  // Ошибки
  'adminProducts.errorLoading': 'common.errors.loading',
  'adminUsers.errorLoading': 'common.errors.loading',
  'adminOrderDetail.errorLoading': 'common.errors.loading',
  'adminProducts.errorUnknown': 'common.errors.unknown',
  'adminOrderDetail.errorUnknown': 'common.errors.unknown',
  
  // Формы
  'orderFormModal.labelName': 'formFields.name.label',
  'orderFormModal.name': 'formFields.name.placeholder',
  'orderFormModal.labelPhone': 'formFields.phone.label',
  'orderFormModal.phone': 'formFields.phone.placeholder',
  'orderFormModal.labelAddress': 'formFields.address.label',
  'orderFormModal.address': 'formFields.address.placeholder',
  
  // Админка - заказы
  'adminDashboard.title': 'admin.orders.title',
  'adminDashboard.noOrders': 'admin.orders.list.noOrders',
  'adminDashboard.date': 'admin.orders.list.date',
  'adminDashboard.name': 'admin.orders.list.name',
  'adminDashboard.email': 'admin.orders.list.email',
  'adminDashboard.amount': 'admin.orders.list.amount',
  'adminDashboard.status': 'admin.orders.list.status',
  'adminDashboard.actions': 'admin.orders.list.actions',
  'adminDashboard.details': 'admin.orders.list.details',
  'adminDashboard.loading': 'admin.orders.list.loading',
  'adminDashboard.deleteSuccess': 'admin.orders.delete.success',
  'adminDashboard.deleteError': 'admin.orders.delete.error',
  
  // Админка - детали заказа
  'adminOrderDetail.title': 'admin.orders.detail.title',
  'adminOrderDetail.customerInfo': 'admin.orders.detail.customerInfo',
  'adminOrderDetail.paymentDeliveryDetails': 'admin.orders.detail.paymentInfo',
  'adminOrderDetail.itemsInOrder': 'admin.orders.detail.items',
  'adminOrderDetail.quantity': 'admin.orders.detail.quantity',
  'adminOrderDetail.noItemsInfo': 'admin.orders.detail.noItemsInfo',
  'adminOrderDetail.current': 'admin.orders.detail.statusManagement.current',
  'adminOrderDetail.changeStatus': 'admin.orders.detail.statusManagement.change',
  'adminOrderDetail.selectNewStatus': 'admin.orders.detail.statusManagement.select',
  'adminOrderDetail.saveStatus': 'admin.orders.detail.statusManagement.save',
  'adminOrderDetail.statusUpdateSuccess': 'admin.orders.detail.statusManagement.success',
  
  // Платежи
  'payment.checkingStatus': 'payment.process.checking',
  'payment.errorNoSessionId': 'payment.errors.noSessionId',
  'payment.errorCheckingStatus': 'payment.errors.checkingStatus',
  'payment.returnToCart': 'payment.actions.returnToCart',
  'payment.successTitle': 'payment.success.title',
  'payment.successMessage': 'payment.success.message',
  'payment.orderNumber': 'payment.success.orderNumber',
  'payment.continueShopping': 'payment.success.continueShopping',
  'orderForm.errorStripeKeyMissing': 'payment.errors.stripeKeyMissing',
  'orderForm.paymentProcessingError': 'payment.errors.processing',
  'orderForm.paymentError': 'payment.errors.retry',
  'orderForm.creatingCheckoutSession': 'payment.process.creating',
  'orderForm.redirectingToCheckout': 'payment.process.redirecting',
};

// Функция для создания новой структуры локализации
function createNewTranslationStructure(oldTranslations: Record<string, unknown>): Record<string, unknown> {
  const newTranslations: Record<string, unknown> = {
    common: {
      actions: {},
      status: {},
      errors: {},
      units: {},
      confirmations: {}
    },
    orderStatuses: {},
    formFields: {
      name: {},
      email: {},
      phone: {},
      address: {}
    },
    validation: {},
    admin: {
      common: {},
      orders: {
        list: {},
        detail: {
          statusManagement: {}
        },
        delete: {}
      },
      products: {
        list: {},
        form: {}
      },
      users: {}
    },
    payment: {
      process: {},
      success: {},
      errors: {},
      actions: {}
    }
  };

  // Заполняем новую структуру значениями из старой
  for (const [oldKey, newKey] of Object.entries(keyMappings)) {
    const oldKeyParts = oldKey.split('.');
    const newKeyParts = newKey.split('.');
    
    // Получаем значение из старой структуры
    let oldValue = oldTranslations;
    for (const part of oldKeyParts) {
      if (oldValue && typeof oldValue === 'object' && part in oldValue) {
        oldValue = oldValue[part] as Record<string, unknown>;
      } else {
        oldValue = undefined;
        break;
      }
    }
    
    // Если значение найдено, добавляем его в новую структуру
    if (oldValue !== undefined) {
      // Создаем вложенные объекты, если их нет
      let current = newTranslations;
      for (let i = 0; i < newKeyParts.length - 1; i++) {
        const part = newKeyParts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
      }
      
      // Устанавливаем значение
      current[newKeyParts[newKeyParts.length - 1]] = oldValue;
    }
  }
  
  return newTranslations;
}

// Функция для обновления ссылок на ключи в исходном коде
function updateSourceCodeReferences(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [oldKey, newKey] of Object.entries(keyMappings)) {
    // Ищем использование t('oldKey') или t("oldKey")
    const singleQuoteRegex = new RegExp(`t\\('${oldKey.replace('.', '\\.')}(\\.|'|\\s)`, 'g');
    const doubleQuoteRegex = new RegExp(`t\\("${oldKey.replace('.', '\\.')}(\\.|"|\\s)`, 'g');
    
    if (singleQuoteRegex.test(content) || doubleQuoteRegex.test(content)) {
      content = content.replace(
        singleQuoteRegex, 
        (match) => match.replace(`'${oldKey}`, `'${newKey}`)
      );
      content = content.replace(
        doubleQuoteRegex, 
        (match) => match.replace(`"${oldKey}`, `"${newKey}`)
      );
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated references in ${filePath}`);
  }
}

// Основная функция миграции
async function migrateTranslations() {
  const localesDir = path.resolve('src/locales');
  const languages = fs.readdirSync(localesDir);
  
  // Обрабатываем каждый язык
  for (const lang of languages) {
    const translationPath = path.join(localesDir, lang, 'translation.json');
    
    if (fs.existsSync(translationPath)) {
      console.log(`Processing ${lang} translations...`);
      
      // Читаем текущие переводы
      const oldTranslations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
      
      // Создаем новую структуру
      const newTranslations = createNewTranslationStructure(oldTranslations);
      
      // Сохраняем резервную копию
      fs.writeFileSync(
        path.join(localesDir, lang, 'translation.backup.json'),
        JSON.stringify(oldTranslations, null, 2),
        'utf8'
      );
      
      // Сохраняем новую структуру
      fs.writeFileSync(
        translationPath,
        JSON.stringify(newTranslations, null, 2),
        'utf8'
      );
      
      console.log(`✅ Migrated ${lang} translations`);
    }
  }
  
  // Обновляем ссылки в исходном коде
  console.log('Updating source code references...');
  const sourceFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: 'src/scripts/**' });
  
  for (const file of sourceFiles) {
    updateSourceCodeReferences(file);
  }
  
  console.log('✅ Migration completed successfully!');
}

// Запускаем миграцию
migrateTranslations().catch(console.error);
