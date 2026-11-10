/**
 * Centralized Verified Portfolio Data for Sindhuja Muthusamy
 * Strictly factual data — no hallucinated stats or invented milestones.
 */

export const personalInfo = {
  name: 'Sindhuja Muthusamy',
  role: '2nd-Year CSE Student • Developer',
  college: 'Rajalakshmi Engineering College (REC)',
  portrait: '/assets/images/sindhuja-portrait.jpg',
  email: 'msindhujaa1@gmail.com',
  resumeUrl: '/docs/Sindhuja_Muthusamy_Resume.pdf',
  socials: {
    linkedin: 'https://www.linkedin.com/in/sindhuja-muthusamy7?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: 'https://github.com/sindhujaamuthusamy72-byte',
    leetcode: 'https://leetcode.com/u/sindhujamuthusamy/',
    blog: 'https://thestudentstacktech.blogspot.com/'
  },
  bio: [
    "A second-year CSE student at REC with a unique story. Though my dream is still to become a cardiologist, I am using Computer Science to build a strong foundation in problem solving. I love taking risks.",
    "I am interested in frontend development, programming, problem solving, hackathons, and exploring new technologies. I enjoy creating things, experimenting with ideas, and documenting what I learn.",
    "My personal interests include coffee, technology, and creative design."
  ],
  keywords: [
    { text: 'Frontend Development', hint: 'Crafting responsive, editorial web interfaces with React and clean CSS.' },
    { text: 'Problem Solving', hint: 'Daily algorithmic practice on LeetCode with C, Java, and Python.' },
    { text: 'Hackathons', hint: 'SRM Designathon Top 10 finalist and SIH 2026 internal qualifier.' },
    { text: 'Coffee', hint: 'The fuel behind late-night deep-work and debugging sessions.' },
    { text: 'Creative Design', hint: 'Editorial layouts, intentional whitespace, and cinematic typography.' }
  ]
};

export const academicJourney = [
  {
    chapter: '01',
    grade: '10th Grade',
    year: '2023',
    score: '488 / 500',
    distinctions: [
      'School 3rd Rank',
      'Centum in Science (100/100)',
      'Finalist in Trichy Way to Success Examination'
    ],
    narrative: 'A foundational milestone establishing academic consistency and deep curiosity for scientific inquiry.'
  },
  {
    chapter: '02',
    grade: '11th Grade',
    year: '2024',
    score: '586 / 600',
    distinctions: [
      'School 2nd Rank',
      'District 2nd Rank',
      'Only Physics Centum (1 of 700+ Students)',
      'IIT-Oriented CS Path'
    ],
    narrative: 'Stood as the only student among 700+ peers to achieve a perfect 100/100 in Physics, choosing Computer Science with an IIT-oriented academic trajectory.'
  },
  {
    chapter: '03',
    grade: '12th Grade',
    year: '2025',
    score: '594 / 600',
    distinctions: [
      'School 1st Rank (School Topper)',
      'TNEA Cutoff: 198',
      'JEE Main: 92 Percentile',
      'Missed JEE Advanced Qualification by 1 Mark'
    ],
    narrative: 'Finished as School Topper with 594/600 and a 198 TNEA cutoff, alongside a 92 percentile in JEE Main, securing admission into REC Computer Science.'
  },
  {
    chapter: '04',
    grade: 'First Year • REC',
    year: '2025–2026',
    score: '9.6 CGPA',
    distinctions: [
      'Rajalakshmi Engineering College (CSE)',
      'First-Year Academic Standing: 9.6 CGPA',
      'Won Yaazh Tamil Mandram Collegiate Tamil Quiz (₹1,000 Prize)'
    ],
    narrative: 'Transitioned to university life at Rajalakshmi Engineering College, achieving a 9.6 CGPA while winning the collegiate Tamil Quiz organized by Yaazh Tamil Mandram.'
  },
  {
    chapter: '05',
    grade: 'Second Year • REC (Current)',
    year: '2026',
    score: 'Craft & Hackathons',
    distinctions: [
      'SRM Designathon: Top 10 among 80+ Teams',
      'SIH 2026 Internal Hackathon Qualifier',
      'Focused Problem Solving & Algorithmic Practice'
    ],
    narrative: 'Sharpening core programming craft, tackling hackathons, and qualifying through the internal Smart India Hackathon 2026 with RakshaNet.'
  }
];

export const featuredAchievement = {
  title: 'Hintro Campus Leader Program 2.0',
  role: 'Campus Leader',
  rank: '2nd Place Winner',
  prize: '₹900 Cash Prize',
  peopleOnboarded: '120+',
  workshopAttendees: '60+',
  honors: [
    'Recognised with the prestigious title "Innovator"',
    'Received Official Letter of Recommendation',
    'Conducted interactive technical workshop for 60+ first-year students',
    'Successfully onboarded 120+ students onto the Hintro AI platform'
  ],
  description: 'Demonstrated high-impact student engagement, technical community outreach, and peer mentorship by introducing first-year engineering students to AI productivity tools.'
};

