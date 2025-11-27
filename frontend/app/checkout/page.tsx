'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [cart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    shippingAddress: '',
    phone: '',
  });
  const [region, setRegion] = useState('vietnam');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    momoPhone: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
  });
  const [paymentErrors, setPaymentErrors] = useState({
    momoPhone: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
  });
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setFormData({
      shippingAddress: user.address || '',
      phone: user.phone || '',
    });

    // Calculate order summary
    const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    setOrderSummary({ subtotal, shipping, tax, total });
  }, [user, cart, router]);

  // Validation functions
  const validatePhone = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');

    if (phone.trim().length === 0) {
      return 'Phone number is required';
    }

    if (cleanPhone.length < 10) {
      return 'Phone number must be at least 10 digits';
    }

    if (cleanPhone.length > 15) {
      return 'Phone number is too long (max 15 digits)';
    }

    if (region === 'vietnam' && !cleanPhone.match(/^(0|84)[0-9]{9,10}$/)) {
      return 'Invalid Vietnamese phone number. Should start with 0 or 84 followed by 9-10 digits';
    }

    if (region === 'europe' && !cleanPhone.match(/^[+]?[0-9]{10,15}$/)) {
      return 'Invalid European phone number. Should be 10-15 digits';
    }

    return '';
  };

  const validateAddress = (address: string): string => {
    if (address.trim().length === 0) {
      return 'Shipping address is required';
    }

    if (address.trim().length < 10) {
      return 'Address is too short (minimum 10 characters)';
    }

    if (address.trim().length > 200) {
      return 'Address is too long (maximum 200 characters)';
    }

    // Check if address contains at least some valid components
    const hasNumbers = /\d/.test(address);
    const hasLetters = /[a-zA-Z]/.test(address);

    if (!hasNumbers && !hasLetters) {
      return 'Address must contain letters or numbers';
    }

    // For Vietnam, encourage specific format
    if (region === 'vietnam' && !address.match(/[0-9].*[a-zA-Z]|[a-zA-Z].*[0-9]/i)) {
      return 'Vietnamese address should include both street number and name';
    }

    return '';
  };

  const handleAddressChange = (value: string) => {
    setFormData({ ...formData, shippingAddress: value });
    if (errors.shippingAddress) {
      setErrors({ ...errors, shippingAddress: validateAddress(value) });
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
    if (errors.phone) {
      setErrors({ ...errors, phone: validatePhone(value) });
    }
  };

  const validateForm = (): boolean => {
    const addressError = validateAddress(formData.shippingAddress);
    const phoneError = validatePhone(formData.phone);

    setErrors({
      shippingAddress: addressError,
      phone: phoneError,
    });

    return !addressError && !phoneError;
  };

  // Payment validation and processing
  const validatePaymentDetails = (): boolean => {
    const newErrors = {
      momoPhone: '',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      paypalEmail: '',
    };

    if (paymentMethod === 'momo') {
      const cleanPhone = paymentDetails.momoPhone.replace(/\D/g, '');
      if (!paymentDetails.momoPhone.trim()) {
        newErrors.momoPhone = 'Momo phone number is required';
      } else if (cleanPhone.length < 10) {
        newErrors.momoPhone = 'Invalid Momo phone number (min 10 digits)';
      } else if (!cleanPhone.match(/^(0|84)[0-9]{9,10}$/)) {
        newErrors.momoPhone = 'Invalid Vietnamese phone format';
      }
    }

    if (paymentMethod === 'card') {
      const cardNum = paymentDetails.cardNumber.replace(/\s/g, '');
      if (!paymentDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNum.length < 13 || cardNum.length > 19) {
        newErrors.cardNumber = 'Card number must be 13-19 digits';
      }

      if (!paymentDetails.cardHolder.trim()) {
        newErrors.cardHolder = 'Card holder name is required';
      } else if (paymentDetails.cardHolder.length < 3) {
        newErrors.cardHolder = 'Card holder name must be at least 3 characters';
      }

      if (!paymentDetails.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required (MM/YY)';
      } else if (!paymentDetails.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        newErrors.expiryDate = 'Invalid format. Use MM/YY';
      }

      if (!paymentDetails.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!paymentDetails.cvv.match(/^\d{3,4}$/)) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    }

    if (paymentMethod === 'paypal') {
      if (!paymentDetails.paypalEmail.trim()) {
        newErrors.paypalEmail = 'PayPal email is required';
      } else if (!paymentDetails.paypalEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.paypalEmail = 'Invalid email address';
      }
    }

    setPaymentErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const processPayment = async (): Promise<boolean> => {
    try {
      const paymentPayload: any = {
        amount: orderSummary.total,
        currency: region === 'vietnam' ? 'VND' : 'EUR',
        paymentMethod,
      };

      if (paymentMethod === 'momo') {
        paymentPayload.momoPhone = paymentDetails.momoPhone;
      } else if (paymentMethod === 'card') {
        paymentPayload.cardNumber = paymentDetails.cardNumber.replace(/\s/g, '');
        paymentPayload.cardHolder = paymentDetails.cardHolder;
        paymentPayload.expiryDate = paymentDetails.expiryDate;
        paymentPayload.cvv = paymentDetails.cvv;
      } else if (paymentMethod === 'paypal') {
        paymentPayload.paypalEmail = paymentDetails.paypalEmail;
      }

      // Call payment processing API
      const response = await api.post('/payments/process', paymentPayload);

      if (response.data.success) {
        toast.success('✅ Payment processed successfully!');
        return true;
      } else {
        toast.error(`❌ Payment failed: ${response.data.message}`);
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '❌ Payment processing error. Please try again.');
      return false;
    }
  };

  const getPaymentMethods = () => {
    if (region === 'vietnam') {
      return [
        { id: 'cod', label: 'Cash on Delivery (COD)', icon: '💵', desc: 'Pay when you receive your order' },
        { id: 'momo', label: 'Momo', icon: '📱', desc: 'Instant mobile wallet payment' },
        { id: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank account transfer' },
        { id: 'card', label: 'Mastercard / Visa', icon: '💳', desc: 'Secure credit or debit card payment' },
      ];
    } else {
      // Europe
      return [
        { id: 'cod', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank account transfer' },
        { id: 'card', label: 'Mastercard / Visa', icon: '💳', desc: 'Secure credit or debit card payment' },
        { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Fast and secure PayPal payment' },
      ];
    }
  };

  // Reset payment method when region changes
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const methods = newRegion === 'vietnam'
      ? ['cod', 'momo', 'bank', 'card']
      : ['cod', 'card', 'paypal'];
    if (!methods.includes(paymentMethod)) {
      setPaymentMethod(methods[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate shipping form before submission
    if (!validateForm()) {
      toast.error('❌ Please fix the errors below before placing your order');
      return;
    }

    // Validate payment details for digital payment methods
    if (['momo', 'card', 'paypal'].includes(paymentMethod)) {
      if (!validatePaymentDetails()) {
        toast.error('❌ Please fix the payment details errors');
        return;
      }
    }

    setLoading(true);

    try {
      // Process payment for digital payment methods
      if (['momo', 'card', 'paypal'].includes(paymentMethod)) {
        const paymentSuccess = await processPayment();
        if (!paymentSuccess) {
          setLoading(false);
          return;
        }
      }

      // Create order after payment is processed/confirmed
      await api.post('/orders/checkout', {
        ...formData,
        region,
        paymentMethod,
        paymentDetails: ['momo', 'card', 'paypal'].includes(paymentMethod) ? paymentDetails : null,
        sendInvoice: true,
      });
      toast.success('🎉 Order placed successfully! Invoice sent to your email.');
      // Redirect to orders page after a short delay to show the success message
      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4 inline-block">💳</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Checkout</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="relative bg-gradient-to-br from-gray-900 to-gray-900/80 border-2 border-gray-800 rounded-2xl p-8 shadow-2xl hover:border-gray-700 transition-colors overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full"></div>

              <div className="relative z-10">
                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center">1</div>
                      <span className="text-sm font-bold text-white">Shipping</span>
                    </div>
                  </div>
                  <div className="flex-1 h-1 bg-white/30"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 font-bold flex items-center justify-center">2</div>
                      <span className="text-sm font-bold text-gray-400">Payment</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-6">Delivery Region</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <label className="flex items-center p-4 bg-gray-800/50 border-2 rounded-lg cursor-pointer transition-all"
                      style={{ borderColor: region === 'vietnam' ? '#ffffff' : '#374151' }}>
                      <input
                        type="radio"
                        name="region"
                        value="vietnam"
                        checked={region === 'vietnam'}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        className="w-4 h-4 accent-white"
                      />
                      <div className="ml-4 flex-1">
                        <p className="text-white font-bold">🇻🇳 Vietnam</p>
                        <p className="text-xs text-gray-400">Southeast Asia</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 bg-gray-800/50 border-2 rounded-lg cursor-pointer transition-all"
                      style={{ borderColor: region === 'europe' ? '#ffffff' : '#374151' }}>
                      <input
                        type="radio"
                        name="region"
                        value="europe"
                        checked={region === 'europe'}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        className="w-4 h-4 accent-white"
                      />
                      <div className="ml-4 flex-1">
                        <p className="text-white font-bold">🇪🇺 Europe</p>
                        <p className="text-xs text-gray-400">European Union</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-6">Shipping Address</h2>
                  <div className="space-y-5">
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3">
                        📍 Street Address <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        value={formData.shippingAddress}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        placeholder="123 Main St, City, State, ZIP"
                        rows={3}
                        className={`w-full px-4 py-4 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all hover:border-gray-600 resize-none ${
                          errors.shippingAddress ? 'border-red-500 hover:border-red-400' : 'border-gray-700'
                        }`}
                      />
                      {errors.shippingAddress && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span> {errors.shippingAddress}
                        </p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">Minimum 10 characters • Maximum 200 characters</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3">
                        📞 Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(123) 456-7890"
                        className={`w-full px-4 py-4 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all hover:border-gray-600 text-white ${
                          errors.phone ? 'border-red-500 hover:border-red-400' : 'border-gray-700'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span> {errors.phone}
                        </p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        {region === 'vietnam'
                          ? '🇻🇳 Format: 0xxxxxxxxxx or 84xxxxxxxxx (10-11 digits)'
                          : '🇪🇺 Format: 10-15 digits (with or without +)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="mb-8 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg flex items-start gap-3">
                  <span className="text-2xl mt-1">🔒</span>
                  <div>
                    <p className="text-sm font-bold text-green-400">Secure Checkout</p>
                    <p className="text-xs text-green-400/80">Your information is encrypted and secured with industry-leading SSL technology</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    {getPaymentMethods().map((method) => (
                      <label key={method.id} className="flex items-center p-4 bg-gray-800/50 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 hover:bg-gray-800 transition-all">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 accent-white"
                        />
                        <div className="ml-4 flex-1">
                          <p className="text-white font-bold">{method.icon} {method.label}</p>
                          <p className="text-xs text-gray-400">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Payment Method Info */}
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
                    ℹ️ A detailed invoice will be sent to your email after order confirmation
                  </div>
                </div>

                {/* Payment Details Forms */}
                {paymentMethod === 'momo' && (
                  <div className="mb-8 p-6 bg-pink-500/10 border-2 border-pink-500/30 rounded-xl">
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                      <span>📱</span> Momo Payment Details
                    </h3>
                    <p className="text-xs text-pink-400 mb-4">Money will be automatically deducted from your Momo wallet</p>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        📞 Momo Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={paymentDetails.momoPhone}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, momoPhone: e.target.value })}
                        placeholder="0912345678"
                        className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all text-white ${
                          paymentErrors.momoPhone ? 'border-red-500' : 'border-gray-700'
                        }`}
                      />
                      {paymentErrors.momoPhone && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span> {paymentErrors.momoPhone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="mb-8 p-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                      <span>💳</span> Card Payment Details
                    </h3>
                    <p className="text-xs text-blue-400 mb-4">Money will be automatically deducted from your card</p>
                    <div className="space-y-4">
                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Card Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                          placeholder="4532 1234 5678 9010"
                          className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all text-white ${
                            paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-700'
                          }`}
                        />
                        {paymentErrors.cardNumber && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                            <span>⚠️</span> {paymentErrors.cardNumber}
                          </p>
                        )}
                      </div>

                      {/* Card Holder */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Card Holder Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.cardHolder}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardHolder: e.target.value })}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all text-white ${
                            paymentErrors.cardHolder ? 'border-red-500' : 'border-gray-700'
                          }`}
                        />
                        {paymentErrors.cardHolder && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                            <span>⚠️</span> {paymentErrors.cardHolder}
                          </p>
                        )}
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-white mb-2">
                            Expiry Date <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length >= 2) {
                                val = val.slice(0, 2) + '/' + val.slice(2, 4);
                              }
                              setPaymentDetails({ ...paymentDetails, expiryDate: val });
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all text-white ${
                              paymentErrors.expiryDate ? 'border-red-500' : 'border-gray-700'
                            }`}
                          />
                          {paymentErrors.expiryDate && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span>⚠️</span> {paymentErrors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-white mb-2">
                            CVV <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all text-white ${
                              paymentErrors.cvv ? 'border-red-500' : 'border-gray-700'
                            }`}
                          />
                          {paymentErrors.cvv && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span>⚠️</span> {paymentErrors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-400">
                      🔒 Your card details are encrypted and secure. We do not store full card information.
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="mb-8 p-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                      <span>🅿️</span> PayPal Payment Details
                    </h3>
                    <p className="text-xs text-blue-400 mb-4">Money will be automatically deducted from your PayPal account</p>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        PayPal Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={paymentDetails.paypalEmail}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, paypalEmail: e.target.value })}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all text-white ${
                          paymentErrors.paypalEmail ? 'border-red-500' : 'border-gray-700'
                        }`}
                      />
                      {paymentErrors.paypalEmail && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span> {paymentErrors.paypalEmail}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <div className="mb-8 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg flex items-start gap-3">
                  <span className="text-2xl mt-1">🔒</span>
                  <div>
                    <p className="text-sm font-bold text-green-400">Secure Checkout</p>
                    <p className="text-xs text-green-400/80">Your information is encrypted and secured with industry-leading SSL technology</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg border-2 border-gray-700 hover:border-gray-600 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-white to-gray-100 text-black font-black py-4 px-6 rounded-lg hover:from-gray-200 hover:to-white disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                  >
                    {loading ? '⏳ Processing Payment...' : `✓ Place Order`}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-800 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item: CartItem) => (
                  <div key={item.id} className="flex justify-between items-start text-sm py-3 border-b border-gray-700 last:border-0">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 py-6 border-y border-gray-700">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (10%)</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className={orderSummary.shipping === 0 ? 'text-green-400 font-bold' : ''}>
                    {orderSummary.shipping === 0 ? 'FREE ✓' : `$${orderSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-black text-white">Total</span>
                  <span className="text-4xl font-black text-white">${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Note */}
              {orderSummary.shipping === 0 && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400 text-center">
                  ✓ Free shipping on this order!
                </div>
              )}

              {/* Continue Shopping */}
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

