import TemplatePulse from "@/components/templates/TemplatePulse"
import type { PortfolioData } from "@/types/portfolio"

const data: PortfolioData = {
  personal: {
    fullName: "Jordan Park",
    professionalTitle: "Senior Data Scientist",
    email: "jordan@jordanpark.io",
    phone: "+1 (415) 822-3947",
    location: "San Francisco, CA",
    bio: "I turn messy data into decisions that ship. Five years building recommendation systems and ML infrastructure at the intersection of research and production — most recently at Spotify, where my models reach 600M listeners.",
    linkedinUrl: "https://linkedin.com/in/jordanpark",
    githubUrl: "https://github.com/jordanpark",
    websiteUrl: "https://jordanpark.io",
    profilePhotoUrl: null,
  },

  tagline: "The model is only as good as the question you asked.",

  careerStory: "I started in computational neuroscience, which means I spent two years teaching a computer to understand how the brain processes sound — then realized I could apply that to music. Spotify found me through an open-source library I built for audio feature extraction. My first production model served 40M users. I broke it twice and fixed it three times, and each time I learned something the papers never told me. Now I'm looking for problems that are genuinely hard and teams smart enough to disagree with me.",

  workStyle: "I believe in shipping fast, measuring carefully, and killing features without sentiment. My notebooks are obsessively documented. I run weekly model reviews, not because I distrust the team, but because I distrust silent drift. I'm most useful when the problem is underspecified and the data is messy.",

  lookingFor: "Staff or Principal Data Scientist at a Series B–D company working on audio, language, or recommendation systems. Strong engineering culture, high data quality standards, and a team that distinguishes between 'the model improved' and 'the metric improved'.",

  experience: [
    {
      companyName: "Spotify",
      roleTitle: "Senior Data Scientist, Recommendations",
      location: "New York, NY (Remote)",
      startDate: "2021",
      endDate: "Present",
      isCurrent: true,
      description: "Built and maintained the contextual bandits framework powering Discover Weekly and Daily Mixes for 600M+ users. Shipped a session-aware ranking model that increased 30-day retention by 8.3%. Led the ML platform migration from Scala to Python-native stack, reducing model iteration time from 3 weeks to 4 days.",
    },
    {
      companyName: "Pandora",
      roleTitle: "Data Scientist",
      location: "Oakland, CA",
      startDate: "2019",
      endDate: "2021",
      isCurrent: false,
      description: "Owned the playlist generation pipeline serving 60M active listeners. Redesigned the audio similarity model using contrastive learning, improving skip rate prediction AUC from 0.71 to 0.84. Reduced cold-start drop-off by 22% through hybrid collaborative + content-based filtering.",
    },
    {
      companyName: "UC Berkeley",
      roleTitle: "Research Associate, Computational Neuroscience",
      location: "Berkeley, CA",
      startDate: "2017",
      endDate: "2019",
      isCurrent: false,
      description: "Modeled auditory cortex response patterns using deep CNNs trained on neural recordings. Published two papers on spectrotemporal feature extraction. Built an open-source Python library (3,400 GitHub stars) for audio signal processing that later became the basis for my work at Spotify.",
    },
  ],

  projects: [
    {
      projectName: "BanditsKit",
      description: "Open-source Python library for contextual bandit algorithms with real-time feedback loops. Used in production at 3 companies. 4,200 GitHub stars.",
      techStack: ["Python", "JAX", "Contextual Bandits", "Online Learning"],
      liveUrl: "https://banditskit.io",
      githubUrl: "https://github.com/jordanpark/banditskit",
    },
    {
      projectName: "AudioEmbed",
      description: "Contrastive learning framework for music audio embeddings. Trained on 80M tracks, outperforms MFCC baselines on genre and mood classification by 19%.",
      techStack: ["PyTorch", "Contrastive Learning", "Audio ML", "Distributed Training"],
      liveUrl: "",
      githubUrl: "https://github.com/jordanpark/audioembed",
    },
    {
      projectName: "Discover Weekly Attribution",
      description: "Causal inference framework to measure the true lift of Spotify's Discover Weekly on long-term user retention. Replaced proxy metrics with a rigorous difference-in-differences model.",
      techStack: ["Causal Inference", "PySpark", "Databricks", "A/B Testing"],
      liveUrl: "",
      githubUrl: "",
    },
    {
      projectName: "Cold Start Resolver",
      description: "Hybrid content + behavioral model for new user onboarding. Reduced cold-start skip rate 22% in 6 weeks A/B test at Pandora, shipped to 60M users.",
      techStack: ["Collaborative Filtering", "Content-Based", "Python", "Airflow"],
      liveUrl: "",
      githubUrl: "",
    },
  ],

  skills: [
    { name: "Python", category: "Languages" },
    { name: "SQL", category: "Languages" },
    { name: "Scala", category: "Languages" },
    { name: "PyTorch", category: "ML Frameworks" },
    { name: "JAX", category: "ML Frameworks" },
    { name: "scikit-learn", category: "ML Frameworks" },
    { name: "Recommendation Systems", category: "Specialties" },
    { name: "Causal Inference", category: "Specialties" },
    { name: "A/B Testing", category: "Specialties" },
    { name: "Databricks", category: "Infrastructure" },
    { name: "Airflow", category: "Infrastructure" },
    { name: "Kubernetes", category: "Infrastructure" },
  ],

  education: [
    {
      degree: "M.S. Computational Neuroscience",
      institution: "UC Berkeley",
      fieldOfStudy: "Auditory Cortex Modeling",
      startYear: "2015",
      endYear: "2017",
    },
    {
      degree: "B.S. Mathematics & Statistics",
      institution: "UCLA",
      fieldOfStudy: "Applied Mathematics",
      startYear: "2011",
      endYear: "2015",
    },
  ],

  certifications: [
    {
      name: "AWS Certified Machine Learning – Specialty",
      issuer: "Amazon Web Services",
      date: "2023",
    },
    {
      name: "Deep Learning Specialization",
      issuer: "Coursera / deeplearning.ai",
      date: "2021",
    },
    {
      name: "Databricks Certified ML Professional",
      issuer: "Databricks",
      date: "2022",
    },
  ],

  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Korean", proficiency: "Native" },
    { language: "Mandarin", proficiency: "Conversational" },
  ],

  interests: [
    "Electronic music production",
    "Long-form podcasts",
    "Trail running",
    "Open source",
    "Generative art",
    "Chess",
    "Fermentation",
    "Science fiction",
  ],
}

export default function Page() {
  return <TemplatePulse portfolioData={data} />
}
