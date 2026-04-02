const PROXY_CONFIG = {
  "/cone": {
    "target": "https://qa.pure.mpdl.mpg.de",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "xfwd": false,
    "onProxyReq": function(proxyReq, req, res) {
      // Setze X-Forwarded-For auf die MPDL-Gateway-IP, um Listenbildung zu vermeiden
      proxyReq.setHeader('X-Forwarded-For', '130.183.252.19');
    }
  },
  "/rest": {
    "target": "https://qa.pure.mpdl.mpg.de",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "xfwd": false,
    "onProxyReq": function(proxyReq, req, res) {
      // Setze X-Forwarded-For auf die MPDL-Gateway-IP, um Listenbildung zu vermeiden
      proxyReq.setHeader('X-Forwarded-For', '130.183.252.19');
    }
  },
  "/pureblogfeed": {
    "target": "https://blog.pure.mpg.de/json1",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": { "^/pureblogfeed" : "" },
    "changeOrigin": true
  }
};

module.exports = PROXY_CONFIG;
