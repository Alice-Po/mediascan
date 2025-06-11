# MédiaScan - News Aggregator MVP

<p align="center">
  <strong> A french news aggregator based on collections of sources edited by humans </strong>
</p>

## Important Notice

🚧 **MVP Stage - Active Development** 🚧

This project is currently a **Minimum Viable Product (MVP)** in very early stages of development. It is specifically designed for the French market and has no internationalization features implemented yet. All user interfaces, documentation, and content are in French.

## Development Setup

Mayby it's a good idea to kill all containers and start fresh : docker kill $(docker ps -a -q)

```bash
# Start all services in development mode
npm run dev:all

# Access points:
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```

### Init MongoDB in local

```bash
# Connect to Atlas
mongosh "mongodb://admin:password@localhost:27017/news_aggregator?authSource=admin"

# Paste the script content
load('mongo-init/mongo-init.js')
```

### MongoDB Express Access

- URL: http://localhost:8081
- Username: dev
- Password: devpassword

### Test on mobile devices

```bash
ngrok http http://localhost:5173
```

### Preview Setup

```bash
npm run preview
```

## Production Setup (MongoDB Atlas)

### Init the database with MongoDB Atlas

```bash
# Connect to Atlas
mongosh "[real url]"

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

## License

MIT licence

---
