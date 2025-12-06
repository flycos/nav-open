// 广告点击统计
class AdStats {
  constructor() {
    this.ads = {
      'top-banner': { 
        name: '首页顶部横幅', 
        price: 100, 
        views: 0, 
        clicks: 0 
      },
      'sidebar': { 
        name: '侧边栏广告', 
        price: 50, 
        views: 0, 
        clicks: 0 
      },
      'in-content': { 
        name: '内容中广告', 
        price: 80, 
        views: 0, 
        clicks: 0 
      },
      'footer-banner': { 
        name: '页脚横幅', 
        price: 60, 
        views: 0, 
        clicks: 0 
      }
    };
    
    this.loadStats();
    this.trackAdViews();
  }
  
  loadStats() {
    const stats = JSON.parse(localStorage.getItem('ad_stats') || '{}');
    Object.keys(this.ads).forEach(key => {
      if (stats[key]) {
        this.ads[key] = { ...this.ads[key], ...stats[key] };
      }
    });
  }
  
  saveStats() {
    localStorage.setItem('ad_stats', JSON.stringify(this.ads));
  }
  
  trackAdViews() {
    // 模拟广告展示
    Object.keys(this.ads).forEach(key => {
      this.ads[key].views += Math.floor(Math.random() * 10) + 1;
    });
    this.saveStats();
    
    // 每分钟更新一次
    setInterval(() => {
      Object.keys(this.ads).forEach(key => {
        this.ads[key].views += Math.floor(Math.random() * 5) + 1;
      });
      this.saveStats();
    }, 60000);
  }
  
  trackClick(position) {
    if (this.ads[position]) {
      this.ads[position].clicks++;
      this.saveStats();
      
      // 计算点击率
      const ctr = (this.ads[position].clicks / this.ads[position].views * 100).toFixed(2);
      console.log(`广告点击: ${position} (CTR: ${ctr}%)`);
      
      // 发送到服务器（如果有的话）
      this.sendAnalytics({
        type: 'ad_click',
        position: position,
        ctr: ctr,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  sendAnalytics(data) {
    // 如果有后端，可以发送到服务器
    if (typeof window.ga !== 'undefined') {
      window.ga('send', 'event', 'Ad', 'click', data.position);
    }
  }
  
  getCTR(position) {
    if (this.ads[position] && this.ads[position].views > 0) {
      return (this.ads[position].clicks / this.ads[position].views * 100).toFixed(2);
    }
    return '0.00';
  }
  
  getStats() {
    return this.ads;
  }
  
  getTotalEarnings() {
    return Object.values(this.ads).reduce((total, ad) => {
      return total + (ad.clicks * 0.1); // 假设每次点击0.1美元
    }, 0).toFixed(2);
  }
}

// 初始化
const adStats = new AdStats();

// 监听广告点击
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ad-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const adElement = e.target.closest('.ad-placeholder');
      if (adElement) {
        const position = adElement.dataset.position;
        adStats.trackClick(position);
      }
    });
  });
});

// 管理员面板（可选）
function showAdStatsPanel() {
  const stats = adStats.getStats();
  const panel = document.createElement('div');
  panel.id = 'ad-stats-panel';
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    padding: 20px;
    z-index: 10000;
    max-width: 300px;
    display: none;
  `;
  
  let html = '<h4>📊 广告统计</h4>';
  Object.entries(stats).forEach(([key, ad]) => {
    const ctr = adStats.getCTR(key);
    html += `
      <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
        <strong>${ad.name}</strong><br>
        <small>展示: ${ad.views} | 点击: ${ad.click} | CTR: ${ctr}%</small>
      </div>
    `;
  });
  
  html += `<hr><small>总收入: $${adStats.getTotalEarnings()}</small>`;
  html += '<button onclick="document.getElementById(\'ad-stats-panel\').style.display=\'none\'" style="float:right; background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 3px;">关闭</button>';
  
  panel.innerHTML = html;
  document.body.appendChild(panel);
  panel.style.display = 'block';
}

// 在控制台显示统计
console.log('广告统计已加载。管理员查看: showAdStatsPanel()');
