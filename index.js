const fs = require('fs');
const axios = require('axios');
const YAML = require('js-yaml');

// 1. 设置请求头的 User-Agent
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ClashforWindows/0.20.30 Chrome/108.0.5359.215 Electron/22.3.14 Safari/537.36',
};

// 2. 发起第一个请求并保存为 o.yml
const url1 = 'https://api.cn2.pw/api/v1/client/subscribe?token=f09d40f4b4023bcf5625dce813994342';
axios.get(url1, { headers })
  .then((response) => {
    fs.writeFileSync('o.yml', response.data);
    console.log('o.yml 文件保存成功！');
  })
  .catch((error) => {
    console.error('请求 o.yml 数据失败:', error.message);
  });

// 3. 发起第二个请求并保存为 c.yml
const url2 = 'https://gist.githubusercontent.com/flied/8f000fd4be413a73ff06f4f776677add/raw/ec062f48d1058b9e30e5da0ec885d7fa5cd07d00/myrules.yml';
axios.get(url2, { headers })
  .then((response) => {
    fs.writeFileSync('c.yml', response.data);
    console.log('c.yml 文件保存成功！');
    
    // 4. 将 c.yml 的数据插入到 o.yml 文件的 rules 规则头部
    const cData = response.data;
    fs.readFile('o.yml', 'utf8', (err, oData) => {
      if (err) {
        console.error('读取 o.yml 文件失败:', err.message);
        return;
      }

      const oYAML = YAML.load(oData);
      const cYAML = YAML.load(cData);

      // 将 cYAML 的数据插入到 oYAML.rules 的头部
      oYAML.rules.unshift(...cYAML);

      // 5. 生成新的 myown.yml 文件
      const myownYAML = YAML.dump(oYAML);
      fs.writeFileSync('myown.yml', myownYAML);
      console.log('myown.yml 文件生成成功！');
    });
  })
  .catch((error) => {
    console.error('请求 c.yml 数据失败:', error.message);
  });
