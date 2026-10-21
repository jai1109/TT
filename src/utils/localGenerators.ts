import { PPTData, SlideItem, StudentProfile } from '../types/index';

export function generateLocalPPT(
  topic: string,
  options: {
    slideCount?: number;
    courseTitle?: string;
    targetType?: string;
  } = {},
  student?: StudentProfile
): PPTData {
  const name = student?.name || 'Rahul Varma';
  const rollNo = student?.rollNo || '22951A05B3';
  const branch = student?.branch || 'Computer Science & Engineering';
  const courseTitle = options.courseTitle || 'Technical Seminar & Capstone Research';
  const cleanTopic = topic.trim() || 'Modern Computing & Engineering Innovations';
  const requestedCount = Math.min(18, Math.max(5, options.slideCount || 7));

  // Determine domain flavor
  const lower = cleanTopic.toLowerCase();
  const isAI = lower.includes('ai') || lower.includes('learning') || lower.includes('neural') || lower.includes('llm') || lower.includes('vision') || lower.includes('gpt');
  const isSystems = lower.includes('distributed') || lower.includes('cloud') || lower.includes('consensus') || lower.includes('system') || lower.includes('kubernetes') || lower.includes('microservice');
  const isSecurity = lower.includes('security') || lower.includes('crypto') || lower.includes('blockchain') || lower.includes('cyber') || lower.includes('auth');
  const isAlgo = lower.includes('algorithm') || lower.includes('graph') || lower.includes('tree') || lower.includes('dynamic') || lower.includes('sort') || lower.includes('search');

  // Master bank of 18 technical slide prototypes customized to the topic
  const fullSlideCatalog: SlideItem[] = [
    {
      slideNumber: 1,
      title: cleanTopic,
      content: [
        `Topic: ${cleanTopic}`,
        `Course: ${courseTitle}`,
        `Presenter: ${name} (${rollNo})`,
        `Department: Department of ${branch}`,
        'Autonomous Institution • Institute of Aeronautical Engineering (IARE)',
      ],
      visualIdea: 'Official IARE Crest, title typography in Deep Navy & Gold with technical subtitle and student badge.',
      speakerNotes: `Good morning respected evaluation committee and peers. I am ${name}, presenting our technical seminar on "${cleanTopic}". In this presentation, we examine architectural foundations, algorithmic methodologies, and experimental evaluation.`,
    },
    {
      slideNumber: 2,
      title: 'Executive Abstract & Problem Significance',
      content: [
        `Addresses critical computational paradigms and real-world efficiency bottlenecks in ${cleanTopic}.`,
        'Rising operational complexity necessitates resilient, mathematically sound, and scalable architectures.',
        'High-dimensional workload constraints demand low tail-latency (P99) and deterministic predictability.',
        'Core Objective: Investigate modern theoretical frameworks, practical implementations, and performance benchmarks.',
      ],
      visualIdea: 'High-level conceptual overview diagram showing input telemetry, processing pipeline, and target throughput.',
      speakerNotes: `To introduce our topic, ${cleanTopic} has emerged as an essential technology. Our research focuses on bridging the gap between theoretical models and real-time industrial deployment.`,
    },
    {
      slideNumber: 3,
      title: 'Background & Literature Review',
      content: [
        'Evolution from foundational monolithic paradigms to contemporary distributed and modular models.',
        'Analysis of landmark peer-reviewed research papers (IEEE, ACM, Springer) establishing key baseline metrics.',
        'Comparative study of classical approaches vs state-of-the-art implementations.',
        'Identified research gap: lack of adaptive fault tolerance and high compute overhead under peak stress.',
      ],
      visualIdea: 'Chronological timeline infographic highlighting seminal milestones and preceding breakthrough papers.',
      speakerNotes: 'Our literature survey systematically analyzed preceding methodologies, revealing significant scalability limits that our study directly addresses.',
    },
    {
      slideNumber: 4,
      title: 'Problem Formulation & Theoretical Foundations',
      content: [
        `Formal mathematical formulation of the optimization objectives governing ${cleanTopic}.`,
        'Constraint equations: resource bounds (memory footprint, bandwidth, execution deadlines).',
        'State space representation and queuing theoretical formulations (M/M/1 and Poisson arrivals).',
        'Formal verification guarantees ensuring deadlock-freedom, convergence, and liveness properties.',
      ],
      visualIdea: 'Mathematical formulation panel with governing equations, variable annotations, and state graph.',
      speakerNotes: 'Here we establish formal mathematical rigor. By modeling the system using state transitions, we prove deterministic convergence.',
    },
    {
      slideNumber: 5,
      title: 'System Architecture & Block Diagram',
      content: [
        'Multi-tiered architectural layout: Ingestion Layer, Processing Engine, Persistence Store, and Telemetry API.',
        'Decoupled micro-service communication utilizing asynchronous message queues and event buses.',
        'In-memory high-throughput cache layer providing sub-millisecond retrieval guarantees.',
        'Observability boundary providing distributed trace correlation and metrics scraping.',
      ],
      visualIdea: 'Three-tier architecture schematic displaying microservices, message broker, database, and telemetry pipeline.',
      speakerNotes: 'This architectural blueprint illustrates the decoupled pipeline. Asynchronous queues eliminate backpressure and safeguard system liveness.',
    },
    {
      slideNumber: 6,
      title: isAI
        ? 'Deep Neural Pipeline & Model Architecture'
        : isSystems
        ? 'Distributed Consensus & Replication Protocols'
        : isSecurity
        ? 'Cryptographic Protocols & Zero-Trust Defense'
        : 'Algorithmic Workflow & Execution Mechanics',
      content: [
        `Detailed execution workflow specialized for ${cleanTopic} computational primitives.`,
        'Data preprocessing, normalization, and dimensional alignment across concurrent worker pools.',
        'Core algorithmic step execution with deterministic state progression and state snapshotting.',
        'Graceful degradation mode ensuring continuous availability during partial node degradation.',
      ],
      visualIdea: 'Step-by-step flowchart with diamond decision nodes, validation checkpoints, and output vectors.',
      speakerNotes: 'Examining the algorithmic mechanics: every transaction undergoes strict validation and parallel transformation before committing to state.',
    },
    {
      slideNumber: 7,
      title: 'Data Flow & Sequence of Operations',
      content: [
        'Phase 1: Ingestion of incoming payload via secure TLS endpoints with payload schema validation.',
        'Phase 2: Serialization into binary buffer formats (Protobuf/FlatBuffers) for minimal transmission overhead.',
        'Phase 3: Worker thread pool dispatch based on consistent hashing and load-balancing weights.',
        'Phase 4: Output generation, transactional acknowledgement, and telemetry logging.',
      ],
      visualIdea: 'UML sequence diagram illustrating client request, gateway, orchestrator, and worker interactions.',
      speakerNotes: 'This sequence diagram traces an end-to-end request lifecycle from initial client ingestion to final consensus confirmation.',
    },
    {
      slideNumber: 8,
      title: 'Technology Stack & Environment Specs',
      content: [
        'Programming Environments: Modern TypeScript, Python 3.11, C++20, and Go runtimes for compute-heavy routines.',
        'Frameworks & Libraries: React SPA, Express middleware, Apache Kafka, and Docker containerization.',
        'Data Tier: Distributed Redis cache with PostgreSQL relational ACID persistence.',
        'Deployment Infrastructure: Linux Kubernetes clusters with automated health probes and CI/CD pipelines.',
      ],
      visualIdea: 'Grid matrix categorizing Frontend, Backend, Compute, and Infrastructure logos and specifications.',
      speakerNotes: 'Our implementation relies on industry-standard containerized cloud technologies optimized for low memory footprint.',
    },
    {
      slideNumber: 9,
      title: 'Complexity & Asymptotic Analysis',
      content: [
        'Time Complexity: Best Case O(1), Average Case O(N log N), Worst-case bounded at O(N log N).',
        'Space Complexity: Space-optimal O(N) allocation avoiding redundant memory duplication.',
        'Empirical CPU cache locality optimization: continuous array allocations minimizing L1/L2 cache misses.',
        'Mathematical proof demonstrating asymptotic optimality over classical O(N²) quadratic baselines.',
      ],
      visualIdea: 'Asymptotic Big-O growth curves comparing O(1), O(log N), O(N), and O(N log N) execution times.',
      speakerNotes: 'Crucially, our asymptotic analysis verifies that computation scales sub-linearly with data volume, keeping CPU consumption within bounds.',
    },
    {
      slideNumber: 10,
      title: 'Security, Fault Tolerance & Recovery',
      content: [
        'Defense-in-depth architecture: Role-Based Access Control (RBAC) and mutual TLS (mTLS) authentication.',
        'Automated circuit breaker patterns preventing cascade failure during upstream network timeouts.',
        'Exponential backoff with jitter on transient retries preventing thundering herd scenarios.',
        'State persistence with write-ahead logging (WAL) ensuring zero data loss upon abrupt node reboot.',
      ],
      visualIdea: 'Security shield matrix displaying encryption layers, authentication barriers, and fallback breakers.',
      speakerNotes: 'Security and fault isolation are central to our design. Circuit breakers isolate faulty services, preserving system uptime.',
    },
    {
      slideNumber: 11,
      title: 'Experimental Setup & Simulation Parameters',
      content: [
        'Hardware Infrastructure: 16-Core AMD EPYC processor, 64 GB DDR5 RAM, NVMe PCIe 4.0 storage.',
        'Workload Simulation: Synthetic generator producing 10,000 to 100,000 concurrent transactions/sec.',
        'Baseline Configurations: Benchmark tests executed against legacy monolithic and non-optimized pipelines.',
        'Telemetry Tools: Prometheus metric scrapers and Grafana dashboards measuring real-time latency.',
      ],
      visualIdea: 'Hardware testbed diagram detailing network topology, load generators, and observability nodes.',
      speakerNotes: 'We established an empirical testbed subjecting the architecture to sustained stress loads exceeding 100,000 transactions per second.',
    },
    {
      slideNumber: 12,
      title: 'Empirical Results & Latency Profiling',
      content: [
        'P50 Median Latency: Drastic reduction from 280ms down to 18ms (93.5% speedup).',
        'P99 Tail Latency: Bound firmly below 45ms even under 90% peak system saturation.',
        'Throughput: Sustained 4.8x higher transactions per second compared to standard baselines.',
        'Zero packet loss or unhandled exceptions recorded during sustained 72-hour benchmark tests.',
      ],
      visualIdea: 'Bar charts comparing latency and throughput before and after architectural optimization.',
      speakerNotes: 'The experimental data demonstrates a 93% decrease in median latency, accompanied by a 4.8-fold throughput increase.',
    },
    {
      slideNumber: 13,
      title: 'Scalability & Stress Testing Benchmarks',
      content: [
        'Linear horizontal scalability validated across 4, 8, 16, 32, and 64 worker nodes.',
        'Chaos Engineering validation: random node termination recovered state in under 1.4 seconds.',
        'Memory Footprint: Stable garbage collection cycles with zero memory leaks over extended runs.',
        'CPU Utilization: Efficient multi-core saturation averaging 68% without thermal throttling.',
      ],
      visualIdea: 'Line graph depicting linear scaling throughput curve vs cluster node count.',
      speakerNotes: 'Under chaos testing, our framework proved self-healing, restoring replica synchronization in less than 1.5 seconds.',
    },
    {
      slideNumber: 14,
      title: 'Comparative Analysis Matrix',
      content: [
        'Comprehensive evaluation against 3 premier commercial and open-source methodologies.',
        'Resource Efficiency: 42% lower energy and cloud compute expenditure via workload rightsizing.',
        'Maintainability & Modularity: High cohesive loose-coupling adhering to SOLID design principles.',
        'Radar chart synthesis proving dominant score in throughput, fault recovery, and operational cost.',
      ],
      visualIdea: 'Multi-variable radar chart comparing Speed, Scalability, Cost, Security, and Ease of Deployment.',
      speakerNotes: 'This comparative matrix highlights our advantage across all 5 key engineering dimensions against existing market options.',
    },
    {
      slideNumber: 15,
      title: 'Industrial Applications & Real-World Use Cases',
      content: [
        'Autonomous Aviation & Telemetry: High-frequency sensor fusion and flight navigation data streaming.',
        'Healthcare & Medical Diagnostics: Secure, real-time patient biometric analytics and monitoring.',
        'Smart Cities & IoT Networks: Large-scale municipal grid control and traffic signal optimization.',
        'FinTech & High-Frequency Transactions: Fraud detection and ledger reconciliation within microsecond windows.',
      ],
      visualIdea: 'Four-quadrant application showcase depicting aerospace, healthcare, IoT, and financial systems.',
      speakerNotes: 'The practical viability of our system spans mission-critical domains including aerospace flight telemetry, healthcare, and finance.',
    },
    {
      slideNumber: 16,
      title: 'Challenges, Limitations & Mitigations',
      content: [
        'Challenge 1: High initial network initialization overhead during cold-boot cluster provisioning.',
        'Mitigation: Implemented pre-warmed container worker pools and warm-state connection pooling.',
        'Challenge 2: Edge-device memory limitations in low-power micro-controllers.',
        'Mitigation: Model quantization and byte-level compression reducing footprint by 65%.',
      ],
      visualIdea: 'Two-column Challenge vs Mitigation comparative cards with actionable engineering solutions.',
      speakerNotes: 'We transparently identify system constraints, such as edge device memory, and detail our quantization solutions.',
    },
    {
      slideNumber: 17,
      title: 'Future Scope & Research Roadmap',
      content: [
        'Integration of hardware-accelerated FPGA and ASIC cryptographic accelerators.',
        'Exploration of quantum-resistant post-quantum cryptographic primitives (NIST standards).',
        'Federated edge-cloud collaborative intelligence with differential privacy guarantees.',
        'Open-source benchmarking toolkit release for academic and student researchers at IARE.',
      ],
      visualIdea: 'Gantt chart and milestone roadmap showing Q1 to Q4 research and deployment milestones.',
      speakerNotes: 'Looking forward, our research roadmap includes FPGA hardware acceleration and post-quantum encryption protocols.',
    },
    {
      slideNumber: 18,
      title: 'Conclusion & Viva Defense References',
      content: [
        `${cleanTopic} successfully engineered, validated, and benchmarked against rigorous criteria.`,
        'Demonstrates clear algorithmic efficiency, sub-millisecond responsiveness, and robust fault tolerance.',
        'Meets all Institute of Aeronautical Engineering (IARE) academic standards and Bloom’s taxonomy targets.',
        'References: IEEE Transactions on Computers, ACM Computing Surveys, and IARE Course Compendium.',
      ],
      visualIdea: 'Summary checkmarks banner with official references list and IARE institutional badge.',
      speakerNotes: 'In conclusion, our investigation confirms that the proposed architecture achieves exceptional performance and reliability. Thank you! I am now ready to take your viva defense questions.',
    },
  ];

  // Select the requested number of slides evenly or slice appropriately
  let selectedSlides: SlideItem[] = [];
  if (requestedCount === 18) {
    selectedSlides = fullSlideCatalog;
  } else {
    // Always include slide 1 (cover), slide 2 (intro), middle key slides, and the conclusion slide
    const firstSlide = fullSlideCatalog[0];
    const lastSlide = fullSlideCatalog[17];
    const middleSlides = fullSlideCatalog.slice(1, 17);

    // Pick (requestedCount - 2) evenly spaced slides from middle
    const step = middleSlides.length / (requestedCount - 2);
    const chosenMiddle: SlideItem[] = [];
    for (let i = 0; i < requestedCount - 2; i++) {
      const idx = Math.min(middleSlides.length - 1, Math.floor(i * step));
      chosenMiddle.push(middleSlides[idx]);
    }

    selectedSlides = [firstSlide, ...chosenMiddle, lastSlide];
  }

  // Renumber slide items sequentially 1..N
  const finalSlides = selectedSlides.map((s, index) => ({
    ...s,
    slideNumber: index + 1,
  }));

  return {
    title: cleanTopic,
    subtitle: `Department of ${branch} • ${courseTitle}`,
    presenter: `${name} (${rollNo})`,
    slides: finalSlides,
  };
}
