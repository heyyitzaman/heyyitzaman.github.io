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
  },
  {
    id: "blog3",
    title: "A Practical Journey Into System Design",
    author: "Aman Pandey",
    date: "Dec 15, 2025",
    category: "Technology",
    readTime: "12 min read",
    snippet: "A beginner-friendly yet practical walkthrough of system design concepts, mindset, and real-world tradeoffs...",
    full: `
    <p>
      System design is one of those skills that feels intimidating at first — 
      whiteboards, buzzwords, massive diagrams — but at its core, it is simply 
      about <strong>making thoughtful decisions</strong> while building software 
      that can grow.
    </p>

    <p>
      This blog is not about memorizing patterns or copying architectures. 
      It is about developing the <em>thinking process</em> behind system design.
    </p>

    <h3>What Is System Design?</h3>
    <p>
      System design is the process of defining the architecture, components, 
      modules, interfaces, and data flow of a system to meet specific requirements.
      In simpler terms, it answers questions like:
    </p>

    <ul>
      <li>How will the system scale?</li>
      <li>How will data be stored and accessed?</li>
      <li>What happens when something fails?</li>
      <li>How do components communicate?</li>
    </ul>

    <p>
      A good system is not necessarily the most complex one. 
      In fact, most great systems start <strong>simple</strong> and evolve over time.
    </p>

    <h3>Start With Requirements (Always)</h3>
    <p>
      Every system design begins with understanding requirements. 
      Skipping this step leads to overengineering or, worse, the wrong solution.
    </p>

    <p><strong>Functional requirements</strong> define what the system should do:</p>
    <ul>
      <li>User authentication</li>
      <li>Posting content</li>
      <li>Searching data</li>
      <li>Sending notifications</li>
    </ul>

    <p><strong>Non-functional requirements</strong> define how the system behaves:</p>
    <ul>
      <li>Scalability</li>
      <li>Latency</li>
      <li>Availability</li>
      <li>Security</li>
      <li>Maintainability</li>
    </ul>

    <p>
      Clear requirements act as constraints — and constraints make design better.
    </p>

    <h3>High-Level Architecture</h3>
    <p>
      Once requirements are clear, the next step is designing the high-level flow.
      This usually includes:
    </p>

    <ul>
      <li>Client (Web / Mobile)</li>
      <li>Backend services</li>
      <li>Databases</li>
      <li>Caching layers</li>
      <li>External services</li>
    </ul>

    <p>
      At this stage, focus on <em>clarity</em>, not optimization.
      A clean diagram beats a clever one.
    </p>

    <h3>Data Storage Decisions</h3>
    <p>
      Choosing the right database is one of the most critical design decisions.
      There is no universally “best” database — only the right tool for the job.
    </p>

    <ul>
      <li><strong>Relational databases</strong> for structured data and transactions</li>
      <li><strong>NoSQL databases</strong> for high-scale and flexible schemas</li>
      <li><strong>Time-series databases</strong> for metrics and logs</li>
    </ul>

    <p>
      Always ask: <em>How will data grow?</em> and <em>How will it be accessed?</em>
    </p>

    <h3>Scalability: Vertical vs Horizontal</h3>
    <p>
      Scalability defines how a system handles growth.
    </p>

    <p>
      <strong>Vertical scaling</strong> means adding more power to a single machine.
      It is simple but has limits.
    </p>

    <p>
      <strong>Horizontal scaling</strong> means adding more machines.
      This is harder but allows near-infinite growth.
    </p>

    <p>
      Most modern systems are designed to scale horizontally using load balancers
      and stateless services.
    </p>

    <h3>Caching for Performance</h3>
    <p>
      Caching is one of the easiest ways to improve performance.
      It reduces database load and lowers response time.
    </p>

    <ul>
      <li>Client-side caching</li>
      <li>CDN caching</li>
      <li>Server-side caching (Redis, Memcached)</li>
    </ul>

    <p>
      The key challenge with caching is <em>cache invalidation</em>.
      Freshness vs speed is always a tradeoff.
    </p>

    <h3>Handling Failures Gracefully</h3>
    <p>
      Failures are inevitable. Good systems are designed with failure in mind.
    </p>

    <ul>
      <li>Timeouts and retries</li>
      <li>Circuit breakers</li>
      <li>Graceful degradation</li>
      <li>Monitoring and alerts</li>
    </ul>

    <p>
      A system that fails silently is far more dangerous than one that fails loudly.
    </p>

    <h3>Security Considerations</h3>
    <p>
      Security should never be an afterthought.
      Some basic principles include:
    </p>

    <ul>
      <li>Authentication and authorization</li>
      <li>Encrypting data in transit and at rest</li>
      <li>Input validation</li>
      <li>Least privilege access</li>
    </ul>

    <p>
      Simple security practices prevent complex disasters.
    </p>

    <h3>Tradeoffs Are Everywhere</h3>
    <p>
      System design is not about perfect answers — it is about tradeoffs.
      Faster vs cheaper. Simpler vs scalable. Consistency vs availability.
    </p>

    <p>
      A strong system designer can clearly explain:
    </p>

    <ul>
      <li>Why a decision was made</li>
      <li>What was sacrificed</li>
      <li>How the system can evolve</li>
    </ul>

    <h3>Final Thoughts</h3>
    <p>
      Learning system design is a journey, not a checklist.
      Start small, build real systems, observe failures, and iterate.
    </p>

    <p>
      Remember:
      <br>
      <strong>Simplicity scales better than cleverness.</strong>
      <br>
      <em>Design for today, but prepare for tomorrow.</em>
    </p>
  `,
    overviewImage: "images/system_design_latest.gif",
    mainImage: "images/system_design_latest.png",
    references: [
      { text: "System Design Primer", url: "#" },
      { text: "Scalable Backend Architectures", url: "#" },
      { text: "Designing Data-Intensive Applications", url: "#" }
    ]
  },
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

];
