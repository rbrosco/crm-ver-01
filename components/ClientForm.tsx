import React, { useState, useEffect } from 'react';
import { User, Calendar, Save, RotateCcw, Globe, Phone, Wifi, Clock, Edit2, X, ShieldCheck, ChevronDown, AlertCircle } from 'lucide-react';
import { Client } from '../types';

interface ClientFormProps {
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  clientToEdit: Client | null;
  onCancelEdit: () => void;
}

// --- DATABASE: COUNTRIES (FULL 197 LIST) ---
const ALL_COUNTRIES = [
  "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra", "Angola", "Antígua e Barbuda", "Arábia Saudita", "Argélia", "Argentina", "Armênia", "Austrália", "Áustria", "Azerbaijão",
  "Bahamas", "Bahrein", "Bangladesh", "Barbados", "Belarus", "Bélgica", "Belize", "Benin", "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei", "Bulgária", "Burkina Faso", "Burundi",
  "Cabo Verde", "Camarões", "Camboja", "Canadá", "Catar", "Cazaquistão", "Chade", "Chile", "China", "Chipre", "Colômbia", "Comores", "Congo", "Coreia do Norte", "Coreia do Sul", "Costa do Marfim", "Costa Rica", "Croácia", "Cuba",
  "Dinamarca", "Djibuti", "Dominica", "República Dominicana",
  "Egito", "El Salvador", "Emirados Árabes Unidos", "Equador", "Eritreia", "Eslováquia", "Eslovênia", "Espanha", "Estados Unidos", "Estônia", "Eswatini (Suazilândia)", "Etiópia",
  "Fiji", "Filipinas", "Finlândia", "França",
  "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada", "Grécia", "Guatemala", "Guiana", "Guiné", "Guiné-Bissau", "Guiné Equatorial",
  "Haiti", "Honduras", "Hungria",
  "Iêmen", "Ilhas Marshall", "Índia", "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Itália",
  "Jamaica", "Japão", "Jordânia",
  "Kiribati", "Kosovo", "Kuwait",
  "Laos", "Lesoto", "Letônia", "Líbano", "Libéria", "Líbia", "Liechtenstein", "Lituânia", "Luxemburgo",
  "Madagascar", "Malásia", "Malawi", "Maldivas", "Mali", "Malta", "Marrocos", "Maurício", "Mauritânia", "México", "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia", "Montenegro", "Myanmar",
  "Namíbia", "Nauru", "Nepal", "Nicarágua", "Níger", "Nigéria", "Noruega", "Nova Zelândia",
  "Omã",
  "Países Baixos", "Palau", "Panamá", "Papua-Nova Guiné", "Paquistão", "Paraguai", "Peru", "Polônia", "Portugal", "Palestina",
  "Quênia",
  "Reino Unido", "República Centro-Africana", "República Checa", "República Democrática do Congo", "Romênia", "Rússia", "Ruanda",
  "Samoa", "San Marino", "Santa Lúcia", "São Cristóvão e Nevis", "São Tomé e Príncipe", "São Vicente e Granadinas", "Seicheles", "Senegal", "Serra Leoa", "Sérvia", "Singapura", "Síria", "Somália", "Sri Lanka", "Sudão", "Sudão do Sul", "Suécia", "Suíça", "Suriname",
  "Tailândia", "Taiwan", "Tajiquistão", "Tanzânia", "Timor-Leste", "Togo", "Tonga", "Trinidad e Tobago", "Tunísia", "Turcomenistão", "Turquia", "Tuvalu",
  "Ucrânia", "Uganda", "Uruguai", "Uzbequistão",
  "Vanuatu", "Vaticano", "Venezuela", "Vietnã",
  "Zâmbia", "Zimbábue"
];

const initialFormState = {
  fullName: '',
  phone: '',
  country: '',
  macAddress: '',
  entryDate: new Date().toISOString().split('T')[0],
  subscriptionDays: 30,
  isPaid: false
};

