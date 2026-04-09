// ========================================
// 第五週作業：電商資料處理系統
// ========================================

// ========== 提供的資料結構 ==========

// 產品資料
const products = [
  { id: 'prod-1', title: '經典白T', category: '衣服', origin_price: 500, price: 399, images: 'https://example.com/t1.jpg' },
  { id: 'prod-2', title: '牛仔褲', category: '褲子', origin_price: 1200, price: 899, images: 'https://example.com/p1.jpg' },
  { id: 'prod-3', title: '帆布鞋', category: '鞋子', origin_price: 1800, price: 1299, images: 'https://example.com/s1.jpg' },
  { id: 'prod-4', title: '棒球帽', category: '配件', origin_price: 350, price: 299, images: 'https://example.com/h1.jpg' },
  { id: 'prod-5', title: '運動外套', category: '衣服', origin_price: 2000, price: 1599, images: 'https://example.com/j1.jpg' }
];

// 購物車資料
const carts = [
  { id: 'cart-1', product: products[0], quantity: 2 },
  { id: 'cart-2', product: products[2], quantity: 1 },
  { id: 'cart-3', product: products[4], quantity: 1 }
];

// 訂單資料
const orders = [
  {
    id: 'order-1',
    createdAt: 1704067200, // Unix timestamp
    paid: false,
    total: 2097,
    user: { name: '王小明', tel: '0912345678', email: 'ming@example.com', address: '台北市信義區', payment: 'ATM' },
    products: [
      { ...products[0], quantity: 2 },
      { ...products[2], quantity: 1 }
    ]
  },
  {
    id: 'order-2',
    createdAt: 1704153600,
    paid: true,
    total: 899,
    user: { name: '李小華', tel: '0923456789', email: 'hua@example.com', address: '台中市西區', payment: 'Credit Card' },
    products: [
      { ...products[1], quantity: 1 }
    ]
  }
];

// ========================================
// 任務一：產品查詢模組 (基礎)
// ========================================

/**
 * 1. 根據 ID 查詢產品
 * @param {Array} products - 產品陣列
 * @param {string} productId - 產品 ID
 * @returns {Object|null} - 回傳產品物件，找不到回傳 null
 */
function getProductById(products, productId) {
  /*
  a || b: 當 a 為真值，回傳 a，否則回傳 b
  a && b: 當 a 為假值，回傳 a，否則回傳 b
  a ?? b: 當 a 為 undefined 或 null，回傳 b，否則回傳 a
  */
  return products.find((item) => item.id === productId) || null;
}

/**
 * 2. 根據分類篩選產品
 * @param {Array} products - 產品陣列
 * @param {string} category - 分類名稱
 * @returns {Array} - 回傳符合分類的產品陣列，若 category 為 '全部' 則回傳全部產品
 */
function getProductsByCategory(products, category) {
  return (category === "全部") ? (products) : (products.filter((item) => item.category === category));
}

/**
 * 3. 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 回傳折扣百分比，例如 '8折' 或 '79折'
 * 計算方式：Math.round((price / origin_price) * 100) / 10
 */
function getDiscountRate(product) {
  return `${Math.round((product.price / product.origin_price) * 100) / 10}折`
}

/**
 * 4. 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 回傳分類陣列，例如 ['衣服', '褲子', '鞋子', '配件']
 */
function getAllCategories(products) {
  // 透過 new Set() 將重複的值移除但保留順序
  /*
  Array.from(可迭代物件) 跟 [...可迭代物件] 都能將可迭代物件轉為陣列，
  但 new Array() 不行，因為這只能建立一個新陣列，無法將可迭代物件一個一個取出並放到陣列中
  */
  return Array.from(new Set(products.map((item) => item.category)));
}

// ========================================
// 任務二：購物車計算模組 (中階)
// ========================================

/**
 * 1. 計算購物車原價總金額
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳數字（原價 × 數量 的總和）
 */
function calculateCartOriginalTotal(carts) {
  return carts.reduce((sum, item) => sum + (item.product.origin_price * item.quantity), 0);
}

/**
 * 2. 計算購物車售價總金額
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳數字（售價 × 數量 的總和）
 */
