export const initialUserProfile = {
  name: "Arjun Sharma",
  email: "arjun.sharma@iit.ac.in",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  title: "Aspiring AI Engineer & Full Stack Developer",
  bio: "Computer Science final year student passionate about Machine Learning, Neural Networks, and scalable Web Applications. Actively looking for AI Engineer and Software Engineer roles in India & globally.",
  location: "Bangalore, Karnataka (Open to Remote)",
  phone: "+91 98765 43210",
  education: [
    {
      degree: "B.Tech in Computer Science & Artificial Intelligence",
      institution: "IIT Bombay",
      period: "2021 - 2025",
      gpa: "9.1 / 10.0",
      courses: ["Deep Learning", "Data Structures & Algorithms", "Distributed Systems", "Natural Language Processing"]
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Software Engineering Intern",
      company: "Infosys AI Labs",
      location: "Bangalore, Karnataka",
      period: "Jun 2024 - Sep 2024",
      description: "Built microservices using Python & React. Fine-tuned LLM prompts for customer support automation, reducing response latency by 35%."
    },
    {
      id: "exp-2",
      role: "ML Research Assistant",
      company: "IIT Bombay AI Lab",
      location: "Mumbai, Maharashtra",
      period: "Jan 2024 - May 2024",
      description: "Trained PyTorch computer vision models on 500k dataset; improved model accuracy by 4.2% using data augmentation pipelines."
    }
  ],
  skills: [
    "Python", "JavaScript", "React.js", "PyTorch", "Node.js",
    "Tailwind CSS", "Git", "Docker", "REST APIs", "PostgreSQL",
    "Machine Learning", "System Design", "TypeScript", "FastAPI"
  ],
  softSkills: ["Problem Solving", "Team Collaboration", "Technical Writing", "Agile Methodology", "Public Speaking"],
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "https://arjunsharma.dev",
    twitter: "https://twitter.com"
  },
  projects: [
    {
      name: "AI Career Twin Platform",
      description: "AI-powered career mentor platform built with React, Vite, Framer Motion, and Tailwind CSS.",
      tech: ["React", "Tailwind CSS", "Chart.js", "Framer Motion"],
      link: "https://github.com"
    },
    {
      name: "Neural Vision Classifier",
      description: "Real-time image detection API built with PyTorch & FastAPI achieving 94.2% mAP score.",
      tech: ["Python", "PyTorch", "FastAPI", "Docker"],
      link: "https://github.com"
    }
  ],
  certificates: [
    { name: "Deep Learning Specialization - DeepLearning.AI", year: "2024" },
    { name: "AWS Certified Developer Associate", year: "2024" }
  ],
  readinessScore: 88,
  atsScore: 92,
  targetSalary: "₹18,00,000",
  hourlyRate: "₹865 / hr",
  workScaleHours: 40,
  scaleLevel: "L5 Senior Scale",
  weeklyStudyHours: 15,
  totalStudyHoursNeeded: 180,
  studyHoursCompleted: 82,
  targetRole: "Senior AI Engineer"
};

