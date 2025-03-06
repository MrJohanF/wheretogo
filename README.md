# Place Discovery & Booking Platform

A modern platform for discovering, reviewing, and booking places like restaurants, venues, and attractions.

## 🌟 Features

- **User Management**
  - User authentication and profile management
  - Session tracking and activity monitoring
  - Personalized preferences and settings

- **Place Discovery**
  - Comprehensive place listings with detailed information
  - Categories and subcategories for easy navigation
  - Advanced search functionality with search history
  - Location-based services with latitude/longitude support

- **Reviews & Ratings**
  - User reviews and ratings system
  - Detailed comments and feedback
  - Rating aggregation

- **Booking System**
  - Reservation management
  - Special requests handling
  - Booking status tracking

- **Favorites & Personalization**
  - Save favorite places
  - Category favorites
  - Personalized recommendations

## 🛠️ Technical Stack

- **Backend Framework**: [Your Framework]
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: [Your Auth Solution]

## 📦 Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-project-name]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:

DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: User accounts and profiles
- **Places**: Venue/location information
- **Categories/Subcategories**: Hierarchical classification
- **Reviews**: User feedback and ratings
- **Reservations**: Booking management
- **Features**: Place attributes and amenities

## 🔐 Environment Variables

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
# Add other required environment variables
```

## 🚀 Deployment

[Add deployment instructions specific to your hosting platform]

## 📝 API Documentation

[Add API documentation or link to your API docs]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

[Add your license information]

## 👥 Authors

- MrJohanF

## 🙏 Acknowledgments

- List any resources, libraries, or inspiration you used

## 📞 Support

[Add support contact information or links]

## 🔧 Local Development Setup

### Setting up HTTPS for Local Development

When testing API calls locally, you'll need HTTPS. The easiest way to achieve this is using `local-ssl-proxy`.

1. Install the proxy globally:
```bash
npm install -g local-ssl-proxy
```

2. Start your Next.js development server:
```bash
npm run dev
# or
yarn dev
```

3. In a separate terminal, run the SSL proxy:
```bash
local-ssl-proxy --source 3443 --target 3000
```

4. Access your app at:
```
https://localhost:3443
```

> **Why is this needed?**
> - Some APIs require HTTPS connections, even in development
> - The proxy creates a secure HTTPS connection while your app runs on regular HTTP
> - This setup prevents "Mixed Content" errors when making API calls
> - No need to modify your Next.js configuration

> **Note**: Your browser might show a security warning because the certificate is self-signed. This is normal for local development and can be safely ignored.


