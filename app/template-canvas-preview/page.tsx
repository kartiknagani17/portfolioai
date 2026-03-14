"use client"
import TemplateCanvas from "@/components/templates/TemplateCanvas"
import type { PortfolioData } from "@/types/portfolio"

const MOCK_DATA: PortfolioData = {
  personal: {
    fullName: "Dr. Priya Nair",
    professionalTitle: "Associate Professor of Computational Neuroscience",
    email: "p.nair@mit.edu",
    phone: "+1 (617) 555-0294",
    location: "Cambridge, MA",
    bio: "I study how the brain encodes time and uncertainty. My lab builds computational models of hippocampal circuitry to understand episodic memory formation — work that sits at the intersection of cognitive neuroscience, machine learning, and dynamical systems theory.",
    linkedinUrl: "https://linkedin.com/in/priyanair",
    githubUrl: "https://github.com/priyanair-lab",
    websiteUrl: "https://nairlab.mit.edu",
    profilePhotoUrl: null,
  },
  experience: [
    {
      companyName: "MIT — Department of Brain & Cognitive Sciences",
      roleTitle: "Associate Professor",
      startDate: "2020-07",
      endDate: "",
      isCurrent: true,
      location: "Cambridge, MA",
      description:
        "Lead the Nair Computation & Memory Lab. 8 graduate students and 3 postdocs. Research funded by NIH R01, Simons Foundation, and a 2022 Sloan Research Fellowship. Teach undergraduate Computational Neuroscience (enrollment 140) and graduate Theoretical Frameworks in Memory.",
    },
    {
      companyName: "Stanford University — Wu Tsai Neurosciences Institute",
      roleTitle: "Postdoctoral Fellow",
      startDate: "2017-09",
      endDate: "2020-06",
      isCurrent: false,
      location: "Stanford, CA",
      description:
        "Developed recurrent neural network models of place cell remapping under Dr. Lisa Giocomo. Produced two first-author Nature Neuroscience papers and a collaborative paper in Cell.",
    },
    {
      companyName: "University of Edinburgh — School of Informatics",
      roleTitle: "PhD Researcher",
      startDate: "2013-09",
      endDate: "2017-08",
      isCurrent: false,
      location: "Edinburgh, UK",
      description:
        "Dissertation: 'Temporal Coding in Hippocampal-Entorhinal Circuits: A Dynamical Systems Approach.' Supervised by Prof. Mark van Rossum. Rotations in electrophysiology and fMRI acquisition.",
    },
    {
      companyName: "Indian Institute of Technology Madras",
      roleTitle: "Research Assistant — Computational Biology Lab",
      startDate: "2011-06",
      endDate: "2013-07",
      isCurrent: false,
      location: "Chennai, India",
      description:
        "Undergraduate and Masters research on spike-timing-dependent plasticity models. Co-authored two conference papers at NeurIPS and COSYNE.",
    },
  ],
  projects: [
    {
      projectName: "Hippocampal Time Cells: A Unified Model",
      description:
        "Multi-year theoretical and experimental collaboration modelling how hippocampal 'time cells' encode elapsed time during memory episodes. Published in Nature Neuroscience (2023, IF 24.9). 180+ citations in first year. Code and datasets fully open-sourced.",
      techStack: ["Python", "NumPy", "JAX", "Brian2", "fMRI Analysis", "Electrophysiology"],
      liveUrl: "https://nairlab.mit.edu/time-cells",
      githubUrl: "https://github.com/priyanair-lab/time-cells",
    },
    {
      projectName: "MemoryBench — Open Evaluation Suite",
      description:
        "An open benchmark suite for evaluating memory models across 14 canonical cognitive tasks. Adopted by 23 labs worldwide. Maintained as a living tool with community contributions. Featured at NeurIPS 2022 Datasets & Benchmarks track.",
      techStack: ["Python", "PyTorch", "Docker", "GitHub Actions"],
      liveUrl: "https://memorybench.org",
      githubUrl: "https://github.com/memorybench/memorybench",
    },
    {
      projectName: "Uncertainty & Episodic Memory",
      description:
        "NIH R01-funded project investigating how the brain represents and propagates uncertainty during memory encoding and retrieval. Combines Bayesian modelling with 7T fMRI in human participants. Two papers in prep for Nature Human Behaviour.",
      techStack: ["Bayesian Modelling", "7T fMRI", "Stan", "R", "FreeSurfer"],
      liveUrl: "https://nairlab.mit.edu/uncertainty",
      githubUrl: "",
    },
    {
      projectName: "NeuroML Primer — Open Course",
      description:
        "Free online course (MIT OpenCourseWare) introducing machine learning concepts to neuroscience graduate students with no prior CS background. 18,000 students enrolled across 90 countries since launch in 2021.",
      techStack: ["Jupyter", "Python", "MIT OpenCourseWare"],
      liveUrl: "https://ocw.mit.edu/neuroml-primer",
      githubUrl: "https://github.com/priyanair-lab/neuroml-primer",
    },
  ],
  skills: [
    { name: "Computational Modelling", category: "Research Methods" },
    { name: "Dynamical Systems Theory", category: "Research Methods" },
    { name: "Bayesian Inference", category: "Research Methods" },
    { name: "Electrophysiology", category: "Research Methods" },
    { name: "fMRI Analysis", category: "Research Methods" },
    { name: "Python", category: "Programming" },
    { name: "JAX / NumPy", category: "Programming" },
    { name: "PyTorch", category: "Programming" },
    { name: "R / Stan", category: "Programming" },
    { name: "MATLAB", category: "Programming" },
    { name: "Grant Writing", category: "Academic Skills" },
    { name: "Peer Review", category: "Academic Skills" },
    { name: "Mentorship", category: "Academic Skills" },
    { name: "Curriculum Design", category: "Academic Skills" },
  ],
  education: [
    {
      institution: "University of Edinburgh",
      degree: "Doctor of Philosophy",
      fieldOfStudy: "Computational Neuroscience",
      startYear: "2013",
      endYear: "2017",
    },
    {
      institution: "IIT Madras",
      degree: "Master of Science",
      fieldOfStudy: "Computational Biology",
      startYear: "2011",
      endYear: "2013",
    },
    {
      institution: "IIT Madras",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Electrical Engineering",
      startYear: "2007",
      endYear: "2011",
    },
  ],
  certifications: [
    {
      name: "Sloan Research Fellowship",
      issuer: "Alfred P. Sloan Foundation",
      date: "2022",
      relevance: "Awarded to outstanding early-career scientists in the US and Canada",
    },
    {
      name: "NIH R01 — Principal Investigator",
      issuer: "National Institutes of Health",
      date: "2021",
      relevance: "5-year grant: Temporal and Uncertainty Representations in Episodic Memory",
    },
  ],
  languages: [
    { language: "English", proficiency: "Fluent" },
    { language: "Tamil", proficiency: "Native" },
    { language: "Hindi", proficiency: "Conversational" },
  ],
  interests: [
    "Carnatic music (vocalist)",
    "Distance swimming",
    "Science communication",
    "Open-source neuroscience tooling",
    "Philosophy of mind",
  ],

  // AI-generated personality fields
  tagline: "Building the mathematics of how the brain remembers.",
  careerStory:
    "Priya started as an electrical engineer who couldn't stop thinking about the brain. She migrated into computational biology at IIT Madras, then crossed the Atlantic to Edinburgh for a PhD in neuroscience — where she discovered that the most interesting questions live at the boundary between math and biology. A Stanford fellowship refined her experimental instincts. Now at MIT, she runs a lab that builds theories of memory precise enough to be wrong — and learns something important every time they are.",
  workStyle:
    "Priya thinks in models first, experiments second. She insists that a theory worth testing should make uncomfortable predictions — if your model only explains what you already know, it isn't doing enough work. She structures her lab around radical transparency: all code is open-sourced, all data is shared on publication, and failed experiments are written up and posted. She believes the next big breakthrough in memory research will come from someone who reads both Hopfield and Tulving before breakfast.",
  lookingFor:
    "Priya is open to sabbatical collaborations, keynote invitations, and industry research partnerships — particularly with labs working on memory-augmented AI systems. She is not looking to leave academia, but is deeply interested in work that builds bridges between biological and artificial memory.",
}

export default function TemplateCanvasPreview() {
  return <TemplateCanvas portfolioData={MOCK_DATA} />
}
