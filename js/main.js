document.addEventListener('DOMContentLoaded', async function() {
  console.log('Open Source Tools Navigation - Loading 5000+ tools...');
  
  const toolsGrid = document.getElementById('tools-grid');
  const toolCount = document.getElementById('tool-count');
  const loading = document.getElementById('loading');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  
  let allTools = [];
  let displayedTools = [];
  
  // 加载工具数据
  async function loadTools() {
    try {
      loading.textContent = 'Loading 5000+ tools...';
      
      // 首先尝试从本地文件加载
      const response = await fetch('data/tools.json');
      if (!response.ok) {
        throw new Error('Failed to load tools data');
      }
      
      const data = await response.json();
      allTools = data.tools || [];
      displayedTools = [...allTools];
      
      renderTools();
      updateToolCount();
      
      loading.style.display = 'none';
      console.log(`Loaded ${allTools.length} tools`);
      
    } catch (error) {
      console.error('Error loading tools:', error);
      loading.innerHTML = `
        <div style="color: #dc2626; background: #fee2e2; padding: 20px; border-radius: 8px;">
          <p>Error loading tools: ${error.message}</p>
          <p>Please run: <code>npm run build</code> to generate tool data</p>
        </div>
      `;
    }
  }
  
  // 渲染工具卡片
  function renderTools() {
    toolsGrid.innerHTML = '';
    
    displayedTools.forEach(tool => {
      const toolCard = createToolCard(tool);
      toolsGrid.appendChild(toolCard);
    });
  }
  
  // 创建工具卡片
  function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    
    // 根据类别设置颜色
    const categoryColors = {
      'AI': '#4f46e5',
      'Development': '#059669',
      'Free VPN': '#dc2626',
      'Termux': '#ea580c',
      'Security': '#9333ea',
      'Productivity': '#0891b2',
      'Graphics': '#db2777',
      'Audio/Video': '#ca8a04',
      'Default': '#4b5563'
    };
    
    const color = categoryColors[tool.category] || categoryColors.Default;
    
    card.innerHTML = `
      <span class="tool-category" style="background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
        ${tool.category}
      </span>
      <h3>${tool.name}</h3>
      <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 15px;">${tool.description || 'Open source tool'}</p>
      <a href="${tool.url}" target="_blank" class="tool-url">
        <i class="fas fa-external-link-alt"></i> ${tool.url.replace('https://', '').replace('http://', '').substring(0, 40)}...
      </a>
      <div class="tool-rating">
        ${'★'.repeat(tool.rating || 3)}${'☆'.repeat(5 - (tool.rating || 3))}
      </div>
    `;
    
    return card;
  }
  
  // 更新工具计数
  function updateToolCount() {
    toolCount.textContent = `Showing ${displayedTools.length} of ${allTools.length} tools`;
  }
  
  // 搜索工具
  function searchTools() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    displayedTools = allTools.filter(tool => {
      const matchesSearch = !searchTerm || 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description?.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    renderTools();
    updateToolCount();
  }
  
  // 事件监听
  searchInput.addEventListener('input', searchTools);
  categoryFilter.addEventListener('change', searchTools);
  
  // 初始化
  loadTools();
  
  // 添加广告点击追踪
  document.querySelectorAll('.ad-slot').forEach((ad, index) => {
    ad.addEventListener('click', () => {
      console.log(`Ad slot ${index + 1} clicked`);
      alert('Advertising slot available. Contact for advertising opportunities.');
    });
  });
});


// 广告点击追踪
function trackAdClick(position) {
  console.log('广告点击:', position);
  
  // 保存到本地存储
  const adClicks = JSON.parse(localStorage.getItem('ad_clicks') || '{}');
  adClicks[position] = (adClicks[position] || 0) + 1;
  adClicks.total = (adClicks.total || 0) + 1;
  adClicks.lastClick = new Date().toISOString();
  localStorage.setItem('ad_clicks', JSON.stringify(adClicks));
  
  // 发送到服务器（如果有的话）
  if (window.ga) {
    window.ga('send', 'event', 'Ad', 'click', position);
  }
  
  // 重定向到联系页面
  window.location.href = 'contact.html?position=' + encodeURIComponent(position);
}