const generateId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (error) {
    console.warn('Crypto API not available, using fallback ID');
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const ClientForm: React.FC<ClientFormProps> = ({ onAddClient, onUpdateClient, clientToEdit, onCancelEdit }) => {
  const [formData, setFormData] = useState<{
    fullName: string;
    phone: string;
    country: string;
    macAddress: string;
    entryDate: string;
    subscriptionDays: number | string;
    isPaid: boolean;
  }>(initialFormState);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCountryList, setShowCountryList] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>(ALL_COUNTRIES);

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        fullName: clientToEdit.fullName,
        phone: clientToEdit.phone,
        country: clientToEdit.country,
        macAddress: clientToEdit.macAddress,
        entryDate: clientToEdit.entryDate,
        subscriptionDays: clientToEdit.subscriptionDays,
        isPaid: clientToEdit.isPaid
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [clientToEdit]);

  // Helper Normalization
  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 1. Validation: Name (Min 4 chars)
    const cleanName = formData.fullName.trim();
    if (!cleanName) {
      newErrors.fullName = 'O Nome Completo é obrigatório.';
    } else if (cleanName.length < 4) {
      newErrors.fullName = 'O nome deve ter pelo menos 4 caracteres.';
    }

    // 2. Validation: Country (Strict List)
    const isValidCountry = ALL_COUNTRIES.some(c => 
      c.toLowerCase() === formData.country.toLowerCase()
    );
    if (!formData.country) {
      newErrors.country = 'Selecione um país.';
    } else if (!isValidCountry) {
      newErrors.country = 'Selecione um país válido da lista.';
    }

    // 3. Validation: Phone (Min 6 digits)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 6) {
      newErrors.phone = 'O telefone deve ter pelo menos 6 dígitos.';
    }

    // 4. Validation: MAC (Exactly 12 hex chars)
    const cleanMac = formData.macAddress.replace(/[^0-9a-fA-F]/g, '');
    if (cleanMac.length > 0 && cleanMac.length !== 12) {
      newErrors.macAddress = 'MAC deve ter 12 chars.';
    } else if (cleanMac.length === 0) {
       newErrors.macAddress = 'O MAC é obrigatório.';
    }

    // 5. Validation: Duration
    const days = Number(formData.subscriptionDays);
    if (isNaN(days) || days < 0) {
      newErrors.subscriptionDays = 'Inválido.';
    }

    // 6. Validation: Date
    if (!formData.entryDate) {
      newErrors.entryDate = 'Obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Stop if errors exist
    }

    // Find proper case for country
    const matchedCountry = ALL_COUNTRIES.find(c => c.toLowerCase() === formData.country.toLowerCase()) || formData.country;

    const finalData = {
      ...formData,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      country: matchedCountry, 
      subscriptionDays: Number(formData.subscriptionDays) || 0
    };

    if (clientToEdit) {
      const updatedClient: Client = { ...clientToEdit, ...finalData };
      onUpdateClient(updatedClient);
    } else {
      const newClient: Client = { id: generateId(), ...finalData };
      onAddClient(newClient);
    }
    setFormData(initialFormState);
    setErrors({});
    setShowCountryList(false);
  };

  const handleClear = () => {
    if (clientToEdit) onCancelEdit();
    setFormData(initialFormState);
    setErrors({});
    setShowCountryList(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, '');
    setFormData({...formData, fullName: val});
    if (errors.fullName) setErrors({...errors, fullName: ''});
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({...formData, phone: val});
    if (errors.phone) setErrors({...errors, phone: ''});
  };

  const handleMacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    const formatted = value.match(/.{1,2}/g)?.join(':') || value;
    setFormData({ ...formData, macAddress: formatted });
    if (errors.macAddress) setErrors({...errors, macAddress: ''});
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, country: value });
    if (errors.country) setErrors({...errors, country: ''});
    
    if (value.trim() === '') {
      setFilteredCountries(ALL_COUNTRIES);
    } else {
      const normalizedSearch = normalizeText(value);
      const filtered = ALL_COUNTRIES.filter(c => {
        const normalizedName = normalizeText(c);
        return normalizedName.includes(normalizedSearch);
      });
      setFilteredCountries(filtered);
    }
    setShowCountryList(true);
  };

  const selectCountry = (countryName: string) => {
    setFormData({ ...formData, country: countryName });
    setShowCountryList(false);
    if (errors.country) setErrors({...errors, country: ''});
  };

  const labelClass = "block text-zinc-600 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider";
  // Compact Input Class - Reduced Height and Font
  const getInputClass = (fieldName: string) => `
    w-full bg-white dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg border py-2 pl-9 pr-3 placeholder-zinc-400 dark:placeholder-zinc-700 
    focus:outline-none focus:ring-1 transition-all shadow-sm h-10
    ${errors[fieldName] 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-zinc-300 dark:border-zinc-800 focus:border-primary-500 focus:ring-primary-500'}
  `;
  const iconContainerClass = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-primary-500 transition-colors";
  const iconSize = 18;

  return (
    // COMPACT PANEL: Reduced padding from p-6/8 to p-4 (mobile p-3)
    <div className="bg-white dark:bg-zinc-900 p-3 md:p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-900/10 dark:shadow-black/20 relative h-full flex flex-col">
      {/* Accent Bar */}
      <div className={`absolute top-0 left-0 w-full h-1.5 rounded-t-2xl bg-primary-600`}></div>
      
      {/* Form Header - Compact */}
      <div className="flex flex-col justify-between mb-4 pt-3 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border bg-primary-500/10 border-primary-500/20`}>
            {<User className="w-5 h-5 text-primary-500" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-500 text-xs">Preencha os dados abaixo</p>
          </div>
        </div>
        {clientToEdit && (
          <span className="self-start text-[10px] font-bold bg-primary-500/10 text-primary-500 px-2 py-1 rounded border border-primary-500/20 uppercase tracking-wide">
            Editando
          </span>
        )}
      </div>

      {/* Main Form Grid - Tighter Gap (gap-x-3 gap-y-4) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-x-3 gap-y-4 content-start relative">
        
        {/* Full Name */}
        <div className="col-span-1 md:col-span-12 group">
          <label className={labelClass} htmlFor="fullName">Nome Completo *</label>
          <div className="relative">
            <div className={iconContainerClass}>
              <User size={iconSize} className={errors.fullName ? "text-red-500" : ""} />
            </div>
            <input 
              type="text" 
              id="fullName"
              name="fullName"
              autoComplete="name"
              autoCapitalize="words"
              placeholder="Ex: João da Silva"
              className={getInputClass('fullName')}
              value={formData.fullName}
              onChange={handleNameChange}
            />
          </div>
          {errors.fullName && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold animate-fadeIn">
              <AlertCircle size={10} />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        {/* Row 2: Phone & Country */}
        <div className="col-span-1 md:col-span-6 group">
          <label className={labelClass} htmlFor="phone">Telefone</label>
          <div className="relative">
            <div className={iconContainerClass}>
              <Phone size={iconSize} className={errors.phone ? "text-red-500" : ""} />
            </div>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              autoComplete="tel"
              placeholder="1199..."
              className={getInputClass('phone')}
              value={formData.phone}
              onChange={handlePhoneChange}
            />
          </div>
        </div>

        {/* SMART AUTOCOMPLETE COUNTRY FIELD */}
        <div className="col-span-1 md:col-span-6 group relative">
          <label className={labelClass} htmlFor="country">País *</label>
          <div className="relative">
            <div className={iconContainerClass}>
              <Globe size={iconSize} className={errors.country ? "text-red-500" : ""} />
            </div>
            <input 
              type="text" 
              id="country"
              name="country"
              autoComplete="off"
              placeholder="Buscar..."
              className={getInputClass('country')}
              value={formData.country}
              onChange={handleCountryChange}
              onFocus={() => setShowCountryList(true)}
              onBlur={() => setTimeout(() => setShowCountryList(false), 200)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-600 pointer-events-none">
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Floating Dropdown List - Compact */}
          {showCountryList && (
            <div className="absolute top-[calc(100%+2px)] left-0 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xl shadow-zinc-900/10 dark:shadow-black/80 z-50 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredCountries.length > 0 ? (
                <ul>
                  {filteredCountries.map((c) => (
                    <li 
                      key={c}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectCountry(c);
                      }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-200 dark:border-zinc-800/50 last:border-0"
                    >
                      <span className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-500 text-center">
                  Não encontrado.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 3: MAC & Date */}
        <div className="col-span-1 md:col-span-6 group z-0">
          <label className={labelClass} htmlFor="macAddress">MAC</label>
          <div className="relative">
            <div className={iconContainerClass}>
              <Wifi size={iconSize} className={errors.macAddress ? "text-red-500" : ""} />
            </div>
            <input 
              type="text" 
              id="macAddress"
              name="macAddress"
              autoComplete="off"
              spellCheck={false}
              placeholder="00:00..."
              className={`${getInputClass('macAddress')} font-mono uppercase text-xs`}
              value={formData.macAddress}
              onChange={handleMacChange}
              maxLength={17}
            />
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-6 group z-0">
          <label className={labelClass} htmlFor="entryDate">Data *</label>
          <div className="relative">
            <div className={iconContainerClass}>
              <Calendar size={iconSize} className={errors.entryDate ? "text-red-500" : ""} />
            </div>
            <input 
              type="date" 
              id="entryDate"
              name="entryDate"
              className={getInputClass('entryDate')}
              value={formData.entryDate}
              onChange={(e) => setFormData({...formData, entryDate: e.target.value})}
            />
          </div>
        </div>

        {/* Row 4: Duration & Status */}
        <div className="col-span-1 md:col-span-6 group">
          <label className={labelClass} htmlFor="subscriptionDays">Dias *</label>
          <div className="relative">
            <div className={iconContainerClass}>
              <Clock size={iconSize} />
            </div>
            <input 
              type="number" 
              id="subscriptionDays"
              name="subscriptionDays"
              inputMode="numeric"
              min="0"
              placeholder="30"
              className={getInputClass('subscriptionDays')}
              value={formData.subscriptionDays}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0) {
                  setFormData({...formData, subscriptionDays: e.target.value});
                }
              }}
            />
          </div>
        </div>

        {/* Custom Checkbox - Compact */}
        <div className="col-span-1 md:col-span-6 flex flex-col justify-end">
           <div className="hidden md:block h-[26px]"></div> 
           <div 
            className="w-full h-10 flex items-center justify-between px-3 border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer select-none group active:scale-98" 
            onClick={() => setFormData({...formData, isPaid: !formData.isPaid})}
            role="checkbox"
            aria-checked={formData.isPaid}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFormData({...formData, isPaid: !formData.isPaid});
              }
            }}
          >
            <span className={`text-xs font-bold transition-colors ${formData.isPaid ? "text-green-600 dark:text-green-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300"}`}>
              {formData.isPaid ? "Pago" : "Pendente"}
            </span>
            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${formData.isPaid ? 'bg-green-600 border-green-600' : 'border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'}`}>
              {formData.isPaid && <ShieldCheck size={12} className="text-white" />}
            </div>
          </div>
        </div>

        {/* Action Buttons - Compact Side-by-Side */}
        <div className="col-span-1 md:col-span-12 flex gap-3 mt-4">
          <button 
            onClick={handleSubmit}
            className={`flex-1 flex items-center justify-center gap-2 text-white h-11 px-2 rounded-lg text-sm font-bold shadow-lg transition-all hover:brightness-110 active:scale-95 bg-primary-600 shadow-primary-900/20`}
          >
            {clientToEdit ? <Save size={18} /> : <Save size={18} />}
            <span>{clientToEdit ? 'Salvar' : 'Cadastrar'}</span>
          </button>
          
          <button 
            onClick={handleClear}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white h-11 px-2 rounded-lg text-sm font-medium transition-colors"
          >
            {clientToEdit ? <X size={18} /> : <RotateCcw size={18} />}
            <span>{clientToEdit ? 'Cancelar' : 'Limpar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};