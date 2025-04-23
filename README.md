# MédiaScan - News Aggregator MVP

<p align="center">
  <strong>🇫🇷 A French News Aggregation Platform with Advanced Monitoring Features</strong>
</p>

## Important Notice

🚧 **MVP Stage - Active Development** 🚧

This project is currently a **Minimum Viable Product (MVP)** in very early stages of development. It is specifically designed for the French market and has no internationalization features implemented yet. All user interfaces, documentation, and content are in French.

## About The Project

MédiaScan aims to provide an accessible and powerful news monitoring tool for the general public. It combines the simplicity of a news aggregator with advanced monitoring features usually reserved for professional tools.

## Development Setup

```bash
# Start all services in development mode
npm run dev:all

# Access points:
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```

### MongoDB Express Access

- URL: http://localhost:8081
- Username: dev
- Password: devpassword

### Preview Setup

```bash
npm run preview
```

## Production Setup (MongoDB Atlas)

### MongoDB Atlas

```bash
# Connect to Atlas
mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/news_aggregator"

# Paste the script content
load('mongo-init/mongo-init.js')
```

### Render

```bash
# Build the project
npm run render-build

# Start the project
npm run start
```

## Contributing

We welcome contributions in various forms! The project is in its early stages, and your input is valuable.

### Ways to Contribute

1. **Report Issues**

   - Bug reports
   - Feature suggestions
   - UX/UI feedback
   - General discussions

2. **Code Contributions**
   - For substantial contributions, please reach out first
   - Email us via mediascan.alicepoggioli.fr/feebacks to discuss your ideas over coffee ☕

### Support the Project

- Share the application
- Provide feedbacks
- Support us on [Patreon](https://patreon.com/AlicePoggioli)

## License

MIT licence

---
