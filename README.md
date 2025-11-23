# Smart Retail Assistant - Comprehensive Retail Platform

A full-featured frontend retail management platform for non-expiry retail stores. Built with Next.js 14, Tailwind CSS, shadcn/ui, Zustand, and React Hot Toast.

## Features

### Customer Portal
- **Product Browsing**: Browse 50+ products across 10 categories
- **Advanced Search**: Fuzzy search with Fuse.js (search by name, description, category, SKU)
- **Smart Filtering**: Filter by price range, rating, stock status
- **Product Details**: Detailed product pages with images, ratings, related products
- **Shopping Cart**: Add/remove items, update quantities, persistent storage
- **Checkout Flow**: Address entry, payment method selection, order summary
- **Loyalty System**: Earn 1 point per ₹10, redeem for discounts at checkout
- **Order Tracking**: Real-time order status with timeline visualization
- **Account Dashboard**: Profile management, order history, loyalty points tracking

### Offline Retailer Dashboard
- **POS Billing System**: Fast search and add products to cart, real-time inventory deduction
- **Inventory Management**: Update stock levels, view all products with current quantities
- **Stock Audit**: Physical count entry, automatic discrepancy detection
- **Low Stock Alerts**: Real-time monitoring of items below 10 units
- **Theft Detection**: Mock suspicious event tracking with AI risk scoring
- **QR Code Support**: Simulated QR scanning for faster checkout

### Online Retailer Dashboard (Admin)
- **Order Management**: View all orders, filter by status, update order progression
- **Delivery Routes**: Map visualization with optimized delivery sequences
- **Route Assignment**: Organize orders into delivery zones (North, South, East)
- **Label Printing**: Generate delivery labels for orders
- **Returns Management**: Process return requests with approval/rejection workflow
- **Pricing Management**: Compare competitor prices with AI suggestions

### Global Features
- **Dark Mode Toggle**: Full dark/light theme support with persistent preference
- **Cart Abandonment Alert**: 5-minute idle timer with reminder popup
- **Toast Notifications**: Real-time feedback for all user actions
- **Role-Based Access**: Automatic routing based on user role (customer/retailer/admin)
- **Responsive Design**: Mobile-first design for all screen sizes
- **Data Persistence**: localStorage-based cart, orders, and settings persistence

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **Search**: Fuse.js for fuzzy search
- **Notifications**: React Hot Toast
- **Theme**: next-themes for dark mode
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod validation

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.com | 123 |
| Retailer | retailer@test.com | 123 |
| Admin | admin@test.com | 123 |

## Running Locally

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
\`\`\`

Visit `http://localhost:3000` to access the application.

## Project Structure

\`\`\`
app/
├── layout.tsx                          # Root layout with theme provider
├── page.tsx                            # Login/redirect page
├── globals.css                         # Global styles and theme
├── customer/
│   ├── home/                          # Customer home page
│   ├── categories/                    # Category browsing
│   ├── products/[id]/                 # Product details
│   ├── cart/                          # Shopping cart
│   ├── checkout/                      # Checkout flow
│   ├── orders/                        # Order history & tracking
│   └── account/                       # Customer profile
├── retailer/
│   ├── dashboard/                     # Retailer overview
│   ├── pos/                           # POS billing system
│   ├── inventory/                     # Inventory management
│   ├── audit/                         # Stock auditing
│   ├── low-stock/                     # Low stock alerts
│   └── theft-alerts/                  # Theft detection
└── admin/
    ├── dashboard/                     # Admin overview
    ├── orders/                        # Order management
    ├── delivery/                      # Delivery routes
    ├── returns/                       # Returns processing
    └── pricing/                       # Pricing management

components/
├── layout/
│   ├── customer-layout.tsx            # Customer page wrapper
│   ├── retailer-layout.tsx            # Retailer page wrapper
│   └── admin-layout.tsx               # Admin page wrapper
├── auth/
│   └── login-page.tsx                 # Login form
├── theme-provider.tsx                 # Dark mode provider
├── global-search.tsx                  # Fuzzy search component
└── ui/                                # shadcn/ui components

lib/
├── store.ts                           # Zustand store with all state
├── mock-data.ts                       # 50 products across 10 categories
├── mock-api.ts                        # Simulated API delays
└── search.ts                          # Fuse.js search configuration
\`\`\`

## Key Features Explained

### Fuzzy Search
- Powered by Fuse.js
- Searches across: name, description, category, SKU
- Threshold: 0.3 for flexible matching
- Results limited to 5 items in dropdown

### Loyalty Points System
- Earn: 1 point per ₹10 spent
- Redeem: 100 points = ₹1 discount
- Redeemable at checkout or in POS
- Persistent across sessions

### Stock Management
- Real-time inventory tracking
- Automatic low stock alerts (<10 units)
- Stock deduction on POS sales
- Audit mode for physical count verification
- Discrepancy detection and reporting

### Order Lifecycle
1. **Placed** - Order created and confirmed
2. **Packed** - Items prepared for shipment
3. **OTD** (On The Way) - Out for delivery
4. **Delivered** - Order received by customer

### Role-Based Features
- **Customer**: Browse, buy, track orders, manage loyalty
- **Retailer**: POS billing, inventory, stock audit, theft alerts
- **Admin**: Order management, delivery optimization, returns, pricing

## Data Storage

All data is stored in localStorage under the `retail-store` key:
- User authentication (demo mode - no backend)
- Shopping cart contents
- Order history with statuses
- Loyalty points balance
- Inventory levels
- Suspicious events log

## Mock Data

- **50 Products** across 10 categories
- **Realistic Pricing** ranging from ₹49 to ₹999
- **Stock Levels** from 5 to 200 units
- **Ratings** from 4.0 to 4.6 stars
- **Categories**: Household, Stationery, Hardware, Electronics, Clothing, Beauty, Toys, Religious, Kitchenware, Decor

## Testing Scenarios

### Customer Journey
1. Login as customer@test.com
2. Browse categories and search products
3. Add items to cart
4. Proceed to checkout
5. Place order with loyalty points
6. Track order status
7. View order history in account

### Retailer Operations
1. Login as retailer@test.com
2. Use POS to ring up sales
3. View and manage inventory
4. Conduct stock audit
5. Monitor low stock alerts
6. Review theft alerts

### Admin Management
1. Login as admin@test.com
2. View all orders and status
3. Manage delivery routes
4. Process returns
5. Compare and adjust pricing

## Performance Features

- **Skeleton Loaders**: For initial page loads
- **Optimistic Updates**: Instant cart updates
- **Lazy Loading**: Images with fallbacks
- **localStorage Caching**: Reduced network calls
- **Debounced Search**: Efficient fuzzy search
- **Pagination Ready**: Can easily add infinite scroll

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive components
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Dark Mode

- Toggle via theme button in header/sidebar
- System preference detection
- Persistent user preference
- All components optimized for both themes

## Future Enhancements

- Backend API integration
- Real database (PostgreSQL/MongoDB)
- Payment gateway integration (Stripe)
- Email notifications
- SMS updates
- Real map integration for delivery
- Advanced analytics dashboard
- Multi-location support
- Barcode scanning with camera

## Notes

- All data is mocked and stored locally
- No backend server required
- API calls simulated with 200-800ms delays
- All products have placeholder images
- Suitable for MVP/demo purposes

## License

MIT - Built with v0 by Vercel