function calculateCartTotal(carts) {
  return carts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

/**
 * 3. 計算總共省下多少錢
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳原價總金額 - 售價總金額
 */
function calculateSavings(carts) {
  return carts.reduce((sum, item) => sum + ((item.product.origin_price - item.product.price) * item.quantity), 0);
}

/**
 * 4. 計算購物車商品總數量
 * @param {Array} carts - 購物車陣列
 * @returns {number} - 回傳所有商品的 quantity 總和
 */
function calculateCartItemCount(carts) {
  return carts.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * 5. 檢查產品是否已在購物車中
 * @param {Array} carts - 購物車陣列
 * @param {string} productId - 產品 ID
 * @returns {boolean} - 回傳 true 或 false
 */
function isProductInCart(carts, productId) {
  return carts.some((item) => item.product.id === productId)
}

// ========================================
// 任務三：購物車操作模組 (進階)
// ========================================

/**
 * 1. 新增商品到購物車
 * @param {Array} carts - 購物車陣列
 * @param {Object} product - 產品物件
 * @param {number} quantity - 數量
 * @returns {Array} - 回傳新的購物車陣列（不要修改原陣列）
 * 如果產品已存在，合併數量；如果不存在，新增一筆
 */
function addToCart(carts, product, quantity) {
  // 因為題目提到不要修改原陣列，所以先宣告一個 newCarts
  let newCarts;
  // 透過展開運算子將購物車陣列作淺拷貝
  /*
  淺拷貝是指只會複製第一層資料，若裡面還有物件或陣列，拷貝後仍會共用相同資料
  */
  newCarts = [...carts];
  // 如果購物車裡面已經有相同產品（product id 相同）就將該產品數量加上 quantity
  if (carts.some((item) => item.product.id === product.id)) {
    // 在新的購物車陣列尋找該產品所在的位置並添加對應數量
    newCarts.find((item) => item.product.id === product.id).quantity += quantity;
  }
  // 如果購物車裡面沒有該產品存在，就將該產品及數量組成物件添加到購物車
  else {
    let newCartId = `cart-${carts.length + 1}`;
    let newCart = {
      id: newCartId,
      product: product,
      quantity: quantity
    };
    newCarts.push(newCart);
  }
  return newCarts
}

/**
 * 2. 更新購物車商品數量
 * @param {Array} carts - 購物車陣列
 * @param {string} cartId - 購物車項目 ID
 * @param {number} newQuantity - 新數量
 * @returns {Array} - 回傳新的購物車陣列，如果 newQuantity <= 0，移除該商品
 */
function updateCartItemQuantity(carts, cartId, newQuantity) {
  /*
  雖然題目沒有要求，但通常建議保留原陣列，回傳新陣列
  */
  const target = carts.find((item) => item.id === cartId);
  // 如果沒有找到對應的購物車項目 ID，就回傳原陣列，也就是不管有沒有找到都回傳陣列
  if (!target) {
    return carts
  }
  else if (newQuantity <= 0) {
    // 從陣列刪除特定元素可透過 filter
    return carts.filter((item) => item.id !== cartId)
  }
  // 從陣列更新特定元素可用 map
  return carts.map(function (item) {
    if (item.id === cartId) {
      return {
        ...item,
        quantity: newQuantity
      }
    }
    else {
      return item
    }
  })
}

/**
 * 3. 從購物車移除商品
 * @param {Array} carts - 購物車陣列
 * @param {string} cartId - 購物車項目 ID
 * @returns {Array} - 回傳移除後的新購物車陣列
 */
function removeFromCart(carts, cartId) {
  // 為了不修改原陣列，所以宣告一個 newCarts
  let newCarts;
  if (carts.find((item) => item.id === cartId)) {
    // 從陣列刪除特定元素可透過 filter
    newCarts = carts.filter((item) => item.id !== cartId);
  }
  else {
    // 透過展開運算子將購物車陣列作淺拷貝
    /*
    淺拷貝是指只會複製第一層資料，若裡面還有物件或陣列，拷貝後仍會共用相同資料
    */
    newCarts = [...carts]; 
  }
  return newCarts
}

/**
 * 4. 清空購物車
 * @returns {Array} - 回傳空陣列
 */
function clearCart() {
  // 建議採用 array.length = 0 而不是 array = []
  /*
  雖然 array.length = 0 跟 array = [] 都能將回傳空陣列，
  但 array = [] 的作法是將變數指向一個新的空陣列，原陣列不變
  如果有其他變數引用原陣列，不會一起清空
  最佳實踐是透過 array.length = 0，除了清空原陣列，也會一併清除所有引用
  */
  carts.length = 0;
  return carts
}

// ========================================
// 任務四：訂單統計模組 (挑戰)
// ========================================

/**
 * 1. 計算訂單總營收
 * @param {Array} orders - 訂單陣列
 * @returns {number} - 只計算已付款 (paid: true) 的訂單
 */
function calculateTotalRevenue(orders) {
  // 將已付款的訂單篩選出來
  const paidOrders = orders.filter((item) => item.paid === true);
  // 宣告一個總營收變數並指定初始值為零
  let totalRevenue = 0;
  /*
  透過雙層迴圈將已付款的訂單累加總營收
  內層：將已付款的訂單中的每一筆產品，其 price 乘以 quantity 的結果都進行累加，添加到總營收
  外層：將每筆已付款的訂單都進行相同過程
  */
  // 迴圈的變數以語意化命名而不是簡單的 x 或 i
  for (const order of paidOrders) {
    // 迴圈的變數以語意化命名而不是簡單的 x 或 i
    for (const product of order.products) {
      totalRevenue += product.price * product.quantity;
    }
  }
  return totalRevenue
}

/**
 * 2. 篩選訂單狀態
 * @param {Array} orders - 訂單陣列
 * @param {boolean} isPaid - true 回傳已付款訂單，false 回傳未付款訂單
 * @returns {Array} - 回傳篩選後的訂單陣列
 */
function filterOrdersByStatus(orders, isPaid) {
  return orders.filter((item) => item.paid === isPaid)
}

/**
 * 3. 產生訂單統計報表
 * @param {Array} orders - 訂單陣列
 * @returns {Object} - 回傳格式：
 * {
 *   totalOrders: 2,
 *   paidOrders: 1,
 *   unpaidOrders: 1,
 *   totalRevenue: 899,
 *   averageOrderValue: 1498  // 所有訂單平均金額
 * }
 */
function generateOrderReport(orders) {
  // 宣告一個總訂單數量變數
  const totalOrders = orders.length;
  // 宣告一個已付款訂單數量變數並指定初始值為零
  let paidOrders = 0;
  // 宣告一個未付款訂單數量變數並指定初始值為零
  let unpaidOrders = 0;
  // 宣告一個總營收變數並指定初始值為零
  let totalRevenue = 0;
  // 宣告一個所有訂單平均金額變數並指定初始值為零
  let averageOrderValue = 0;
  // 宣告一個所有訂單金額變數並指定初始值為零
  let totalOrderValue = 0;

  // 迴圈的變數以語意化命名而不是簡單的 x 或 i
  for (const order of orders) {
    // 宣告一個訂單金額變數並指定初始值為零
    let orderValue = 0;
    // 迴圈的變數以語意化命名而不是簡單的 x 或 i
    for (const product of order.products) {
      // 訂單金額等於產品價格乘以產品數量
      orderValue += product.price * product.quantity;
    }
    // 將該筆訂單金額添加到所有訂單金額
    totalOrderValue += orderValue;

    // 如果該筆訂單已付款，則已付款訂單數量加一，同時將該筆訂單金額添加到總營收
    if (order.paid) {
      paidOrders ++;
      totalRevenue  += orderValue;
    }
    // 如果該筆訂單未付款，則未付款訂單數量加一
    else {
      unpaidOrders ++;
    }
  }

  // 所有訂單平均金額等於所有訂單金額除以總訂單數量，但如果總訂單數量為零則回傳零
  averageOrderValue =  (totalOrders) ? (totalOrderValue / totalOrders) : 0

  return {
    totalOrders,
    paidOrders,
    unpaidOrders,
    totalRevenue,
    averageOrderValue
  }
}

/**
 * 4. 依付款方式統計
 * @param {Array} orders - 訂單陣列
 * @returns {Object} - 回傳格式：
 * {
 *   'ATM': [order1],
 *   'Credit Card': [order2]
 * }
 */
function groupOrdersByPayment(orders) {
  // 宣告一個結果變數並指定初始值為空物件
  const result = {};
  for (const order of orders) {
    // 宣告一個付款方式變數並指定為該訂單的 user 的 payment
    const payment = order.user.payment;
    // 如果結果變數中尚未有該付款方式的屬性，就先指定為空陣列
    if (!result[payment]) {
      result[payment] = [];
    }
    // 將該訂單資料添加到結果變數中該付款方式的屬性陣列
    result[payment].push(order);
  }
  return result
}

// ========================================
// 測試區域（可自行修改測試）
// ========================================

// 任務一測試
console.log('=== 任務一測試 ===');
console.log('getProductById:', getProductById(products, 'prod-1'));
console.log('getProductsByCategory:', getProductsByCategory(products, '衣服'));
console.log('getDiscountRate:', getDiscountRate(products[0]));
console.log('getAllCategories:', getAllCategories(products));

// 任務二測試
console.log('\n=== 任務二測試 ===');
console.log('calculateCartOriginalTotal:', calculateCartOriginalTotal(carts));
console.log('calculateCartTotal:', calculateCartTotal(carts));
console.log('calculateSavings:', calculateSavings(carts));
console.log('calculateCartItemCount:', calculateCartItemCount(carts));
console.log('isProductInCart:', isProductInCart(carts, 'prod-1'));

// 任務三測試
console.log('\n=== 任務三測試 ===');
console.log('addToCart:', addToCart(carts, products[1], 2));
console.log('updateCartItemQuantity:', updateCartItemQuantity(carts, 'cart-1', 5));
console.log('removeFromCart:', removeFromCart(carts, 'cart-1'));
console.log('clearCart:', clearCart());

// 任務四測試
console.log('\n=== 任務四測試 ===');
console.log('calculateTotalRevenue:', calculateTotalRevenue(orders));
console.log('filterOrdersByStatus:', filterOrdersByStatus(orders, true));
console.log('generateOrderReport:', generateOrderReport(orders));
console.log('groupOrdersByPayment:', groupOrdersByPayment(orders));

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
  getProductById,
  getProductsByCategory,
  getDiscountRate,
  getAllCategories,
  calculateCartOriginalTotal,
  calculateCartTotal,
  calculateSavings,
  calculateCartItemCount,
  isProductInCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  calculateTotalRevenue,
  filterOrdersByStatus,
  generateOrderReport,
  groupOrdersByPayment
};
