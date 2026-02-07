import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  message?: string;
}

export const WhatsAppButton = ({ message }: WhatsAppButtonProps) => {
  const phoneNumber = '62895325633487';
  const defaultMessage = 'Hi Renata I would Like to ask question about product (fill this data)';
  const finalMessage = encodeURIComponent(message || defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${finalMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20ba5a] transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
};