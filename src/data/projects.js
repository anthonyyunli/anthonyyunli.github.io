export const projects = [
  {
    id: 'cansat',
    title: 'CanSat Design Challenge',
    role: 'Software Lead · 2025–2026',
    stack: 'Python, PyTorch',
    description: 'Computer vision, sensor processing, and mission software for a rocket-launched CanSat, under compute, memory, and power constraints.',
    source: 'https://github.com/CantSatTeam/CanSat-MHE',
    details: [
      'Investigated CNN failures in blurred and degraded imagery and adapted TerrainMesh’s graph neural network for aerial 3D reconstruction and Raspberry Pi inference, with guidance from a Google DeepMind mentor.',
      'Built paired RGB/elevation-map preprocessing, sparse-depth sampling, and augmentations for image scale, blur, lighting, and camera quality.',
      'Coordinated delivery of a working model for a University of Alberta research presentation and received positive panel feedback.',
      'Won the Educational Outreach Award with the team at the Canada-wide challenge.',
    ],
  },
  {
    id: 'mayhem',
    title: 'Mayhem',
    role: 'Development Lead',
    stack: 'Lua/Luau, Internal Tooling',
    description: 'A multiplayer party FPS with unusual weapons and abilities. Led a 12-person team across code, art, animation, and music to build a game played by over 200 players.',
    source: 'https://github.com/Roblox-MAYHEM/Game',
    details: [
      'Refactored tightly coupled systems for maintainability and built playtesting and QA tools that cut testing and iteration time by 50%.',
    ],
  },
  {
    id: 'compact-ai-text-detectors',
    title: 'Compact AI Text Detectors',
    role: 'Independent CS229 Project · 2026',
    stack: 'Python, PyTorch',
    description: 'Exploring compact AI-text detection using matched comparisons of human and AI responses to limit topic-based shortcuts.',
    details: [
      'Built a CNN pairwise ranker and covariance-based classifier, then extended the ranker with HMM/Viterbi decoding for mixed-authorship segmentation.',
    ],
  },
  {
    id: 'competitive-programming',
    title: 'Competitive Programming',
    stack: 'C++',
    description: 'Solutions to programming contests and algorithmic problems.',
    source: 'https://github.com/anthonyyunli/competitive-programming',
  },
  {
    id: 'substracker',
    title: 'Substracker',
    stack: 'Vue, Django',
    description: 'A subscription tracker with upcoming-payment reminders and usage tracking. Built for my IB Computer Science IA.',
    source: 'https://github.com/anthonyyunli/subs-tracker',
  },
  {
    id: 'agentegg',
    title: 'AgentEgg',
    stack: 'C#',
    description: 'A game built for GMTK Game Jam 2026.',
    source: 'https://github.com/anthonyyunli/AgentEgg-GMTK-2026',
  },
];
