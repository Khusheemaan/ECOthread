# ECOthread Loop

A sustainable fashion platform that promotes circular fashion through AI-powered styling, repair guidance, and a marketplace for pre-loved garments.

## 🌱 About ECOthread Loop

ECOthread Loop is a comprehensive platform designed to combat fast fashion waste by encouraging circular fashion practices. Users can track their garments' lifecycle, get AI-powered outfit suggestions, learn repair techniques, and participate in a marketplace for swapping and reselling pre-loved clothing.

### Key Features

- **👕 Wear**: AI-powered outfit suggestions and styling inspiration
- **🧵 Care**: Repair guides and fabric care advice
- **🔄 Share**: Marketplace for swapping and reselling garments
- **📍 Loop Path**: Track the complete lifecycle of your garments
- **👤 Profile**: Personal dashboard with style preferences
- **🛒 Cart & Orders**: Full e-commerce functionality
- **🤖 AI Assistant**: Gemini-powered chat for fashion advice

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database for user data and garments
- **Google Gemini AI** - AI-powered chat and outfit suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecothread-loop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:
   ```env
   API_KEY=your_google_gemini_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   ```

   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - For MongoDB, you can use MongoDB Atlas (cloud) or a local instance

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
ecothread-loop/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── views/             # Main application views
│   │   ├── WearView.tsx   # Outfit suggestions
│   │   ├── CareView.tsx   # Repair guides
│   │   ├── ShareView.tsx  # Marketplace
│   │   ├── LoopPathView.tsx # Garment lifecycle tracking
│   │   ├── ProfileView.tsx # User profile
│   │   ├── OrdersView.tsx  # Order history
│   │   └── CartView.tsx   # Shopping cart
│   ├── services/          # API services
│   │   ├── geminiService.ts # Gemini AI integration
│   │   └── userService.js   # User management
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── server.js              # Backend server (Express)
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Features in Detail

### AI-Powered Styling (Wear)
- Get creative outfit combinations for your existing garments
- Pinterest-style inspiration powered by Google Gemini
- Focus on sustainable re-wear practices

### Repair & Care Guides
- Step-by-step repair tutorials
- Fabric care instructions
- Sustainable maintenance tips

### Circular Marketplace (Share)
- Buy and sell pre-loved garments
- Swap clothes with other users
- Track garment history and authenticity

### Garment Lifecycle Tracking
- Document your clothes' journey from purchase to disposal
- Record repairs, swaps, and restyling
- Build a personal fashion archive

### AI Chat Assistant
- Get answers about circular fashion
- Ask for styling advice
- Learn about sustainable fashion practices

## 🔧 API Endpoints

The backend provides the following endpoints (when server.js is implemented):

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/garments` - Get marketplace garments
- `POST /api/garments` - List a garment for sale/swap
- `GET /api/orders` - Get user orders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Mission

ECOthread Loop aims to reduce textile waste by making circular fashion accessible and enjoyable. Through technology and community, we're building a future where fashion is sustainable, creative, and circular.

---

Made with ❤️ for a sustainable fashion future
