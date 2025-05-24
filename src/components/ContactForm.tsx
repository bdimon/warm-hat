
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-shop-text">Связаться с нами</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ваше имя
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Иван Иванов"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@mail.com"
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+48 123 456 789"
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Сообщение
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Ваше сообщение..."
                className="w-full min-h-[120px]"
              />
            </div>
            <div className="md:col-span-2">
              <Button 
                className="w-full py-6 bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Отправка...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-5 w-5" />
                    Отправить сообщение
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContactInfo = () => {
  return (
    <div className="bg-shop-blue rounded-xl shadow-lg overflow-hidden h-full">
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-shop-text">Контактная информация</h3>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <Phone className="h-6 w-6 text-shop-blue-dark" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-shop-text">Телефон</h4>
              <p className="text-gray-700">+48 536 223 178</p>
              <p className="text-gray-700">+48 537 118 873</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <Mail className="h-6 w-6 text-shop-blue-dark" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-shop-text">Email</h4>
              <p className="text-gray-700">info@shapkashop.com</p>
              <p className="text-gray-700">support@shapkashop.com</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-shop-blue-dark" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-shop-text">Адрес</h4>
              <p className="text-gray-700">08-110, Warszawa, Polska, ul. Warszawska 2</p>
              <p className="text-gray-700">Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00</p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-medium text-shop-text mb-4">Наш Телеграм-бот</h4>
            <a 
              href="https://t.me/example_bot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center bg-shop-blue-dark text-white py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.17-.04-.25-.02-.11.02-1.84 1.17-5.2 3.44-.49.33-.94.5-1.35.48-.44-.01-1.29-.25-1.92-.46-.78-.26-1.39-.4-1.34-.85.03-.22.32-.45.87-.68 3.41-1.49 5.69-2.47 6.85-2.94 3.26-1.33 3.94-1.56 4.38-1.57.1 0 .32.02.46.15.12.11.15.26.17.37.02.12.01.55.01.55z"/>
              </svg>
              Начать чат с ботом
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <section id='contact' className='py-16 scroll-mt-24'>
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-shop-text'>Готовы помочь</h2>
          <div className='w-24 h-1 bg-shop-blue-dark mx-auto mb-6'></div>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            У вас есть вопросы или предложения? Мы всегда на связи и готовы помочь!
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
