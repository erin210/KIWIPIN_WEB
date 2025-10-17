const environment = {
    production: {
      pageBaseUrl: 'https://api-page.p99pay.com',
      apiBaseUrl: 'https://api.p99pay.com',
    },
    stage: {
      pageBaseUrl: 'https://stage-api-page.p99pay.com',
      apiBaseUrl: 'https://stage-api.p99pay.com',
    },
    github: {
      pageBaseUrl: 'https://erin210.github.io/Kiwipin_Web/',
      apiBaseUrl: 'https://erin210.github.io/Kiwipin_Web/',
    },
    localhost: {
      pageBaseUrl: 'http://127.0.0.1:5504/',
      apiBaseUrl: 'http://127.0.0.1:5504/',
    },
    localhosthome: {
      pageBaseUrl: 'http://192.168.8.224:5504/',
      apiBaseUrl: 'http://192.168.8.224:5504/',
    }
  };
  
  //配置
  const currentEnv = (function() {
    const hostname = window.location.hostname;
    if (hostname === 'api.p99pay.com') {
      return environment.production;
    } else if (hostname === 'stage-api.p99pay.com') {
      return environment.stage;
    }else if (hostname === 'erin210.github.io') {
      return environment.github;
    }else if (hostname === '192.168.8.224') {
      return environment.localhosthome;
    } else {
      return environment.localhost;
    }
  })();

window.pageBaseUrl = currentEnv.pageBaseUrl;
window.apiUrl = currentEnv.apiBaseUrl;
