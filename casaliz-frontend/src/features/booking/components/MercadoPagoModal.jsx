// src/features/booking/components/MercadoPagoModal.jsx

import { useState } from 'react';
import { CreditCard, CheckCircle, Loader2, Shield } from 'lucide-react';
import PaymentModal from './PaymentModal';

const MercadoPagoModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleConfirmPayment = () => {
    if (email && email.includes('@')) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess({
          method: 'mercadopago',
          email: email,
          amount: amount,
          transactionId: `MP-${Date.now()}`,
        });
        onClose();
        setEmail('');
      }, 3000);
    }
  };

  return (
    <PaymentModal isOpen={isOpen} onClose={onClose} title="Pagar con Mercado Pago">
      <div className="space-y-6">
        {/* Logo Mercado Pago */}
        <div className="bg-gradient-to-br from-[#233274] to-[#1a2555] rounded-2xl p-8 text-[#f8f5ef] text-center">
          <div className="w-20 h-20 bg-[#f8f5ef]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Mercado Pago</h3>
          <p className="text-[#f8f5ef]">Tu dinero seguro</p>
        </div>

        {/* Monto */}
        <div className="bg-[#f8f5ef] rounded-xl p-4 text-center">
          <p className="text-sm text-[#233274] mb-1">Total a pagar</p>
          <p className="text-3xl font-black text-[#1a2555]">
            S/ {amount.toFixed(2)}
          </p>
        </div>

        {/* Beneficios */}
        <div className="bg-[#f8f5ef] rounded-xl p-4">
          <h4 className="font-bold text-[#233274] mb-3">Beneficios:</h4>
          <ul className="space-y-2 text-sm text-[#233274]">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#233274]" />
              Compra protegida
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#233274]" />
              Paga en cuotas sin interés
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#233274]" />
              Devolución garantizada
            </li>
          </ul>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#233274] mb-2">
            Email de Mercado Pago
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#233274] focus:outline-none"
          />
        </div>

        {/* Seguridad */}
        <div className="flex items-center gap-3 bg-[#f8f5ef] p-4 rounded-xl">
          <Shield className="w-6 h-6 text-[#233274] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1a2555]">Pago 100% seguro</p>
            <p className="text-xs text-[#233274]">Protegido por Mercado Pago</p>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleConfirmPayment}
          disabled={!email || !email.includes('@') || loading}
          className="w-full bg-gradient-to-r from-[#233274] to-[#1a2555] hover:from-[#233274] hover:to-[#1a2555] text-[#f8f5ef] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirigiendo a Mercado Pago...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pagar con Mercado Pago
            </>
          )}
        </button>

        <p className="text-xs text-center text-[#9a98a0]">
          ⚠️ Pago simulado - Serás redirigido a Mercado Pago (simulado)
        </p>
      </div>
    </PaymentModal>
  );
};

export default MercadoPagoModal;