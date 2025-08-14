export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export const formatTime = (timeString) => {
  return timeString || '';
};

export const isReturnToday = (returnDate) => {
  if (!returnDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const returnDateObj = new Date(returnDate);
  returnDateObj.setHours(0, 0, 0, 0);
  // The API seems to be off by one day, so we add a day to the return date
  returnDateObj.setDate(returnDateObj.getDate() + 1);
  return today.getTime() === returnDateObj.getTime();
};

export const handleWhatsAppClick = (client) => {
  if (!client || !client.contato) return;
  const phoneNumber = client.contato.replace(/\D/g, '');
  const message = encodeURIComponent(`Olá ${client.nome}! Conforme combinado, estou retornando o contato sobre o plano ${client.plano}. Como posso ajudá-lo?`);
  window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
};
