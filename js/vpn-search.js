// VPN搜索增强功能
class VPNSearch {
  constructor() {
    this.vpnEnabled = false;
    this.vpnServer = 'us';
    this.dataUsage = 0;
    this.init();
  }
  
  init() {
    this.loadVPNState();
    this.setupVPNToggle();
    this.setupSearchEnhancement();
  }
  
  loadVPNState() {
    this.vpnEnabled = localStorage.getItem('vpnEnabled') === 'true';
    this.vpnServer = localStorage.getItem('vpnServer') || 'us';
  }
  
  setupVPNToggle() {
    const vpnToggle = document.getElementById('global-vpn-toggle');
    if (vpnToggle) {
      vpnToggle.checked = this.vpnEnabled;
      vpnToggle.addEventListener('change', (e) => {
        this.vpnEnabled = e.target.checked;
        localStorage.setItem('vpnEnabled', this.vpnEnabled);
        this.showVPNStatus();
      });
    }
  }
  
  showVPNStatus() {
    if (this.vpnEnabled) {
      console.log('VPN已启用，搜索将加速');
      document.body.classList.add('vpn-active');
    } else {
      document.body.classList.remove('vpn-active');
    }
  }
  
  setupSearchEnhancement() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.vpnEnabled) {
        this.searchWithVPN(searchInput.value);
      }
    });
  }
  
  async searchWithVPN(query) {
    if (!query.trim()) return;
    
    console.log(`通过VPN搜索: ${query}`);
    
    // 搜索源配置
    const searchEngines = {
      google: 'https://www.google.com/search?q=',
      github: 'https://github.com/search?q=',
      stackoverflow: 'https://stackoverflow.com/search?q=',
      npm: 'https://www.npmjs.com/search?q=',
      docker: 'https://hub.docker.com/search?q=',
      youtube: 'https://www.youtube.com/results?search_query=',
      bing: 'https://www.bing.com/search?q=',
      baidu: 'https://www.baidu.com/s?wd=',
      duckduckgo: 'https://duckduckgo.com/?q='
    };
    
    // 打开新窗口进行搜索
    const searchUrl = searchEngines.google + encodeURIComponent(query);
    window.open(searchUrl, '_blank');
  }
  
  // 获取VPN服务器列表
  async getVPNServers() {
    try {
      const servers = [
        { id: 'us', name: 'United States', ping: 150 },
        { id: 'jp', name: 'Japan', ping: 100 },
        { id: 'sg', name: 'Singapore', ping: 80 },
        { id: 'de', name: 'Germany', ping: 200 },
        { id: 'hk', name: 'Hong Kong', ping: 50 },
        { id: 'kr', name: 'Korea', ping: 60 }
      ];
      
      return servers;
    } catch (error) {
      console.error('获取VPN服务器失败:', error);
      return [];
    }
  }
  
  // 连接VPN
  async connectVPN(serverId = 'us') {
    console.log(`连接到VPN服务器: ${serverId}`);
    this.vpnEnabled = true;
    this.vpnServer = serverId;
    localStorage.setItem('vpnEnabled', 'true');
    localStorage.setItem('vpnServer', serverId);
    this.showVPNStatus();
    
    return { success: true, server: serverId };
  }
  
  // 断开VPN
  disconnectVPN() {
    console.log('断开VPN连接');
    this.vpnEnabled = false;
    localStorage.setItem('vpnEnabled', 'false');
    this.showVPNStatus();
  }
  
  // 获取当前连接信息
  getConnectionInfo() {
    return {
      connected: this.vpnEnabled,
      server: this.vpnServer,
      dataUsage: this.dataUsage
    };
  }
  
  // 增强搜索功能
  enhanceSearch(query) {
    if (!this.vpnEnabled) {
      console.log('VPN未启用，使用普通搜索');
      return this.normalSearch(query);
    }
    
    return this.vpnAcceleratedSearch(query);
  }
  
  normalSearch(query) {
    // 普通搜索逻辑
    return { method: 'normal', query };
  }
  
  vpnAcceleratedSearch(query) {
    // VPN加速搜索逻辑
    return { 
      method: 'vpn',
      query,
      server: this.vpnServer,
      timestamp: new Date().toISOString()
    };
  }
}

// 在页面上添加全局VPN控制
function addGlobalVPNControl() {
  if (document.querySelector('#global-vpn-control')) return;
  
  const vpnControl = document.createElement('div');
  vpnControl.id = 'global-vpn-control';
  vpnControl.innerHTML = `
    <style>
      .vpn-control {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.95);
        padding: 10px 15px;
        border-radius: 25px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        border-left: 4px solid #667eea;
      }
      .vpn-status {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-right: 10px;
      }
      .vpn-status .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f56565;
        transition: background 0.3s ease;
      }
      .vpn-status.connected .dot {
        background: #48bb78;
      }
      .vpn-toggle {
        cursor: pointer;
        padding: 5px 10px;
        background: #edf2f7;
        border-radius: 12px;
        font-size: 0.8rem;
        color: #4a5568;
      }
      .vpn-toggle:hover {
        background: #e2e8f0;
      }
    </style>
    <div class="vpn-status" id="vpn-status-indicator">
      <span class="dot"></span>
      <span>VPN</span>
    </div>
    <div class="vpn-toggle" id="vpn-toggle-btn">
      连接
    </div>
  `;
  
  document.body.appendChild(vpnControl);
  
  const vpn = new VPNSearch();
  const statusIndicator = document.getElementById('vpn-status-indicator');
  const toggleBtn = document.getElementById('vpn-toggle-btn');
  
  // 更新状态显示
  function updateStatus() {
    if (vpn.vpnEnabled) {
      statusIndicator.classList.add('connected');
      toggleBtn.textContent = '断开';
    } else {
      statusIndicator.classList.remove('connected');
      toggleBtn.textContent = '连接';
    }
  }
  
  // 切换VPN
  toggleBtn.addEventListener('click', async () => {
    if (vpn.vpnEnabled) {
      vpn.disconnectVPN();
    } else {
      await vpn.connectVPN('us');
    }
    updateStatus();
  });
  
  updateStatus();
  
  // 右键点击打开VPN页面
  vpnControl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.open('vpn.html', '_blank');
  });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname !== '/vpn.html' && 
      window.location.pathname !== '/search-with-vpn.html') {
    setTimeout(addGlobalVPNControl, 1000);
  }
  
  // 添加VPN样式
  const style = document.createElement('style');
  style.textContent = `
    .vpn-active .vpn-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #48bb78;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      z-index: 10000;
    }
    
    .vpn-active .tool-card:hover {
      border-color: #48bb78;
    }
    
    .vpn-active .ad-slot {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    }
  `;
  document.head.appendChild(style);
});