export const otherAchievements = [
  {
    category: '24-HOUR HACKATHON',
    title: 'SRM Designathon',
    highlight: 'Top 10 / 80+ Teams',
    description: 'Finalist standing in a high-intensity 24-hour designathon competing against 80+ multidisciplinary teams.'
  },
  {
    category: 'NATIONAL HACKATHON',
    title: 'SIH Internal Hackathon 2026',
    highlight: 'Qualified Team (RakshaNet)',
    description: "Qualified through Rajalakshmi Engineering College's competitive internal hackathon (Problem Statement ID: 26043)."
  },
  {
    category: 'ACADEMIC EXCELLENCE',
    title: 'School Topper & District Rank',
    highlight: '594/600 • 9.6 CGPA',
    description: '12th Grade School Topper (594/600), 11th Grade District 2nd Rank (Physics Centum), and 9.6 CGPA in college first year.\nJEE Main 2025: 92 Percentile.'
  },
  {
    category: 'COLLEGIATE COMPETITION',
    title: 'Yaazh Tamil Mandram Quiz',
    highlight: '1st Place • ₹1,000 Prize',
    description: 'First prize winner in the Yaazh Tamil Mandram collegiate Tamil Quiz at REC.'
  }
];

export const projects = [
  {
    id: 'rakshanet',
    title: 'RakshaNet',
    status: 'IN PROGRESS',
    context: 'Smart India Hackathon 2026 Internal Qualifier',
    problemId: 'Problem Statement ID: 26043',
    image: '/Screenshot 2026-11-11 023009.png',
    subtitle: 'Crowdsourcing Societal Challenges & University-Industry Collaboration',
    overview: 'A digital platform designed to crowdsource real-world societal challenges and establish an active tripartite collaboration between citizens, universities, and industries.',
    workflow: [
      'Citizens or government departments report verified societal challenges onto the platform.',
      'Universities review, evaluate, and accept challenges for student and faculty research sprints.',
      'Industries view accepted projects and collaborate directly with academic teams to co-develop production solutions.'
    ],
    tags: ['Societal Impact', 'Tripartite Architecture', 'SIH 2026', 'Platform Engineering']
  },
  {
    id: 'rec-voice',
    title: 'REC Voice',
    status: 'CONCEPT PLATFORM',
    context: 'Campus Governance & Communication',
    problemId: 'Student Voice & Feedback',
    githubUrl: 'https://github.com/sindhujaamuthusamy72-byte/REC-VOICE',
    image: '/Screenshot 2026-11-11 022652.png',
    subtitle: 'Student Feedback & Transparent Campus Voting System',
    overview: 'A structured concept platform designed to foster constructive dialogue between the student body and college administration through transparent feedback collection, verified upvoting, and administrative resolution tracking.',
    workflow: [
      'Students propose constructive feedback, facility requests, and campus ideas.',
      'Peers verify and upvote issues to surface critical campus-wide priorities.',
      'Administration reviews prioritized items and updates ticket statuses with transparent progress.'
    ],
    tags: ['Campus Tech', 'Voting Mechanics', 'Feedback Loop', 'Transparency']
  },
  {
    id: 'debug-diary',
    title: 'Debug Diary',
    status: 'DEVELOPER TOOL',
    context: 'Engineering Knowledge Base',
    problemId: 'Developer Journal',
    githubUrl: 'https://github.com/sindhujaamuthusamy72-byte/Sindhu-s-debug-diary',
    image: '/Screenshot 2026-11-11 023228.png',
    subtitle: 'Systematic Developer Error & Insight Journal',
    overview: 'A developer learning journal created to systematically document coding errors, debugging patterns, root cause analyses, and key lessons discovered across diverse programming languages.',
    workflow: [
      'Capture stack traces, anomalous behaviors, and environmental constraints.',
      'Document root cause diagnosis and failed vs. successful resolution attempts.',
      'Catalog reusable troubleshooting insights to accelerate future engineering cycles.'
    ],
    tags: ['Developer Experience', 'Knowledge Management', 'Debugging Patterns']
  },
  {
    id: 'number-guessing-game',
    title: 'Number Guessing Game',
    status: 'BUILT',
    context: 'Foundational Systems & C Logic',
    problemId: 'Algorithmic Control Flow',
    image: '/Screenshot 2026-11-11 023110.png',
    subtitle: 'Algorithmic Randomness & Constraint-Based Console Game',
    overview: 'A console-based logic game developed in C to master core programming building blocks: pseudo-random number generation, input validation loops, attempt counter state management, and conditional branching.',
    workflow: [
      'Initialize seed using system clock and generate bounded pseudo-random target values.',
      'Validate user input streams against boundary conditions and type safety.',
      'Provide dynamic directional hints (Higher / Lower) based on remaining attempt limits.'
    ],
    tags: ['C Programming', 'Random Generation', 'Control Flow', 'Console Logic']
  }
];

