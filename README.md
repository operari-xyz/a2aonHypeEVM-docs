# HyperEVM USDT0 Facilitator - Documentation Site

A modern, interactive documentation website for the HyperEVM USDT0 Facilitator service built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, responsive interface with dark/light themes
- **Interactive API Docs**: Live code examples with copy-to-clipboard functionality
- **Comprehensive Examples**: TypeScript, React, and Node.js implementation examples
- **Security Guidelines**: Detailed security best practices and considerations
- **Deployment Guide**: Docker, PM2, and cloud deployment instructions
- **Mobile Responsive**: Optimized for all device sizes

## 📋 Pages

- **Homepage**: Overview, key features, and quick start guide
- **API Reference**: Complete API documentation with examples
- **Examples**: Code examples for different programming languages and frameworks
- **Security**: Security considerations and best practices
- **Deployment**: Step-by-step deployment guide

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Docker, PM2, or any Node.js hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd facilitator-docs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API documentation page
│   ├── examples/          # Code examples page
│   ├── security/          # Security guidelines page
│   ├── deployment/        # Deployment guide page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── APICard.tsx        # API endpoint card component
│   ├── CodeBlock.tsx      # Code block with copy functionality
│   ├── FeatureCard.tsx    # Feature showcase card
│   └── Navigation.tsx     # Main navigation component
└── lib/                   # Utility functions (if needed)
```

## 🎨 Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary color palette
      }
    }
  }
}
```

### Content

- **API Documentation**: Edit `src/app/api/page.tsx`
- **Examples**: Edit `src/app/examples/page.tsx`
- **Security**: Edit `src/app/security/page.tsx`
- **Deployment**: Edit `src/app/deployment/page.tsx`

### Components

All reusable components are in the `src/components/` directory and can be customized as needed.

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t facilitator-docs .

# Run container
docker run -p 3000:3000 facilitator-docs
```

### PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "facilitator-docs" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 📝 Content Management

The documentation content is managed through React components. To update:

1. **API Documentation**: Modify the `endpoints` array and examples in `src/app/api/page.tsx`
2. **Code Examples**: Update the code blocks in `src/app/examples/page.tsx`
3. **Security Guidelines**: Edit the security practices in `src/app/security/page.tsx`
4. **Deployment Instructions**: Update deployment steps in `src/app/deployment/page.tsx`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint with Next.js recommended rules. Code is formatted using Prettier (if configured).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions about the documentation site, please:

1. Check the existing documentation
2. Search for existing issues
3. Create a new issue with detailed information

---

Built with ❤️ for the HyperEVM USDT0 Facilitator project.