export const careerRecommendations = [
  {
    id: "career-1",
    title: "AI Engineer / ML Specialist",
    category: "Artificial Intelligence",
    matchScore: 95,
    demandGrowth: "+38% YoY",
    avgSalary: "₹18L - ₹28L",
    hourlyRateRange: "₹865/hr - ₹1,346/hr",
    medianSalaryNum: 2200000,
    workHoursPerWeek: 40,
    scaleLevel: "L5 Senior Scale",
    description: "Design, train, and deploy generative AI models and neural networks into scalable cloud environments.",
    requiredSkills: ["PyTorch", "Python", "FastAPI", "LangChain", "Docker", "Vector DBs"],
    matchedSkills: ["PyTorch", "Python", "FastAPI", "Docker"],
    missingSkills: ["LangChain", "Vector DBs (Pinecone/Milvus)"],
    keyResponsibilities: [
      "Develop and fine-tune LLMs and transformer architectures.",
      "Optimize model inference latencies using TensorRT and ONNX.",
      "Integrate vector databases for retrieval-augmented generation (RAG)."
    ]
  },
  {
    id: "career-2",
    title: "Full Stack AI Application Developer",
    category: "Software Engineering",
    matchScore: 91,
    demandGrowth: "+29% YoY",
    avgSalary: "₹15L - ₹24L",
    hourlyRateRange: "₹721/hr - ₹1,154/hr",
    medianSalaryNum: 1900000,
    workHoursPerWeek: 40,
    scaleLevel: "L4 Mid-Senior Scale",
    description: "Bridge the gap between frontend user experiences and complex machine learning backends.",
    requiredSkills: ["React.js", "TypeScript", "Node.js", "Python", "Tailwind CSS", "REST APIs"],
    matchedSkills: ["React.js", "JavaScript", "Node.js", "Python", "Tailwind CSS", "REST APIs"],
    missingSkills: ["TypeScript Mastery", "Next.js App Router"],
    keyResponsibilities: [
      "Build highly interactive React/Next.js user interfaces.",
      "Connect AI service APIs to web applications with real-time streaming.",
      "Design database schemas for high throughput user interactions."
    ]
  },
  {
    id: "career-3",
    title: "Data Scientist / Predictive Analyst",
    category: "Data & Analytics",
    matchScore: 84,
    demandGrowth: "+22% YoY",
    avgSalary: "₹12L - ₹20L",
    hourlyRateRange: "₹577/hr - ₹961/hr",
    medianSalaryNum: 1500000,
    workHoursPerWeek: 40,
    scaleLevel: "L3 Mid Scale",
    description: "Transform complex unstructured datasets into actionable enterprise intelligence and forecasting models.",
    requiredSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau", "Statistics"],
    matchedSkills: ["Python", "Machine Learning", "PostgreSQL"],
    missingSkills: ["SQL Advanced Queries", "Tableau / PowerBI"],
    keyResponsibilities: [
      "Perform exploratory data analysis and hypothesis testing.",
      "Build regression and classification pipelines.",
      "Present executive data dashboards to non-technical stakeholders."
    ]
  },
  {
    id: "career-4",
    title: "MLOps Engineer / Cloud AI Architect",
    category: "Cloud & DevOps",
    matchScore: 78,
    demandGrowth: "+42% YoY",
    avgSalary: "₹20L - ₹35L",
    hourlyRateRange: "₹961/hr - ₹1,682/hr",
    medianSalaryNum: 2700000,
    workHoursPerWeek: 40,
    scaleLevel: "L6 Staff Scale",
    description: "Automate machine learning model training pipelines, monitoring, CI/CD, and Kubernetes orchestration.",
    requiredSkills: ["Kubernetes", "Docker", "AWS/GCP", "MLflow", "Terraform", "CI/CD"],
    matchedSkills: ["Docker", "Git", "Python"],
    missingSkills: ["Kubernetes", "MLflow", "Terraform"],
    keyResponsibilities: [
      "Build scalable CI/CD pipelines for ML model deployments.",
      "Monitor drift, latency, and hardware utilization across clusters.",
      "Manage cloud infrastructure as code using Terraform."
    ]
  }
];

export const atsAnalysisData = {
  overallScore: 92,
  keywordMatchScore: 94,
  formattingScore: 88,
  impactMetricsScore: 86,
  sectionStructureScore: 96,
  summary: "Your resume is highly optimized for AI & Full Stack roles! Minor tweaks to quantitative impact metrics will boost your pass rate to 98%.",
  formattingChecks: [
    { title: "Font & Typography", status: "pass", details: "Standard readable fonts (Inter/Calibri) used cleanly." },
    { title: "Section Headers", status: "pass", details: "Standard headers recognized by standard ATS parsers." },
    { title: "Tables & Columns", status: "pass", details: "Single column clean layout prevents parser misalignments." },
    { title: "Contact Information", status: "pass", details: "Email, phone number, and LinkedIn URL correctly parsed." }
  ],
  keywordAnalysis: [
    { keyword: "Python", type: "Hard Skill", category: "Core AI", density: 8, status: "Optimal" },
    { keyword: "PyTorch", type: "Hard Skill", category: "Framework", density: 5, status: "Optimal" },
    { keyword: "React.js", type: "Hard Skill", category: "Frontend", density: 6, status: "Optimal" },
    { keyword: "Docker", type: "Hard Skill", category: "DevOps", density: 3, status: "Good" },
    { keyword: "LangChain", type: "Hard Skill", category: "GenAI", density: 0, status: "Missing" },
    { keyword: "RAG Architecture", type: "Domain", category: "GenAI", density: 0, status: "Missing" },
    { keyword: "Kubernetes", type: "Hard Skill", category: "DevOps", density: 0, status: "Missing" },
    { keyword: "TypeScript", type: "Hard Skill", category: "Frontend", density: 1, status: "Low" }
  ],
  suggestions: [
    {
      id: "sug-1",
      type: "High Priority",
      title: "Add RAG & Vector Database Keywords",
      description: "Top AI Engineering roles look for RAG architecture, Pinecone, or ChromaDB. Mention how you handle document embeddings.",
      actionText: "Apply Recommended Insert"
    },
    {
      id: "sug-2",
      type: "Medium Priority",
      title: "Quantify Technical Impact in Project #2",
      description: "Replace 'Trained neural network' with 'Trained PyTorch model achieving 94.2% accuracy across 50k test samples'.",
      actionText: "Auto-rewrite Bullet"
    },
    {
      id: "sug-3",
      type: "Low Priority",
      title: "Standardize Certification Titles",
      description: "Add complete credential link or verification code for AWS Developer Associate certification.",
      actionText: "Update Section"
    }
  ]
};

