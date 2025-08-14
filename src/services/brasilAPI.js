export const fetchCnpjData = async (cnpj) => {
  const cleanCnpj = cnpj.replace(/\D/g, '');
  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('CNPJ não encontrado na base de dados da BrasilAPI.');
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro ao buscar dados do CNPJ.');
  }

  return response.json();
};
