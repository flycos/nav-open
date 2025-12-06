const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeTools() {
  console.log('Starting daily tool update...');
  
  const newTools = [];
  
  // 从多个来源爬取
  const sources = [
    {
      name: 'GitHub Trending',
      url: 'https://github.com/trending',
      type: 'github'
    },
    {
      name: 'GitHub AI Trending',
      url: 'https://github.com/trending/ai',
      type: 'github'
    }
  ];
  
  for (const source of sources) {
    try {
      console.log(`Scraping from ${source.name}...`);
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      if (source.type === 'github') {
        $('article').each((i, el) => {
          if (i < 2) { // 只取2个
            const titleElement = $(el).find('h2 a');
            if (titleElement.length) {
              const title = titleElement.text().trim().replace(/\s+/g, ' ');
              const relativeLink = titleElement.attr('href');
              if (title && relativeLink) {
                const link = 'https://github.com' + relativeLink;
                newTools.push({
                  name: title,
                  url: link,
                  category: getCategoryFromTitle(title),
                  description: 'Trending open source project',
                  rating: 5
                });
              }
            }
          }
        });
      }
      
      console.log(`Found ${newTools.length} new tools from ${source.name}`);
      
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error.message);
    }
  }
  
  return newTools.slice(0, 3); // 确保只返回3个
}

function getCategoryFromTitle(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('ai') || titleLower.includes('ml') || titleLower.includes('machine learning')) {
    return 'AI';
  } else if (titleLower.includes('vpn') || titleLower.includes('proxy') || titleLower.includes('privacy')) {
    return 'Free VPN';
  } else if (titleLower.includes('termux') || titleLower.includes('android')) {
    return 'Termux';
  } else if (titleLower.includes('security') || titleLower.includes('hack') || titleLower.includes('pentest')) {
    return 'Security';
  } else {
    return 'Development';
  }
}

// 每日更新工具列表
async function updateTools() {
  const dataPath = path.join(__dirname, '../data/tools.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('Tools data not found. Please run npm run build first.');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const tools = data.tools || [];
  
  console.log(`Current tools: ${tools.length}`);
  
  // 获取新工具
  const newTools = await scrapeTools();
  console.log(`New tools found: ${newTools.length}`);
  
  if (newTools.length === 0) {
    console.log('No new tools found today. Using fallback tools.');
    
    // 如果没爬取到，使用备用工具
    newTools.push(
      {
        name: 'GitHub Copilot',
        url: 'https://github.com/features/copilot',
        category: 'AI',
        description: 'AI pair programmer',
        rating: 5
      },
      {
        name: 'VS Code',
        url: 'https://code.visualstudio.com/',
        category: 'Development',
        description: 'Popular code editor',
        rating: 5
      },
      {
        name: 'OpenVPN',
        url: 'https://openvpn.net/',
        category: 'Free VPN',
        description: 'Open source VPN solution',
        rating: 5
      }
    );
  }
  
  console.log('Adding new tools:', newTools.map(t => t.name));
  
  // 找出评分最低的3个工具
  tools.sort((a, b) => (a.rating || 3) - (b.rating || 3));
  const lowestRated = tools.slice(0, 3);
  
  console.log('Removing lowest rated tools:', lowestRated.map(t => t.name));
  
  // 移除评分最低的3个
  const updatedTools = tools.slice(3);
  
  // 添加新工具
  newTools.forEach(tool => {
    updatedTools.push({
      ...tool,
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      added: new Date().toISOString(),
      rating: tool.rating || 5
    });
  });
  
  // 更新数据
  data.tools = updatedTools;
  data.metadata.lastUpdated = new Date().toISOString();
  data.metadata.totalTools = updatedTools.length;
  
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  
  console.log(`✅ Updated! Total tools: ${updatedTools.length}`);
  console.log(`📅 Last updated: ${data.metadata.lastUpdated}`);
  
  return updatedTools;
}

// 直接导出函数
module.exports = { scrapeTools, updateTools };
