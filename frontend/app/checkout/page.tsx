'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as apiModule from '@/lib/api';
import { useAuthHydration } from '@/hooks/useAuthHydration';
import { toast } from '@/lib/toast';

const api = apiModule.default;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface FormData {
  shippingAddress: string;
  phone: string;
}

interface PaymentDetails {
  momoPhone: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  paypalEmail: string;
}

interface FormErrors {
  shippingAddress: string;
  phone: string;
}

interface PaymentErrors {
  momoPhone: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  paypalEmail: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuthHydration();

  // State declarations
  const [region, setRegion] = useState('vietnam');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [formData, setFormData] = useState<FormData>({
    shippingAddress: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    shippingAddress: '',
    phone: '',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    momoPhone: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
  });

  const [paymentErrors, setPaymentErrors] = useState<PaymentErrors>({
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

  // Check authentication on mount
  useEffect(() => {
    if (!isHydrated) {
      console.log('⏳ Waiting for auth hydration...');
      return;
    }

    if (!user) {
      console.log('❌ No user found, redirecting to login');
      toast.error('Please login to proceed to checkout');
      router.push('/login');
      return;
    }

    console.log('✅ User authenticated:', user.email);

    // Initialize form with user data
    setFormData({
      shippingAddress: user.address || '',
      phone: user.phone || '',
    });

    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        calculateOrderSummary(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, [isHydrated, user, router]);

  const calculateOrderSummary = (cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    setOrderSummary({ subtotal, shipping, tax, total });
  };

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

    const hasNumbers = /\d/.test(address);
    const hasLetters = /[a-zA-Z]/.test(address);

    if (!hasNumbers && !hasLetters) {
      return 'Address must contain letters or numbers';
    }

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

  const validatePaymentDetails = (): boolean => {
    const newErrors: PaymentErrors = {
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
    return !Object.values(newErrors).some((error) => error !== '');
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

      const response = await api.post('/payments/process', paymentPayload);

      if (response.data.success) {
        toast.success('✅ Payment processed successfully!');
        return true;
      } else {
        toast.error(`❌ Payment failed: ${response.data.message}`);
        return false;
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '❌ Payment processing error. Please try again.'
      );
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
      return [
        { id: 'cod', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank account transfer' },
        { id: 'card', label: 'Mastercard / Visa', icon: '💳', desc: 'Secure credit or debit card payment' },
        { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Fast and secure PayPal payment' },
      ];
    }
  };

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const methods = newRegion === 'vietnam' ? ['cod', 'momo', 'bank', 'card'] : ['cod', 'card', 'paypal'];
    if (!methods.includes(paymentMethod)) {
      setPaymentMethod(methods[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('❌ Please fix the errors below before placing your order');
      return;
    }

    if (['momo', 'card', 'paypal'].includes(paymentMethod)) {
      if (!validatePaymentDetails()) {
        toast.error('❌ Please fix the payment details errors');
        return;
      }
    }

    setLoading(true);

    try {
      if (['momo', 'card', 'paypal'].includes(paymentMethod)) {
        const paymentSuccess = await processPayment();
        if (!paymentSuccess) {
          setLoading(false);
          return;
        }
      }

      console.log('📤 Submitting checkout request...');
      console.log('📋 User:', user?.email);
      console.log('📋 Token available:', !!localStorage.getItem('token'));

      await api.post('/orders/checkout', {
        ...formData,
        region,
        paymentMethod,
        paymentDetails: ['momo', 'card', 'paypal'].includes(paymentMethod) ? paymentDetails : null,
        sendInvoice: true,
      });

      toast.success('🎉 Order placed successfully! Invoice sent to your email.');
      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Checkout error:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });

      if (error.response?.status === 403) {
        toast.error('❌ Not authenticated. Please login again.');
        localStorage.clear();
        router.push('/login');
      } else if (error.response?.status === 401) {
        toast.error('❌ Session expired. Please login again.');
        localStorage.clear();
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-white text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
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
            <form
              onSubmit={handleSubmit}
              className="relative bg-gradient-to-br from-gray-900 to-gray-900/80 border-2 border-gray-800 rounded-2xl p-8 shadow-2xl hover:border-gray-700 transition-colors overflow-hidden"
            >
              {/* Region Selection */}
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white mb-6">Delivery Region</h2>
                <div className="space-y-3">
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

                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
                  ℹ️ A detailed invoice will be sent to your email after order confirmation
                </div>
              </div>

              {/* Payment Details - Momo */}
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

              {/* Payment Details - Card */}
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
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cardNumber: e.target.value
                              .replace(/\s/g, '')
                              .replace(/(.{4})/g, '$1 ')
                              .trim(),
                          })
                        }
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
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cvv: e.target.value
                                .replace(/\D/g, '')
                                .slice(0, 4),
                            })
                          }
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

              {/* Payment Details - PayPal */}
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
                  {loading ? '⏳ Processing Payment...' : '✓ Place Order'}
                </button>
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

