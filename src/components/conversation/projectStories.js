// Case-study summaries are based on the existing portfolio descriptions.
// Results describe delivered functionality, not unverified business metrics.
// Screenshots: public demo pages (or the local portfolio), captured September 2026.
export const projectStories = {
  1: {
    category: 'Education', steps: ['Teaching materials', 'Course folders', 'University staff'],
    problem: 'Give university staff a way to organize teaching materials by course.',
    contribution: 'A web application for managing and organizing course materials, built as my final-year project.',
    decisions: 'The application uses React, Node.js, Express, and MongoDB as a full-stack MERN implementation.',
    result: 'A course-folder application for university teaching materials.',
  },
  2: {
    category: 'Personal website', steps: ['Choose a question', 'Explore the work', 'Get in touch'],
    image: '/projects/portfolio.jpg', imageLabel: 'Conversation home',
    problem: 'Make it easy for visitors to explore my work, skills, and professional background.',
    contribution: 'This React portfolio, including its prepared conversational replies, project content, and responsive interface.',
    decisions: 'React manages the conversation state. GSAP handles reply reveals and icon motion; prepared content keeps the experience independent of an AI service.',
    result: 'An interactive portfolio with accessible topic navigation, a résumé download, and direct contact links.',
  },
  3: {
    category: 'Operations', steps: ['University assets', 'Inventory records', 'Asset access'],
    problem: 'Organize university inventory and make asset information easier to access.',
    contribution: 'An inventory management application built with the MERN stack.',
    decisions: 'React provides the interface, with Node.js, Express, and MongoDB supporting the application and its records.',
    result: 'A system for managing and organizing university inventory.',
  },
  4: {
    category: 'Real-time messaging', steps: ['Send a message', 'Socket.io', 'Live conversation'],
    image: '/projects/chat.jpg', imageLabel: 'Public sign-in screen',
    problem: 'Support live conversations and show when other users are online.',
    contribution: 'A MERN messaging application with real-time messages and online user status.',
    decisions: 'Socket.io supplies the real-time messaging layer alongside React, Node.js, Express, and MongoDB.',
    result: 'A chat application with live messaging and online presence.',
  },
  5: {
    category: 'Booking', steps: ['Car services', 'Booking platform', 'Limousine services'],
    image: '/projects/limousine.jpg', imageLabel: 'Public sign-in screen',
    problem: 'Provide a web platform for booking luxury limousine and car services.',
    contribution: 'A full-stack MERN application for Royal Falcon Limousine.',
    decisions: 'The platform uses React for the interface with Node.js, Express, and MongoDB behind it.',
    result: 'A web application for limousine and car-service bookings.',
  },
  6: {
    category: 'Commerce', steps: ['Admin operations', 'Brand portals', 'Products & inventory'],
    demoUnavailable: true,
    problem: 'Support the different operational needs of administrators and brands in one application.',
    contribution: 'Admin and brand portals for managing operations, products, inventory, and sales.',
    decisions: 'Separate admin and brand portals organize the workflows within a shared MERN-stack application.',
    result: 'Web portals supporting both platform administration and brand operations.',
  },
  7: {
    category: 'Real estate', steps: ['Google sign-in', 'Property search', 'Manage listings'],
    image: '/projects/estate.jpg', imageLabel: 'Property discovery home',
    problem: 'Let people search properties and manage real-estate listings through a web application.',
    contribution: 'A MERN real-estate platform with property search, listing management, and Google authentication.',
    decisions: 'Firebase handles Google authentication alongside the React, Node.js, Express, and MongoDB stack.',
    result: 'A real-estate application combining authentication, advanced property search, and listing management.',
  },
};

export const featuredProjectIds = [7, 4, 6];
