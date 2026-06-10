const fs = require('fs');
const path = require('path');

const cssPath = path.join('D:', 'job-tracker', 'frontend', 'src', 'index.css');

if (!fs.existsSync(cssPath)) {
  console.error("CSS file not found at " + cssPath);
  process.exit(1);
}

let cssContent = fs.readFileSync(cssPath, 'utf-8');

// Replace Root Colors
cssContent = cssContent.replace(/--bg-main:\s*#[0-9a-fA-F]+;/g, '--bg-main: #f0f4f0;'); // Light olive gray
cssContent = cssContent.replace(/--bg-card:\s*rgba\([^)]+\);/g, '--bg-card: rgba(255, 255, 255, 0.85);');
cssContent = cssContent.replace(/--bg-card-hover:\s*rgba\([^)]+\);/g, '--bg-card-hover: rgba(255, 255, 255, 1);');
cssContent = cssContent.replace(/--border-glass:\s*rgba\([^)]+\);/g, '--border-glass: rgba(107, 142, 35, 0.2);');
cssContent = cssContent.replace(/--border-glass-hover:\s*rgba\([^)]+\);/g, '--border-glass-hover: rgba(107, 142, 35, 0.35);');

cssContent = cssContent.replace(/--primary:\s*#[0-9a-fA-F]+;/g, '--primary: #6b8e23;'); // Olive Drab
cssContent = cssContent.replace(/--primary-glow:\s*rgba\([^)]+\);/g, '--primary-glow: rgba(107, 142, 35, 0.3);');
cssContent = cssContent.replace(/--primary-light:\s*#[0-9a-fA-F]+;/g, '--primary-light: #556b2f;'); // Dark Olive Green
cssContent = cssContent.replace(/--secondary:\s*#[0-9a-fA-F]+;/g, '--secondary: #e8eee8;');
cssContent = cssContent.replace(/--cyan-accent:\s*#[0-9a-fA-F]+;/g, '--cyan-accent: #2e8b57;'); // Sea Green
cssContent = cssContent.replace(/--cyan-glow:\s*rgba\([^)]+\);/g, '--cyan-glow: rgba(46, 139, 87, 0.3);');

// Replace dark text colors
cssContent = cssContent.replace(/color:\s*#fff;/g, 'color: #2c3e2c;');
cssContent = cssContent.replace(/color:\s*#f3f0f7;/g, 'color: #1f2d1f;');
cssContent = cssContent.replace(/color:\s*#b0aabf;/g, 'color: #5d6e5d;');
cssContent = cssContent.replace(/color:\s*#e0dced;/g, 'color: #3b4d3b;');
cssContent = cssContent.replace(/color:\s*#8c869c;/g, 'color: #6a7b6a;');
cssContent = cssContent.replace(/color:\s*#7d778a;/g, 'color: #7b8c7b;');
cssContent = cssContent.replace(/background:\s*#141226;/g, 'background: #ffffff;'); // Select backgrounds
cssContent = cssContent.replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.3\);/g, 'background: rgba(0, 0, 0, 0.05);');
cssContent = cssContent.replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.2\);/g, 'background: rgba(0, 0, 0, 0.03);');
cssContent = cssContent.replace(/background:\s*rgba\(20,\s*18,\s*38,\s*0\.4\);/g, 'background: rgba(255, 255, 255, 0.6);');
cssContent = cssContent.replace(/background:\s*rgba\(14,\s*12,\s*28,\s*0\.7\);/g, 'background: rgba(240, 244, 240, 0.9);');
cssContent = cssContent.replace(/background:\s*rgba\(14,\s*12,\s*28,\s*0\.45\);/g, 'background: rgba(245, 248, 245, 0.7);');

// Body background gradient
cssContent = cssContent.replace(/radial-gradient\(at 50% 50%, rgba\(16, 12, 34, 0\.95\) 0px, rgba\(10, 9, 20, 1\) 100%\)/g, 
  'radial-gradient(at 50% 50%, rgba(240, 244, 240, 0.95) 0px, rgba(230, 235, 230, 1) 100%)');

fs.writeFileSync(cssPath, cssContent);
console.log("CSS updated to olive green light mode successfully!");
