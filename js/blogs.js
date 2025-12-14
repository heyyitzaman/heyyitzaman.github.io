// Blog entries
const blogs = [
  {
    id: "blog1",
    title: "Why I Write",
    author: "Aman Pandey",
    date: "Dec 14, 2025",
    category: "Personal Growth",
    readTime: "3 min read",
    snippet: "Writing helps me organize thoughts, reflect on learning, and share ideas...",
    full: `
        <p>Writing helps me organize thoughts, reflect on learning, and share ideas with the world.</p>
        <p>Journaling daily keeps me focused and disciplined.</p>
        <p>In this blog, I’ll share how I developed my writing habit, tools I use, and tips for anyone starting their own journey.</p>
        <p>Some key tips include: <strong>setting a routine</strong>, <em>staying consistent</em>, and <a href="#">tracking progress</a>.</p>
        <ul>
            <li>Start small: 10 minutes/day</li>
            <li>Use a notebook or digital app</li>
            <li>Review weekly</li>
        </ul>
        `,
    overviewImage: "images/writing.gif", // image shown on card
    mainImage: "images/writing.jpg",         // image shown in modal
    references: [
      { text: "My Writing Notebook", url: "#" },
      { text: "Daily Journaling Tips", url: "#" }
    ]
  },
  {
    id: "blog2",
    title: "Learning Systems Design",
    author: "Aman Pandey",
    date: "Dec 10, 2025",
    category: "Technology",
    readTime: "5 min read",
    snippet: "My approach to understanding complex systems and backend architecture...",
    full: `
        <p>Learning systems design is essential for scalable applications.</p>
        <p><strong>Key principle:</strong> Break systems into modular components.</p>
        <p>Remember: <em>simplicity over complexity</em><br>Always keep your users in mind.</p>
        `,
    overviewImage: "images/system_design.gif",
    mainImage: "images/system_design.png",
    references: [
      { text: "System Design Basics", url: "#" },
      { text: "Backend Architecture Patterns", url: "#" }
    ]
  }
];
