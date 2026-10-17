import { CompanyInfo } from '../types';

export const BRANDED_COMPANIES: CompanyInfo[] = [
  {
    id: 'google',
    name: 'Google (Alphabet)',
    logoBadge: 'G',
    tagline: 'Organize the world’s information and make it universally accessible and useful.',
    accentColor: 'from-blue-600 to-red-500',
    difficulty: 'Very Hard',
    avgTurnaroundWeeks: '4 to 8 weeks',
    interviewStyle: 'Data Structures & Algorithms rigor, System Design at scale, Googleyness & Leadership, calibrated by an independent Hiring Committee.',
    keyHiringPillars: [
      { name: 'General Cognitive Ability (GCA)', description: 'How you learn, process ambiguity, ask clarifying questions, and solve unstructured challenges.' },
      { name: 'Role-Related Knowledge (RRK)', description: 'Deep technical competence, algorithmic mastery, Big-O trade-offs, and design patterns.' },
      { name: 'Leadership & Navigation', description: 'Steering projects without formal authority, resolving technical disagreements, and mentoring peers.' },
      { name: 'Googleyness', description: 'Doing the right thing, intellectual humility, navigating ambiguity, prioritizing user needs, and thriving in diverse teams.' }
    ],
    salaryBenchmark: [
      { level: 'L3 (Entry / Junior)', role: 'Software Engineer', base: '$145,000', totalCompensation: '$198,000 / year' },
      { level: 'L4 (Mid-Level)', role: 'Software Engineer', base: '$178,000', totalCompensation: '$275,000 / year' },
      { level: 'L5 (Senior)', role: 'Senior Software Engineer', base: '$215,000', totalCompensation: '$385,000 / year' },
      { level: 'L6 (Staff)', role: 'Staff Software Engineer', base: '$260,000', totalCompensation: '$540,000 / year' }
    ],
    rounds: [
      {
        stageNumber: 1,
        title: 'Recruiter Screening Call',
        duration: '30 minutes',
        type: 'Recruiter Screen',
        description: 'Review of resume trajectory, algorithmic fundamentals, work authorization, and level alignment.',
        evalCriteria: ['Clear communication', 'Relevant technical experience', 'Level expectations'],
        sampleQuestions: [
          'Walk me through your most technically complex distributed systems project.',
          'Which programming language are you most comfortable coding in under time pressure?',
          'What motivates you to work at Google over other tech giants?'
        ],
        passRate: '35%',
        proTips: ['Keep answers concise and highlight quantified impact using Google XYZ format.']
      },
      {
        stageNumber: 2,
        title: 'Technical Screen (Coding on Google Docs / CoderPad)',
        duration: '45 minutes',
        type: 'Technical / DSA',
        description: 'Live algorithmic problem solving. No compiler or autocomplete; interviewer evaluates thought process and Big-O complexity.',
        evalCriteria: ['Problem clarification', 'Optimal algorithm formulation', 'Bug-free code', 'Edge case detection'],
        sampleQuestions: [
          'Given a directed graph of job dependencies, determine the valid build order or return a cycle error.',
          'Implement an autocomplete search trie with frequency-weighted ranking under strict memory constraints.'
        ],
        passRate: '25%',
        proTips: ['Never jump into code immediately. Spend 5 minutes clarifying constraints and discussing 2 approaches with trade-offs.']
      },
      {
        stageNumber: 3,
        title: 'Onsite Loop: Coding & Algorithms (Rounds 1 & 2)',
        duration: '45 mins each',
        type: 'Technical / DSA',
        description: 'Deep dives into Trees, Graphs, Dynamic Programming, Heaps, and Concurrency.',
        evalCriteria: ['Time & space complexity analysis', 'Clean modular code', 'Handling interviewer hints gracefully'],
        sampleQuestions: [
          'Design an algorithm to find the median of two sorted arrays of different sizes in O(log(min(m, n))) time.',
          'Serialize and deserialize an N-ary tree with custom attributes.'
        ],
        passRate: '20%',
        proTips: ['Dry run your code with sample and edge inputs before declaring completion.']
      },
      {
        stageNumber: 4,
        title: 'Onsite Loop: System Design & Architecture (L4+)',
        duration: '45 minutes',
        type: 'System Design & Architecture',
        description: 'Designing high-throughput distributed systems: caching, database sharding, CAP theorem, and fault tolerance.',
        evalCriteria: ['Requirements gathering', 'High-level architecture', 'Deep dive into bottlenecks', 'Scalability calculations'],
        sampleQuestions: [
          'Design Google Drive / Dropbox file synchronization engine with chunk-based deduplication.',
          'Design YouTube video upload, transcoding, and low-latency global delivery system.'
        ],
        passRate: '25%',
        proTips: ['Start with Back-of-the-envelope calculations for storage, QPS, and bandwidth.']
      },
      {
        stageNumber: 5,
        title: 'Onsite Loop: Googleyness & Leadership',
        duration: '45 minutes',
        type: 'Behavioral / Leadership Fit',
        description: 'Evaluating how you navigate ethical gray areas, handle interpersonal conflict, and exhibit intellectual humility.',
        evalCriteria: ['Active listening', 'STAR method structure', 'Focus on team success over individual ego'],
        sampleQuestions: [
          'Tell me about a time you made a major technical decision that turned out to be wrong. How did you recover?',
          'Describe a situation where you had to push forward on an initiative with incomplete data and conflicting stakeholder opinions.'
        ],
        passRate: '35%',
        proTips: ['Never blame past teammates or managers. Focus on the learning and actionable remediation.']
      }
    ],
    dosAndDonts: {
      dos: [
        'Think aloud throughout your entire interview; interviewers score communication as heavily as the final code.',
        'Use the XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".',
        'State worst-case and average-case Time and Space complexity explicitly.'
      ],
      donts: [
        'Do not stay silent for more than 30 seconds without explaining your thought pattern.',
        'Do not assume constraints like array bounds or character sets—always ask explicitly.',
        'Do not argue defensively if the interviewer points out an edge-case flaw; treat it as collaborative pair programming.'
      ]
    },
    topQuestions: [
      {
        question: 'How would you design a distributed rate limiter that handles 500,000 requests per second across multi-region data centers?',
        category: 'System Design',
        idealAnswerOutline: 'Clarify rate limiting policy (Token Bucket / Sliding Window Counter). Propose Redis cluster with sorted sets or local in-memory token buckets with gossip protocol sync. Discuss clock drift, network partitions, and fall-through behavior.',
        keyMetricsToHit: 'Sub-millisecond latency overhead, high availability over strict consistency, memory footprint calculations.'
      },
      {
        question: 'Tell me about a time you led a technical project that faced severe resistance from other senior engineers.',
        category: 'Googleyness & Leadership',
        idealAnswerOutline: 'Situation: Legacy monolithic system caused deployment blockades. Task: Propose event-driven architecture. Action: Created a sandbox POC with metrics, organized brown-bag demos, addressed specific reliability doubts. Result: Team adopted the RFC with 95% consensus, slashing deploy cycles by 70%.',
        keyMetricsToHit: 'Data-driven persuasion, empathy for opposing view, quantifiable deployment velocity improvement.'
      }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logoBadge: 'A',
    tagline: 'Earth’s Most Customer-Centric Company.',
    accentColor: 'from-amber-500 to-orange-600',
    difficulty: 'Hard',
    avgTurnaroundWeeks: '3 to 5 weeks',
    interviewStyle: 'Strict evaluation against the 16 Leadership Principles (LPs) combined with coding and the famous Bar Raiser round.',
    keyHiringPillars: [
      { name: 'Customer Obsession', description: 'Leaders start with the customer and work backwards; vigorously earn and keep customer trust.' },
      { name: 'Ownership', description: 'Leaders are owners; they think long term and don’t sacrifice long-term value for short-term results.' },
      { name: 'Bias for Action', description: 'Speed matters in business. Many decisions are two-way doors and do not need exhaustive analysis.' },
      { name: 'Dive Deep & Deliver Results', description: 'Operate at all levels, stay connected to the details, audit frequently, and deliver high-quality outcomes.' }
    ],
    salaryBenchmark: [
      { level: 'SDE I (L4)', role: 'Software Development Engineer', base: '$135,000', totalCompensation: '$178,000 / year' },
      { level: 'SDE II (L5)', role: 'Software Development Engineer II', base: '$165,000', totalCompensation: '$245,000 / year' },
      { level: 'SDE III (L6)', role: 'Senior SDE', base: '$198,000', totalCompensation: '$360,000 / year' }
    ],
    rounds: [
      {
        stageNumber: 1,
        title: 'Online Assessment (OA 1, 2 & 3)',
        duration: '90 - 120 minutes',
        type: 'Online Assessment (OA)',
        description: 'OA 1: Code debugging. OA 2: Two algorithmic LeetCode medium questions. OA 3: Amazon Work Style Simulation (situational leadership judgment).',
        evalCriteria: ['Algorithmic correctness', 'Test case coverage', 'Alignment with 16 Leadership Principles'],
        sampleQuestions: [
          'Amazon Fresh Logistics: Minimum cost to connect all distribution centers (MST - Prim/Kruskal).',
          'Items in containers: Calculate items enclosed between compartment dividers for multiple query ranges.'
        ],
        passRate: '30%',
        proTips: ['In the Work Style simulation, prioritize Customer Obsession and Ownership above all else.']
      },
      {
        stageNumber: 2,
        title: 'Virtual Onsite Loop: Technical & LP Round 1 (Data Structures)',
        duration: '60 minutes',
        type: 'Technical / DSA',
        description: '20 mins on 2 Leadership Principles (STAR format) + 35 mins coding problem on arrays, graphs, or priority queues.',
        evalCriteria: ['STAR storytelling with data', 'Clean modular object-oriented code'],
        sampleQuestions: [
          'Tell me about a time you had a tight deadline and had to make trade-offs between scope and quality (Bias for Action).',
          'Find the top K frequently ordered products across millions of streaming shopping cart transactions.'
        ],
        passRate: '25%',
        proTips: ['Have 6-8 distinct stories prepared that can be adapted across multiple Leadership Principles.']
      },
      {
        stageNumber: 3,
        title: 'Virtual Onsite Loop: System Design & LP Round 2',
        duration: '60 minutes',
        type: 'System Design & Architecture',
        description: 'High-level architecture design for an Amazon-scale service + Leadership Principle deep dive (Dive Deep & Deliver Results).',
        evalCriteria: ['Scalability & fault tolerance', 'DynamoDB vs Relational trade-offs', 'Asynchronous queues (SQS/SNS)'],
        sampleQuestions: [
          'Design Amazon Prime Video streaming recommendation pipeline.',
          'Design an inventory fulfillment lock system that prevents overselling during Prime Day flash sales.'
        ],
        passRate: '22%',
        proTips: ['Amazon loves DynamoDB, SQS, SNS, and S3 in architecture discussions. Justify your storage choices.']
      },
      {
        stageNumber: 4,
        title: 'The Bar Raiser Round',
        duration: '60 minutes',
        type: 'Behavioral / Leadership Fit',
        description: 'Conducted by a certified Bar Raiser from a completely different organization at Amazon with veto power.',
        evalCriteria: ['Must raise the bar (be better than 50% of current Amazonians at that level)', 'Integrity', 'Handling failure'],
        sampleQuestions: [
          'Tell me about a time you took a calculated risk and failed completely. What was the fallout, and what did you learn?',
          'Tell me about a time you had to deliver a critical project without enough resources or direction.'
        ],
        passRate: '18%',
        proTips: ['The Bar Raiser will probe every claim 3-4 layers deep ("Who specifically did that? What was the exact metric?"). Never fabricate.']
      }
    ],
    dosAndDonts: {
      dos: [
        'Use "I", not "we", when describing actions in your STAR stories; interviewers need to evaluate your specific contribution.',
        'Always quantify results: "reduced latency by 45%", "saved $120,000 annually", "increased throughput by 3x".',
        'Demonstrate Customer Obsession even in purely backend engineering discussions.'
      ],
      donts: [
        'Never say "That was not my job" or "I just followed instructions"—violates Ownership.',
        'Do not give theoretical answers to behavioral questions; always anchor to a real past event.',
        'Never skip edge cases in your code tests.'
      ]
    },
    topQuestions: [
      {
        question: 'Tell me about a time you strongly disagreed with your team lead on an architectural direction. What did you do?',
        category: 'Have Backbone; Disagree and Commit',
        idealAnswerOutline: 'Explain the technical disagreement with objective benchmarks. Present alternative with risk analysis. If overruled, explain how you committed 100% to making the chosen approach succeed without resentment.',
        keyMetricsToHit: 'Data-driven advocacy, professional respect, total commitment post-decision.'
      },
      {
        question: 'Design Amazon Locker delivery and pickup notification system.',
        category: 'System Design',
        idealAnswerOutline: 'Partition by geo-location/locker cluster. State machine for package lifecycle (Assigned -> Deposited -> Pickup Code Generated -> Collected / Expired). Secure OTP verification with TTL and SMS/push fallback.',
        keyMetricsToHit: 'Offline locker edge sync, security against brute force codes, transactional integrity.'
      }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logoBadge: 'MS',
    tagline: 'Empower every person and every organization on the planet to achieve more.',
    accentColor: 'from-blue-500 to-teal-500',
    difficulty: 'Hard',
    avgTurnaroundWeeks: '3 to 6 weeks',
    interviewStyle: 'Growth Mindset focus, customer empathy, collaborative technical problem-solving, and clean maintainable code.',
    keyHiringPillars: [
      { name: 'Growth Mindset', description: 'Belief that abilities can be developed through dedication and hard work; curiosity to learn from mistakes.' },
      { name: 'Customer Empathy', description: 'Understanding real user pain points and translating empathy into solid product architecture.' },
      { name: 'Collaboration & Inclusivity', description: 'Elevating colleagues, seeking diverse perspectives, and driving cross-team alignment.' },
      { name: 'Technical Excellence', description: 'Writing robust, testable, and secure enterprise-grade software.' }
    ],
    salaryBenchmark: [
      { level: 'Level 59/60 (SDE I)', role: 'Software Engineer', base: '$128,000', totalCompensation: '$168,000 / year' },
      { level: 'Level 61/62 (SDE II)', role: 'Software Engineer II', base: '$155,000', totalCompensation: '$225,000 / year' },
      { level: 'Level 63/64 (Senior)', role: 'Senior Software Engineer', base: '$185,000', totalCompensation: '$310,000 / year' }
    ],
    rounds: [
      {
        stageNumber: 1,
        title: 'Online Codility Assessment',
        duration: '60 - 90 minutes',
        type: 'Online Assessment (OA)',
        description: '2-3 algorithmic problems focusing on string parsing, dynamic programming, matrix manipulation, and optimal runtime.',
        evalCriteria: ['100% correctness and performance score on Codility test suites'],
        sampleQuestions: [
          'Count visible nodes in a binary tree from the root perspective.',
          'Minimum deletions required to make character frequencies unique in a string.'
        ],
        passRate: '35%',
        proTips: ['Codility tests both correctness and execution time under large inputs. Watch out for O(N^2) traps.']
      },
      {
        stageNumber: 2,
        title: 'Virtual Onsite 4-Round Loop',
        duration: '4 x 45 minutes',
        type: 'Technical / DSA',
        description: 'Covers Data Structures, Object-Oriented Design (OOD), Distributed Systems (Azure scale), and Behavioral Growth Mindset.',
        evalCriteria: ['Modular code', 'Design patterns (Factory, Observer, Strategy)', 'Handling corner cases'],
        sampleQuestions: [
          'Design an In-Memory File System with mkdir, addContentToFile, readContentFromFile operations.',
          'Design Microsoft Teams notification delivery service for 300 million active users.'
        ],
        passRate: '28%',
        proTips: ['Microsoft places significant emphasis on Object-Oriented Design and clean API contracts.']
      },
      {
        stageNumber: 3,
        title: 'As-Appropriate (AA) Executive Interview',
        duration: '45 minutes',
        type: 'Behavioral / Leadership Fit',
        description: 'Conducted by a Partner or Director. High-level vision, culture, career aspirations, and organizational impact.',
        evalCriteria: ['Strategic alignment', 'Growth mindset maturity', 'Long-term potential'],
        sampleQuestions: [
          'What is a technology you recently learned from scratch because a project demanded it? How did you approach the steep learning curve?',
          'Tell me about how you incorporated diverse perspectives into a technical architecture.'
        ],
        passRate: '40%',
        proTips: ['Demonstrate passion for Microsoft cloud ecosystem (Azure, AI Copilot, GitHub) and enterprise reliability.']
      }
    ],
    dosAndDonts: {
      dos: [
        'Emphasize learning from failure—Microsoft explicitly screens for Growth Mindset versus a fixed mindset.',
        'Write modular, readable code with descriptive variable names.',
        'Ask about unit tests and error handling without being prompted.'
      ],
      donts: [
        'Never show arrogance or act as if you have nothing left to learn.',
        'Do not dismiss edge cases as "unlikely in production".',
        'Avoid overly complex over-engineering when a simpler, maintainable pattern suffices.'
      ]
    },
    topQuestions: [
      {
        question: 'How would you design a collaborative document editing service like Microsoft Office 365 Word / Excel?',
        category: 'System Design',
        idealAnswerOutline: 'Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDTs). WebSocket connections to session gateway. Distributed lock manager vs lock-free peer resolution. Snapshot checkpointing to Azure Blob Storage.',
        keyMetricsToHit: 'Sub-50ms keystroke sync latency, conflict resolution algorithms, offline reconnection buffer.'
      }
    ]
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    logoBadge: 'M',
    tagline: 'Give people the power to build community and bring the world closer together.',
    accentColor: 'from-blue-600 to-indigo-700',
    difficulty: 'Very Hard',
    avgTurnaroundWeeks: '3 to 5 weeks',
    interviewStyle: 'Extreme coding speed (2 LeetCode Medium/Hard in 35 mins without compiler), massive-scale Product Architecture, and Jedi behavioral.',
    keyHiringPillars: [
      { name: 'Move Fast', description: 'Willingness to take calculated risks and ship continuous value rapidly rather than obsessing over perfection.' },
      { name: 'Focus on Long-Term Impact', description: 'Prioritizing features that unlock generational shifts in connectivity, AI, and community.' },
      { name: 'Live in the Future & Be Bold', description: 'Anticipating what infrastructure will look like at billions of daily interactions.' },
      { name: 'Be Open & Build Awesome Things', description: 'Radical transparency, peer review, and engineering empowerment.' }
    ],
    salaryBenchmark: [
      { level: 'E3 (Software Engineer)', role: 'SWE', base: '$142,000', totalCompensation: '$192,000 / year' },
      { level: 'E4 (Software Engineer)', role: 'SWE', base: '$175,000', totalCompensation: '$270,000 / year' },
      { level: 'E5 (Senior SWE)', role: 'Senior SWE', base: '$218,000', totalCompensation: '$410,000 / year' }
    ],
    rounds: [
      {
        stageNumber: 1,
        title: 'Technical Screen (CoderPad without Execution)',
        duration: '45 minutes',
        type: 'Technical / DSA',
        description: 'Candidate must solve TWO algorithmic problems in ~35 minutes of actual coding time. No compiler execution; code must be syntax-clean.',
        evalCriteria: ['Speed', 'Optimal time/space complexity', 'Bug-free syntax', 'Communication while typing'],
        sampleQuestions: [
          'Binary Tree Vertical Order Traversal with sorted column offsets.',
          'Subarray Sum Equals K (using hash map of prefix sums in O(N)).'
        ],
        passRate: '20%',
        proTips: ['You cannot spend 15 minutes discussing theory. Aim to write and dry-run each problem within 15-18 minutes flat.']
      },
      {
        stageNumber: 2,
        title: 'Onsite Loop: 2x Coding Rounds',
        duration: '2 x 45 minutes',
        type: 'Technical / DSA',
        description: 'Two separate coding interviews, each with 2 algorithmic challenges spanning Graphs (BFS/DFS), Dynamic Programming, and Two Pointers.',
        evalCriteria: ['Algorithmic intuition', 'Minimal lines of code', 'Immediate edge-case coverage'],
        sampleQuestions: [
          'Lowest Common Ancestor of a Binary Tree III (nodes with parent pointers).',
          'Merge Intervals with memory optimization for streaming input.'
        ],
        passRate: '22%',
        proTips: ['Master the top 100 Meta-tagged LeetCode problems—Meta draws heavily from known patterns.']
      },
      {
        stageNumber: 3,
        title: 'Onsite Loop: Product Architecture / Systems Design (E4+)',
        duration: '45 minutes',
        type: 'System Design & Architecture',
        description: 'Designing end-to-end user features (Instagram Stories, Facebook News Feed, Messenger Live Presence) with real-time requirements.',
        evalCriteria: ['Data modeling', 'Feed generation (Fan-out on read vs write)', 'Caching layers (TAO / Memcached)'],
        sampleQuestions: [
          'Design Instagram Stories with 24-hour expiration and real-time view counts.',
          'Design Facebook Messenger live typing indicator and read receipts.'
        ],
        passRate: '25%',
        proTips: ['Explicitly mention Meta tech like GraphQL, TAO (distributed graph database), and RocksDB where appropriate.']
      },
      {
        stageNumber: 4,
        title: 'The Jedi Behavioral Round',
        duration: '45 minutes',
        type: 'Behavioral / Leadership Fit',
        description: 'Assesses conflict resolution, driving impact in an unstructured environment, and handling difficult feedback.',
        evalCriteria: ['Personal ownership', 'Bias toward rapid resolution', 'Constructive response to critical feedback'],
        sampleQuestions: [
          'Tell me about a time you had to pivot your entire project due to unexpected business priority changes.',
          'How do you decide what NOT to build when faced with dozens of feature requests?'
        ],
        passRate: '40%',
        proTips: ['Highlight high autonomy and ability to unblock yourself without waiting for management direction.']
      }
    ],
    dosAndDonts: {
      dos: [
        'Practice coding by hand without relying on an IDE or compiler.',
        'Target solving 2 Mediums in 40 minutes consistently.',
        'Show deep appreciation for user metrics (DAU, engagement, latency).'
      ],
      donts: [
        'Do not get bogged down in perfectionism on problem 1; remember you have problem 2 waiting.',
        'Do not write sloppy or unreadable code just to be fast.',
        'Do not ignore interviewer hints—Meta interviewers will guide you if you listen actively.'
      ]
    },
    topQuestions: [
      {
        question: 'Design Facebook News Feed generation and ranking for 2 billion daily active users.',
        category: 'System Design',
        idealAnswerOutline: 'Hybrid fan-out model (push for regular users, pull for celebrity accounts). Multi-stage ranking pipeline (Candidate retrieval -> Lightweight ML filtering -> Heavy scoring model). Redis cache clusters with TAO graph store.',
        keyMetricsToHit: 'Feed latency < 200ms, stale feed prevention, storage calculations for media posts.'
      }
    ]
  },
  {
    id: 'mckinsey',
    name: 'McKinsey & Company',
    logoBadge: 'McK',
    tagline: 'Change that matters. Helping organizations accelerate sustainable and inclusive growth.',
    accentColor: 'from-sky-700 to-blue-900',
    difficulty: 'Very Hard',
    avgTurnaroundWeeks: '4 to 6 weeks',
    interviewStyle: 'Interviewer-led Case Interviews, Imbellus Problem Solving Game, and Personal Experience Interview (PEI).',
    keyHiringPillars: [
      { name: 'Problem Solving (MECE Framework)', description: 'Mutually Exclusive, Collectively Exhaustive structuring of business ambiguity.' },
      { name: 'Personal Impact & Presence', description: 'Executive poise, persuasive storytelling, and confidence when challenged.' },
      { name: 'Entrepreneurial Drive', description: 'Overcoming roadblocks, taking initiative, and achieving disproportionate results.' },
      { name: 'Inclusive Leadership', description: 'Rallying teams, mentoring, and navigating organizational politics with emotional intelligence.' }
    ],
    salaryBenchmark: [
      { level: 'Business Analyst', role: 'Undergraduate Hire', base: '$115,000', totalCompensation: '$140,000 / year' },
      { level: 'Associate', role: 'MBA / Post-Grad Hire', base: '$195,000', totalCompensation: '$255,000 / year' },
      { level: 'Engagement Manager', role: 'EM', base: '$240,000', totalCompensation: '$340,000 / year' }
    ],
    rounds: [
      {
        stageNumber: 1,
        title: 'McKinsey Problem Solving Game (Imbellus)',
        duration: '70 minutes',
        type: 'Online Assessment (OA)',
        description: 'Immersive digital simulation without business jargon. Games evaluate decision-making, critical thinking, and cognitive adaptability.',
        evalCriteria: ['Ecosystem creation balance', 'Plant defense tactical strategy', 'Data synthesis efficiency'],
        sampleQuestions: [
          'Create a sustainable marine ecosystem balance given animal food chains and water depth constraints.',
          'Optimize barricade placement to protect wildlife against encroaching invasive species.'
        ],
        passRate: '30%',
        proTips: ['Focus on system dynamics. Write notes on predator-prey caloric balance before placing organisms.']
      },
      {
        stageNumber: 2,
        title: 'First Round: 2 x Case & PEI Interviews',
        duration: '2 x 50 minutes',
        type: 'Case Study / Superday',
        description: '20 mins PEI (deep dive into ONE leadership or entrepreneurial story) + 30 mins interviewer-led business case.',
        evalCriteria: ['Issue tree structuring', 'Mental math without calculator', 'Synthesis and executive recommendation'],
        sampleQuestions: [
          'A European airline has seen profit margins drop by 6% despite record passenger volume. Where is the leak and how do we fix it?',
          'PEI: Tell me about a time you led a team through a crisis when initial plans collapsed.'
        ],
        passRate: '25%',
        proTips: ['McKinsey cases are interviewer-led: answer the specific question asked rather than rambling through generic frameworks.']
      },
      {
        stageNumber: 3,
        title: 'Final Round (Partner Round): 3 x Case & PEI',
        duration: '3 x 50 minutes',
        type: 'Case Study / Superday',
        description: 'Conducted by Senior Partners. Tests high-level strategic instincts, pushback resilience, and CEO-level communication.',
        evalCriteria: ['Strategic intuition', 'Poise under pressure', 'Clear synthesized recommendation with risks and next steps'],
        sampleQuestions: [
          'Should a global pharmaceutical conglomerate acquire an AI drug-discovery startup for $1.2B?',
          'PEI: Tell me about a time you changed someone’s deeply held mindset on an important matter.'
        ],
        passRate: '35%',
        proTips: ['Always structure your final recommendation into: Recommendation, Supporting Pillars (3 key data points), Risks, and Next Steps.']
      }
    ],
    dosAndDonts: {
      dos: [
        'Always take 1-2 minutes of silence to draw your issue tree before proposing your structure.',
        'Calculate out loud: "40 million passengers times €15 average ancillary spend is €600 million revenue".',
        'State hypotheses early: "My initial hypothesis is that fuel hedging volatility or staffing costs drove the margin decline".'
      ],
      donts: [
        'Do not force-fit rigid textbook frameworks (e.g. standard 4Ps) if they do not fit the client situation.',
        'Never panic if your mental math is off; pause, self-correct calmly, and verify.',
        'Do not present a laundry list of ideas; categorize them logically (MECE).'
      ]
    },
    topQuestions: [
      {
        question: 'Our client is a global retail bank losing younger customers to fintech apps. How would you diagnose and address this?',
        category: 'Case Interview',
        idealAnswerOutline: 'Structure issue tree into 3 buckets: 1. Product & UX Offering (features, mobile app speed, zero-fee trading), 2. Economics & Pricing (overdraft penalties, account maintenance fees), 3. Brand Perception & Marketing Channels (TikTok/digital vs traditional branches).',
        keyMetricsToHit: 'Customer Acquisition Cost (CAC), Churn Rate, Lifetime Value (LTV), Feature parity matrix.'
      }
    ]
  },
  {
    id: 'goldman-sachs',
    name: 'Goldman Sachs',
    logoBadge: 'GS',
    tagline: 'Delivering sustainable economic growth and financial opportunity across the globe.',
    accentColor: 'from-blue-700 to-amber-600',
    difficulty: 'Very Hard',
    avgTurnaroundWeeks: '3 to 6 weeks',
    interviewStyle: 'Quantitative rigor, algorithms, probability, market knowledge, HireVue video screening, and back-to-back Superday rounds.',
    keyHiringPillars: [
      { name: 'Analytical & Quantitative Mastery', description: 'Probability, statistics, algorithmic complexity, and numerical speed.' },
      { name: 'Risk Management Mindset', description: 'Zero-tolerance for unhedged catastrophic failure and respect for regulatory governance.' },
      { name: 'Composure Under Pressure', description: 'High-stakes execution where milliseconds and decimal points impact millions of dollars.' },
      { name: 'Teamwork & Partnership', description: 'Flawless collaboration between engineering, quant research, and trading desks.' }
    ],
    salaryBenchmark: [
      { level: 'Analyst (Year 1)', role: 'Software Engineer / Quant', base: '$115,000', totalCompensation: '$145,000 / year' },
      { level: 'Associate', role: 'Software Engineer / Associate', base: '$160,000', totalCompensation: '$225,000 / year' },
      { level: 'Vice President (VP)', role: 'VP Engineering', base: '$210,000', totalCompensation: '$340,000 / year' }
    ],
    rounds: [
      {
        stageNumber: 1,
        title: 'HackerRank Quantitative & Coding OA',
        duration: '120 minutes',
        type: 'Online Assessment (OA)',
        description: '2 advanced coding challenges + 10-15 math/probability questions (combinations, Bayes theorem, expected values).',
        evalCriteria: ['Algorithm efficiency', 'Mathematical precision', 'Time allocation'],
        sampleQuestions: [
          'Calculate the expected number of coin flips before getting two consecutive heads.',
          'Stock trading optimization: Maximum profit with at most K transactions and cooldown periods.'
        ],
        passRate: '20%',
        proTips: ['Brush up on mental probability shortcuts, permutations, and dynamic programming for state-space problems.']
      },
      {
        stageNumber: 2,
        title: 'HireVue Asynchronous Video Interview',
        duration: '30 minutes',
        type: 'Recruiter Screen',
        description: 'Automated video prompt response with 30-45 seconds preparation time and 2-minute recorded answers.',
        evalCriteria: ['Clarity', 'Confidence', 'Why Goldman Sachs', 'Commercial awareness'],
        sampleQuestions: [
          'Why do you want to work at Goldman Sachs specifically over pure tech companies?',
          'Describe a time you detected an anomaly or data discrepancy that everyone else overlooked.'
        ],
        passRate: '30%',
        proTips: ['Maintain direct eye contact with the camera and dress in full business formal attire.']
      },
      {
        stageNumber: 3,
        title: 'Superday: 4-5 Back-to-Back Rounds',
        duration: '4 hours',
        type: 'Case Study / Superday',
        description: 'Intense rounds covering Systems, Data Structures, Concurrency, Financial Knowledge, and Cultural Fit.',
        evalCriteria: ['Thread safety and race conditions', 'High-frequency trading latency reduction', 'Team alignment'],
        sampleQuestions: [
          'Design an ultra-low-latency order matching engine for equity limit orders.',
          'How does garbage collection in Java impact high-frequency trading systems, and how do you achieve zero-GC?'
        ],
        passRate: '15%',
        proTips: ['Highlight off-heap memory, ring buffers (LMAX Disruptor pattern), and cache locality for low-latency questions.']
      }
    ],
    dosAndDonts: {
      dos: [
        'Know the basics of capital markets, equity, bonds, derivatives, and recent financial news.',
        'Emphasize thread-safety, idempotency, and transactional consistency in code.',
        'Be prepared for rapid-fire probability and brainteaser questions.'
      ],
      donts: [
        'Never treat financial accuracy casually—rounding errors in finance can mean multi-million regulatory fines.',
        'Do not appear disinterested in the financial business side if applying for a software engineering role.',
        'Do not dress casually for Goldman Sachs interviews; business formal remains the gold standard.'
      ]
    },
    topQuestions: [
      {
        question: 'Design a low-latency order book matching engine that processes 100,000 limit orders per second with sub-millisecond execution.',
        category: 'System Design',
        idealAnswerOutline: 'In-memory data structures: doubly linked list per price point, price-time priority map with Red-Black tree or B+ tree. Single-threaded event loop (disruptor pattern) to eliminate mutex lock contention. Write-Ahead-Log (WAL) for durability.',
        keyMetricsToHit: 'Deterministic p99 latency < 500 microseconds, lock-free queues, zero allocation during matching.'
      }
    ]
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Services (TCS)',
    logoBadge: 'TCS',
    tagline: 'Building on belief. Pioneering global IT and business transformation.',
    accentColor: 'from-purple-700 to-indigo-900',
    difficulty: 'Medium',
    avgTurnaroundWeeks: '2 to 4 weeks',
    interviewStyle: 'National Qualifier Test (NQT) screening followed by Technical (TR), Managerial (MR), and HR interviews for Ninja, Digital, or Prime bands.',
    keyHiringPillars: [
      { name: 'Core Computer Science Fundamentals', description: 'Strong grounding in OOP, DBMS, SQL, Data Structures, and Computer Networks.' },
      { name: 'Adaptability & Learning Agility', description: 'Readiness to learn and deploy across diverse enterprise client technology stacks.' },
      { name: 'Professional Integrity & Work Ethic', description: 'Dependability, client confidentiality, and long-term commitment.' },
      { name: 'Communication & Team Synergy', description: 'Clear articulation in English and readiness to collaborate in global cross-functional pods.' }
    ],
    salaryBenchmark: [
      { level: 'Ninja Cadre', role: 'Assistant System Engineer', base: '₹3.36 Lakhs', totalCompensation: '₹3.36 - 3.60 LPA' },
      { level: 'Digital Cadre', role: 'System Engineer', base: '₹7.00 Lakhs', totalCompensation: '₹7.00 - 7.50 LPA' },
      { level: 'Prime Cadre', role: 'Cadre Developer', base: '₹9.00 Lakhs', totalCompensation: '₹9.00 - 11.50 LPA' }
    ],
    rounds: [
      {
        stageNumber: 1,
        title: 'TCS National Qualifier Test (NQT)',
        duration: '165 minutes',
        type: 'Online Assessment (OA)',
        description: 'Part A Foundation: Numerical Ability, Verbal Ability, Reasoning Ability. Part B Advanced (for Digital/Prime): Advanced Quantitative, Advanced Reasoning, and 2 Advanced Coding Questions.',
        evalCriteria: ['Sectional cut-offs', 'Coding test case accuracy', 'Speed across quantitative aptitude'],
        sampleQuestions: [
          'Find the minimum operations to convert an array such that no two adjacent elements are equal.',
          'Solve time-speed-distance problem involving two trains crossing a bridge at variable speeds.'
        ],
        passRate: '35%',
        proTips: ['Scoring high on the Advanced Coding section is the direct gateway to the higher-paying Digital and Prime packages.']
      },
      {
        stageNumber: 2,
        title: 'Technical Round (TR)',
        duration: '30 - 45 minutes',
        type: 'Technical / DSA',
        description: 'Comprehensive screening of OOP concepts (Polymorphism, Inheritance), SQL joins, normalization, indexing, basic DSA, and candidate resume projects.',
        evalCriteria: ['Understanding of written code', 'Database query writing', 'Explaining college capstone project'],
        sampleQuestions: [
          'What is the difference between TRUNCATE, DROP, and DELETE in SQL?',
          'Explain the four pillars of OOPs with a real-world banking application example.',
          'Write a program to reverse a linked list or detect a loop using Floyd’s cycle finding algorithm.'
        ],
        passRate: '45%',
        proTips: ['Be ready to share your screen and write code in Notepad without compiler support.']
      },
      {
        stageNumber: 3,
        title: 'Managerial (MR) & HR Round',
        duration: '20 - 30 minutes',
        type: 'Behavioral / Leadership Fit',
        description: 'Assessing willingness to relocate, work in variable shift timings, handle tight client project deliverables, and team collaboration.',
        evalCriteria: ['Flexibility', 'Commitment', 'Communication skills'],
        sampleQuestions: [
          'Are you willing to relocate to any TCS delivery center across India or work in night shifts?',
          'Tell me about a time you handled a difficult team member during your final year project.'
        ],
        passRate: '80%',
        proTips: ['Always answer with complete willingness to relocate and adapt to client project requirements.']
      }
    ],
    dosAndDonts: {
      dos: [
        'Review your final-year college project inside out—know every database schema, architecture diagram, and library used.',
        'Be clear and structured when explaining SQL queries and DBMS normalization.',
        'Dress in formal attire for both technical and HR rounds.'
      ],
      donts: [
        'Do not fake skills on your resume—if you list Python or Docker, expect deep technical verification.',
        'Never argue with the interviewer or show hesitation regarding relocation or shifts.',
        'Do not leave coding questions blank in the NQT; partial test cases still grant valuable score points.'
      ]
    },
    topQuestions: [
      {
        question: 'Write a SQL query to find the 3rd highest salary from an Employee table without using the LIMIT or TOP keywords.',
        category: 'Technical / SQL',
        idealAnswerOutline: 'Use correlated subquery: SELECT Salary FROM Employee e1 WHERE 2 = (SELECT COUNT(DISTINCT Salary) FROM Employee e2 WHERE e2.Salary > e1.Salary); or use DENSE_RANK() window function.',
        keyMetricsToHit: 'Handling duplicate salaries cleanly, explaining subquery execution cost.'
      }
    ]
  }
];
