
interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const fetchAddressFromCEP = async (cep: string): Promise<AddressData | null> => {
  try {
    const formattedCEP = cep.replace(/\D/g, '');
    
    if (formattedCEP.length !== 8) {
      return null;
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${formattedCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching address from CEP:', error);
    return null;
  }
};