export const experienceRoles = [
  {
    id: 'hintro',
    role: 'Campus Leader',
    organization: 'Hintro AI',
    program: 'Hintro Campus Leader Program 2.0',
    badge: '2nd Place & Innovator',
    details: [
      'Led campus outreach and student engagement to introduce university peers to Hintro AI tools.',
      'Organized and conducted a hands-on technical workshop for 60+ first-year engineering students.',
      'Successfully onboarded 120+ active individuals onto the Hintro platform.',
      'Awarded 2nd place overall, ₹900 cash prize, Letter of Recommendation, and the "Innovator" title.'
    ]
  },
  {
    id: 'student-stack',
    role: 'Technical Content Writer',
    organization: 'The Student Stack',
    program: 'Technical Publication',
    badge: 'thestudentstacktech.blogspot.com',
    link: 'https://thestudentstacktech.blogspot.com/',
    details: [
      'Author beginner-friendly technical articles covering programming, frontend web architecture, AI productivity tools, and computer science fundamentals.',
      'Break down complex topics such as HTTP request lifecycles and browser rendering engines into accessible guides.',
      'Foster a culture of learning by explaining concepts clearly for fellow undergraduate students.'
    ]
  },
  {
    id: 'yrc',
    role: 'Technical Member',
    organization: 'Youth Red Cross (YRC)',
    program: 'Rajalakshmi Engineering College Chapter',
    badge: 'Campus Service',
    details: [
      'Support technical coordination, digital documentation, and operational workflows for campus service events.',
      'Collaborate with student volunteers on organizing humanitarian and health awareness drives at REC.'
    ]
  },
  {
    id: 'elite-coders',
    role: 'Campus Ambassador',
    organization: 'Elite Coders Summer of Code',
    program: 'Developer Community Outreach',
    badge: 'Community Ambassador',
    details: [
      'Represented the student developer community to share open-source summer programming opportunities.',
      'Encouraged peers to participate in open-source repositories, Git collaboration, and collaborative coding.'
    ]
  }
];

export const codingData = {
  languages: [
    { name: 'C', level: 'Foundations & Console Logic' },
    { name: 'Java', level: 'Object-Oriented Programming & DSA' },
    { name: 'JavaScript', level: 'Modern ES6+ & Reactive Web' },
    { name: 'Python', level: 'Scripting & Problem Solving' }
  ],
  areas: [
    'Data Structures & Algorithms',
    'Algorithmic Problem Solving',
    'Frontend Development',
    'Web Architecture'
  ],
  metrics: [
    { label: 'LeetCode Problems Solved', value: '200+', highlight: false },
    { label: 'Active Coding Days', value: '120+', highlight: false },
    { label: 'College-Wide Rank at REC', value: '#5', sub: '/ 3800+', highlight: true }
  ],
  profiles: {
    leetcode: 'https://leetcode.com/u/sindhujamuthusamy/',
    github: 'https://github.com/sindhujaamuthusamy72-byte'
  }
};

export const publishedArticles = [
  {
    title: 'Beyond ChatGPT: 11 AI Tools Every College Student Must Explore in 2026',
    category: 'AI & PRODUCTIVITY TOOLS • 2026',
    readTime: '6 min read',
    excerpt: 'A curated guide exploring modern AI tools for note-taking, academic research, code assistance, and productivity workflows tailored for university students.',
    url: 'https://thestudentstacktech.blogspot.com/2026/09/beyond-chatgpt-11-ai-tools-every-college-student-must-explore-in-2026.html#more'
  },
  {
    title: 'What Really Happens When You Open a Website? The Journey From Browser to Database',
    category: 'WEB ARCHITECTURE FUNDAMENTALS',
    readTime: '5 min read',
    excerpt: 'A beginner-friendly breakdown of what happens behind the scenes when you enter a URL—covering DNS resolution, TCP handshakes, TLS encryption, HTTP request lifecycles, and how browser rendering engines construct the DOM and CSSOM.',
    url: 'https://thestudentstacktech.blogspot.com/2026/09/what-really-happens-when-you-open-a-website.html#more'
  }
];

export const skillCategories = [
  {
    title: 'Programming Languages',
    skills: ['C', 'Java', 'JavaScript', 'Python']
  },
  {
    title: 'Frontend Development',
    skills: ['HTML5', 'CSS3 / Vanilla CSS', 'React.js', 'Tailwind CSS']
  },
  {
    title: 'Backend & Databases',
    skills: ['Firebase', 'Backend Development (Exploring)']
  },
  {
    title: 'DevOps & Developer Tools',
    skills: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Canva', 'Flutter', 'n8n']
  },
  {
    title: 'Core Competencies & Interests',
    skills: [
      'Data Structures & Algorithms',
      'Problem Solving',
      'Frontend Development',
      'Web Development',
      'Hackathons',
      'Technical Writing',
      'Creative Design'
    ]
  }
];