export const salaryPredictionData = {
  currentEstimate: "₹18,00,000",
  rangeMin: "₹15,00,000",
  rangeMax: "₹22,00,000",
  percentile: "Top 15% for Entry/Mid Level AI Engineers in India",
  experienceSliderDefault: 1,
  salaryByExperience: [
    { years: "0 Yrs (Fresher)", salary: 900000 },
    { years: "1 Yr (Current)", salary: 1500000 },
    { years: "2 Yrs", salary: 1800000 },
    { years: "3 Yrs", salary: 2200000 },
    { years: "5 Yrs (Senior)", salary: 3000000 },
    { years: "7+ Yrs (Lead)", salary: 4500000 }
  ],
  salaryByLocation: [
    { location: "Bangalore (Bengaluru)", salary: 2000000, remoteIndex: 1.15 },
    { location: "Mumbai / Navi Mumbai", salary: 1900000, remoteIndex: 1.10 },
    { location: "Hyderabad (HITEC City)", salary: 1750000, remoteIndex: 1.05 },
    { location: "Pune / PCMC", salary: 1600000, remoteIndex: 1.00 },
    { location: "Chennai / OMR", salary: 1500000, remoteIndex: 0.95 },
    { location: "Delhi NCR / Noida", salary: 1700000, remoteIndex: 1.02 }
  ],
  industryBreakdown: [
    { sector: "GenAI & Foundation Model Startups", avg: "₹22,00,000" },
    { sector: "Big Tech / FAANG India (Google, Microsoft, Amazon)", avg: "₹30,00,000" },
    { sector: "Fintech & Quantitative Finance", avg: "₹25,00,000" },
    { sector: "SaaS / B2B Cloud Platforms", avg: "₹18,00,000" },
    { sector: "EdTech & HealthTech AI (Byju's, PharmEasy)", avg: "₹14,00,000" }
  ]
};

export const skillGapData = {
  targetRole: "Senior AI Engineer",
  overallMatch: 85,
  radarComparison: {
    labels: ["Python & PyTorch", "GenAI / RAG", "Frontend (React)", "Backend APIs", "DevOps & Docker", "System Design"],
    userScores: [95, 60, 90, 85, 70, 65],
    targetScores: [90, 90, 75, 90, 85, 85]
  },
  skillsMatrix: [
    { name: "Python & PyTorch", category: "Core AI", currentLevel: 95, targetLevel: 90, gap: "Exceeds Requirement", status: "mastered" },
    { name: "React.js & Tailwind", category: "Frontend", currentLevel: 90, targetLevel: 75, gap: "Exceeds Requirement", status: "mastered" },
    { name: "REST APIs & FastAPI", category: "Backend", currentLevel: 85, targetLevel: 90, gap: "Minor 5% Gap", status: "in-progress" },
    { name: "Docker & Containerization", category: "DevOps", currentLevel: 70, targetLevel: 85, gap: "Moderate 15% Gap", status: "in-progress" },
    { name: "System Design & Microservices", category: "Architecture", currentLevel: 65, targetLevel: 85, gap: "20% Gap", status: "gap" },
    { name: "LangChain & Vector DBs (RAG)", category: "GenAI", currentLevel: 60, targetLevel: 90, gap: "Critical 30% Gap", status: "gap" }
  ],
  actionableRecommendations: [
    {
      skill: "LangChain & Vector Databases",
      priority: "High Priority",
      estimatedTime: "2 Weeks",
      impact: "+8% Career Match",
      recommendedCourse: "Generative AI Engineering with LangChain & Pinecone"
    },
    {
      skill: "System Design for Machine Learning",
      priority: "Medium Priority",
      estimatedTime: "3 Weeks",
      impact: "+5% Salary Estimate",
      recommendedCourse: "ML System Design & Scalable Infrastructure"
    },
    {
      skill: "Kubernetes & Cloud Deployment",
      priority: "Low Priority",
      estimatedTime: "2 Weeks",
      impact: "+3% MLOps Match",
      recommendedCourse: "Docker & Kubernetes Mastery for Developers"
    }
  ]
};

