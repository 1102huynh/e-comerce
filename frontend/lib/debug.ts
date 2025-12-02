/**
 * Debug helper - thêm vào console để test
 *
 * Chạy:
 * window.__testCheckout()
 */

const debugHelper = function() {
  console.log('=== 🧪 CHECKOUT TEST DEBUG ===');

  // Check localStorage
  console.log('\n📦 LocalStorage:');
  console.log('  token:', localStorage.getItem('token') ? `✅ ${localStorage.getItem('token')!.substring(0, 20)}...` : '❌ NOT FOUND');
  console.log('  user:', localStorage.getItem('auth-storage') ? '✅ FOUND' : '❌ NOT FOUND');

  // Check Zustand store
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  console.log('\n🏪 Zustand Store (auth-storage):');
  console.log('  state:', authStorage.state);
  console.log('  user:', authStorage.state?.user ? `✅ ${authStorage.state.user.email}` : '❌ NOT FOUND');
  console.log('  token:', authStorage.state?.token ? `✅ ${authStorage.state.token.substring(0, 20)}...` : '❌ NOT FOUND');

  // Check Cart
  console.log('\n🛒 Cart (localStorage):');
  const cart = localStorage.getItem('cart');
  console.log('  cart:', cart ? `✅ ${cart.length} bytes` : '❌ NOT FOUND');

  console.log('\n✅ Debug test complete');
};

// Attach to window for easy access
if (typeof window !== 'undefined') {
  (window as any).__testCheckout = debugHelper;
  // Auto-run on load
  debugHelper();
}

export { debugHelper };

