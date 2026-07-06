export const portfolioData = {
    about: `I build things that bridge the gap between raw data and scalable infrastructure.\n\nMy formal education is at TCET Mumbai, but my actual learning happens somewhere between architecting full-stack engines that can handle real-time logic for Persian Darbar, and asking myself why a standard REST API is sitting there idling when an optimized data pipeline could do it better.\n\nThat's the mindset that drives my code. Not just: does it compile. But: is it scalable. Building VEDA AI under hackathon pressure taught me what a real generative pipeline demands in production. My MERN and Python internship at Static.Int taught me that managing NoSQL data clusters isn't just about functionality—it's about structural integrity. And optimizing datasets for predictive models taught me that the deepest layers of data architecture are just as fascinating as the frontend dashboards that display them.\n\nI care about the architecture beneath the application. The optimizations that don't show up in a standard README.\n\nBased in Mumbai, India. Open to internships and full-time roles in Data Architecture, Data Engineering, or Full-Stack Engineering—anywhere raw data and reliable systems actually need to talk to each other.`,
    education: [
        { school: "Thakur College of Engineering and Technology (TCET)", degree: "B.E. Computer Engineering", details: "2025 – Present | Mumbai, Maharashtra | Data Structures & Algorithms, Web Development, Database Management, OOP with Java" },
        { school: "Thakur Polytechnic", degree: "Diploma in Information Technology — CGPA: 9.5 / 10", details: "2022 – 2025 | Mumbai, Maharashtra | Programming in C / Java, Web Technologies" },
        { school: "St. Francis D'Assisi High School", degree: "Secondary School Certificate (SSC) — 91.40%", details: "2021 – 2022 | Mumbai, Maharashtra | Mathematics, Science, English" }
    ],
    experience: [
        {
            role: "Python & MERN Stack Intern",
            company: "Static.Int | Mumbai, India",
            period: "June 2024 – July 2024",
            desc: [
                "Architected and developed responsive web applications leveraging the complete MERN stack (MongoDB, Express.js, React.js, Node.js) and Python, optimizing data flow between frontend interfaces and backend logic.",
                "Engineered robust API endpoints and integrated NoSQL databases to facilitate efficient data management, retrieval, and structural integrity across the application lifecycle.",
                "Gained deep practical expertise in full-stack debugging, Git-based version control, and deploying automated collaborative workflows using GitHub."
            ]
        },
        {
            role: "Available for Opportunities",
            company: "Mumbai, India",
            period: "Current",
            desc: [
                "Open to internships and full-time roles in scalable Data Architecture or Full-Stack Engineering."
            ]
        }
    ],
    projects: [
        {
            name: "Persian Darbar",
            slug: "persian-darbar",
            tech: "HTML, CSS, JavaScript, MySQL",
            date: "Recent",
            featured: true,
            desc: [
                "Booking a table sounds simple until you hit Friday night load and race conditions start handing the same table to three different families. That's a consistency problem hiding behind a UX problem.",
                "I built Persian Darbar to handle that stress test. It's a real-time reservation engine that doesn't just show availability, it lock-steps every time slot against a relational MySQL backend so data persistence is guaranteed before the confirmation screen even loads.",
                "A pretty UI is meaningless if the database underneath drops the transaction."
            ],
            url: "https://github.com/viccotermeric",
            liveUrl: "",
            screenshots: []
        },
        {
            name: "VEDA AI",
            slug: "veda-ai",
            tech: "React, Tailwind CSS, JavaScript, AI/ML",
            date: "Hackathon",
            featured: true,
            desc: [
                "Education platforms usually hand you a giant textbook PDF and expect you to map out your own learning path. That's not personalized learning. That's just file hosting.",
                "VEDA AI is what happens when you treat learning as a conversational pipeline rather than a static document. Built under hackathon pressure, I wired together a React frontend with generative ML APIs to parse complex topics, instantly summarize chunks, and dynamically spawn study pathways.",
                "The technology wasn't just there to answer questions. It was there to figure out what questions the student actually needed to ask."
            ],
            url: "https://github.com/The-Knightts/Team-Lossers",
            liveUrl: "",
            screenshots: []
        },
        {
            name: "Weather App",
            slug: "weather-app",
            tech: "React, JavaScript, API, CSS",
            date: "Recent",
            featured: true,
            desc: [
                "Weather data is cheap, but rendering it without blocking the main event thread or lagging the dashboard is exactly the kind of frontend optimization that gets overlooked.",
                "I built this dashboard to pull real-time telemetry from the OpenWeatherMap API—tracking temperature, humidity, and 5-day forecast vectors—and pipe it directly into a highly dynamic, reactive CSS layout.",
                "Simple state management, done well, is what separates a clean application from a bloated one."
            ],
            url: "https://github.com/viccotermeric/weather-app",
            liveUrl: "",
            screenshots: []
        }
    ],
    certifications: [],
    hackathons: [],
    talks: [],
    leadership: [],
    contact: { email: "rtrivedi.data@gmail.com", linkedin: "https://www.linkedin.com/in/rishabh-trivedi-27b3362b2/", github: "https://github.com/viccotermeric" },
    skills: {
        "Data Architecture": ["ETL Pipelines", "Data Warehousing", "Data Modeling", "Database Design"],
        "Data Analytics": ["Power BI", "Tableau", "Advanced Excel", "Statistical Analysis"],
        "Languages": ["Python", "SQL", "Java", "JavaScript"],
        "AI & ML": ["TensorFlow", "PyTorch", "scikit-learn", "Hugging Face"],
        "Data Engineering": ["Apache Spark", "Apache Kafka", "PostgreSQL", "Pandas", "NumPy", "MySQL"],
        "Tools & Cloud": ["AWS", "Git", "GitHub", "Docker", "Jupyter", "Databricks"]
    }
};