export const learningRoadmapData = {
  targetRole: "Senior AI Engineer",
  totalDuration: "12 Weeks",
  completedPercentage: 45,
  phases: [
    {
      id: "phase-1",
      number: "01",
      title: "Foundations & Core AI Refinement",
      duration: "Weeks 1 - 4",
      status: "Completed",
      description: "Master advanced Python, PyTorch tensor manipulation, and RESTful microservices with FastAPI.",
      milestones: [
        { title: "Deep Dive into PyTorch Autograd & CUDA", completed: true },
        { title: "Build Scalable FastAPI Backend Services", completed: true },
        { title: "Dockerize Full-Stack AI Microservice App", completed: true }
      ],
      courses: [
        { name: "Deep Learning with PyTorch - DeepLearning.AI", provider: "Coursera", link: "#" },
        { name: "FastAPI Complete Web Development", provider: "Udemy", link: "#" }
      ]
    },
    {
      id: "phase-2",
      number: "02",
      title: "Generative AI, LangChain & RAG Architectures",
      duration: "Weeks 5 - 8",
      status: "In Progress",
      description: "Build production-grade retrieval-augmented generation applications with Pinecone and vector embeddings.",
      milestones: [
        { title: "Implement Sentence Transformer Embeddings", completed: true },
        { title: "Build Vector Search Engine with Pinecone", completed: false },
        { title: "Develop RAG Chatbot with Source Citations", completed: false }
      ],
      courses: [
        { name: "LangChain for LLM Application Development", provider: "DeepLearning.AI", link: "#" },
        { name: "Vector Databases & Semantic Search", provider: "Pinecone Academy", link: "#" }
      ]
    },
    {
      id: "phase-3",
      number: "03",
      title: "ML System Design & Enterprise Deployment",
      duration: "Weeks 9 - 12",
      status: "Up Next",
      description: "Scale AI applications, implement load balancing, stream responses, and deploy to Kubernetes.",
      milestones: [
        { title: "Design High-Throughput Model Serving Pipeline", completed: false },
        { title: "Set up Prometheus & Grafana Model Monitoring", completed: false },
        { title: "Deploy AI Twin to AWS EKS Cluster", completed: false }
      ],
      courses: [
        { name: "Machine Learning System Design Interview", provider: "Educative", link: "#" },
        { name: "AWS Cloud Architect & Kubernetes Handbook", provider: "Udemy", link: "#" }
      ]
    }
  ]
};

