// 简化版本，避免浏览器 API
const fs = require('fs');
const path = require('path');

console.log('开始生成工具数据...');

// 确保 data 目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 生成工具数据
const categories = [
  "AI Tools", "Development", "Free VPN", "Termux", "Security",
  "Productivity", "Graphics", "Audio/Video", "Games", "Education",
  "Science", "Blockchain", "IoT", "Browser Extensions", "API Tools"
];

const tools = [];
let toolId = 1;

// 生成 1000 个示例工具
for (let i = 0; i < 1000; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  tools.push({
    id: toolId++,
    name: `${category.split(' ')[0]} Tool ${i + 1}`,
    description: `An amazing ${category.toLowerCase()} tool for developers`,
    category: category,
    url: `https://example.com/tool${i + 1}`,
    icon: "fas fa-code",
    tags: ["open-source", "free", "web"],
    date: new Date().toISOString().split('T')[0]
  });
}

// 创建完整的数据结构
const toolsData = {
  meta: {
    name: "Open Source Tools Navigation",
    version: "1.0.0",
    count: tools.length,
    lastUpdated: new Date().toISOString(),
    categories: categories
  },
  tools: tools
};

// 写入文件
const outputPath = path.join(dataDir, 'tools.json');
fs.writeFileSync(outputPath, JSON.stringify(toolsData, null, 2));

console.log(`✅ 生成 ${tools.length} 个工具数据`);
console.log(`📁 保存到: ${outputPath}`);
console.log('🎉 构建完成！');
