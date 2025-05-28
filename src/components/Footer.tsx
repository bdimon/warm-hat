import { useTranslation } from 'react-i18next';
import facebook from '/images/brands/facebook.png';
import instagram from '/images/brands/instagram.png';
import telegram from '/images/brands/telegram.png';
import whatsapp from '/images/brands/whatsapp.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className='bg-shop-text text-white py-8 mt-auto'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
          <div className='lg:col-span-2 flex flex-col items-center space-y-6'>
            <Link
              to='/'
              aria-label={t('header.shopName')}
              className='inline-block hover:opacity-80 transition-opacity'
            >
              <img
                src='/images/logo.webp'
                alt={t('header.shopName')}
                className='h-12 w-auto rounded-lg'
              />
              {/* Или если у вас есть компонент Logo: */}
              {/* <Logo className="h-8 w-auto" /> */}
            </Link>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors'
              >
                <img src={facebook} alt='Facebook' className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors'
              >
                <img src={instagram} alt='Instagram' className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors'
              >
                <img src={telegram} alt='Telegram' className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors'
              >
                <img src={whatsapp} alt='WhatsApp' className='h-5 w-5' />
              </a>
            </div>
          </div>

          <div className='space-y-3'>
            <ul className='space-y-2'>
              <h3 className='text-lg font-semibold mb-6'>{t('footer.navigation')}</h3>
              <>
                <li>
                  <Link
                    to='/'
                    className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                  >
                    {t('header.main')}
                  </Link>
                </li>
                <li>
                  <Link
                    to='/#catalog'
                    className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                  >
                    {t('header.catalog')}
                  </Link>
                </li>
                <li>
                  <Link
                    to='/#benefits'
                    className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                  >
                    {t('header.benefits')}
                  </Link>
                </li>
                <li>
                  <Link
                    to='/#reviews'
                    className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                  >
                    {t('header.reviews')}
                  </Link>{' '}
                </li>
                <li>
                  <Link
                    to='/#contact'
                    className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                  >
                    {t('header.contact')}
                  </Link>
                </li>
              </>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-6'>{t('footer.information')}</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  to='/about'
                  className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link
                  to='/delivery'
                  className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                >
                  {t('footer.delivery')}
                </Link>
              </li>
              <li>
                <Link
                  to='/returns'
                  className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                >
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link
                  to='/warranty'
                  className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                >
                  {t('footer.warranty')}
                </Link>
              </li>
              <li>
                <Link
                  to='/blog'
                  className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                >
                  {t('footer.blog')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-6'> {t('header.contact')}</h3>
            <ul className='space-y-3'>
              <li className='text-gray-300'>08-110, Warszawa, Polska, ul. Warszawska 2</li>
              <li>
                <a
                  href='tel:+78001234567'
                  className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                >
                  +48 536 223 178
                </a>
              </li>
              <li>
                <a
                  href='mailto:info@bystromarket.ru'
                  className='text-gray-300 hover:text-shop-blue-dark transition-colors'
                >
                  support@shapkashop.com
                </a>
              </li>
              <li className='text-gray-300'>{t('footer.workingHours')}: 9:00 - 20:00</li>
              <li className='text-gray-300'>{t('footer.weekendsHours')}: 10:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-700 pt-8 mt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-400 text-sm mb-4 md:mb-0'>
              &copy; {new Date().getFullYear()} {t('footer.companyName', 'Warm Store')}.{' '}
              {t('footer.allRightsReserved')}
            </p>
            <div className='flex space-x-6'>
              <Link
                to='/confident'
                className='text-gray-400 text-sm hover:text-shop-blue-dark transition-colors'
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to='/useragriment'
                className='text-gray-400 text-sm hover:text-shop-blue-dark transition-colors'
              >
                {t('footer.customerAgriment')}
              </Link>
              <Link
                to='/sitemap'
                className='text-gray-400 text-sm hover:text-shop-blue-dark transition-colors'
              >
                {t('footer.sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
