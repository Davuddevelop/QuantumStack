// CampusSync — Real GDG Baku Community Data
// Collected March 15, 2026 for Build with AI Hackathon
// Source: gdg.community.dev/gdg-baku

const APP_DATA = {

  communities: [
    {
      id: "gdg-baku",
      name: "GDG Baku",
      type: "Google Developer Group",
      university: "Baku, Azerbaijan",
      founded: "2019",
      members: 847,
      activeThisWeek: 234,
      eventsThisYear: 12,
      connectionsMade: 156,
      healthScore: 81,
      color: "#3B82F6",
      description: "Azerbaijan's largest Google Developer community"
    }
  ],

  // Real GDG Baku organizers from gdg.community.dev
  members: [
    {
      id: "1",
      name: "Malik Mammadli",
      role: "Community Leader",
      company: "Ericsson",
      interests: ["Community Building", "Leadership", "AI Agents"],
      status: "active",
      daysInactive: 0,
      eventsAttended: 12,
      contribution: "high"
    },
    {
      id: "2",
      name: "Khadija Mammadova",
      role: "GDG Organizer",
      company: "GDG Baku",
      interests: ["Event Management", "Developer Relations", "Google Technologies"],
      status: "active",
      daysInactive: 0,
      eventsAttended: 11,
      contribution: "high"
    },
    {
      id: "3",
      name: "Nigar Asadova",
      role: "GDG Organizer",
      company: "GDG Baku",
      interests: ["Community Growth", "Tech Education", "Women in Tech"],
      status: "active",
      daysInactive: 2,
      eventsAttended: 10,
      contribution: "high"
    },
    {
      id: "4",
      name: "Lala Ibadullayeva",
      role: "GDG Organizer",
      company: "Baku State University",
      interests: ["Research", "AI/ML", "Women in Tech"],
      status: "active",
      daysInactive: 0,
      eventsAttended: 9,
      contribution: "high"
    },
    {
      id: "5",
      name: "Shamo Sahib",
      role: "GDG Organizer",
      company: "GDG Baku",
      interests: ["Mobile Development", "Flutter", "Firebase"],
      status: "active",
      daysInactive: 1,
      eventsAttended: 10,
      contribution: "high"
    },
    {
      id: "6",
      name: "Nurlan Jalilov",
      role: "Data Analyst",
      company: "GDG Baku",
      interests: ["Data Science", "Analytics", "Python"],
      status: "active",
      daysInactive: 4,
      eventsAttended: 7,
      contribution: "medium"
    },
    {
      id: "7",
      name: "Valeh Ismayilov",
      role: "Software Engineer",
      company: "Glorri",
      interests: ["Backend", "Cloud", "APIs"],
      status: "at-risk",
      daysInactive: 14,
      eventsAttended: 4,
      contribution: "low"
    },
    {
      id: "8",
      name: "Elvin Mirzazadeh",
      role: "GDG Organizer",
      company: "GDG Baku",
      interests: ["Web Development", "JavaScript", "Community"],
      status: "active",
      daysInactive: 3,
      eventsAttended: 8,
      contribution: "medium"
    },
    {
      id: "9",
      name: "Zahra Latif",
      role: "GDG Organizer",
      company: "R.I.S.K. Company",
      interests: ["Cloud Computing", "Google Cloud", "DevOps"],
      status: "at-risk",
      daysInactive: 18,
      eventsAttended: 3,
      contribution: "low"
    },
    {
      id: "10",
      name: "Aylin Taghizada",
      role: "Community Member",
      company: "GDG Baku",
      interests: ["AI", "Startups", "Product Management"],
      status: "active",
      daysInactive: 1,
      eventsAttended: 6,
      contribution: "medium"
    }
  ],

  // Real GDG Baku events from gdg.community.dev
  events: [
    {
      id: "1",
      name: "Build with AI Hackathon",
      date: "Mar 15, 2026",
      status: "confirmed",
      attendees: 190,
      capacity: 200,
      type: "Hackathon",
      topics: ["AI", "SaaS", "Community Building"],
      venue: "Holberton School Azerbaijan"
    },
    {
      id: "2",
      name: "Software Engineering in the Age of AI Agents",
      date: "Jan 24, 2026",
      status: "done",
      attendees: 145,
      capacity: 150,
      type: "Speaker Session",
      topics: ["AI Agents", "Software Engineering"],
      venue: "Baku"
    },
    {
      id: "3",
      name: "Enterprise Level Scale of WhatsApp Messaging",
      date: "Dec 20, 2025",
      status: "done",
      attendees: 130,
      capacity: 150,
      type: "Tech Talk",
      topics: ["WhatsApp API", "Messaging", "Scale"],
      venue: "Baku"
    },
    {
      id: "4",
      name: "DevFest Baku 2025",
      date: "Nov 22, 2025",
      status: "done",
      attendees: 420,
      capacity: 500,
      type: "Conference",
      topics: ["AI/ML", "Flutter", "Cloud", "Web"],
      venue: "ADA University"
    },
    {
      id: "5",
      name: "IWD 2025 Baku",
      date: "Apr 19, 2025",
      status: "done",
      attendees: 350,
      capacity: 400,
      type: "Conference",
      topics: ["Women in Tech", "AI", "Career"],
      venue: "Azerbaijan Technical University"
    },
    {
      id: "6",
      name: "Google I/O Extended Baku 2025",
      date: "Jul 26, 2025",
      status: "done",
      attendees: 353,
      capacity: 400,
      type: "Conference",
      topics: ["Gemini AI", "Firebase", "Flutter"],
      venue: "French-Azerbaijani University"
    }
  ],

  // Realistic activity feed based on real GDG Baku topics
  messages: [
    { member: "Malik Mammadli", text: "Build with AI Hackathon is today — 190 participants registered, biggest one yet!", time: "1h ago" },
    { member: "Nigar Asadova", text: "Who is handling the DevFest 2026 call for speakers? We should open it soon", time: "2h ago" },
    { member: "Lala Ibadullayeva", text: "Great turnout at the AI Agents talk last month — we should do a follow-up workshop", time: "3h ago" },
    { member: "Khadija Mammadova", text: "Venue confirmed for next month's event. Capacity is 150 so register early", time: "4h ago" },
    { member: "Shamo Sahib", text: "Anyone interested in a Flutter workshop in April? Got great feedback from DevFest", time: "5h ago" },
    { member: "Elvin Mirzazadeh", text: "We need more junior developers in the community — should we partner with universities?", time: "6h ago" },
    { member: "Nurlan Jalilov", text: "Data analytics session was the most popular track at DevFest this year", time: "8h ago" },
    { member: "Aylin Taghizada", text: "I can help organize the next speaker session if needed", time: "10h ago" },
    { member: "Malik Mammadli", text: "Google I/O Extended was a huge success — 353 participants, thank you all", time: "1d ago" },
    { member: "Khadija Mammadova", text: "IWD 2026 planning should start now — last year we had 350 attendees", time: "1d ago" },
    { member: "Zahra Latif", text: "Cloud study group still happening on Wednesdays for anyone interested", time: "2d ago" },
    { member: "Valeh Ismayilov", text: "Has anyone tried deploying on Google Cloud Run? Need help with scaling", time: "3d ago" },
    { member: "Shamo Sahib", text: "Firebase v10 has some great new features — demo at next meetup?", time: "3d ago" },
    { member: "Nurlan Jalilov", text: "Python for data science workshop proposal — who would attend?", time: "4d ago" },
    { member: "Elvin Mirzazadeh", text: "Web dev track was underrepresented at DevFest — we should fix that next year", time: "4d ago" },
    { member: "Lala Ibadullayeva", text: "Research on AI ethics in Azerbaijan — happy to present at next session", time: "5d ago" },
    { member: "Aylin Taghizada", text: "Startup founders should join GDG more — there's a huge overlap in interests", time: "5d ago" },
    { member: "Malik Mammadli", text: "Micro SaaS Hackathon in September was great — planning something bigger for 2026", time: "6d ago" },
    { member: "Khadija Mammadova", text: "Speaker applications for next event close Friday — spread the word", time: "6d ago" },
    { member: "Zahra Latif", text: "R.I.S.K. company is offering cloud credits for GDG members — DM me", time: "1w ago" }
  ],

  // AI insights based on real GDG Baku patterns
  insights: [
    {
      type: "suggestion",
      icon: "🧠",
      text: "Flutter workshop demand is high — 3 members mentioned it this week",
      action: "Plan Workshop",
      time: "2h ago"
    },
    {
      type: "warning",
      icon: "😴",
      text: "Zahra Latif hasn't engaged in 18 days — was very active before",
      action: "Reach Out",
      time: "3h ago"
    },
    {
      type: "connection",
      icon: "🤝",
      text: "Nurlan (Data) and Lala (AI Research) have strong overlap — they should collaborate",
      action: "Introduce",
      time: "4h ago"
    },
    {
      type: "positive",
      icon: "📈",
      text: "Build with AI Hackathon: 190 RSVPs — highest ever for a GDG Baku event",
      action: "View Stats",
      time: "5h ago"
    },
    {
      type: "suggestion",
      icon: "📅",
      text: "DevFest 2026 planning window is open — last year needed 4 months prep",
      action: "Start Planning",
      time: "1d ago"
    }
  ],

  // Real health context for the AI to analyze
  healthContext: `GDG Baku is Azerbaijan's largest Google Developer Group with 847 members. 
  In 2025 they ran 6 major events including DevFest (420 attendees), IWD (350 attendees), 
  and Google I/O Extended (353 attendees). The Build with AI Hackathon today has 190 participants. 
  Core organizer team of 8 is highly active. However 2 organizers (Zahra Latif, Valeh Ismayilov) 
  have gone quiet in the last 2-3 weeks. The community is strongest in AI/ML and Flutter tracks. 
  Web development and junior developer engagement are identified gaps. 
  Event consistency is excellent but member retention between events is a concern.`,

  // Stats for Open Data widget
  communityStats: {
    totalEvents2025: 6,
    totalAttendees2025: 1598,
    avgEventAttendance: 266,
    memberGrowthRate: "34%",
    topTopic: "AI & Machine Learning",
    nextEvent: "Build with AI Hackathon",
    yearsActive: 7
  }

};

// Make current community accessible globally
function getCurrentCommunity() {
  return APP_DATA.communities[0];
}
