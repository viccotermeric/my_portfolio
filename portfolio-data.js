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
            tech: ["HTML", "CSS", "JavaScript", "MySQL"],
            date: "Recent",
            featured: true,
            challenge: "High-traffic Friday night booking systems often fail gracefully, defaulting to race conditions that grant the same table to multiple reservations.",
            solution: "Built a resilient, real-time reservation engine that lock-steps every timeslot against a highly relational MySQL backend.",
            result: "Guaranteed 100% data persistence before confirmation, completely eliminating zero-sum double-bookings and allowing scale under heavy server pressure.",
            url: "https://github.com/viccotermeric",
            liveUrl: "",
            screenshots: []
        },
        {
            name: "VEDA AI",
            slug: "veda-ai",
            tech: ["React", "Tailwind CSS", "JavaScript", "AI/ML APIs"],
            date: "Hackathon",
            featured: true,
            challenge: "Modern online education platforms hand users static textbook PDFs, failing to personalize learning paths dynamically.",
            solution: "Developed an interactive conversational pipeline wiring a responsive React frontend directly with generative ML APIs to parse complex queries and spawn dynamic topics.",
            result: "Re-envisioned educational structures by automatically summarizing vast data chunks, anticipating prerequisite student questions in real time.",
            url: "https://github.com/The-Knightts/Team-Lossers",
            liveUrl: "",
            screenshots: []
        },
        {
            name: "Weather App",
            slug: "weather-app",
            tech: ["React", "JavaScript", "REST APIs", "Modern CSS"],
            date: "Recent",
            featured: true,
            challenge: "Rendering dense live telemetry data often blocks the main JavaScript thread, lagging the dashboard state.",
            solution: "Architected a reactive CSS layout powered by clean React state hooks pulling from OpenWeatherMap API metrics like temperature and 5-day vectors.",
            result: "Established a highly dynamic dashboard avoiding UI blocking constraints, separating clean component re-renders from expensive dataset polling.",
            url: "https://github.com/viccotermeric/weather-app",
            liveUrl: "",
            screenshots: []
        }
    ],
    hackathons: [],
    talks: [],
    leadership: [
        {
            role: "Vice President",
            org: "Green Club, Thakur Polytechnic",
            period: "2023",
            points: [
                "Spearheaded environmental initiatives and coordinated campus-wide eco-awareness campaigns.",
                "Led a team of student volunteers to organize interactive seminars and tree-plantation drives."
            ]
        },
        {
            role: "Event Coordinator",
            org: "Green Club, Thakur Polytechnic",
            period: "2024",
            points: [
                "Organized and managed logistics for large-scale college technical and cultural events.",
                "Facilitated seamless communication between faculty, vendors, and student participants to ensure successful execution."
            ]
        }
    ],
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
