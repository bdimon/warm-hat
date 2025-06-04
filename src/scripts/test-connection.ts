import { supabase, supabaseEnv } from '../lib/supabase-client';

async function testConnection() {
  console.log(`Тестирование подключения к ${supabaseEnv.isDevelopment ? 'локальному' : 'удаленному'} Supabase`);
  console.log(`URL: ${supabaseEnv.url}`);
  
  try {
    // Проверка аутентификации
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('Сессия:', authData.session ? 'Активна' : 'Отсутствует');
    if (authError) console.error('Ошибка аутентификации:', authError);
    
    // Проверка доступа к таблице products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('Ошибка при получении продуктов:', productsError);
    } else {
      console.log(`Получено ${products.length} продуктов:`);
      products.forEach(p => console.log(` - ${p.name}: $${p.price}`));
    }
  } catch (err) {
    console.error('Непредвиденная ошибка:', err);
  }
}

testConnection();