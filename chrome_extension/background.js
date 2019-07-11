var refreshTokenResp = `HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
X-Application-Context: umfnd-ap-southeast-1:docker:8080
Content-Length: 846
X-EdgeConnect-MidMile-RTT: 49
X-EdgeConnect-Origin-MEX-Latency: 4s
Connection: close
Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS
Access-Control-Allow-Headers: Content-Type, hotstarauth, deviceId, userIdentity, userId, secret, Authorization, userIdentityToken, stream-platform, username
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.hotstar.com

{
    "description": {
        "userIdentity": "XXXX"
    },
    "message": null,
    "appCode": "UMSP_700"
}`

var entitlementTokenResp = `HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Connection: close
X-Application-Context: antares:docker:8080
Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS
Access-Control-Allow-Headers: Content-Type, hotstarauth, deviceId, userIdentity, userId, secret, Authorization, userIdentityToken, stream-platform, username
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.hotstar.com

{
  "description": {
      "ck": "c857a36dddf4e8a75e9d092a1a09beb00d673844",
      "entitlementToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJoSWRcIjpcImFjbnxleGFtcGxlQGdtYWlsLmNvbVwiLFwiY29udGVudElkXCI6XCIxNjYwMDEwNjkxXCIsXCJlbnRpdGVsbWVudFwiOnRydWUsXCJjYWNoZUtleVwiOlwiYzg1N2EzNmRkZGY0ZThhNzVlOWQwOTJhMWEwOWJlYjAwZDY3Mzg0OFwifSIsImlzcyI6IlVNIiwiZXhwIjoxNjA5Mjg2NDAwfQ.jnFW9GLDbDbEqaCZ1IYG2MWJg4uJwmxe2RU-_edZR1U"
  },
  "message": "User eligible for playback",
  "appCode": "UMSP_8200"
}`

var entitlementDeviceResp = `HTTP/1.1 200 OK
Access-Control-Expose-Headers: X-Reference-Error
Access-Control-Max-Age: 3600
Content-Type: application/json;charset=UTF-8
Content-Length: 74
X-EdgeConnect-MidMile-RTT: 37
X-EdgeConnect-Origin-MEX-Latency: 8
Connection: close
Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS
Access-Control-Allow-Headers: Content-Type, hotstarauth, deviceId, userIdentity, userId, secret, Authorization, userIdentityToken, stream-platform, username
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.hotstar.com

{"description":null,"message":null,"appCode":"UMSP_8200","errorCode":null}`


chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [
              new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: {
                      hostEquals: 'www.hotstar.com'
                  }
              })
          ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
  });
});

chrome.pageAction.onClicked.addListener(function(tab) { 
  chrome.debugger.getTargets((targets) => {
    let target = tab;
    let debuggee = { tabId: target.id };

    chrome.debugger.attach(debuggee, "1.2", () => {
      chrome.debugger.sendCommand(debuggee, "Network.setRequestInterception",  {patterns: [{ urlPattern: '*v2*' }]});
    });

    chrome.debugger.onEvent.addListener((source, method, params) => {
        if(method === "Network.requestIntercepted" && params.request.method === 'OPTIONS') {
          let continueParams = {interceptionId: params.interceptionId};
          chrome.debugger.sendCommand(debuggee, "Network.continueInterceptedRequest", continueParams);
        }
        else if(method === "Network.requestIntercepted" && params.request.method === 'GET') {
          let continueParams = {interceptionId: params.interceptionId};
          if (params.request.url.match(/\/in\/aadhar\/v2\/web\/in\/user\/refresh-token/)) {
            refreshTokenResp.replace('XXXX', params.request.headers['userIdentity']);
            continueParams.rawResponse = btoa(refreshTokenResp);
            console.log(continueParams.rawResponse);
          } else if(params.request.url.match(/\/in\/antares\/v2\/chromecast\/in\/entitlement\/content/)) {
            continueParams.rawResponse = btoa(entitlementTokenResp);
          }else if(params.request.url.match(/\/in\/antares\/v2\/appletv\/in\/entitlement\/content/)) {
            continueParams.rawResponse = btoa(entitlementTokenResp);
          } else if(params.request.url.match(/\/in\/hodor\/v2\/web\/in\/entitlement\/device/)) {
            continueParams.rawResponse = btoa(entitlementDeviceResp);
          } else if(params.request.url.match(/\/h\/v2\/play\/in\/contents/)) { 
            continueParams.headers = params.request.headers;
            delete continueParams.headers['x-et'];
            delete continueParams.headers['x-eck'];
          }
          chrome.debugger.sendCommand(debuggee, "Network.continueInterceptedRequest", continueParams);
        }
    });
  });
});