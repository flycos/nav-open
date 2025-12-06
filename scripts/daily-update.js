const { updateTools } = require('./scraper.js');
const fs = require('fs');
const path = require('path');

async function dailyUpdate() {
  console.log('=== Daily Update Process Starting ===');
  console.log(new Date().toISOString());
  
  try {
    // 运行更新
    const updatedTools = await updateTools();
    
    if (updatedTools) {
      console.log('✅ Daily update completed successfully');
      
      // 记录更新日志
      const logPath = path.join(__dirname, '../data/update-log.json');
      const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : { updates: [] };
      
      log.updates.push({
        date: new Date().toISOString(),
        toolsAdded: 3,
        totalTools: updatedTools.length
      });
      
      // 只保留最近30天的日志
      if (log.updates.length > 30) {
        log.updates = log.updates.slice(-30);
      }
      
      fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
      console.log('📝 Update log saved');
    }
    
  } catch (error) {
    console.error('❌ Daily update failed:', error);
  }
  
  console.log('=== Daily Update Process Finished ===');
}

if (require.main === module) {
  dailyUpdate();
}
