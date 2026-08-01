import { Project } from '../types';

// Utility to create crisp SVG screen data URLs for mock screenshots
function createMockScreenSvg(
  bgColor: string,
  accentColor: string,
  title: string,
  contentType: 'workout' | 'ai' | 'wallet' | 'chart' | 'food' | 'map' | 'profile' | 'generative'
): string {
  let innerContent = '';

  if (contentType === 'workout') {
    innerContent = `
      <rect x="20" y="80" width="320" height="140" rx="20" fill="rgba(255,255,255,0.08)" />
      <text x="40" y="115" fill="#94A3B8" font-size="14" font-family="sans-serif">CURRENT HEART RATE</text>
      <text x="40" y="160" fill="#FFFFFF" font-size="38" font-weight="bold" font-family="sans-serif">142 <tspan font-size="18" fill="${accentColor}">BPM</tspan></text>
      <path d="M 40 190 Q 90 170 140 195 T 240 175 T 320 185" fill="none" stroke="${accentColor}" stroke-width="4" />
      
      <!-- Ring -->
      <circle cx="180" cy="340" r="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="16" />
      <circle cx="180" cy="340" r="80" fill="none" stroke="${accentColor}" stroke-width="16" stroke-dasharray="502" stroke-dashoffset="120" stroke-linecap="round" />
      <text x="180" y="335" fill="#FFFFFF" font-size="28" font-weight="bold" text-anchor="middle" font-family="sans-serif">76%</text>
      <text x="180" y="360" fill="#94A3B8" font-size="13" text-anchor="middle" font-family="sans-serif">Daily Active Goal</text>

      <!-- Stat Cards -->
      <rect x="20" y="460" width="150" height="100" rx="16" fill="rgba(255,255,255,0.06)" />
      <text x="40" y="490" fill="#94A3B8" font-size="12" font-family="sans-serif">CALORIES BURNED</text>
      <text x="40" y="525" fill="#FFFFFF" font-size="22" font-weight="bold" font-family="sans-serif">540 kcal</text>

      <rect x="190" y="460" width="150" height="100" rx="16" fill="rgba(255,255,255,0.06)" />
      <text x="210" y="490" fill="#94A3B8" font-size="12" font-family="sans-serif">ACTIVE TIME</text>
      <text x="210" y="525" fill="#FFFFFF" font-size="22" font-weight="bold" font-family="sans-serif">48 mins</text>
    `;
  } else if (contentType === 'ai') {
    innerContent = `
      <rect x="20" y="80" width="320" height="120" rx="20" fill="url(#aiGrad)" />
      <text x="40" y="120" fill="#FFFFFF" font-size="18" font-weight="bold" font-family="sans-serif">⚡ Gemini AI Coach</text>
      <text x="40" y="150" fill="rgba(255,255,255,0.85)" font-size="13" font-family="sans-serif">"Based on your muscle fatigue, today focus on light upper body hypertrophy."</text>
      
      <rect x="20" y="220" width="320" height="70" rx="16" fill="rgba(255,255,255,0.06)" />
      <circle cx="50" cy="255" r="16" fill="${accentColor}" />
      <text x="80" y="250" fill="#FFFFFF" font-size="15" font-weight="bold" font-family="sans-serif">Incline Dumbbell Press</text>
      <text x="80" y="270" fill="#94A3B8" font-size="12" font-family="sans-serif">4 Sets × 12 Reps • 24kg</text>

      <rect x="20" y="305" width="320" height="70" rx="16" fill="rgba(255,255,255,0.06)" />
      <circle cx="50" cy="340" r="16" fill="${accentColor}" />
      <text x="80" y="335" fill="#FFFFFF" font-size="15" font-weight="bold" font-family="sans-serif">Cable Chest Flyes</text>
      <text x="80" y="355" fill="#94A3B8" font-size="12" font-family="sans-serif">3 Sets × 15 Reps • 15kg</text>

      <rect x="20" y="390" width="320" height="70" rx="16" fill="rgba(255,255,255,0.06)" />
      <circle cx="50" cy="425" r="16" fill="${accentColor}" />
      <text x="80" y="420" fill="#FFFFFF" font-size="15" font-weight="bold" font-family="sans-serif">Tricep Rope Pushdowns</text>
      <text x="80" y="440" fill="#94A3B8" font-size="12" font-family="sans-serif">4 Sets × 12 Reps • 20kg</text>

      <rect x="20" y="510" width="320" height="50" rx="25" fill="${accentColor}" />
      <text x="180" y="542" fill="#FFFFFF" font-size="16" font-weight="bold" text-anchor="middle" font-family="sans-serif">Start Guided Workout</text>
    `;
  } else if (contentType === 'wallet') {
    innerContent = `
      <rect x="20" y="80" width="320" height="180" rx="24" fill="url(#walletGrad)" />
      <text x="45" y="120" fill="rgba(255,255,255,0.7)" font-size="13" font-family="sans-serif">TOTAL BALANCE</text>
      <text x="45" y="165" fill="#FFFFFF" font-size="34" font-weight="bold" font-family="sans-serif">$24,590.80</text>
      <text x="45" y="195" fill="#4ADE80" font-size="14" font-family="sans-serif">+12.4% this week (+$2,710.00)</text>

      <g transform="translate(20, 280)">
        <circle cx="40" cy="30" r="28" fill="${accentColor}" />
        <text x="40" y="35" fill="#FFF" font-size="18" text-anchor="middle">↑</text>
        <text x="40" y="75" fill="#94A3B8" font-size="12" text-anchor="middle">Send</text>

        <circle cx="120" cy="30" r="28" fill="rgba(255,255,255,0.1)" />
        <text x="120" y="35" fill="#FFF" font-size="18" text-anchor="middle">↓</text>
        <text x="120" y="75" fill="#94A3B8" font-size="12" text-anchor="middle">Receive</text>

        <circle cx="200" cy="30" r="28" fill="rgba(255,255,255,0.1)" />
        <text x="200" y="35" fill="#FFF" font-size="18" text-anchor="middle">⇄</text>
        <text x="200" y="75" fill="#94A3B8" font-size="12" text-anchor="middle">Swap</text>

        <circle cx="280" cy="30" r="28" fill="rgba(255,255,255,0.1)" />
        <text x="280" y="35" fill="#FFF" font-size="18" text-anchor="middle">⊕</text>
        <text x="280" y="75" fill="#94A3B8" font-size="12" text-anchor="middle">Buy</text>
      </g>

      <text x="20" y="410" fill="#FFFFFF" font-size="16" font-weight="bold" font-family="sans-serif">Top Assets</text>
      <rect x="20" y="430" width="320" height="60" rx="14" fill="rgba(255,255,255,0.06)" />
      <circle cx="50" cy="460" r="16" fill="#F7931A" />
      <text x="80" y="455" fill="#FFFFFF" font-size="15" font-weight="bold">Bitcoin (BTC)</text>
      <text x="80" y="473" fill="#94A3B8" font-size="12">0.24 BTC • $68,400</text>
      <text x="310" y="465" fill="#FFFFFF" font-size="15" font-weight="bold" text-anchor="end">$16,416</text>

      <rect x="20" y="500" width="320" height="60" rx="14" fill="rgba(255,255,255,0.06)" />
      <circle cx="50" cy="530" r="16" fill="#627EEA" />
      <text x="80" y="525" fill="#FFFFFF" font-size="15" font-weight="bold">Ethereum (ETH)</text>
      <text x="80" y="543" fill="#94A3B8" font-size="12">2.35 ETH • $3,480</text>
      <text x="310" y="535" fill="#FFFFFF" font-size="15" font-weight="bold" text-anchor="end">$8,178</text>
    `;
  } else if (contentType === 'food') {
    innerContent = `
      <rect x="20" y="80" width="320" height="180" rx="20" fill="#2A2A38" />
      <circle cx="180" cy="150" r="50" fill="${accentColor}" opacity="0.2" />
      <text x="180" y="155" fill="${accentColor}" font-size="42" text-anchor="middle">🍔</text>
      <rect x="30" y="210" width="100" height="24" rx="12" fill="${accentColor}" />
      <text x="80" y="226" fill="#FFF" font-size="11" font-weight="bold" text-anchor="middle">30% OFF DEAL</text>
      <text x="140" y="226" fill="#94A3B8" font-size="12">Est. 20-25 mins</text>

      <text x="20" y="295" fill="#FFFFFF" font-size="20" font-weight="bold" font-family="sans-serif">The Smash Burger Bar</text>
      <text x="20" y="318" fill="#94A3B8" font-size="13">Double Angus Patty, Cheddar, Secret Sauce</text>

      <text x="20" y="360" fill="#FFFFFF" font-size="16" font-weight="bold">Customize Meal</text>
      <rect x="20" y="380" width="320" height="50" rx="12" fill="rgba(255,255,255,0.06)" />
      <text x="40" y="410" fill="#FFF" font-size="14">Extra Melted Cheese</text>
      <text x="310" y="410" fill="${accentColor}" font-size="14" font-weight="bold" text-anchor="end">+$1.50</text>

      <rect x="20" y="440" width="320" height="50" rx="12" fill="rgba(255,255,255,0.06)" />
      <text x="40" y="470" fill="#FFF" font-size="14">Crispy Bacon Strips</text>
      <text x="310" y="470" fill="${accentColor}" font-size="14" font-weight="bold" text-anchor="end">+$2.00</text>

      <rect x="20" y="510" width="320" height="50" rx="25" fill="${accentColor}" />
      <text x="180" y="542" fill="#FFFFFF" font-size="16" font-weight="bold" text-anchor="middle">Add to Cart — $14.50</text>
    `;
  } else {
    // Default Chart / Analytics Screen
    innerContent = `
      <rect x="20" y="80" width="320" height="220" rx="20" fill="rgba(255,255,255,0.06)" />
      <text x="40" y="115" fill="#94A3B8" font-size="13">WEEKLY METRICS & ANALYTICS</text>
      <text x="40" y="150" fill="#FFFFFF" font-size="28" font-weight="bold">+48.2% Growth</text>
      
      <!-- Bars -->
      <g transform="translate(40, 180)">
        <rect x="0" y="30" width="24" height="50" rx="6" fill="rgba(255,255,255,0.2)" />
        <rect x="40" y="10" width="24" height="70" rx="6" fill="rgba(255,255,255,0.2)" />
        <rect x="80" y="40" width="24" height="40" rx="6" fill="rgba(255,255,255,0.2)" />
        <rect x="120" y="0" width="24" height="80" rx="6" fill="${accentColor}" />
        <rect x="160" y="20" width="24" height="60" rx="6" fill="${accentColor}" opacity="0.8" />
        <rect x="200" y="15" width="24" height="65" rx="6" fill="${accentColor}" />
        <rect x="240" y="5" width="24" height="75" rx="6" fill="${accentColor}" />
      </g>

      <rect x="20" y="320" width="320" height="80" rx="16" fill="rgba(255,255,255,0.06)" />
      <text x="40" y="355" fill="#FFFFFF" font-size="16" font-weight="bold">AI Insights Report</text>
      <text x="40" y="380" fill="#94A3B8" font-size="13">Retention increased by 18% after v2.4 launch.</text>

      <rect x="20" y="415" width="320" height="80" rx="16" fill="rgba(255,255,255,0.06)" />
      <text x="40" y="450" fill="#FFFFFF" font-size="16" font-weight="bold">Active Devices</text>
      <text x="40" y="475" fill="#94A3B8" font-size="13">94% iOS / Android mobile clients active.</text>
    `;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="360" height="640">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentColor}" />
          <stop offset="100%" stop-color="#4F46E5" />
        </linearGradient>
        <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentColor}" />
          <stop offset="100%" stop-color="#3B82F6" />
        </linearGradient>
      </defs>

      <!-- Screen Background -->
      <rect width="360" height="640" fill="url(#bgGrad)" />

      <!-- Status Bar -->
      <text x="30" y="38" fill="#FFFFFF" font-size="13" font-weight="bold" font-family="sans-serif">9:41</text>
      <g transform="translate(290, 26)">
        <path d="M0 8 A 6 6 0 0 1 12 8 A 6 6 0 0 1 0 8 Z" fill="#FFFFFF" />
        <rect x="16" y="2" width="18" height="10" rx="3" fill="none" stroke="#FFFFFF" stroke-width="2" />
        <rect x="18" y="4" width="10" height="6" rx="1" fill="#FFFFFF" />
      </g>

      <!-- App Header Bar -->
      <text x="20" y="66" fill="#FFFFFF" font-size="18" font-weight="bold" font-family="sans-serif">${title}</text>

      ${innerContent}

      <!-- Bottom Nav Bar -->
      <rect x="0" y="580" width="360" height="60" fill="rgba(15,23,42,0.95)" />
      <circle cx="60" cy="610" r="12" fill="${accentColor}" />
      <circle cx="140" cy="610" r="10" fill="#64748B" />
      <circle cx="220" cy="610" r="10" fill="#64748B" />
      <circle cx="300" cy="610" r="10" fill="#64748B" />
      <rect x="120" y="632" width="120" height="4" rx="2" fill="#FFFFFF" />
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SEED_PROJECTS: Project[] = [
  {
    id: 'seed-pulsefit',
    name: 'PulseFit Pro',
    tagline: 'AI-Powered Personal Fitness & Recovery Companion',
    description: 'PulseFit Pro converts raw biometric workout data into actionable recovery scores and personalized gym routines using Gemini 2.5 AI. Built natively with Flutter and Material 3.',
    category: 'Health & Fitness',
    primaryColor: '#06B6D4',
    secondaryColor: '#3B82F6',
    techStack: ['Flutter', 'Material 3', 'Gemini AI', 'Firebase', 'HealthConnect', 'GetX'],
    createdAt: '2026-07-20T10:00:00.000Z',
    updatedAt: '2026-07-28T14:20:00.000Z',
    isFavorite: true,
    links: {
      githubUrl: 'https://github.com/example/pulsefit-pro',
      apkUrl: 'https://github.com/example/pulsefit-pro/releases/download/v1.2/pulsefit-v1.2.apk',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.pulsefit.app',
      websiteUrl: 'https://pulsefit.app',
    },
    deviceConfig: {
      deviceType: 'iphone',
      color: 'titanium',
      showGlare: true,
      showShadow: true,
      notchType: 'dynamic',
      theme: 'dark',
    },
    screens: [
      {
        id: 'screen-1',
        title: 'Live Heart & Cardio Monitor',
        description: 'Real-time telemetry showing heart rate zones, calories burned, and active workout duration.',
        imageUrl: createMockScreenSvg('#0F172A', '#06B6D4', 'PulseFit • Cardio', 'workout'),
        order: 0,
        category: 'Workout',
        aiExtractedFeatures: ['Real-time telemetry', 'Custom heart rate zones', 'Calorie burning velocity graph'],
        aiAnalysisDone: true,
      },
      {
        id: 'screen-2',
        title: 'Gemini AI Workout Coach',
        description: 'Automated AI recommendations tailoring sets, reps, and target weights based on daily recovery scores.',
        imageUrl: createMockScreenSvg('#0F172A', '#06B6D4', 'PulseFit • AI Coach', 'ai'),
        order: 1,
        category: 'AI Assistant',
        aiExtractedFeatures: ['Adaptive hypertrophy routine', 'Fatigue analyzer', '1-Tap start guided session'],
        aiAnalysisDone: true,
      },
      {
        id: 'screen-3',
        title: 'Weekly Performance Analytics',
        description: 'Detailed bar charts and growth velocity indicators comparing weekly volume and strain.',
        imageUrl: createMockScreenSvg('#0F172A', '#06B6D4', 'PulseFit • Analytics', 'chart'),
        order: 2,
        category: 'Analytics',
        aiExtractedFeatures: ['Weekly volume trendlines', 'Muscle group breakdown', 'Personal record milestones'],
        aiAnalysisDone: true,
      },
    ],
    showcase: {
      heroTitle: 'Transform Your Gym Journey with Gemini AI',
      heroTagline: 'PulseFit Pro monitors your telemetry, calculates muscle fatigue, and builds perfect workouts in real-time.',
      overviewSummary: 'PulseFit Pro is a production Flutter application that eliminates fitness guesswork. By pairing smartwatch telemetry with server-side AI, athletes receive precise daily guidance.',
      features: [
        {
          id: 'feat-1',
          title: 'Live Biometric Telemetry',
          description: 'Tracks heart rate zones and active strain with sub-second latency.',
          iconName: 'Activity',
          screenId: 'screen-1',
        },
        {
          id: 'feat-2',
          title: 'Gemini AI Adaptive Coach',
          description: 'Generates progressive overload routines adjusted to your sleep & fatigue.',
          iconName: 'Zap',
          screenId: 'screen-2',
        },
        {
          id: 'feat-3',
          title: 'Deep Analytics Dashboard',
          description: 'Visualizes volume growth, max lifts, and recovery trends over time.',
          iconName: 'BarChart3',
          screenId: 'screen-3',
        },
      ],
      userFlow: [
        { stepNumber: 1, title: 'Connect Wearable', description: 'Pair Apple Watch or WearOS in seconds.', screenId: 'screen-1' },
        { stepNumber: 2, title: 'Get AI Guidance', description: 'Receive today\'s customized set & rep targets.', screenId: 'screen-2' },
        { stepNumber: 3, title: 'Track & Elevate', description: 'Log workouts and monitor long-term gains.', screenId: 'screen-3' },
      ],
      milestones: [
        { id: 'm-1', title: 'v1.0 Core Engine Release', description: 'Local storage, heart rate BLE pairing, basic logging.', date: 'May 2026', status: 'completed' },
        { id: 'm-2', title: 'v1.2 Gemini AI Upgrade', description: 'Integrated Gemini 2.5 for recovery score & AI coach.', date: 'July 2026', status: 'completed' },
        { id: 'm-3', title: 'v2.0 Social Competitions', description: 'Global fitness leaderboards and group challenges.', date: 'Q4 2026', status: 'planned' },
      ],
      architectureNotes: 'Clean Architecture with GetX controller bindings, Hive offline persistence, and server-side Gemini 2.5 API integration.',
    },
  },
  {
    id: 'seed-novapay',
    name: 'NovaPay Wallet',
    tagline: 'Next-Generation Crypto & Fiat Multi-Asset Wallet',
    description: 'Instant biometrics-secured transactions, cross-chain crypto swaps, and real-time market telemetry wrapped in a fluid Material 3 interface.',
    category: 'Finance',
    primaryColor: '#8B5CF6',
    secondaryColor: '#3B82F6',
    techStack: ['Flutter', 'Web3', 'Node.js', 'Hive Storage', 'Biometrics', 'GoRouter'],
    createdAt: '2026-07-15T08:00:00.000Z',
    updatedAt: '2026-07-27T18:00:00.000Z',
    isFavorite: true,
    links: {
      githubUrl: 'https://github.com/example/novapay-wallet',
      apkUrl: 'https://github.com/example/novapay-wallet/releases',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.novapay.wallet',
      websiteUrl: 'https://novapay.io',
    },
    deviceConfig: {
      deviceType: 'pixel',
      color: 'black',
      showGlare: true,
      showShadow: true,
      notchType: 'punchhole',
      theme: 'dark',
    },
    screens: [
      {
        id: 'screen-np-1',
        title: 'Multi-Asset Portfolio',
        description: 'Comprehensive overview of fiat and cryptocurrency balances with weekly change percentages.',
        imageUrl: createMockScreenSvg('#0F172A', '#8B5CF6', 'NovaPay • Portfolio', 'wallet'),
        order: 0,
        category: 'Dashboard',
        aiExtractedFeatures: ['Unified asset balance', 'Instant swap / send actions', 'Live crypto valuation ticker'],
        aiAnalysisDone: true,
      },
      {
        id: 'screen-np-2',
        title: 'Market Trends & Analytics',
        description: 'Real-time price feeds with AI-assisted sentiment analysis and market alerts.',
        imageUrl: createMockScreenSvg('#0F172A', '#8B5CF6', 'NovaPay • Markets', 'chart'),
        order: 1,
        category: 'Markets',
        aiExtractedFeatures: ['Live candlestick feeds', 'AI Market sentiment rating', 'Instant price target alerts'],
        aiAnalysisDone: true,
      },
    ],
    showcase: {
      heroTitle: 'Send, Swap & Manage Wealth Instantly',
      heroTagline: 'NovaPay combines military-grade encryption with ultra-fast UX for seamless crypto and fiat transactions.',
      overviewSummary: 'Built for the modern crypto economy, NovaPay delivers sub-second cross-chain swaps and local biometric authentication.',
      features: [
        { id: 'f-1', title: 'Biometric Security', description: 'Hardware enclave key protection and face/thumbprint verification.', iconName: 'Shield', screenId: 'screen-np-1' },
        { id: 'f-2', title: 'Zero-Fee Swaps', description: 'Direct liquidity routing for instant token exchanges.', iconName: 'RefreshCw', screenId: 'screen-np-1' },
        { id: 'f-3', title: 'Market Intelligence', description: 'Real-time charts powered by web sockets and AI alerts.', iconName: 'TrendingUp', screenId: 'screen-np-2' },
      ],
      userFlow: [
        { stepNumber: 1, title: 'Create Vault', description: 'Generate seed phrase protected by secure hardware enclave.', screenId: 'screen-np-1' },
        { stepNumber: 2, title: 'Deposit or Buy', description: 'Add funds via card, Apple Pay, or crypto transfer.', screenId: 'screen-np-1' },
        { stepNumber: 3, title: 'Transact Worldwide', description: 'Send money anywhere with zero delays.', screenId: 'screen-np-2' },
      ],
      milestones: [
        { id: 'm-1', title: 'Security Audit Passed', description: 'CertiK smart contract and mobile penetration audit completed.', date: 'June 2026', status: 'completed' },
        { id: 'm-2', title: 'Global Launch', description: 'iOS and Android release with 50+ supported currencies.', date: 'July 2026', status: 'completed' },
      ],
      architectureNotes: 'Clean Architecture with Web3 RPC nodes, Encrypted SecureStorage, and GetX reactive state management.',
    },
  },
];
