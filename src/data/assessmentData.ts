import { CompanyAssessmentTest } from '../types';

export const COMPANY_ASSESSMENTS: CompanyAssessmentTest[] = [
  {
    id: 'amazon-oa-simulation',
    companyId: 'amazon',
    companyName: 'Amazon',
    title: 'Amazon SDE Online Assessment (OA 2 Simulation)',
    type: 'Coding & Algorithmic Challenge',
    durationMinutes: 45,
    difficulty: 'Hard',
    description: 'Accurately mirrors the Amazon OA 2 hiring screen: 1 Algorithmic problem with automated test cases + 2 Leadership Principles situational judgment scenarios.',
    questions: [
      {
        id: 'amz-q1',
        type: 'coding',
        title: 'Optimizing Warehouse Package Pairings',
        problemText: `An Amazon fulfillment center has an array of package weights 'weights' and a maximum truck payload capacity 'target'. 
You need to find two distinct packages whose combined weight is less than or equal to 'target' such that their sum is maximized. If multiple pairs achieve the same maximum sum, choose the pair that includes the package with the single largest weight. Return the 0-indexed indices of the two packages sorted in ascending order. If no valid pair exists, return [-1, -1].

Example:
Input: weights = [10, 25, 35, 15, 40, 20], target = 50
Output: [1, 1] -> (Weights 25 + 20 = 45 or 10 + 40 = 50. Sum 50 from index 0 & 4. Best pair is [0, 4])

Constraints:
- 2 <= weights.length <= 10^5
- 1 <= weights[i] <= 10^9
- Expected Time: O(N log N) or O(N)`,
        starterCode: `function optimizePackagePairings(weights: number[], target: number): [number, number] {
  // Write your optimal solution here
  let maxWeight = -1;
  let result: [number, number] = [-1, -1];
  
  // Implement two-pointer or binary search
  return result;
}`,
        testCases: [
          { input: 'weights = [10, 25, 35, 15, 40, 20], target = 50', expectedOutput: '[0, 4]' },
          { input: 'weights = [30, 40, 50], target = 60', expectedOutput: '[-1, -1]' },
          { input: 'weights = [5, 10, 15, 20], target = 30', expectedOutput: '[1, 3]' }
        ],
        explanation: 'Sort index-value pairs. Use two pointers (left at 0, right at N-1). When sum <= target, update best pair based on highest sum, or if equal, the maximum single item weight.',
        companyTip: 'Amazon OA tests for clean O(N log N) two-pointer solutions and careful handling of duplicate weights.'
      },
      {
        id: 'amz-q2',
        type: 'situational',
        title: 'Work Style Simulation: Prime Day Deadline vs Quality',
        problemText: `You are leading the deployment of a new checkout discount microservice scheduled to go live 48 hours before Prime Day. During final load testing at 150% simulated traffic, you discover a memory leak that causes 0.2% of transactions to timeout after 20 minutes of sustained load. Fixing the root cause requires refactoring a core caching module, which will take 72 hours, missing the Prime Day launch date.

As an Amazon SDE applying the Leadership Principles (Customer Obsession, Ownership, Insist on the Highest Standards, Bias for Action), what is your most effective course of action?`,
        options: [
          'A) Deploy as-is because 0.2% timeout rate is acceptable under peak load, and fix the leak next week.',
          'B) Unilaterally postpone the Prime Day launch by 72 hours without notifying the retail leadership team.',
          'C) Design an immediate automated worker process restart (canary recycling) every 15 minutes to clear memory while monitoring latency; brief the on-call team and escalate the risk to leadership with a mitigation plan.',
          'D) Disable the new discount microservice completely and run with no promotional discounts for Prime Day.'
        ],
        correctOptionIndex: 2,
        explanation: 'Option C embodies Bias for Action and Ownership with Customer Obsession: you implement an immediate operational mitigation (process recycling prevents timeouts) while transparently escalating and protecting the customer experience.',
        companyTip: 'Amazon looks for engineers who find pragmatic mitigation paths without putting the customer at risk.'
      },
      {
        id: 'amz-q3',
        type: 'situational',
        title: 'Work Style Simulation: Frugality & Technical Debt',
        problemText: `Your team’s AWS cloud bill for Elastic MapReduce (EMR) clusters has increased by 40% over the last two quarters. A junior engineer proposes rewriting the entire batch processing pipeline in Rust over the next 4 months. Another teammate suggests upgrading to larger AWS EC2 instance types to handle the jobs faster. 

What action best demonstrates Amazon’s Frugality and Dive Deep principles?`,
        options: [
          'A) Approve the 4-month Rust rewrite immediately because Rust is memory efficient.',
          'B) Profile the current Spark/EMR jobs to identify skewed partition keys, optimize memory garbage collection, and switch to Spot instances with auto-scaling before considering any rewrite.',
          'C) Upgrade to the larger EC2 instances immediately to avoid spending engineering time.',
          'D) Delete 50% of the historical data to reduce storage requirements.'
        ],
        correctOptionIndex: 1,
        explanation: 'Option B demonstrates Dive Deep (profiling and identifying skewed partitions) and Frugality (optimizing configuration and utilizing Spot instances) before committing heavy 4-month engineering resources.',
        companyTip: 'Frugality means accomplishing more with less. Before undertaking massive rewrites, audit and optimize existing infrastructure.'
      }
    ]
  },
  {
    id: 'google-online-challenge',
    companyId: 'google',
    companyName: 'Google',
    title: 'Google Online Challenge: Algorithmic & Complexity Screening',
    type: 'Coding & Algorithmic Challenge',
    durationMinutes: 60,
    difficulty: 'Hard',
    description: 'Designed around Google’s online challenge benchmarks: complex algorithmic reasoning, optimal asymptotic complexity, and graph/DP structures.',
    questions: [
      {
        id: 'goog-q1',
        type: 'coding',
        title: 'Longest Contiguous Subarray with At Most K Distinct Server IDs',
        problemText: `Google data centers monitor incoming server logs represented as an integer array 'serverIds'. You need to determine the maximum length of a contiguous sequence of server logs that contains at most 'k' distinct server IDs.

Example:
Input: serverIds = [1, 2, 1, 2, 3, 3, 4], k = 2
Output: 4 (The longest contiguous subarray is [1, 2, 1, 2] with 2 distinct IDs: 1 and 2)

Constraints:
- 1 <= serverIds.length <= 10^5
- 1 <= k <= 10^4
- Expected Time Complexity: O(N) using Sliding Window + Hash Map.
- Expected Space Complexity: O(k)`,
        starterCode: `function longestSubarrayAtMostKDistinct(serverIds: number[], k: number): number {
  // Sliding window algorithm with frequency map
  let maxLength = 0;
  let left = 0;
  const countMap = new Map<number, number>();

  for (let right = 0; right < serverIds.length; right++) {
    // Implement O(N) sliding window logic
  }

  return maxLength;
}`,
        testCases: [
          { input: 'serverIds = [1, 2, 1, 2, 3, 3, 4], k = 2', expectedOutput: '4' },
          { input: 'serverIds = [5, 5, 5, 5], k = 1', expectedOutput: '4' },
          { input: 'serverIds = [1, 2, 3, 4, 5], k = 2', expectedOutput: '2' }
        ],
        explanation: 'Use two pointers (left and right). Maintain a map of element frequencies. Expand right pointer; if distinct count exceeds k, shrink left pointer until distinct count <= k.',
        companyTip: 'Google heavily emphasizes clean sliding window state invariants and tight space bounds.'
      },
      {
        id: 'goog-q2',
        type: 'mcq',
        title: 'Distributed System Invariant: CAP Theorem Trade-off',
        problemText: `Google Spanner achieved global strong consistency and high availability by using GPS and atomic clocks (TrueTime API). In a traditional distributed database during a network partition (P), which statement is true according to the CAP theorem?`,
        options: [
          'A) The system can maintain both strong Consistency (C) and Availability (A) simultaneously without any clock synchronization.',
          'B) The system must choose between returning potentially stale data (Availability) or failing/blocking requests until partition heals (Consistency).',
          'C) Network partitions never occur in modern cloud networks.',
          'D) Consistency in CAP theorem refers to ACID transactional rollback.'
        ],
        correctOptionIndex: 1,
        explanation: 'Under a network partition (P), a distributed system must sacrifice either Consistency (allowing divergent writes/stale reads to keep responding) or Availability (rejecting writes to guarantee linearizable consistency).',
        companyTip: 'In Google system design interviews, always define CAP terms precisely and explain how TrueTime mitigates partition risk.'
      },
      {
        id: 'goog-q3',
        type: 'mcq',
        title: 'Algorithm Complexity: QuickSelect vs Median of Medians',
        problemText: `What is the worst-case and average-case time complexity of QuickSelect to find the k-th smallest element in an unsorted array of size N using random pivot selection?`,
        options: [
          'A) Average O(N), Worst-case O(N^2)',
          'B) Average O(N log N), Worst-case O(N log N)',
          'C) Average O(N), Worst-case O(N)',
          'D) Average O(log N), Worst-case O(N)'
        ],
        correctOptionIndex: 0,
        explanation: 'Randomized QuickSelect achieves O(N) average time because the expected subproblem size halves each step: N + N/2 + N/4... = 2N. However, if bad pivots are consistently chosen, worst case degrades to O(N^2).',
        companyTip: 'Google interviewers love probing whether you understand why QuickSelect is O(N) on average while QuickSort is O(N log N).'
      }
    ]
  },
  {
    id: 'mckinsey-imbellus-quant',
    companyId: 'mckinsey',
    companyName: 'McKinsey & Company',
    title: 'McKinsey Problem Solving & Quantitative Assessment',
    type: 'Case Math & Financial Analytics',
    durationMinutes: 40,
    difficulty: 'Hard',
    description: 'Assesses business math agility, MECE logic, profitability breakdown, and mental calculation without a calculator.',
    questions: [
      {
        id: 'mck-q1',
        type: 'mcq',
        title: 'Break-Even Unit Volume & Profitability Analysis',
        problemText: `A manufacturing client produces eco-friendly packaging units. 
- Annual Fixed Overhead Costs: $3,600,000
- Unit Selling Price: $45
- Variable Cost Per Unit: $25 (Raw material $18, Labor & logistics $7)

If the client aims to generate an annual Operating Profit of $1,400,000, how many units must they manufacture and sell?`,
        options: [
          'A) 180,000 units',
          'B) 250,000 units',
          'C) 320,000 units',
          'D) 500,000 units'
        ],
        correctOptionIndex: 1,
        explanation: 'Contribution Margin per unit = Selling Price ($45) - Variable Cost ($25) = $20. Total Required Contribution = Fixed Costs ($3,600,000) + Target Profit ($1,400,000) = $5,000,000. Required Units = $5,000,000 / $20 = 250,000 units.',
        companyTip: 'Structure the calculation cleanly: CM = P - VC, Total Required = Fixed + Target Profit, Units = Total / CM.'
      },
      {
        id: 'mck-q2',
        type: 'mcq',
        title: 'Market Sizing & TAM Estimation',
        problemText: `You are sizing the annual consumer coffee market in a country with a population of 80 million people.
- 60% of the population drinks coffee.
- Average coffee drinker consumes 2 cups per day.
- 75% of consumed cups are brewed at home (cost $0.50/cup), while 25% are purchased at coffee shops (average $4.00/cup).

What is the estimated total annual consumer spend on coffee in this country? (Use 365 days/year)`,
        options: [
          'A) $9.85 Billion',
          'B) $24.09 Billion',
          'C) $48.20 Billion',
          'D) $15.75 Billion'
        ],
        correctOptionIndex: 1,
        explanation: 'Coffee drinkers = 80M * 0.60 = 48 Million. Daily cups = 48M * 2 = 96 Million cups/day. Blended price per cup = (0.75 * $0.50) + (0.25 * $4.00) = $0.375 + $1.00 = $1.375. Daily spend = 96M * $1.375 = $132 Million. Annual spend = $132M * 365 = $24.09 Billion (approx $24.1B).',
        companyTip: 'In McKinsey cases, round numbers smartly to simplify mental math (e.g. 96 * 1.375 = 132).'
      },
      {
        id: 'mck-q3',
        type: 'mcq',
        title: 'Customer Churn & Unit Economics (LTV/CAC)',
        problemText: `A SaaS enterprise client acquires subscribers at a Customer Acquisition Cost (CAC) of $1,200. 
- Average Monthly Subscription Fee: $150
- Gross Margin: 80%
- Monthly Churn Rate: 2.5%

What is the Customer Lifetime Value (LTV) and the resulting LTV to CAC ratio?`,
        options: [
          'A) LTV = $4,800 | LTV:CAC = 4.0x',
          'B) LTV = $2,400 | LTV:CAC = 2.0x',
          'C) LTV = $6,000 | LTV:CAC = 5.0x',
          'D) LTV = $3,600 | LTV:CAC = 3.0x'
        ],
        correctOptionIndex: 0,
        explanation: 'Average Customer Lifetime = 1 / Churn Rate = 1 / 0.025 = 40 months. Monthly Gross Profit per user = $150 * 80% = $120. LTV = 40 months * $120 = $4,800. LTV:CAC Ratio = $4,800 / $1,200 = 4.0x. A healthy SaaS benchmark is >= 3.0x.',
        companyTip: 'LTV = (Monthly Revenue * Gross Margin) / Churn Rate.'
      }
    ]
  },
  {
    id: 'tcs-nqt-digital',
    companyId: 'tcs',
    companyName: 'Tata Consultancy Services',
    title: 'TCS NQT & Digital Coding Assessment',
    type: 'Aptitude & Logical OA',
    durationMinutes: 45,
    difficulty: 'Medium',
    description: 'Directly mirrors the TCS National Qualifier Test (NQT) Foundation + Advanced Digital round: Aptitude, Data Interpretation, and Coding.',
    questions: [
      {
        id: 'tcs-q1',
        type: 'mcq',
        title: 'Numerical Ability: Time, Speed and Distance',
        problemText: `Two trains running in opposite directions on parallel tracks cross each other in 18 seconds. The length of the first train is 220 meters and its speed is 54 km/hr. If the speed of the second train is 72 km/hr, what is the length of the second train?`,
        options: [
          'A) 340 meters',
          'B) 410 meters',
          'C) 450 meters',
          'D) 500 meters'
        ],
        correctOptionIndex: 1,
        explanation: 'Relative Speed = 54 + 72 = 126 km/hr = 126 * (5/18) = 35 m/s. Total distance covered in 18 seconds = Speed * Time = 35 * 18 = 630 meters. Total distance = Length of Train 1 + Length of Train 2. Length of Train 2 = 630 - 220 = 410 meters.',
        companyTip: 'Convert km/hr to m/s immediately by multiplying by 5/18.'
      },
      {
        id: 'tcs-q2',
        type: 'coding',
        title: 'Array Modification: Minimum Subarray Inversions',
        problemText: `Given an array of positive integers 'arr', find the minimum number of swaps needed to group all even numbers together at the beginning of the array while maintaining their original relative order (stable partition).

Example:
Input: arr = [3, 2, 4, 1, 6]
Output: 2 (Move 2 and 4 before 3 and 1)

Constraints:
- 1 <= arr.length <= 10^5
- Expected Time: O(N)`,
        starterCode: `function minSwapsToGroupEvens(arr: number[]): number {
  let swaps = 0;
  let evenCountSoFar = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      // Swaps equal number of odd elements passed so far
      swaps += (i - evenCountSoFar);
      evenCountSoFar++;
    }
  }

  return swaps;
}`,
        testCases: [
          { input: 'arr = [3, 2, 4, 1, 6]', expectedOutput: '2' },
          { input: 'arr = [2, 4, 6]', expectedOutput: '0' },
          { input: 'arr = [1, 3, 5, 2]', expectedOutput: '3' }
        ],
        explanation: 'For each even number at index i, the number of swaps required to bring it next to previously placed evens is exactly (i - evenCountSoFar). Summing this gives the optimal swap count in O(N).',
        companyTip: 'TCS Digital tests for linear O(N) array transformations without auxiliary memory arrays.'
      }
    ]
  }
];