export const interviewPrepData = {
  readinessScore: 85,
  completedMocks: 4,
  avgFeedbackRating: "4.8 / 5.0",
  categories: [
    { id: "tech", label: "Technical & ML Architecture", count: 18 },
    { id: "hr", label: "HR & Behavioral", count: 12 },
    { id: "coding", label: "Live Coding & Data Structures", count: 25 },
    { id: "sysdesign", label: "System Design", count: 10 }
  ],
  questions: [
    {
      id: "q-1",
      category: "tech",
      difficulty: "Hard",
      question: "How do you mitigate hallucination and latency bottlenecks when implementing a RAG architecture with LLMs?",
      keyPoints: [
        "Use hybrid search (dense vector retrieval + sparse keyword BM25).",
        "Implement re-ranking models (Cohere Rerank) before context injection.",
        "Stream LLM output tokens using Server-Sent Events (SSE).",
        "Apply strict prompt guardrails and source citation validation."
      ],
      sampleAnswer: "To mitigate hallucinations, I structure context injection using semantic similarity thresholds with vector databases. I pass candidate documents through a cross-encoder re-ranker model. For latency, I utilize asynchronous model streaming (SSE) and cache frequently queried embeddings in Redis.",
      aiTip: "Highlight real-world benchmarks from your internship experience!"
    },
    {
      id: "q-2",
      category: "tech",
      difficulty: "Medium",
      question: "Explain the difference between Fine-tuning (LoRA/PEFT) and Retrieval-Augmented Generation (RAG). When would you choose one over the other?",
      keyPoints: [
        "RAG provides real-time dynamic knowledge without retraining model weights.",
        "LoRA adapts model tone, syntax, or domain-specific language patterns.",
        "RAG is cheaper and easier to update; LoRA is better for specialized task formats."
      ],
      sampleAnswer: "RAG is best when source data updates frequently or requires strict provenance. LoRA/PEFT is ideal when modifying the model's internal reasoning style, output format, or specialized domain vocabulary.",
      aiTip: "Mention parameter efficiency and memory trade-offs."
    },
    {
      id: "q-3",
      category: "coding",
      difficulty: "Medium",
      question: "Implement a Least Recently Used (LRU) Cache data structure with O(1) get and put operations in Python.",
      keyPoints: [
        "Use a Hash Map combined with a Doubly Linked List.",
        "Hash Map provides O(1) key lookups.",
        "Doubly Linked List allows O(1) removal and insertion at head/tail."
      ],
      sampleAnswer: "We combine an OrderedDict or custom Doubly Linked List with a dictionary. When accessing a node, move it to the head. When exceeding capacity, pop node from tail.",
      aiTip: "Walk through edge cases like capacity = 1 or duplicate key updates."
    },
    {
      id: "q-4",
      category: "hr",
      difficulty: "Easy",
      question: "Tell me about a time you faced a technical conflict or trade-off during a project deadline. How did you resolve it?",
      keyPoints: [
        "Use the STAR method (Situation, Task, Action, Result).",
        "Focus on collaborative communication and data-driven trade-off analysis.",
        "Show ownership and team alignment."
      ],
      sampleAnswer: "During my internship at Infosys AI Labs, we debated between deploying a larger 70B parameter model vs a 7B model. I conducted latency benchmark tests showing 7B with RAG met SLA requirements at 1/10th the infrastructure cost.",
      aiTip: "Keep the resolution positive and metrics-focused!"
    }
  ]
};

export const reportsData = {
  title: "AI Career Twin — Executive Career Audit Report",
  generatedDate: "July 31, 2026",
  candidateName: "Arjun Sharma",
  targetRole: "Senior AI Engineer",
  summary: "Candidate displays exceptional readiness (88/100) for Senior AI Engineer & Full Stack roles. High proficiency in Python, PyTorch, React, and REST services.",
  keyMetrics: [
    { label: "Overall Career Readiness", value: "88%", badge: "Excellent" },
    { label: "ATS Resume Compatibility", value: "92/100", badge: "Pass Rate 98%" },
    { label: "Estimated Salary Growth", value: "₹18 LPA", badge: "+22% vs Market" },
    { label: "Roadmap Progress", value: "45% Completed", badge: "On Track" }
  ],
  actionPlan: [
    "Complete Phase 2 LangChain & Vector DBs learning modules by Week 8.",
    "Apply ATS suggestions: add RAG & Pinecone keywords to Resume project section.",
    "Schedule 2 Mock Technical Interviews targeting System Design."
  ]
};

export const recentActivities = [
  { id: "act-1", title: "ATS Score Analysis Updated", description: "Score improved from 86 to 92 after resume update.", time: "2 hours ago", icon: "FileText", color: "emerald" },
  { id: "act-2", title: "Completed PyTorch Milestone", description: "Phase 1 - PyTorch Autograd & CUDA milestone marked completed.", time: "Yesterday", icon: "CheckCircle", color: "blue" },
  { id: "act-3", title: "Salary Forecast Calculated", description: "Predicted salary range updated for Bangalore & Remote India.", time: "3 days ago", icon: "IndianRupee", color: "amber" },
  { id: "act-4", title: "Mock Interview Completed", description: "Scored 4.8/5.0 in Technical ML Architecture track.", time: "4 days ago", icon: "Video", color: "violet" }
];

export const recentResumes = [
  { id: 1, filename: 'Resume_Arjun_Sharma.pdf', date: '2024-08-12', atsScore: 92 },
  { id: 2, filename: 'Resume_Priya_Mehta.docx', date: '2024-07-28', atsScore: 88 },
  { id: 3, filename: 'Resume_Rohit_Gupta.pdf', date: '2024-07-05', atsScore: 81 },
];
