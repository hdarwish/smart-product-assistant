# Smart Product Assistant

A full-stack application that helps users find products using natural language search. The application uses OpenAI's GPT model to understand user queries and MongoDB to store and retrieve product information.

## Features

- Natural language product search
- Product browsing with pagination
- Detailed product information
- Modern, responsive UI
- Real-time search results
- Product categorization

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- AI: OpenAI GPT
- Containerization: Docker

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose
- OpenAI API key

## Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://admin:password123@localhost:27017/smart-product?authSource=admin
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-product-assistant
```

2. Start MongoDB using Docker: (make sure not to have local MongoDB service running on same port)
```bash
docker-compose up -d
```

3. Set up the backend:
```bash
cd backend
npm install
npm run dev
```

4. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

5. Frontend Access:
- Open FE url in your browser e.g. http://localhost:3001



## Project Structure

```
smart-product-assistant/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── app.ts         # Main application file
│   ├── .env.example       # Environment variables template
│   ├── package.json       # Project configuration
│   └── tsconfig.json     # TypeScript configuration
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main App component
│   ├── .env.example      # Environment variables template
│   ├── package.json      # Project configuration
│   └── tsconfig.json    # TypeScript configuration
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # Project documentation
```

## API Endpoints

- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/search` - Search products using natural language
- `GET /api/products/:id` - Get product by ID

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Management
```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# View MongoDB logs
docker-compose logs mongodb
```

## LLM Integration Approach

The application uses OpenAI's GPT model to enhance product search capabilities through natural language understanding. Here's how the LLM integration works:

1. **Query Understanding**
   - Users input natural language queries (e.g., "I want a modern blue sofa under $900")
   - The LLM analyzes the query to extract key attributes:
     - Product type (sofa)
     - Style (modern)
     - Color (blue)
     - Price range (under $900)

2. **Query Transformation**
   - The LLM converts natural language into structured search criteria
   - Generates MongoDB query parameters
   - Handles complex requirements and multiple conditions

3. **Context Enhancement**
   - The LLM provides additional context for search results
   - Helps in product categorization
   - Suggests related products based on user preferences

4. **Error Handling**
   - Graceful handling of ambiguous queries
   - Fallback mechanisms for unclear requirements
   - User-friendly error messages and suggestions

## Trade-offs and Future Improvements

### Current Trade-offs

1. **Performance vs. Accuracy**
   - LLM processing adds latency to search requests
   - Balancing response time with search accuracy
   - Caching strategies for common queries

2. **Cost vs. Features**
   - OpenAI API usage costs
   - Balancing feature richness with API consumption
   - Rate limiting and usage optimization

3. **Scalability Considerations**
   - Database query optimization
   - Caching strategies
   - Load balancing for high traffic

### Future Improvements

1. **Technical Enhancements**
   - Implement vector search for better semantic matching
   - Add Redis caching for frequently accessed data
   - Optimize LLM prompt engineering
   - Implement batch processing for bulk operations

2. **Feature Additions**
   - Product recommendations based on user history
   - Image-based search capabilities
   - Voice input support
   - Multi-language support
   - Advanced filtering and sorting options

3. **User Experience**
   - Real-time search suggestions
   - Advanced product comparison tools
   - Personalized search results

4. **Infrastructure**
   - Kubernetes deployment
   - CI/CD pipeline improvements
   - Automated testing expansion
   - Monitoring and analytics

5. **Security**
   - Enhanced authentication
   - Rate limiting improvements
   - Input validation strengthening
   - API key rotation mechanism

