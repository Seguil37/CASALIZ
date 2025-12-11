// src/features/booking/components/YapeModal.jsx

import { useState } from 'react';
import { Smartphone, CheckCircle, Loader2, Copy, Check } from 'lucide-react';
import PaymentModal from './PaymentModal';

const YapeModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const yapeNumber = '987 654 321';
  const yapeName = 'Book&Go Tours';

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 9);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(yapeNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (phoneNumber.length === 9) {
      setStep(2);
    }
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        method: 'yape',
        phone: phoneNumber,
        amount: amount,
        transactionId: `YAPE-${Date.now()}`,
      });
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    setStep(1);
    setPhoneNumber('');
    setLoading(false);
    onClose();
  };

  return (
    <PaymentModal isOpen={isOpen} onClose={handleClose} title="Pagar con Yape">
      {step === 1 && (
        <div className="space-y-6">
          {/* Logo Yape */}
          <div className="bg-gradient-to-br from-[#233274] to-[#1a2555] rounded-2xl p-8 text-[#f8f5ef] text-center">
            <div className="w-20 h-20 bg-[#f8f5ef]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Yape</h3>
            <p className="text-[#f8f5ef]">Billetera digital del BCP</p>
          </div>

          {/* Monto a pagar */}
          <div className="bg-[#f8f5ef] rounded-xl p-4 text-center">
            <p className="text-sm text-[#1a2555] mb-1">Total a pagar</p>
            <p className="text-3xl font-black text-[#1a2555]">
              S/ {amount.toFixed(2)}
            </p>
          </div>

          {/* Instrucciones */}
          <div className="space-y-4">
            <div className="bg-[#f8f5ef] rounded-xl p-4">
              <h4 className="font-bold text-[#233274] mb-3">Instrucciones:</h4>
              <ol className="space-y-2 text-sm text-[#233274]">
                <li className="flex gap-2">
                  <span className="font-bold text-[#233274]">1.</span>
                  Abre tu app de Yape
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#233274]">2.</span>
                  Selecciona "Yapear"
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#233274]">3.</span>
                  Ingresa el número: <strong>{yapeNumber}</strong>
                  <button
                    onClick={handleCopyNumber}
                    className="ml-auto p-1 hover:bg-[#f8f5ef] rounded"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#233274]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#9a98a0]" />
                    )}
                  </button>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#233274]">4.</span>
                  Yapea S/ {amount.toFixed(2)} a {yapeName}
                </li>
              </ol>
            </div>

            {/* Input de teléfono */}
            <div>
              <label className="block text-sm font-semibold text-[#233274] mb-2">
                Tu número de celular
              </label>
              <div className="flex gap-2">
                <div className="px-4 py-3 border-2 border-[#9a98a0] rounded-xl bg-[#f8f5ef] font-mono">
                  +51
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                  placeholder="987654321"
                  className="flex-1 px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#233274] focus:outline-none font-mono"
                  maxLength="9"
                />
              </div>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={handleContinue}
            disabled={phoneNumber.length !== 9}
            className="w-full bg-gradient-to-r from-[#233274] to-[#1a2555] hover:from-[#1a2555] hover:to-[#1a2555] text-[#f8f5ef] font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ya Yapeé
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Confirmación */}
          <div className="text-center">
            <div className="w-20 h-20 bg-[#f8f5ef] rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-10 h-10 text-[#233274]" />
            </div>
            <h3 className="text-xl font-bold text-[#233274] mb-2">
              Confirma tu Yape
            </h3>
            <p className="text-[#9a98a0]">
              Estamos verificando tu pago
            </p>
          </div>

          {/* Detalles */}
          <div className="bg-[#f8f5ef] rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-[#9a98a0]">Monto</span>
              <span className="font-bold text-[#233274]">S/ {amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a98a0]">Destino</span>
              <span className="font-bold text-[#233274]">{yapeNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a98a0]">Tu número</span>
              <span className="font-bold text-[#233274]">+51 {phoneNumber}</span>
            </div>
          </div>

          {/* Nota */}
          <div className="bg-[#f8f5ef] border-l-4 border-[#e15f0b] p-4 rounded">
            <p className="text-sm text-[#d14a00]">
              <strong>Importante:</strong> Asegúrate de haber enviado el Yape antes de confirmar.
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#233274] to-[#1a2555] hover:from-[#1a2555] hover:to-[#1a2555] text-[#f8f5ef] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando pago...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirmar Pago
                </>
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full border-2 border-[#9a98a0] hover:bg-[#f8f5ef] text-[#233274] font-semibold py-3 rounded-xl transition-all"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </PaymentModal>
  );
};

export default YapeModal;