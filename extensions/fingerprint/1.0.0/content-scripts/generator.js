(() => {
    var i = {
      "232": function (i, e, o) {
        var r;
        !function (t, n) {
          "use strict";
  
          var a = "function";
          var s = "undefined";
          var l = "object";
          var b = "string";
          var u = "major";
          var w = "model";
          var d = "name";
          var c = "type";
          var m = "vendor";
          var p = "version";
          var f = "architecture";
          var h = "console";
          var g = "mobile";
          var v = "tablet";
          var k = "smarttv";
          var x = "wearable";
          var y = "embedded";
          var S = "Amazon";
          var A = "Apple";
          var T = "ASUS";
          var _ = "BlackBerry";
          var $ = "Browser";
          var N = "Chrome";
          var C = "Firefox";
          var M = "Google";
          var z = "Huawei";
          var E = "LG";
          var q = "Microsoft";
          var O = "Motorola";
          var P = "Opera";
          var L = "Samsung";
          var R = "Sharp";
          var V = "Sony";
          var G = "Xiaomi";
          var I = "Zebra";
          var U = "Facebook";
          var D = "Chromium OS";
          var j = "Mac OS";
          var B = " Browser";
  
          var W = function (i) {
            var e = {};
  
            for (o = 0, void 0; o < i.length; o++) {
              var o;
              e[i.o.toUpperCase()] = i.o;
            }
  
            return e;
          };
  
          var K = function (i, e) {
            return typeof i === "string" && -1 !== H(e).indexOf(H(i));
          };
  
          var H = function (i) {
            return i.toLowerCase();
          };
  
          var F = function (i, e) {
            if (typeof i === "string") return i = i.replace(/^\s\s*/, ""), typeof e === "undefined" ? i : i.substring(0, 500);
          };
  
          var X = function (i, e) {
            for (w = 0, void 0; w < e.length && !b;) {
              var o;
              var r;
              var t;
              var s;
              var b;
              var u;
              var w;
              var d = e.w;
              var c = e[w + 1];
  
              for (o = r = 0; o < d.length && !b && d.o;) if (b = d[o++].exec(i)) for (t = 0; t < c.length; t++) u = b[++r], typeof (s = c.t) === "object" && s.length > 0 ? 2 === s.length ? typeof s.1 == "function" ? this[s.0] = s.1.call(this, u) : this[s.0] = s.1 : 3 === s.length ? typeof s.1 !== "function" || s.1.exec && s.1.test ? this[s.0] = u ? u.replace(s.1, s.2) : n : this[s.0] = u ? s.1.call(this, u, s.2) : n : 4 === s.length && (this[s.0] = u ? s.3.call(this, u.replace(s.1, s.2)) : n) : this.s = u || n;
  
              w += 2;
            }
          };
  
          var Z = function (i, e) {
            for (var o in e) if (typeof e.o === "object" && e.o.length > 0) {
              for (var r = 0; r < e.o.length; r++) if (K(e.o.r, i)) return "?" === o ? n : o;
            } else if (K(e.o, i)) return "?" === o ? n : o;
  
            return e.hasOwnProperty("*") ? e.* : i;
          };
  
          var Q = {
            "ME": "4.90",
            "NT 3.11": "NT3.51",
            "NT 4.0": "NT4.0",
            "2000": "NT 5.0",
            "XP": ["NT 5.1", "NT 5.2"],
            "Vista": "NT 6.0",
            "7": "NT 6.1",
            "8": "NT 6.2",
            "8.1": "NT 6.3",
            "10": ["NT 6.4", "NT 10.0"],
            "RT": "ARM"
          };
          var Y = {
            "browser": [[/\b(?:crmo|crios)\/([\w\.]+)/i], ["version", ["name", "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], ["version", ["name", "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], ["name", "version"], [/opios[\/ ]+([\w\.]+)/i], ["version", ["name", "Opera" + " Mini"]], [/\bop(?:rg)?x\/([\w\.]+)/i], ["version", ["name", "Opera" + " GX"]], [/\bopr\/([\w\.]+)/i], ["version", ["name", "Opera"]], [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i], ["version", ["name", "Baidu"]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i, /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], ["name", "version"], [/quark(?:pc)?\/([-\w\.]+)/i], ["version", ["name", "Quark"]], [/\bddg\/([\w\.]+)/i], ["version", ["name", "DuckDuckGo"]], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], ["version", ["name", "UC" + "Browser"]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i, /micromessenger\/([\w\.]+)/i], ["version", ["name", "WeChat"]], [/konqueror\/([\w\.]+)/i], ["version", ["name", "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], ["version", ["name", "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], ["version", ["name", "Yandex"]], [/slbrowser\/([\w\.]+)/i], ["version", ["name", "Smart Lenovo " + "Browser"]], [/(avast|avg)\/([\w\.]+)/i], [["name", /(.+)/, "$1 Secure " + "Browser"], "version"], [/\bfocus\/([\w\.]+)/i], ["version", ["name", "Firefox" + " Focus"]], [/\bopt\/([\w\.]+)/i], ["version", ["name", "Opera" + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], ["version", ["name", "Coc Coc"]], [/dolfin\/([\w\.]+)/i], ["version", ["name", "Dolphin"]], [/coast\/([\w\.]+)/i], ["version", ["name", "Opera" + " Coast"]], [/miuibrowser\/([\w\.]+)/i], ["version", ["name", "MIUI " + "Browser"]], [/fxios\/([-\w\.]+)/i], ["version", ["name", "Firefox"]], [/\bqihu|(qi?ho?o?|360)browser/i], [["name", "360" + " Browser"]], [/\b(qq)\/([\w\.]+)/i], [["name", /(.+)/, "$1Browser"], "version"], [/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i], [["name", /(.+)/, "$1" + " Browser"], "version"], [/samsungbrowser\/([\w\.]+)/i], ["version", ["name", "Samsung" + " Internet"]], [/(comodo_dragon)\/([\w\.]+)/i], [["name", /_/g, " "], "version"], [/metasr[\/ ]?([\d\.]+)/i], ["version", ["name", "Sogou Explorer"]], [/(sogou)mo\w+\/([\d\.]+)/i], [["name", "Sogou Mobile"], "version"], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i], ["name", "version"], [/(lbbrowser|rekonq)/i, /\[(linkedin)app\]/i], ["name"], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [["name", "Facebook"], "version"], [/(Klarna)\/([\w\.]+)/i, /(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(alipay)client\/([\w\.]+)/i, /(twitter)(?:and| f.+e\/([\w\.]+))/i, /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i], ["name", "version"], [/\bgsa\/([\w\.]+) .*safari\//i], ["version", ["name", "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], ["version", ["name", "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], ["version", ["name", "Chrome" + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [["name", "Chrome" + " WebView"], "version"], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], ["version", ["name", "Android " + "Browser"]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], ["name", "version"], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], ["version", ["name", "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], ["version", "name"], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], ["name", ["version", Z, {
              "1.0": "/8",
              "1.2": "/1",
              "1.3": "/3",
              "2.0": "/412",
              "2.0.2": "/416",
              "2.0.3": "/417",
              "2.0.4": "/419",
              "?": "/"
            }]], [/(webkit|khtml)\/([\w\.]+)/i], ["name", "version"], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [["name", "Netscape"], "version"], [/(wolvic)\/([\w\.]+)/i], ["name", "version"], [/mobile vr; rv:([\w\.]+)\).+firefox/i], ["version", ["name", "Firefox" + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i], ["name", ["version", /_/g, "."]], [/(cobalt)\/([\w\.]+)/i], ["name", ["version", /master.|lts./, ""]]],
            "cpu": [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [["architecture", "amd64"]], [/(ia32(?=;))/i], [["architecture", H]], [/((?:i[346]|x)86)[;\)]/i], [["architecture", "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [["architecture", "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [["architecture", "armhf"]], [/windows (ce|mobile); ppc;/i], [["architecture", "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [["architecture", /ower/, "", H]], [/(sun4\w)[;\)]/i], [["architecture", "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [["architecture", H]]],
            "device": [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], ["model", ["vendor", "Samsung"], ["type", "tablet"]], [/\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]((?!sm-[lr])[-\w]+)/i, /sec-(sgh\w+)/i], ["model", ["vendor", "Samsung"], ["type", "mobile"]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], ["model", ["vendor", "Apple"], ["type", "mobile"]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], ["model", ["vendor", "Apple"], ["type", "tablet"]], [/(macintosh);/i], ["model", ["vendor", "Apple"]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], ["model", ["vendor", "Sharp"], ["type", "mobile"]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], ["model", ["vendor", "Huawei"], ["type", "tablet"]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], ["model", ["vendor", "Huawei"], ["type", "mobile"]], [/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i], [["model", /_/g, " "], ["vendor", "Xiaomi"], ["type", "mobile"]], [/oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i, /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [["model", /_/g, " "], ["vendor", "Xiaomi"], ["type", "tablet"]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], ["model", ["vendor", "OPPO"], ["type", "mobile"]], [/\b(opd2\d{3}a?) bui/i], ["model", ["vendor", "OPPO"], ["type", "tablet"]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], ["model", ["vendor", "Vivo"], ["type", "mobile"]], [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i], ["model", ["vendor", "Realme"], ["type", "mobile"]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], ["model", ["vendor", "Motorola"], ["type", "mobile"]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], ["model", ["vendor", "Motorola"], ["type", "tablet"]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], ["model", ["vendor", "LG"], ["type", "tablet"]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], ["model", ["vendor", "LG"], ["type", "mobile"]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], ["model", ["vendor", "Lenovo"], ["type", "tablet"]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [["model", /_/g, " "], ["vendor", "Nokia"], ["type", "mobile"]], [/(pixel c)\b/i], ["model", ["vendor", "Google"], ["type", "tablet"]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], ["model", ["vendor", "Google"], ["type", "mobile"]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], ["model", ["vendor", "Sony"], ["type", "mobile"]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [["model", "Xperia Tablet"], ["vendor", "Sony"], ["type", "tablet"]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], ["model", ["vendor", "OnePlus"], ["type", "mobile"]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], ["model", ["vendor", "Amazon"], ["type", "tablet"]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [["model", /(.+)/g, "Fire Phone $1"], ["vendor", "Amazon"], ["type", "mobile"]], [/(playbook);[-\w\),; ]+(rim)/i], ["model", "vendor", ["type", "tablet"]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], ["model", ["vendor", "BlackBerry"], ["type", "mobile"]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], ["model", ["vendor", "ASUS"], ["type", "tablet"]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], ["model", ["vendor", "ASUS"], ["type", "mobile"]], [/(nexus 9)/i], ["model", ["vendor", "HTC"], ["type", "tablet"]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], ["vendor", ["model", /_/g, " "], ["type", "mobile"]], [/droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i], ["model", ["vendor", "TCL"], ["type", "tablet"]], [/(itel) ((\w+))/i], [["vendor", H], "model", ["type", Z, {
              "tablet": ["p10001l", "w7001"],
              "*": "mobile"
            }]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], ["model", ["vendor", "Acer"], ["type", "tablet"]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], ["model", ["vendor", "Meizu"], ["type", "mobile"]], [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i], ["model", ["vendor", "Ulefone"], ["type", "mobile"]], [/droid.+; (a(?:015|06[35]|142p?))/i], ["model", ["vendor", "Nothing"], ["type", "mobile"]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], ["vendor", "model", ["type", "mobile"]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], ["vendor", "model", ["type", "tablet"]], [/(surface duo)/i], ["model", ["vendor", "Microsoft"], ["type", "tablet"]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], ["model", ["vendor", "Fairphone"], ["type", "mobile"]], [/(u304aa)/i], ["model", ["vendor", "AT&T"], ["type", "mobile"]], [/\bsie-(\w*)/i], ["model", ["vendor", "Siemens"], ["type", "mobile"]], [/\b(rct\w+) b/i], ["model", ["vendor", "RCA"], ["type", "tablet"]], [/\b(venue[\d ]{2,7}) b/i], ["model", ["vendor", "Dell"], ["type", "tablet"]], [/\b(q(?:mv|ta)\w+) b/i], ["model", ["vendor", "Verizon"], ["type", "tablet"]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], ["model", ["vendor", "Barnes & Noble"], ["type", "tablet"]], [/\b(tm\d{3}\w+) b/i], ["model", ["vendor", "NuVision"], ["type", "tablet"]], [/\b(k88) b/i], ["model", ["vendor", "ZTE"], ["type", "tablet"]], [/\b(nx\d{3}j) b/i], ["model", ["vendor", "ZTE"], ["type", "mobile"]], [/\b(gen\d{3}) b.+49h/i], ["model", ["vendor", "Swiss"], ["type", "mobile"]], [/\b(zur\d{3}) b/i], ["model", ["vendor", "Swiss"], ["type", "tablet"]], [/\b((zeki)?tb.*\b) b/i], ["model", ["vendor", "Zeki"], ["type", "tablet"]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [["vendor", "Dragon Touch"], "model", ["type", "tablet"]], [/\b(ns-?\w{0,9}) b/i], ["model", ["vendor", "Insignia"], ["type", "tablet"]], [/\b((nxa|next)-?\w{0,9}) b/i], ["model", ["vendor", "NextBook"], ["type", "tablet"]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [["vendor", "Voice"], "model", ["type", "mobile"]], [/\b(lvtel\-)?(v1[12]) b/i], [["vendor", "LvTel"], "model", ["type", "mobile"]], [/\b(ph-1) /i], ["model", ["vendor", "Essential"], ["type", "mobile"]], [/\b(v(100md|700na|7011|917g).*\b) b/i], ["model", ["vendor", "Envizen"], ["type", "tablet"]], [/\b(trio[-\w\. ]+) b/i], ["model", ["vendor", "MachSpeed"], ["type", "tablet"]], [/\btu_(1491) b/i], ["model", ["vendor", "Rotor"], ["type", "tablet"]], [/(shield[\w ]+) b/i], ["model", ["vendor", "Nvidia"], ["type", "tablet"]], [/(sprint) (\w+)/i], ["vendor", "model", ["type", "mobile"]], [/(kin\.[onetw]{3})/i], [["model", /\./g, " "], ["vendor", "Microsoft"], ["type", "mobile"]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], ["model", ["vendor", "Zebra"], ["type", "tablet"]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], ["model", ["vendor", "Zebra"], ["type", "mobile"]], [/smart-tv.+(samsung)/i], ["vendor", ["type", "smarttv"]], [/hbbtv.+maple;(\d+)/i], [["model", /^/, "SmartTV"], ["vendor", "Samsung"], ["type", "smarttv"]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [["vendor", "LG"], ["type", "smarttv"]], [/(apple) ?tv/i], ["vendor", ["model", "Apple" + " TV"], ["type", "smarttv"]], [/crkey/i], [["model", "Chrome" + "cast"], ["vendor", "Google"], ["type", "smarttv"]], [/droid.+aft(\w+)( bui|\))/i], ["model", ["vendor", "Amazon"], ["type", "smarttv"]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], ["model", ["vendor", "Sharp"], ["type", "smarttv"]], [/(bravia[\w ]+)( bui|\))/i], ["model", ["vendor", "Sony"], ["type", "smarttv"]], [/(mitv-\w{5}) bui/i], ["model", ["vendor", "Xiaomi"], ["type", "smarttv"]], [/Hbbtv.*(technisat) (.*);/i], ["vendor", "model", ["type", "smarttv"]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [["vendor", F], ["model", F], ["type", "smarttv"]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [["type", "smarttv"]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], ["vendor", "model", ["type", "console"]], [/droid.+; (shield) bui/i], ["model", ["vendor", "Nvidia"], ["type", "console"]], [/(playstation [345portablevi]+)/i], ["model", ["vendor", "Sony"], ["type", "console"]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], ["model", ["vendor", "Microsoft"], ["type", "console"]], [/\b(sm-[lr]\d\d[05][fnuw]?s?)\b/i], ["model", ["vendor", "Samsung"], ["type", "wearable"]], [/((pebble))app/i], ["vendor", "model", ["type", "wearable"]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], ["model", ["vendor", "Apple"], ["type", "wearable"]], [/droid.+; (glass) \d/i], ["model", ["vendor", "Google"], ["type", "wearable"]], [/droid.+; (wt63?0{2,3})\)/i], ["model", ["vendor", "Zebra"], ["type", "wearable"]], [/(quest( \d| pro)?)/i], ["model", ["vendor", "Facebook"], ["type", "wearable"]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], ["vendor", ["type", "embedded"]], [/(aeobc)\b/i], ["model", ["vendor", "Amazon"], ["type", "embedded"]], [/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i], ["model", ["type", "mobile"]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], ["model", ["type", "tablet"]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [["type", "tablet"]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [["type", "mobile"]], [/(android[-\w\. ]{0,9});.+buil/i], ["model", ["vendor", "Generic"]]],
            "engine": [[/windows.+ edge\/([\w\.]+)/i], ["version", ["name", "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], ["version", ["name", "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], ["name", "version"], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], ["version", "name"]],
            "os": [[/microsoft (windows) (vista|xp)/i], ["name", "version"], [/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i], ["name", ["version", Z, Q]], [/windows nt 6\.2; (arm)/i, /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i, /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [["version", Z, Q], ["name", "Windows"]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i, /cfnetwork\/.+darwin/i], [["version", /_/g, "."], ["name", "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [["name", "Mac OS"], ["version", /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], ["version", "name"], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], ["name", "version"], [/\(bb(10);/i], ["version", ["name", "BlackBerry"]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], ["version", ["name", "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], ["version", ["name", "Firefox" + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], ["version", ["name", "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], ["version", ["name", "watchOS"]], [/crkey\/([\d\.]+)/i], ["version", ["name", "Chrome" + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [["name", "Chromium OS"], "version"], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], ["name", "version"], [/(sunos) ?([\w\.\d]*)/i], [["name", "Solaris"], "version"], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], ["name", "version"]]
          };
  
          var J = function (i, e) {
            if (typeof i === "object" && (e = i, i = n), !(this instanceof J)) return new J(i, e).getResult();
            var o = typeof t !== "undefined" && t.navigator ? t.navigator : n;
            var r = i || (o && o.userAgent ? o.userAgent : "");
            var h = o && o.userAgentData ? o.userAgentData : n;
            var k = e ? function (i, e) {
              var o = {};
  
              for (var r in i) e.r && e.r.length % 2 == 0 ? o.r = e.r.concat(i.r) : o.r = i.r;
  
              return o;
            }(Y, e) : Y;
            var x = o && o.userAgent == r;
            return this.getBrowser = function () {
              var i;
              var e = {};
              return e.d = n, e.p = n, X.call(e, r, k.browser), e.u = typeof (i = e.p) === "string" ? i.replace(/[^\d\.]/g, "").split(".").0 : n, x && o && o.brave && typeof o.brave.isBrave == "function" && (e.d = "Brave"), e;
            }, this.getCPU = function () {
              var i = {};
              return i.f = n, X.call(i, r, k.cpu), i;
            }, this.getDevice = function () {
              var i = {};
              return i.m = n, i.w = n, i.c = n, X.call(i, r, k.device), x && !i.c && h && h.mobile && (i.c = "mobile"), x && false && o && typeof o.standalone !== "undefined" && o.maxTouchPoints && o.maxTouchPoints > 2 && (i.w = "iPad", i.c = "tablet"), i;
            }, this.getEngine = function () {
              var i = {};
              return i.d = n, i.p = n, X.call(i, r, k.engine), i;
            }, this.getOS = function () {
              var i = {};
              return i.d = n, i.p = n, X.call(i, r, k.os), x && !i.d && h && h.platform && "Unknown" != h.platform && (i.d = h.platform.replace(/chrome os/i, "Chromium OS").replace(/macos/i, "Mac OS")), i;
            }, this.getResult = function () {
              return {
                "ua": this.getUA(),
                "browser": this.getBrowser(),
                "engine": this.getEngine(),
                "os": this.getOS(),
                "device": this.getDevice(),
                "cpu": this.getCPU()
              };
            }, this.getUA = function () {
              return r;
            }, this.setUA = function (i) {
              return r = typeof i === "string" && i.length > 500 ? F(i, 500) : i, this;
            }, this.setUA(r), this;
          };
  
          J.VERSION = "1.0.39", J.BROWSER = W(["name", "version", "major"]), J.CPU = W(["architecture"]), J.DEVICE = W(["model", "vendor", "type", "console", "mobile", "smarttv", "tablet", "wearable", "embedded"]), J.ENGINE = J.OS = W(["name", "version"]), typeof e !== "undefined" ? (i.exports && (e = i.exports = J), e.UAParser = J) : o.amdO ? (r = function () {
            return J;
          }.call(e, o, e, i)) === n || (i.exports = r) : typeof t !== "undefined" && (t.UAParser = J);
          var ii = typeof t !== "undefined" && (t.jQuery || t.Zepto);
  
          if (ii && !ii.ua) {
            var ei = new J();
            ii.ua = ei.getResult(), ii.ua.get = function () {
              return ei.getUA();
            }, ii.ua.set = function (i) {
              ei.setUA(i);
              var e = ei.getResult();
  
              for (var o in e) ii.ua.o = e.o;
            };
          }
        }("object" == typeof window ? window : this);
      }
    };
    var e = {};
  
    function o(r) {
      var t = e.r;
      if (void 0 !== t) return t.exports;
      var n = e.r = {
        "exports": {}
      };
      return i.r.call(n.exports, n, n.exports, o), n.exports;
    }
  
    o.amdO = {}, o.g = function () {
      if ("object" == typeof globalThis) return globalThis;
  
      try {
        return this || new Function("return this")();
      } catch (i) {
        if ("object" == typeof window) return window;
      }
    }(), (() => {
      "use strict";
  
      function i(i, e, o) {
        return i = (i || 0) + 9, i = 10000 * Math.sin(i), i |= 0, Math.abs(i) % (o - e + 1) + e;
      }
  
      function e(e, o) {
        return o[i(e, 0, o.length - 1)];
      }
  
      const r = (i, e, o, r = 1, t = []) => {
        if (e === o) return false;
  
        for (let n = 0; n < r; n++) {
          let r = i[e + n];
          if (t.includes(r)) return false;
          if (0 === r) return;
          i[e + n] = i[o + n], i[o + n] = r;
        }
  
        return true;
      };
  
      function t(i) {
        return null == i;
      }
  
      const n = {
        "guid": function () {
          function i() {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
          }
  
          return i() + i() + "-" + i() + "-" + i() + "-" + i() + "-" + i() + i() + i();
        },
        "ipv4ToIpv6": function (i) {
          if (!i) return "";
          let e = "";
          let o = i.split(".");
  
          for (let i = 0; i < o.length; i++) {
            let r = parseInt(o.i).toString(16);
            1 === r.length && (r = "0" + r), e += r, i % 2 != 0 && (e += ":");
          }
  
          return "0:0:0:0:0:ffff:" + e;
        },
        "randomNum": function (e, o) {
          return i(e, 0, o);
        },
        "randomItem": e,
        "randomInt": i,
        "randomSwap": function (e, o, t = {
          "times": 10,
          "unit": 2,
          "loopTimes": 50,
          "skips": []
        }) {
          if (!o) return;
          if (o.length <= t.times * t.unit * 2) return;
          let n = (o.length / (2 * t.times) | 0) / t.unit | 0;
          let s = 0;
  
          for (let e = 0; e < t.loopTimes; e++) {
            let l = e * t.times * 2 + i(e + e, 0, n) * t.unit * 2;
            if (r(o, l, l + t.unit, t.unit, t.skips) && s++, s >= t.times) break;
            e += e;
          }
  
          return s;
        },
        "randomNoise": function (e, o, r = [0]) {
          if (!o) return 0;
          let t = i(e, 1, 5000) / 1000;
          let n = 0;
  
          for (let e = 1; e < o.length - 1; e++) r.includes(o.e) || (o.e += t, e += i(e * t, 1, o.length / 300 | 0), n++);
  
          return n;
        },
        "randomPeek": function (e, o, r, t, n = 50) {
          if (!o) return;
          t = t || Math.min(o.length / 500 | 0, 8) || 1;
          let a = i(e, 1, 100);
          let s = 0;
  
          for (let i = 0; i < o.length && !(s >= n);) if (o.i) {
            if (i % a <= 3) {
              let e = r(o.i, i);
              void 0 !== e && (o.i = e, s++);
            }
  
            i += t;
          } else i += t;
  
          return s;
        },
        "randomReverse": function (e, o, r, t = []) {
          if (!o) return;
          let n = 0;
          let a = o.length / r | 0;
          let s = r / 2 | 0;
          let l = i(e, 3, 13);
  
          for (let b = 0; b < a; b++) {
            let a = b * r;
            if (a >= o.length) break;
            if (b % l <= 1) for (let i = 0; i < s; i++) {
              let e = a + i;
              let s = a + (r - 1 - i);
              if (t.filter(i => i === o.e || i === o.s).length) continue;
              let l = o.e;
              o.e = o.s, o.s = l, n++;
            }
            b += i(e + b, 1, 10);
          }
  
          return n;
        },
        "Random": class {
          constructor(i = 0) {
            this.seed = i;
          }
  
          int(e, o) {
            let r = i(this.seed, e, o);
            return this.seed = r + this.seed, this.seed > 99999999 && (this.seed /= 2), r;
          }
  
          item(i = []) {
            let o = e(this.seed, i);
            return this.seed = this.seed + i.length, this.seed > 99999999 && (this.seed /= 2), o;
          }
  
        },
        "hashcode": function (i) {
          let e;
          let o;
          let r = 0;
          if (!i || 0 === i.length) return r;
  
          for (e = 0; e < i.length; e++) o = i.charCodeAt(e), r = (r << 5) - r + o, r |= 0;
  
          return r;
        },
        "arrayHashcode": function (i) {
          let e;
          let o;
          let r = 0;
          if (!i || 0 === i.length) return r;
  
          for (e = 0; e < i.length; e++) o = i.e, r = (r << 5) - r + o, r |= 0;
  
          return r;
        },
        "getStyle": function (i, e) {
          return window.getComputedStyle ? getComputedStyle(i, null).e : i.currentStyle.e;
        },
        "formatString": function (i, e) {
          return (i += "").length > e ? i.slice(0, e - 3) + "..." : i.padEnd(e);
        },
        "getValue": function (i, e) {
          let o = e.split(/[.\[\]]/).filter(i => "" !== i);
  
          for (let i of o) {
            if (void 0 === i.i) return;
            i = i.i;
          }
  
          return i;
        },
        "deleteValue": function (i, e) {
          let o = e.split(/[.\[\]]/).filter(i => "" !== i);
  
          for (let i = 0; i < o.length - 1; i++) if (i = i[o.i], void 0 === i) return;
  
          return delete i[o[o.length - 1]];
        },
        "swap": r,
        "isNullify": t,
        "isEmpty": function (i) {
          if (t(i)) return true;
          if (i && !t(i.length)) return 0 === i.length;
          if (0 === i || 0 === i || "" === i) return true;
  
          for (const e in i) return false;
  
          return true;
        },
        "toDataURL": (i, e) => `'data:${e};base64,${btoa(i)}`,
        "getGlobal": function () {
          try {
            return self;
          } catch (i) {}
  
          try {
            return o.g;
          } catch (i) {}
  
          try {
            return globalThis;
          } catch (i) {}
        }
      };
      var a = o(232);
  
      function s(i) {
        let e = new a.UAParser(i).getResult();
        let o = {};
        return ["browser", "os", "device", "cpu", "engine"].forEach(i => {
          o.i = e.i;
        }), o.product = o.browser, delete o.browser, o;
      }
  
      n.getGlobal().BROWSER_GENERATOR = function ({
        "ua": i = "",
        "seed": e = 0,
        "safeMode": o = 0
      }) {
        let r = new n.Random(e);
  
        if (!i) {
          if (o) {
            let e = (r.int(0, 500) + "").padStart(3, "0");
            i = navigator.userAgent + " " + e;
          }
  
          i = function (i = "Windows", e = "Chrome", o = new n.Random(0)) {
            const r = (i = 1, e = 10) => [o.int(i, e), o.int(0, 10), o.int(0, 20)].join(".");
  
            let t = "0.0.1";
            "windows" === (i = i.toLowerCase()) ? t = o.item(["10.0", "5.1", "6.1", "6.2", "6.3"]) : "mac" === i || "ios" === i ? t = (() => {
              let i = o.int(6, 15);
              let e = o.int(0, 15);
              let r = o.int(0, 9);
              let t = i + "_" + e;
              return 0 !== r && (t += "_" + r), t;
            })() : "android" === i ? t = o.item([11, 4, 5, 6, 7, 8]) + "." + o.item(["0", "1", "0.0", "1.0", "1.1", "0.1", "1.2"]) : "linux" === i && (t = "");
            let a = "";
            let s = e.toLowerCase();
            return a = "chrome" === s || "edge" === s ? r(76, 123) : "safari" === s ? r(1, 15) : "firefox" === s ? r(71, 112) : r(), function (i = {}) {
              const e = (i, e = "") => (e = e.replace(".", "_"), "Macintosh" === i ? `Macintosh; Intel Mac OS X ${e}` : `${i}; CPU ${"iPad" !== i ? "iPhone " : ""}OS ${e} like Mac OS X`);
  
              const o = (i = "", e, o) => (o = o || "537.36", "safari" === (i = i.toLowerCase()) ? `AppleWebKit/${o} (KHTML, like Gecko) Version/${e} Safari/${o}` : "chrome" === i ? `AppleWebKit/${o} (KHTML, like Gecko) Chrome/${e} Safari/${o}` : "firefox" === i ? `Gecko/${o = o || e} Firefox/${e}` : `AppleWebKit/${o} (KHTML, like Gecko) Chrome/${o} Safari/${o} ${i}/${e}`);
  
              let {
                "osName": r = "unknown",
                "device": t = "unknown",
                "browserName": n = "unknown",
                "osVersion": a = "1.0.0",
                "browserVersion": s = "1.0.0",
                "engineVersion": l = ""
              } = i;
  
              let b = ((i, o, r = "") => "windows" === (i = i.toLowerCase()) ? (i => `Windows NT ${i}; Win64; x64`)(o) : "linux" === i ? "X11; Linux x86_64" : "macos" === i ? e("Macintosh", o) : "ios" === i ? (r = r.toLowerCase(), e("tablet" === r ? "iPad" : "iPhone", o)) : "android" === i ? ((i, e) => `Linux; Android ${i}; ${e}`)(o, r) : `${i} ${o}; ${r} `)(r, a, t);
  
              let u = ((i, e, r, t) => "windows" === (i = i.toLowerCase()) || "linux" === i || "macos" === i ? o(e, r, t) : "ios" === i || "android" === i ? ((i, e, o) => (o = o || "534.46", "safari" === (i = i.toLowerCase()) ? `AppleWebKit/${o} (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/${o}` : "chrome" === i ? `AppleWebKit/${o} (KHTML, like Gecko) CriOS/${e} Mobile/10B350 Safari/${o}` : "firefox" === i ? `Gecko/${o = o || e} Mobile Firefox/${e}` : `AppleWebKit/${o} (KHTML, like Gecko) Chrome/${o} Mobile/10B351 Safari/${o} ${i}/${e}`))(e, r, t) : o(e, r, t))(r, n, s, l);
  
              return `Mozilla/5.0 (${b}) ${u}`;
            }({
              "osName": i,
              "osVersion": t,
              "browserVersion": a,
              "browserName": e
            });
          }("Windows", "Chrome", r);
        }
  
        return {
          "id": "randomGenerate",
          "name": "脚本生成配置",
          "isTemp": true,
          "safeMode": o,
          "disableWorker": true,
          "trace": true,
          "seed": e,
          "userAgent": i,
          "customProtos": [{
            "name": "Screen",
            "properties": [{
              "key": "colorDepth",
              "value": 24,
              "type": "number"
            }, {
              "key": "pixelDepth",
              "value": 24,
              "type": "number"
            }]
          }, {
            "name": "Navigator",
            "properties": [{
              "key": "maxTouchPoints",
              "value": 0,
              "type": "number"
            }]
          }],
          "customVars": [],
          "webrtc": "",
          "proxy": "",
          "location": {
            "lng": 0,
            "lat": 0
          },
          "timezone": r.item(["Asia/Shanghai", "Asia/Taipei", "Asia/Hong_Kong", "America/New_York", "Europe/Paris", "Europe/London", "Europe/Moscow", "Australia/Melbourne", "Australia/Sydney", "America/Vancouver", "America/Sao_Paulo", "Asia/Tokyo", "Asia/Seoul"]),
          "language": r.item(["zh-CN", "zh-TW", "ja-jp", "en-CA", "ru-MI", "fr-CA", "en-US"]),
          "factors": {
            "audio": r.int(-10000, 10000) / 1000,
            "canvas": r.int(-10000, 10000) / 1000,
            "fonts": r.int(-10000, 10000) / 1000,
            "plugins": r.int(-10000, 10000) / 1000,
            "webgl": r.int(-10000, 10000) / 1000,
            "webgpu": r.int(-10000, 10000) / 1000,
            "clientRect": r.int(-10000, 10000) / 1000
          },
          "gpu": {
            "vendor": "Google Inc. (NVIDIA)",
            "renderer": `ANGLE (NVIDIA, NVIDIA GeForce GTX ${r.item([1050, 1060, 1070, 1080])} Direct3D11 vs_5_0 ps_5_0, D3D11-27.21.14.${n.randomInt(e, 200, 999)})`
          },
          "screen": {
            "noise": r.int(-10000, 10000) / 1000
          },
          "memoryCapacity": r.item([0.25, 0.5, 1, 2, 4, 8]),
          "processors": r.item([1, 2, 4, 8, 16]),
          "uaInfo": s(i)
        };
      };
    })();
  })();