# Lara's Kitchen

_It's now easier than ever - scan in the restaurant, order for delivery, or even as a guest. No stress, just good food._

Lara's Kitchen is a modern food ordering platform that allows customers to browse menus, place orders for delivery or pickup, and enjoy a seamless dining experience whether they're dining in, ordering online, or visiting as a guest.

## Features

- **QR Code Menu Scanning** - Scan and order directly from your table
- **Online Ordering** - Browse menu and order for delivery or pickup
- **Guest Ordering** - No account required for quick orders
- **Real-time Order Tracking** - Track your order from kitchen to delivery
- **Menu Management** - Dynamic menu with daily specials and seasonal items
- **Payment Integration** - Secure payment processing
- **Responsive Design** - Optimized for mobile, tablet, and desktop

## Tech Stack

This React project was built using Vite for optimal development experience and fast builds.

- **Build Tool**: Vite v7.1.2 [Learn more here](https://vitejs.dev/guide/)
- **Frontend Framework**: React v19.1.1
- **Styling**: Tailwind
- **State Management**: Redux
- **HTTP Client**: Axios, RTK Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SmartApproaches/Lara-s-Kitchen-Frontend.git
   cd Lara-s-Kitchen-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── assets/             # Static assets (images, icons)
├── components/         # Reusable UI components (buttons, modals, inputs, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page-level components (Home, Menu, Checkout, etc.)
├── redux/              # Redux store setup
│   ├── slices/         # Feature-based slices (cart, user, menu, orders, etc.)
│   ├── store.js        # Central Redux store configuration
│   └── rootReducer     # Combines all reducers
├── services/           # API services (Axios setup, endpoints)
├── styles/             # Global styles (custom CSS)
├── utils/              # Helper functions (formatters, validators, constants)
├── App.tsx             # Root application component
└── main.tsx            # App entry point (ReactDOM + Redux Provider)
```

## Deployment

### Production Build

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Preview the build locally**
   ```bash
   npm run preview
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Lara's Kitchen** - Making good food accessible, one order at a time. 🍽️
