import { Project } from '../types';

export class ExportService {
  /**
   * Generates a fully self-contained HTML file for the app showcase
   */
  static generateHTML(project: Project): string {
    const primaryColor = project.primaryColor || '#6366F1';
    const screens = project.screens || [];
    const features = project.showcase.features || [];
    const userFlow = project.showcase.userFlow || [];
    const links = project.links || {};

    const screensHTML = screens
      .map(
        (s, idx) => `
        <div class="screen-card">
          <div class="phone-frame">
            <div class="phone-notch"></div>
            <img src="${s.imageUrl}" alt="${s.title}" class="screen-img" />
          </div>
          <div class="screen-info">
            <span class="screen-num">Screen 0${idx + 1}</span>
            <h3 class="screen-title">${s.title}</h3>
            <p class="screen-desc">${s.description || ''}</p>
          </div>
        </div>
      `
      )
      .join('');

    const featuresHTML = features
      .map(
        (f) => `
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3 class="feature-title">${f.title}</h3>
          <p class="feature-desc">${f.description}</p>
        </div>
      `
      )
      .join('');

    const userFlowHTML = userFlow
      .map(
        (step) => `
        <div class="flow-step">
          <div class="step-badge">Step ${step.stepNumber}</div>
          <h4 class="step-title">${step.title}</h4>
          <p class="step-desc">${step.description}</p>
        </div>
      `
      )
      .join('');

    const techBadges = project.techStack
      .map((tech) => `<span class="tech-badge">${tech}</span>`)
      .join(' ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} — Showcase</title>
  <style>
    :root {
      --primary: ${primaryColor};
      --bg-dark: #0B0F19;
      --card-bg: #151C2C;
      --text-main: #F3F4F6;
      --text-muted: #9CA3AF;
      --border-color: rgba(255,255,255,0.1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--bg-dark); color: var(--text-main); line-height: 1.6; padding-bottom: 60px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    
    /* Header & Hero */
    header { padding: 32px 0; border-bottom: 1px solid var(--border-color); }
    .nav { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-weight: 800; font-size: 22px; color: #FFF; display: flex; align-items: center; gap: 10px; }
    .category-badge { background: rgba(255,255,255,0.1); color: var(--text-muted); padding: 4px 12px; border-radius: 20px; font-size: 13px; }
    
    .hero { padding: 80px 0 60px; text-align: center; }
    .hero-badge { display: inline-block; background: rgba(99, 102, 241, 0.15); color: var(--primary); padding: 6px 16px; border-radius: 30px; font-size: 14px; font-weight: 600; margin-bottom: 20px; border: 1px solid rgba(99, 102, 241, 0.3); }
    .hero h1 { font-size: 52px; font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; line-height: 1.15; }
    .hero p { font-size: 20px; color: var(--text-muted); max-width: 720px; margin: 0 auto 32px; }
    
    .cta-group { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; font-weight: 600; text-decoration: none; transition: transform 0.2s, opacity 0.2s; }
    .btn-primary { background: var(--primary); color: #FFF; }
    .btn-secondary { background: rgba(255,255,255,0.08); color: #FFF; border: 1px solid var(--border-color); }
    .btn:hover { opacity: 0.9; transform: translateY(-2px); }

    /* Tech Stack */
    .tech-stack { text-align: center; margin-bottom: 80px; }
    .tech-badge { display: inline-block; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: #E5E7EB; padding: 6px 14px; border-radius: 8px; font-size: 14px; margin: 4px; }

    /* Screens Carousel / Grid */
    .section-title { text-align: center; font-size: 32px; font-weight: 700; margin-bottom: 12px; }
    .section-subtitle { text-align: center; color: var(--text-muted); font-size: 16px; margin-bottom: 48px; }
    
    .screens-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-bottom: 90px; }
    .screen-card { background: var(--card-bg); border-radius: 20px; border: 1px solid var(--border-color); padding: 24px; text-align: center; transition: transform 0.3s; }
    .screen-card:hover { transform: translateY(-6px); }
    
    .phone-frame { width: 220px; height: 440px; margin: 0 auto 20px; background: #000; border-radius: 36px; padding: 10px; border: 4px solid #333; box-shadow: 0 20px 40px rgba(0,0,0,0.6); position: relative; overflow: hidden; }
    .phone-notch { width: 80px; height: 14px; background: #000; border-radius: 0 0 10px 10px; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 10; }
    .screen-img { width: 100%; height: 100%; object-fit: cover; border-radius: 26px; }
    
    .screen-num { font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
    .screen-title { font-size: 18px; font-weight: 700; margin: 4px 0 8px; }
    .screen-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; }

    /* Features */
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 90px; }
    .feature-card { background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border-color); padding: 32px; }
    .feature-icon { font-size: 28px; margin-bottom: 16px; }
    .feature-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    .feature-desc { color: var(--text-muted); font-size: 15px; }

    /* User Flow Timeline */
    .flow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 90px; }
    .flow-step { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 24px; border-left: 4px solid var(--primary); }
    .step-badge { font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
    .step-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
    .step-desc { font-size: 14px; color: var(--text-muted); }

    /* Footer */
    footer { border-top: 1px solid var(--border-color); padding-top: 40px; text-align: center; color: var(--text-muted); font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="container nav">
      <div class="logo">📱 ${project.name}</div>
      <span class="category-badge">${project.category || 'Mobile App'}</span>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <span class="hero-badge">Generated with ScreenCraft AI</span>
      <h1>${project.showcase.heroTitle || project.name}</h1>
      <p>${project.showcase.heroTagline || project.tagline}</p>
      
      <div class="cta-group">
        ${links.apkUrl ? `<a href="${links.apkUrl}" class="btn btn-primary" target="_blank">⬇ Direct APK Download</a>` : ''}
        ${links.playStoreUrl ? `<a href="${links.playStoreUrl}" class="btn btn-secondary" target="_blank">Google Play Store</a>` : ''}
        ${links.githubUrl ? `<a href="${links.githubUrl}" class="btn btn-secondary" target="_blank">GitHub Repository</a>` : ''}
        ${links.websiteUrl ? `<a href="${links.websiteUrl}" class="btn btn-secondary" target="_blank">Official Website</a>` : ''}
      </div>

      <div class="tech-stack">
        ${techBadges}
      </div>
    </section>

    <section>
      <h2 class="section-title">Interactive App Screens</h2>
      <p class="section-subtitle">Take a visual tour of key user flows and mobile UI components</p>
      <div class="screens-grid">
        ${screensHTML || '<p style="text-align:center; color:#999; grid-column: 1/-1;">No screenshots uploaded yet.</p>'}
      </div>
    </section>

    ${
      features.length > 0
        ? `
    <section>
      <h2 class="section-title">Key Capabilities</h2>
      <p class="section-subtitle">Engineered for performance, modularity, and seamless user interaction</p>
      <div class="features-grid">
        ${featuresHTML}
      </div>
    </section>
    `
        : ''
    }
  </main>

  <footer>
    <div class="container">
      <p>© ${new Date().getFullYear()} ${project.name}. Crafted with ScreenCraft AI.</p>
    </div>
  </footer>
</body>
</html>`;
  }

  /**
   * Generates a clean Markdown documentation / README for GitHub
   */
  static generateMarkdown(project: Project): string {
    const links = project.links || {};
    const screens = project.screens || [];
    const features = project.showcase.features || [];

    const techBadgesMarkdown = project.techStack
      .map(
        (t) =>
          `![${t}](https://img.shields.io/badge/${encodeURIComponent(t)}-${project.primaryColor.replace('#', '')}?style=for-the-badge)`
      )
      .join(' ');

    const featuresMarkdown = features.map((f) => `- **${f.title}**: ${f.description}`).join('\n');

    const screensMarkdown = screens
      .map(
        (s, idx) => `
### Screen ${idx + 1}: ${s.title}
${s.description}
`
      )
      .join('\n');

    return `# ${project.name}

> ${project.tagline || project.showcase.heroTagline}

${techBadgesMarkdown}

## 📖 Overview
${project.showcase.overviewSummary || project.description}

## ✨ Key Features
${featuresMarkdown || '- Modular Architecture\n- High performance state management'}

## 📱 App Screenshots & User Experience
${screensMarkdown || 'No screenshots attached.'}

## 🚀 Quick Links
${links.githubUrl ? `- [GitHub Repository](${links.githubUrl})` : ''}
${links.apkUrl ? `- [Download APK direct](${links.apkUrl})` : ''}
${links.playStoreUrl ? `- [Google Play Store](${links.playStoreUrl})` : ''}
${links.websiteUrl ? `- [Live Showcase Site](${links.websiteUrl})` : ''}

---
*Generated with [ScreenCraft AI](https://screencraft.ai)*
`;
  }

  /**
   * Helper to trigger a browser file download for HTML, MD, or JSON
   */
  static downloadFile(filename: string, content: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
