var etadata = Object.defineProperty;
var validateType = (invalidInput) => {
  throw TypeError(invalidInput);
};
var privateSetter = (dataEntity, e, newValue) =>
  e in dataEntity
    ? etadata(dataEntity, e, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: newValue,
      })
    : (dataEntity[e] = newValue);
var etPrivateVar = (_initializer, e, __________index) =>
  privateSetter(
    _initializer,
    typeof e != "symbol" ? e + "" : e,
    __________index,
  );
var isValidAccess = (targetValue, e, errorMessage) =>
  e.has(targetValue) || validateType("Cannot " + errorMessage);
var getPrivateVal = (_targetObject, e, getter) => {
  isValidAccess(_targetObject, e, "read from private field");
  if (getter) {
    return getter.call(_targetObject);
  } else {
    return e.get(_targetObject);
  }
};
var attach = (tagName, e, _defaultValue) =>
  e.has(tagName)
    ? validateType("Cannot add the same private member more than once")
    : e instanceof WeakSet
      ? e.add(tagName)
      : e.set(tagName, _defaultValue);
var authorizeSet = (targetElement, e, valueToWrite, onSetPrivate) => {
  isValidAccess(targetElement, e, "write to private field");
  if (onSetPrivate) {
    onSetPrivate.call(targetElement, valueToWrite);
  } else {
    e.set(targetElement, valueToWrite);
  }
  return valueToWrite;
};
var allowPrivateA = (initialItem, e, __esult) => {
  isValidAccess(initialItem, e, "access private method");
  return __esult;
};
const afeRandomI = function (target, torage, elector) {
  target = (target || 0) + 9;
  target = Math.sin(target) * 10000;
  target |= 0;
  return (Math.abs(target) % (elector - torage + 1)) + torage;
};
const getRandomized = function (_target, entity) {
  let randomEntity = afeRandomI(_target, 0, entity.length - 1);
  return entity[randomEntity];
};
function generateUUID() {
  function generateHexa() {
    return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
  }
  return (
    generateHexa() +
    generateHexa() +
    "-" +
    generateHexa() +
    "-" +
    generateHexa() +
    "-" +
    generateHexa() +
    "-" +
    generateHexa() +
    generateHexa() +
    generateHexa()
  );
}
function isValidIp(targetObject) {
  return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
    targetObject,
  );
}
function getUserAgent(dataContainer = {}) {
  const generateUserL = (_deviceModel, androidOsInfo) =>
    `Linux; Android ${_deviceModel}; ${androidOsInfo}`;
  const generateNonLx = (______________________deviceType, _osVersion = "") => {
    _osVersion = _osVersion.replace(".", "_");
    if (______________________deviceType === "Macintosh") {
      return `Macintosh; Intel Mac OS X ${_osVersion}`;
    } else {
      return `${______________________deviceType}; CPU ${______________________deviceType !== "iPad" ? "iPhone " : ""}OS ${_osVersion} like Mac OS X`;
    }
  };
  const generateWinNT = (windowsNtx64) =>
    `Windows NT ${windowsNtx64}; Win64; x64`;
  const unknownUserAa = () => "X11; Linux x86_64";
  const generateUserA = (
    ____browserType = "",
    _browserMajor,
    __browserMajor,
  ) => {
    __browserMajor = __browserMajor || "537.36";
    ____browserType = ____browserType.toLowerCase();
    if (____browserType === "safari") {
      return `AppleWebKit/${__browserMajor} (KHTML, like Gecko) Version/${_browserMajor} Safari/${__browserMajor}`;
    } else if (____browserType === "chrome") {
      return `AppleWebKit/${__browserMajor} (KHTML, like Gecko) Chrome/${_browserMajor} Safari/${__browserMajor}`;
    } else if (____browserType === "firefox") {
      __browserMajor = __browserMajor || _browserMajor;
      return `Gecko/${__browserMajor} Firefox/${_browserMajor}`;
    } else {
      return `AppleWebKit/${__browserMajor} (KHTML, like Gecko) Chrome/${__browserMajor} Safari/${__browserMajor} ${____browserType}/${_browserMajor}`;
    }
  };
  const _generateUserA = (___browserType, browserMajor, defaultUserAg) => {
    defaultUserAg = defaultUserAg || "534.46";
    ___browserType = ___browserType.toLowerCase();
    if (___browserType === "safari") {
      return `AppleWebKit/${defaultUserAg} (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/${defaultUserAg}`;
    } else if (___browserType === "chrome") {
      return `AppleWebKit/${defaultUserAg} (KHTML, like Gecko) CriOS/${browserMajor} Mobile/10B350 Safari/${defaultUserAg}`;
    } else if (___browserType === "firefox") {
      defaultUserAg = defaultUserAg || browserMajor;
      return `Gecko/${defaultUserAg} Mobile Firefox/${browserMajor}`;
    } else {
      return `AppleWebKit/${defaultUserAg} (KHTML, like Gecko) Chrome/${defaultUserAg} Mobile/10B351 Safari/${defaultUserAg} ${___browserType}/${browserMajor}`;
    }
  };
  const browserName = (
    operatingOSTh,
    accountName,
    _______________________deviceType = "",
  ) => {
    operatingOSTh = operatingOSTh.toLowerCase();
    if (operatingOSTh === "windows") {
      return generateWinNT(accountName);
    } else if (operatingOSTh === "linux") {
      return unknownUserAa();
    } else if (operatingOSTh === "macos") {
      return generateNonLx("Macintosh", accountName);
    } else if (operatingOSTh === "ios") {
      _______________________deviceType =
        _______________________deviceType.toLowerCase();
      return generateNonLx(
        _______________________deviceType === "tablet" ? "iPad" : "iPhone",
        accountName,
      );
    } else if (operatingOSTh === "android") {
      return generateUserL(accountName, _______________________deviceType);
    } else {
      return `${operatingOSTh} ${accountName}; ${_______________________deviceType} `;
    }
  };
  const __generateUserA = (
    _getOperatingS,
    userProperty,
    userGenerator,
    userManager,
  ) => {
    _getOperatingS = _getOperatingS.toLowerCase();
    if (
      _getOperatingS === "windows" ||
      _getOperatingS === "linux" ||
      _getOperatingS === "macos"
    ) {
      return generateUserA(userProperty, userGenerator, userManager);
    } else if (_getOperatingS === "ios" || _getOperatingS === "android") {
      return _generateUserA(userProperty, userGenerator, userManager);
    } else {
      return generateUserA(userProperty, userGenerator, userManager);
    }
  };
  let {
    osName: _browserInfo = "unknown",
    device: platformType = "unknown",
    browserName: options = "unknown",
    osVersion: _esult = "1.0.0",
    browserVersion: osUserAgents = "1.0.0",
    engineVersion: namespace = "",
  } = dataContainer;
  let ___generateUserA = browserName(_browserInfo, _esult, platformType);
  let ____generateUserA = __generateUserA(
    _browserInfo,
    options,
    osUserAgents,
    namespace,
  );
  return `Mozilla/5.0 (${___generateUserA}) ${____generateUserA}`;
}
function osPlatform(
  osType = "Windows",
  e = "Chrome",
  equenceIndex = Math.random(),
) {
  const generateOsVsn = () =>
    getRandomized(equenceIndex++, ["10.0", "5.1", "6.1", "6.2", "6.3"]);
  const osUniqueId = () => {
    let _length = afeRandomI(equenceIndex++, 6, 15);
    let randomIndex = afeRandomI(equenceIndex++, 0, 15);
    let _randomIndex = afeRandomI(equenceIndex++, 0, 9);
    let _compositeKey = _length + "_" + randomIndex;
    if (_randomIndex !== 0) {
      _compositeKey += "_" + _randomIndex;
    }
    return _compositeKey;
  };
  const androidOsMock = () => {
    let randomDigit = getRandomized(equenceIndex++, [11, 4, 5, 6, 7, 8]);
    let possibleValue = getRandomized(equenceIndex++, [
      "0",
      "1",
      "0.0",
      "1.0",
      "1.1",
      "0.1",
      "1.2",
    ]);
    return randomDigit + "." + possibleValue;
  };
  const generateSemVr = (initialValue = 1, productPrice = 10) => {
    let randomOffset = afeRandomI(equenceIndex++, initialValue, productPrice);
    let randomNumber = afeRandomI(equenceIndex++, 0, 10);
    let randomValue = afeRandomI(equenceIndex++, 0, 20);
    return [randomOffset, randomNumber, randomValue].join(".");
  };
  osType = osType.toLowerCase();
  let osVersion = "0.0.1";
  if (osType === "windows") {
    osVersion = generateOsVsn();
  } else if (osType === "mac" || osType === "ios") {
    osVersion = osUniqueId();
  } else if (osType === "android") {
    osVersion = androidOsMock();
  } else if (osType === "linux") {
    osVersion = "";
  }
  let _operatingSys = "";
  let apiClient = e.toLowerCase();
  if (apiClient === "chrome" || apiClient === "edge") {
    _operatingSys = generateSemVr(76, 123);
  } else if (apiClient === "safari") {
    _operatingSys = generateSemVr(1, 15);
  } else if (apiClient === "firefox") {
    _operatingSys = generateSemVr(71, 112);
  } else {
    _operatingSys = generateSemVr();
  }
  return getUserAgent({
    osName: osType,
    osVersion: osVersion,
    browserVersion: _operatingSys,
    browserName: e,
  });
}
const availableGpuM = ["Mali-T880", "Mali-G76", "Mali-G72", "Mali-G52"];
const gpuModelNames = [
  "Adreno(TM) 618",
  "Adreno(TM) 616",
  "Adreno(TM) 405",
  "Adreno(TM) 640",
  "Adreno(TM) 308",
  "Adreno(TM) 505",
];
const gpuModels = {
  ARM: availableGpuM,
  Qualcomm: gpuModelNames,
  "Apple Inc.": ["Apple GPU"],
  "Google Inc.": {
    Amd: [
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.7), OpenGL 4.6)",
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.6), OpenGL 4.6)",
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.5), OpenGL 4.6)",
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.4), OpenGL 4.6)",
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.3), OpenGL 4.6)",
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.2), OpenGL 4.6)",
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.1), OpenGL 4.6)",
      "ANGLE (AMD, RENOIR(renoir LLVM 15.0.0), OpenGL 4.6)",
    ],
    Intel: [
      "ANGLE (Intel, Mesa Intel(R) Graphics (RPL-S), OpenGL 4.6)",
      "ANGLE (Intel, Mesa Intel(R) Graphics (RPL-P), OpenGL 4.6)",
      "ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
      "ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.8681)",
      "ANGLE (Intel, Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0, D3D11-10.18.10.5059)",
      "ANGLE (Intel, Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0, D3D11-10.18.13.5582)",
      "ANGLE (Intel, Intel(R) HD Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-10.18.10.4885)",
    ],
    Apple: [
      "ANGLE (Apple, Apple M1, OpenGL 4.1)",
      "ANGLE (Apple, Apple M1 Max, OpenGL 4.1)",
      "ANGLE (Apple, Apple M2 Max, OpenGL 4.1)",
      "ANGLE (Apple, Apple M2, OpenGL 4.1)",
      "ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)",
      "ANGLE (Apple, Apple M2 Pro, OpenGL 4.1)",
    ],
    Nvidia: [
      "ANGLE (NVIDIA, NVIDIA GeForce GTX 960 Direct3D11 vs_5_0 ps_5_0, D3D11-26.21.14.4575)",
      "ANGLE (NVIDIA, NVIDIA GeForce GTX 750 Ti Direct3D11 vs_5_0 ps_5_0, D3D11-25.21.14.1735)",
      "ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0, D3D11-27.21.14.6089)",
      "ANGLE (NVIDIA, NVIDIA GeForce GTX 1060 6GB Direct3D11 vs_5_0 ps_5_0, D3D11-23.21.13.9135)",
      "ANGLE (NVIDIA, NVIDIA GeForce GTX 650 Direct3D11 vs_5_0 ps_5_0, D3D11)",
      "ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 Direct3D11 vs_5_0 ps_5_0, D3D11-27.21.14.5185)",
      "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Direct3D11 vs_5_0 ps_5_0, D3D11-22.21.13.8476)",
    ],
  },
};
const languageLocs = [
  {
    code: "zh-CN",
    name: "中文",
  },
  {
    code: "zh-SG",
    name: "马新简体",
  },
  {
    code: "zh-TW",
    name: "繁体中文",
  },
  {
    code: "ko-KR",
    name: "韩语（韩国）",
  },
  {
    code: "th-TH",
    name: "泰语（泰国）",
  },
  {
    code: "ja-jp",
    name: "日语（日本）",
  },
  {
    code: "en-US",
    name: "英语（美国）",
  },
  {
    code: "en-EG",
    name: "英语",
  },
  {
    code: "en-AU",
    name: "英语（澳大利亚）",
  },
  {
    code: "en-GB",
    name: "英语（英国）",
  },
  {
    code: "en-CA",
    name: "英语（加拿大）",
  },
  {
    code: "en-NZ",
    name: "英语（新西兰）",
  },
  {
    code: "en-IE",
    name: "英语（爱尔兰）",
  },
  {
    code: "en-ZA",
    name: "英语（南非）",
  },
  {
    code: "en-JM",
    name: "英语（牙买加）",
  },
  {
    code: "en-BZ",
    name: "英语（伯利兹）",
  },
  {
    code: "en-TT",
    name: "英语（特立尼达和多巴哥）",
  },
  {
    code: "it-CH",
    name: "意大利语（瑞士）",
  },
  {
    code: "ru-MI",
    name: "俄语",
  },
  {
    code: "ru-mo",
    name: "俄语（摩尔多瓦共和国）",
  },
  {
    code: "de-CH",
    name: "德语（瑞士）",
  },
  {
    code: "de-AT",
    name: "德语（奥地利）",
  },
  {
    code: "de-LU",
    name: "德语（卢森堡）",
  },
  {
    code: "de-LI",
    name: "德语（列支敦士登）",
  },
  {
    code: "fr-BE",
    name: "法语（比利时）",
  },
  {
    code: "fr-CA",
    name: "法语（加拿大）",
  },
  {
    code: "fr-CH",
    name: "法语（瑞士）",
  },
  {
    code: "fr-LU",
    name: "法语（卢森堡）",
  },
  {
    code: "es-AR",
    name: "西班牙语（阿根廷）",
  },
  {
    code: "es-GT",
    name: "西班牙语（危地马拉）",
  },
  {
    code: "es-CR",
    name: "西班牙语（哥斯达黎加）",
  },
  {
    code: "es-PA",
    name: "西班牙语（巴拿马）",
  },
  {
    code: "es-DO",
    name: "西班牙语（多米尼加共和国）",
  },
  {
    code: "es-MX",
    name: "西班牙语（墨西哥）",
  },
  {
    code: "es-VE",
    name: "西班牙语（委内瑞拉）",
  },
  {
    code: "es-CO",
    name: "西班牙语（哥伦比亚）",
  },
  {
    code: "es-PE",
    name: "西班牙语（秘鲁）",
  },
  {
    code: "es-EC",
    name: "西班牙语（厄瓜多尔）",
  },
  {
    code: "es-CL",
    name: "西班牙语（智利）",
  },
  {
    code: "es-UY",
    name: "西班牙语（乌拉圭）",
  },
  {
    code: "es-PY",
    name: "西班牙语（巴拉圭）",
  },
  {
    code: "es-BO",
    name: "西班牙语（玻利维亚）",
  },
  {
    code: "es-SV",
    name: "西班牙语（萨尔瓦多）",
  },
  {
    code: "es-HN",
    name: "西班牙语（洪都拉斯）",
  },
  {
    code: "es-NI",
    name: "西班牙语（尼加拉瓜）",
  },
  {
    code: "es-PR",
    name: "西班牙语（波多黎各）",
  },
  {
    code: "ar-SA",
    name: "阿拉伯语（沙特阿拉伯）",
  },
  {
    code: "ar-IQ",
    name: "阿拉伯语（伊拉克）",
  },
  {
    code: "ar-EG",
    name: "阿拉伯语（埃及）",
  },
  {
    code: "ar-LY",
    name: "阿拉伯语（利比亚）",
  },
  {
    code: "ar-DZ",
    name: "阿拉伯语（阿尔及利亚）",
  },
  {
    code: "ar-MA",
    name: "阿拉伯语（摩洛哥）",
  },
  {
    code: "ar-TN",
    name: "阿拉伯语（突尼斯）",
  },
  {
    code: "ar-OM",
    name: "阿拉伯语（阿曼）",
  },
  {
    code: "ar-YE",
    name: "阿拉伯语（也门）",
  },
  {
    code: "ar-SY",
    name: "阿拉伯语（叙利亚）",
  },
  {
    code: "ar-JO",
    name: "阿拉伯语（约旦）",
  },
  {
    code: "ar-LB",
    name: "阿拉伯语（黎巴嫩）",
  },
  {
    code: "ar-KW",
    name: "阿拉伯语（科威特）",
  },
  {
    code: "ar-AE",
    name: "阿拉伯语（阿联酋）",
  },
  {
    code: "ar-BH",
    name: "阿拉伯语（巴林）",
  },
  {
    code: "ar-QA",
    name: "阿拉伯语（卡塔尔）",
  },
  {
    code: "pt-PT",
    name: "葡萄牙文",
  },
  {
    code: "pt-BR",
    name: "葡萄牙文（巴西）",
  },
  {
    code: "ro-MO",
    name: "罗马尼亚语（摩尔多瓦共和国）",
  },
  {
    code: "sq-AL",
    name: "阿尔巴尼亚语",
  },
  {
    code: "nl-NL",
    name: "荷兰文",
  },
  {
    code: "nl-BE",
    name: "荷兰文（比利时）",
  },
  {
    code: "gd-IE",
    name: "盖尔语（苏格兰）",
  },
  {
    code: "is-IS",
    name: "冰岛文",
  },
  {
    code: "no-NO",
    name: "挪威文",
  },
  {
    code: "sv-FI",
    name: "瑞典语（芬兰）",
  },
];
const cityNames = [
  {
    id: 1,
    city_en: "Midway",
    city_zh: "中途岛",
    region_en: "United States Minor Outlying Islands",
    region_zh: "美国本土外小岛屿",
    timezone: "Pacific/Midway",
    utc_offset: "UTC-11:00",
  },
  {
    id: 2,
    city_en: "Niue",
    city_zh: "纽埃",
    region_en: "Niue",
    region_zh: "纽埃",
    timezone: "Pacific/Niue",
    utc_offset: "UTC-11:00",
  },
  {
    id: 3,
    city_en: "Pago Pago",
    city_zh: "帕果帕果",
    region_en: "American Samoa",
    region_zh: "美属萨摩亚",
    timezone: "Pacific/Pago_Pago",
    utc_offset: "UTC-11:00",
  },
  {
    id: 4,
    city_en: "Adak",
    city_zh: "阿达克",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Adak",
    utc_offset: "UTC-10:00",
  },
  {
    id: 5,
    city_en: "Honolulu",
    city_zh: "檀香山",
    region_en: "United States",
    region_zh: "美国",
    timezone: "Pacific/Honolulu",
    utc_offset: "UTC-10:00",
  },
  {
    id: 6,
    city_en: "Rarotonga",
    city_zh: "拉罗汤加",
    region_en: "Cook Islands",
    region_zh: "库克群岛",
    timezone: "Pacific/Rarotonga",
    utc_offset: "UTC-10:00",
  },
  {
    id: 7,
    city_en: "Tahiti",
    city_zh: "大溪地",
    region_en: "French Polynesia",
    region_zh: "法属波利尼西亚",
    timezone: "Pacific/Tahiti",
    utc_offset: "UTC-10:00",
  },
  {
    id: 8,
    city_en: "Marquesas",
    city_zh: "马克萨斯",
    region_en: "French Polynesia",
    region_zh: "法属波利尼西亚",
    timezone: "Pacific/Marquesas",
    utc_offset: "UTC-9:30",
  },
  {
    id: 9,
    city_en: "Anchorage",
    city_zh: "安克雷奇",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Anchorage",
    utc_offset: "UTC-9:00",
  },
  {
    id: 10,
    city_en: "Juneau",
    city_zh: "朱诺",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Juneau",
    utc_offset: "UTC-9:00",
  },
  {
    id: 11,
    city_en: "Metlakatla",
    city_zh: "梅特拉卡特拉",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Metlakatla",
    utc_offset: "UTC-9:00",
  },
  {
    id: 12,
    city_en: "Nome",
    city_zh: "诺姆",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Nome",
    utc_offset: "UTC-9:00",
  },
  {
    id: 13,
    city_en: "Sitka",
    city_zh: "锡特卡",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Sitka",
    utc_offset: "UTC-9:00",
  },
  {
    id: 14,
    city_en: "Yakutat",
    city_zh: "雅库塔特",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Yakutat",
    utc_offset: "UTC-9:00",
  },
  {
    id: 15,
    city_en: "Gambier",
    city_zh: "甘比尔",
    region_en: "French Polynesia",
    region_zh: "法属波利尼西亚",
    timezone: "Pacific/Gambier",
    utc_offset: "UTC-9:00",
  },
  {
    id: 16,
    city_en: "Los Angeles",
    city_zh: "洛杉矶",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Los_Angeles",
    utc_offset: "UTC-8:00",
  },
  {
    id: 17,
    city_en: "Tijuana",
    city_zh: "蒂华纳",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Tijuana",
    utc_offset: "UTC-8:00",
  },
  {
    id: 18,
    city_en: "Vancouver",
    city_zh: "温哥华",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Vancouver",
    utc_offset: "UTC-8:00",
  },
  {
    id: 19,
    city_en: "Pitcairn",
    city_zh: "皮特凯恩群岛",
    region_en: "Pitcairn",
    region_zh: "皮特凯恩群岛",
    timezone: "Pacific/Pitcairn",
    utc_offset: "UTC-8:00",
  },
  {
    id: 20,
    city_en: "Boise",
    city_zh: "博伊西",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Boise",
    utc_offset: "UTC-7:00",
  },
  {
    id: 21,
    city_en: "Cambridge Bay",
    city_zh: "剑桥湾",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Cambridge_Bay",
    utc_offset: "UTC-7:00",
  },
  {
    id: 22,
    city_en: "Ciudad Juarez",
    city_zh: "华雷斯城",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Ciudad_Juarez",
    utc_offset: "UTC-7:00",
  },
  {
    id: 23,
    city_en: "Creston",
    city_zh: "克雷斯顿",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Creston",
    utc_offset: "UTC-7:00",
  },
  {
    id: 24,
    city_en: "Dawson",
    city_zh: "道森",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Dawson",
    utc_offset: "UTC-7:00",
  },
  {
    id: 25,
    city_en: "Dawson Creek",
    city_zh: "道森克里克",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Dawson_Creek",
    utc_offset: "UTC-7:00",
  },
  {
    id: 26,
    city_en: "Denver",
    city_zh: "丹佛",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Denver",
    utc_offset: "UTC-7:00",
  },
  {
    id: 27,
    city_en: "Edmonton",
    city_zh: "埃德蒙顿",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Edmonton",
    utc_offset: "UTC-7:00",
  },
  {
    id: 28,
    city_en: "Fort Nelson",
    city_zh: "纳尔逊堡",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Fort_Nelson",
    utc_offset: "UTC-7:00",
  },
  {
    id: 29,
    city_en: "Hermosillo",
    city_zh: "埃莫西约",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Hermosillo",
    utc_offset: "UTC-7:00",
  },
  {
    id: 30,
    city_en: "Inuvik",
    city_zh: "伊努维克",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Inuvik",
    utc_offset: "UTC-7:00",
  },
  {
    id: 31,
    city_en: "Mazatlan",
    city_zh: "马萨特兰",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Mazatlan",
    utc_offset: "UTC-7:00",
  },
  {
    id: 32,
    city_en: "Phoenix",
    city_zh: "凤凰城",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Phoenix",
    utc_offset: "UTC-7:00",
  },
  {
    id: 33,
    city_en: "Whitehorse",
    city_zh: "白马",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Whitehorse",
    utc_offset: "UTC-7:00",
  },
  {
    id: 34,
    city_en: "Yellowknife",
    city_zh: "耶洛奈夫",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Yellowknife",
    utc_offset: "UTC-7:00",
  },
  {
    id: 35,
    city_en: "Bahia Banderas",
    city_zh: "巴伊亚班德拉斯",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Bahia_Banderas",
    utc_offset: "UTC-6:00",
  },
  {
    id: 36,
    city_en: "Belize",
    city_zh: "伯利兹",
    region_en: "Belize",
    region_zh: "伯利兹",
    timezone: "America/Belize",
    utc_offset: "UTC-6:00",
  },
  {
    id: 37,
    city_en: "Chicago",
    city_zh: "芝加哥",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Chicago",
    utc_offset: "UTC-6:00",
  },
  {
    id: 38,
    city_en: "Chihuahua",
    city_zh: "奇瓦瓦州",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Chihuahua",
    utc_offset: "UTC-6:00",
  },
  {
    id: 39,
    city_en: "Costa Rica",
    city_zh: "哥斯达黎加",
    region_en: "Costa Rica",
    region_zh: "哥斯达黎加",
    timezone: "America/Costa_Rica",
    utc_offset: "UTC-6:00",
  },
  {
    id: 40,
    city_en: "El Salvador",
    city_zh: "萨尔瓦多",
    region_en: "El Salvador",
    region_zh: "萨尔瓦多",
    timezone: "America/El_Salvador",
    utc_offset: "UTC-6:00",
  },
  {
    id: 41,
    city_en: "Guatemala",
    city_zh: "危地马拉",
    region_en: "Guatemala",
    region_zh: "危地马拉",
    timezone: "America/Guatemala",
    utc_offset: "UTC-6:00",
  },
  {
    id: 42,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Knox",
    utc_offset: "UTC-6:00",
  },
  {
    id: 43,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Tell_City",
    utc_offset: "UTC-6:00",
  },
  {
    id: 44,
    city_en: "Managua",
    city_zh: "马那瓜",
    region_en: "Nicaragua",
    region_zh: "尼加拉瓜",
    timezone: "America/Managua",
    utc_offset: "UTC-6:00",
  },
  {
    id: 45,
    city_en: "Matamoros",
    city_zh: "马塔莫罗斯",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Matamoros",
    utc_offset: "UTC-6:00",
  },
  {
    id: 46,
    city_en: "Menominee",
    city_zh: "梅诺米尼",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Menominee",
    utc_offset: "UTC-6:00",
  },
  {
    id: 47,
    city_en: "Merida",
    city_zh: "梅里达",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Merida",
    utc_offset: "UTC-6:00",
  },
  {
    id: 48,
    city_en: "Mexico City",
    city_zh: "墨西哥城",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Mexico_City",
    utc_offset: "UTC-6:00",
  },
  {
    id: 49,
    city_en: "Monterrey",
    city_zh: "蒙特雷",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Monterrey",
    utc_offset: "UTC-6:00",
  },
  {
    id: 50,
    city_en: "North Dakota",
    city_zh: "北达科他州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/North_Dakota/Beulah",
    utc_offset: "UTC-6:00",
  },
  {
    id: 51,
    city_en: "North Dakota",
    city_zh: "北达科他州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/North_Dakota/Center",
    utc_offset: "UTC-6:00",
  },
  {
    id: 52,
    city_en: "North Dakota",
    city_zh: "北达科他州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/North_Dakota/New_Salem",
    utc_offset: "UTC-6:00",
  },
  {
    id: 53,
    city_en: "Ojinaga",
    city_zh: "小品永",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Ojinaga",
    utc_offset: "UTC-6:00",
  },
  {
    id: 54,
    city_en: "Rankin Inlet",
    city_zh: "兰金湾",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Rankin_Inlet",
    utc_offset: "UTC-6:00",
  },
  {
    id: 55,
    city_en: "Regina",
    city_zh: "里贾纳",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Regina",
    utc_offset: "UTC-6:00",
  },
  {
    id: 56,
    city_en: "Resolute",
    city_zh: "坚决",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Resolute",
    utc_offset: "UTC-6:00",
  },
  {
    id: 57,
    city_en: "Swift Current",
    city_zh: "迅捷电流",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Swift_Current",
    utc_offset: "UTC-6:00",
  },
  {
    id: 58,
    city_en: "Tegucigalpa",
    city_zh: "特古西加尔巴",
    region_en: "Honduras",
    region_zh: "洪都拉斯",
    timezone: "America/Tegucigalpa",
    utc_offset: "UTC-6:00",
  },
  {
    id: 59,
    city_en: "Winnipeg",
    city_zh: "温尼伯",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Winnipeg",
    utc_offset: "UTC-6:00",
  },
  {
    id: 60,
    city_en: "Easter",
    city_zh: "复活节",
    region_en: "Chile",
    region_zh: "智利",
    timezone: "Pacific/Easter",
    utc_offset: "UTC-6:00",
  },
  {
    id: 61,
    city_en: "Galapagos",
    city_zh: "加拉帕戈斯群岛",
    region_en: "Ecuador",
    region_zh: "厄瓜多尔",
    timezone: "Pacific/Galapagos",
    utc_offset: "UTC-6:00",
  },
  {
    id: 62,
    city_en: "Atikokan",
    city_zh: "阿提科坎",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Atikokan",
    utc_offset: "UTC-5:00",
  },
  {
    id: 63,
    city_en: "Bogota",
    city_zh: "波哥大",
    region_en: "Colombia",
    region_zh: "哥伦比亚",
    timezone: "America/Bogota",
    utc_offset: "UTC-5:00",
  },
  {
    id: 64,
    city_en: "Cancun",
    city_zh: "坎昆",
    region_en: "Mexico",
    region_zh: "墨西哥",
    timezone: "America/Cancun",
    utc_offset: "UTC-5:00",
  },
  {
    id: 65,
    city_en: "Cayman",
    city_zh: "开曼群岛",
    region_en: "Cayman Islands",
    region_zh: "开曼群岛",
    timezone: "America/Cayman",
    utc_offset: "UTC-5:00",
  },
  {
    id: 66,
    city_en: "Detroit",
    city_zh: "底特律",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Detroit",
    utc_offset: "UTC-5:00",
  },
  {
    id: 67,
    city_en: "Eirunepe",
    city_zh: "埃鲁内佩",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Eirunepe",
    utc_offset: "UTC-5:00",
  },
  {
    id: 68,
    city_en: "Grand Turk",
    city_zh: "大特克",
    region_en: "Turks and Caicos Islands",
    region_zh: "特克斯和凯科斯群岛",
    timezone: "America/Grand_Turk",
    utc_offset: "UTC-5:00",
  },
  {
    id: 69,
    city_en: "Guayaquil",
    city_zh: "瓜亚基尔",
    region_en: "Ecuador",
    region_zh: "厄瓜多尔",
    timezone: "America/Guayaquil",
    utc_offset: "UTC-5:00",
  },
  {
    id: 70,
    city_en: "Havana",
    city_zh: "哈瓦那",
    region_en: "Cuba",
    region_zh: "古巴",
    timezone: "America/Havana",
    utc_offset: "UTC-5:00",
  },
  {
    id: 71,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Indianapolis",
    utc_offset: "UTC-5:00",
  },
  {
    id: 72,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Marengo",
    utc_offset: "UTC-5:00",
  },
  {
    id: 73,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Petersburg",
    utc_offset: "UTC-5:00",
  },
  {
    id: 74,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Vevay",
    utc_offset: "UTC-5:00",
  },
  {
    id: 75,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Vincennes",
    utc_offset: "UTC-5:00",
  },
  {
    id: 76,
    city_en: "Indiana",
    city_zh: "印第安纳州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Indiana/Winamac",
    utc_offset: "UTC-5:00",
  },
  {
    id: 77,
    city_en: "Iqaluit",
    city_zh: "伊卡卢伊特",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Iqaluit",
    utc_offset: "UTC-5:00",
  },
  {
    id: 78,
    city_en: "Jamaica",
    city_zh: "牙买加",
    region_en: "Jamaica",
    region_zh: "牙买加",
    timezone: "America/Jamaica",
    utc_offset: "UTC-5:00",
  },
  {
    id: 79,
    city_en: "Kentucky",
    city_zh: "肯塔基州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Kentucky/Louisville",
    utc_offset: "UTC-5:00",
  },
  {
    id: 80,
    city_en: "Kentucky",
    city_zh: "肯塔基州",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/Kentucky/Monticello",
    utc_offset: "UTC-5:00",
  },
  {
    id: 81,
    city_en: "Lima",
    city_zh: "利马",
    region_en: "Peru",
    region_zh: "秘鲁",
    timezone: "America/Lima",
    utc_offset: "UTC-5:00",
  },
  {
    id: 82,
    city_en: "Nassau",
    city_zh: "拿骚",
    region_en: "Bahamas",
    region_zh: "巴哈马",
    timezone: "America/Nassau",
    utc_offset: "UTC-5:00",
  },
  {
    id: 83,
    city_en: "New York",
    city_zh: "纽约",
    region_en: "United States",
    region_zh: "美国",
    timezone: "America/New_York",
    utc_offset: "UTC-5:00",
  },
  {
    id: 84,
    city_en: "Panama",
    city_zh: "巴拿马",
    region_en: "Panama",
    region_zh: "巴拿马",
    timezone: "America/Panama",
    utc_offset: "UTC-5:00",
  },
  {
    id: 85,
    city_en: "Port-au-Prince",
    city_zh: "太子港",
    region_en: "Haiti",
    region_zh: "海地",
    timezone: "America/Port-au-Prince",
    utc_offset: "UTC-5:00",
  },
  {
    id: 86,
    city_en: "Rio Branco",
    city_zh: "里约布兰科",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Rio_Branco",
    utc_offset: "UTC-5:00",
  },
  {
    id: 87,
    city_en: "Toronto",
    city_zh: "多伦多",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Toronto",
    utc_offset: "UTC-5:00",
  },
  {
    id: 88,
    city_en: "Anguilla",
    city_zh: "安圭拉",
    region_en: "Anguilla",
    region_zh: "安圭拉",
    timezone: "America/Anguilla",
    utc_offset: "UTC-4:00",
  },
  {
    id: 89,
    city_en: "Antigua",
    city_zh: "安提瓜",
    region_en: "Antigua and Barbuda",
    region_zh: "安提瓜和巴布达",
    timezone: "America/Antigua",
    utc_offset: "UTC-4:00",
  },
  {
    id: 90,
    city_en: "Aruba",
    city_zh: "阿鲁巴",
    region_en: "Aruba",
    region_zh: "阿鲁巴岛",
    timezone: "America/Aruba",
    utc_offset: "UTC-4:00",
  },
  {
    id: 91,
    city_en: "Asuncion",
    city_zh: "亚松森",
    region_en: "Paraguay",
    region_zh: "巴拉圭",
    timezone: "America/Asuncion",
    utc_offset: "UTC-4:00",
  },
  {
    id: 92,
    city_en: "Barbados",
    city_zh: "巴巴多斯",
    region_en: "Barbados",
    region_zh: "巴巴多斯",
    timezone: "America/Barbados",
    utc_offset: "UTC-4:00",
  },
  {
    id: 93,
    city_en: "Blanc-Sablon",
    city_zh: "布兰克-萨布隆",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Blanc-Sablon",
    utc_offset: "UTC-4:00",
  },
  {
    id: 94,
    city_en: "Boa Vista",
    city_zh: "博阿维斯塔",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Boa_Vista",
    utc_offset: "UTC-4:00",
  },
  {
    id: 95,
    city_en: "Campo Grande",
    city_zh: "大坎普",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Campo_Grande",
    utc_offset: "UTC-4:00",
  },
  {
    id: 96,
    city_en: "Caracas",
    city_zh: "加拉加斯",
    region_en: "Venezuela",
    region_zh: "委内瑞拉",
    timezone: "America/Caracas",
    utc_offset: "UTC-4:00",
  },
  {
    id: 97,
    city_en: "Cuiaba",
    city_zh: "库亚巴",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Cuiaba",
    utc_offset: "UTC-4:00",
  },
  {
    id: 98,
    city_en: "Curacao",
    city_zh: "库拉索岛",
    region_en: "Curacao",
    region_zh: "库拉索岛",
    timezone: "America/Curacao",
    utc_offset: "UTC-4:00",
  },
  {
    id: 99,
    city_en: "Dominica",
    city_zh: "多米尼加",
    region_en: "Dominican Republic",
    region_zh: "多米尼加共和国",
    timezone: "America/Dominica",
    utc_offset: "UTC-4:00",
  },
  {
    id: 100,
    city_en: "Glace Bay",
    city_zh: "格拉斯湾",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Glace_Bay",
    utc_offset: "UTC-4:00",
  },
  {
    id: 101,
    city_en: "Goose Bay",
    city_zh: "鹅湾",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Goose_Bay",
    utc_offset: "UTC-4:00",
  },
  {
    id: 102,
    city_en: "Grenada",
    city_zh: "格林纳达",
    region_en: "Grenada",
    region_zh: "格林纳达",
    timezone: "America/Grenada",
    utc_offset: "UTC-4:00",
  },
  {
    id: 103,
    city_en: "Guadeloupe",
    city_zh: "瓜德罗普岛",
    region_en: "Guadeloupe",
    region_zh: "瓜德罗普",
    timezone: "America/Guadeloupe",
    utc_offset: "UTC-4:00",
  },
  {
    id: 104,
    city_en: "Guyana",
    city_zh: "圭亚那",
    region_en: "Guyana",
    region_zh: "圭亚那",
    timezone: "America/Guyana",
    utc_offset: "UTC-4:00",
  },
  {
    id: 105,
    city_en: "Halifax",
    city_zh: "哈利法克斯",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Halifax",
    utc_offset: "UTC-4:00",
  },
  {
    id: 106,
    city_en: "Kralendijk",
    city_zh: "克拉伦代克",
    region_en: "Bonaire,Saint Eustatius and Saba",
    region_zh: "博内尔岛、圣尤斯特歇斯岛和萨巴岛",
    timezone: "America/Kralendijk",
    utc_offset: "UTC-4:00",
  },
  {
    id: 107,
    city_en: "La Paz",
    city_zh: "拉巴斯",
    region_en: "Bolivia",
    region_zh: "玻利维亚",
    timezone: "America/La_Paz",
    utc_offset: "UTC-4:00",
  },
  {
    id: 108,
    city_en: "Lower Princes",
    city_zh: "下王子",
    region_en: "Sint Maarten",
    region_zh: "荷属圣马丁",
    timezone: "America/Lower_Princes",
    utc_offset: "UTC-4:00",
  },
  {
    id: 109,
    city_en: "Manaus",
    city_zh: "马瑙斯",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Manaus",
    utc_offset: "UTC-4:00",
  },
  {
    id: 110,
    city_en: "Marigot",
    city_zh: "马里戈特",
    region_en: "Saint Martin",
    region_zh: "法属圣马丁",
    timezone: "America/Marigot",
    utc_offset: "UTC-4:00",
  },
  {
    id: 111,
    city_en: "Martinique",
    city_zh: "马提尼克岛",
    region_en: "Martinique",
    region_zh: "马提尼克",
    timezone: "America/Martinique",
    utc_offset: "UTC-4:00",
  },
  {
    id: 112,
    city_en: "Moncton",
    city_zh: "蒙克顿",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/Moncton",
    utc_offset: "UTC-4:00",
  },
  {
    id: 113,
    city_en: "Montserrat",
    city_zh: "蒙特塞拉特",
    region_en: "Montserrat",
    region_zh: "蒙特塞拉特",
    timezone: "America/Montserrat",
    utc_offset: "UTC-4:00",
  },
  {
    id: 114,
    city_en: "Porto Velho",
    city_zh: "韦柳港",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Porto_Velho",
    utc_offset: "UTC-4:00",
  },
  {
    id: 115,
    city_en: "Port of Spain",
    city_zh: "西班牙港",
    region_en: "Trinidad and Tobago",
    region_zh: "特立尼达和多巴哥",
    timezone: "America/Port_of_Spain",
    utc_offset: "UTC-4:00",
  },
  {
    id: 116,
    city_en: "Puerto Rico",
    city_zh: "波多黎各",
    region_en: "Puerto Rico",
    region_zh: "波多黎各",
    timezone: "America/Puerto_Rico",
    utc_offset: "UTC-4:00",
  },
  {
    id: 117,
    city_en: "Santiago",
    city_zh: "圣地亚哥",
    region_en: "Chile",
    region_zh: "智利",
    timezone: "America/Santiago",
    utc_offset: "UTC-4:00",
  },
  {
    id: 118,
    city_en: "Santo Domingo",
    city_zh: "圣多明各",
    region_en: "Dominican Republic",
    region_zh: "多米尼加共和国",
    timezone: "America/Santo_Domingo",
    utc_offset: "UTC-4:00",
  },
  {
    id: 119,
    city_en: "St Barthelemy",
    city_zh: "圣巴泰勒米",
    region_en: "Saint Barthelemy",
    region_zh: "圣巴泰勒米",
    timezone: "America/St_Barthelemy",
    utc_offset: "UTC-4:00",
  },
  {
    id: 120,
    city_en: "St Kitts",
    city_zh: "圣基茨",
    region_en: "Saint Kitts and Nevis",
    region_zh: "圣基茨和尼维斯",
    timezone: "America/St_Kitts",
    utc_offset: "UTC-4:00",
  },
  {
    id: 121,
    city_en: "St Lucia",
    city_zh: "圣卢西亚",
    region_en: "Saint Lucia",
    region_zh: "圣卢西亚",
    timezone: "America/St_Lucia",
    utc_offset: "UTC-4:00",
  },
  {
    id: 122,
    city_en: "St Thomas",
    city_zh: "圣托马斯",
    region_en: "U.S. Virgin Islands",
    region_zh: "美属维尔京群岛",
    timezone: "America/St_Thomas",
    utc_offset: "UTC-4:00",
  },
  {
    id: 123,
    city_en: "St Vincent",
    city_zh: "圣文森特",
    region_en: "Saint Vincent and the Grenadines",
    region_zh: "圣文森特和格林纳丁斯",
    timezone: "America/St_Vincent",
    utc_offset: "UTC-4:00",
  },
  {
    id: 124,
    city_en: "Thule",
    city_zh: "图勒",
    region_en: "Greenland",
    region_zh: "格陵兰",
    timezone: "America/Thule",
    utc_offset: "UTC-4:00",
  },
  {
    id: 125,
    city_en: "Tortola",
    city_zh: "托尔托拉",
    region_en: "British Virgin Islands",
    region_zh: "英属维尔京群岛",
    timezone: "America/Tortola",
    utc_offset: "UTC-4:00",
  },
  {
    id: 126,
    city_en: "Bermuda",
    city_zh: "百慕大",
    region_en: "Bermuda",
    region_zh: "百慕大",
    timezone: "Atlantic/Bermuda",
    utc_offset: "UTC-4:00",
  },
  {
    id: 127,
    city_en: "St Johns",
    city_zh: "圣约翰斯",
    region_en: "Canada",
    region_zh: "加拿大",
    timezone: "America/St_Johns",
    utc_offset: "UTC-3:30",
  },
  {
    id: 128,
    city_en: "Araguaina",
    city_zh: "阿拉瓜伊纳",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Araguaina",
    utc_offset: "UTC-3:00",
  },
  {
    id: 129,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Buenos_Aires",
    utc_offset: "UTC-3:00",
  },
  {
    id: 130,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Catamarca",
    utc_offset: "UTC-3:00",
  },
  {
    id: 131,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Cordoba",
    utc_offset: "UTC-3:00",
  },
  {
    id: 132,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Jujuy",
    utc_offset: "UTC-3:00",
  },
  {
    id: 133,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/La_Rioja",
    utc_offset: "UTC-3:00",
  },
  {
    id: 134,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Mendoza",
    utc_offset: "UTC-3:00",
  },
  {
    id: 135,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Rio_Gallegos",
    utc_offset: "UTC-3:00",
  },
  {
    id: 136,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Salta",
    utc_offset: "UTC-3:00",
  },
  {
    id: 137,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/San_Juan",
    utc_offset: "UTC-3:00",
  },
  {
    id: 138,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/San_Luis",
    utc_offset: "UTC-3:00",
  },
  {
    id: 139,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Tucuman",
    utc_offset: "UTC-3:00",
  },
  {
    id: 140,
    city_en: "Argentina",
    city_zh: "阿根廷",
    region_en: "Argentina",
    region_zh: "阿根廷",
    timezone: "America/Argentina/Ushuaia",
    utc_offset: "UTC-3:00",
  },
  {
    id: 141,
    city_en: "Bahia",
    city_zh: "巴伊亚",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Bahia",
    utc_offset: "UTC-3:00",
  },
  {
    id: 142,
    city_en: "Belem",
    city_zh: "贝伦",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Belem",
    utc_offset: "UTC-3:00",
  },
  {
    id: 143,
    city_en: "Cayenne",
    city_zh: "卡宴",
    region_en: "French Guiana",
    region_zh: "法属圭亚那",
    timezone: "America/Cayenne",
    utc_offset: "UTC-3:00",
  },
  {
    id: 144,
    city_en: "Fortaleza",
    city_zh: "福塔莱萨",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Fortaleza",
    utc_offset: "UTC-3:00",
  },
  {
    id: 145,
    city_en: "Maceio",
    city_zh: "马塞约",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Maceio",
    utc_offset: "UTC-3:00",
  },
  {
    id: 146,
    city_en: "Miquelon",
    city_zh: "密克隆群岛",
    region_en: "Saint Pierre and Miquelon",
    region_zh: "圣皮埃尔和密克隆群岛",
    timezone: "America/Miquelon",
    utc_offset: "UTC-3:00",
  },
  {
    id: 147,
    city_en: "Montevideo",
    city_zh: "蒙得维的亚",
    region_en: "Uruguay",
    region_zh: "乌拉圭",
    timezone: "America/Montevideo",
    utc_offset: "UTC-3:00",
  },
  {
    id: 148,
    city_en: "Nuuk",
    city_zh: "努克",
    region_en: "Greenland",
    region_zh: "格陵兰",
    timezone: "America/Nuuk",
    utc_offset: "UTC-3:00",
  },
  {
    id: 149,
    city_en: "Paramaribo",
    city_zh: "帕拉马里博",
    region_en: "Suriname",
    region_zh: "苏里南",
    timezone: "America/Paramaribo",
    utc_offset: "UTC-3:00",
  },
  {
    id: 150,
    city_en: "Punta Arenas",
    city_zh: "蓬塔阿雷纳斯",
    region_en: "Chile",
    region_zh: "智利",
    timezone: "America/Punta_Arenas",
    utc_offset: "UTC-3:00",
  },
  {
    id: 151,
    city_en: "Recife",
    city_zh: "累西腓",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Recife",
    utc_offset: "UTC-3:00",
  },
  {
    id: 152,
    city_en: "Santarem",
    city_zh: "圣塔伦",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Santarem",
    utc_offset: "UTC-3:00",
  },
  {
    id: 153,
    city_en: "Sao Paulo",
    city_zh: "圣保罗",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Sao_Paulo",
    utc_offset: "UTC-3:00",
  },
  {
    id: 154,
    city_en: "Palmer",
    city_zh: "帕尔默",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Palmer",
    utc_offset: "UTC-3:00",
  },
  {
    id: 155,
    city_en: "Rothera",
    city_zh: "罗瑟拉",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Rothera",
    utc_offset: "UTC-3:00",
  },
  {
    id: 156,
    city_en: "Stanley",
    city_zh: "赤柱",
    region_en: "Falkland Islands",
    region_zh: "福克兰群岛",
    timezone: "Atlantic/Stanley",
    utc_offset: "UTC-3:00",
  },
  {
    id: 157,
    city_en: "Noronha",
    city_zh: "诺罗尼亚",
    region_en: "Brazil",
    region_zh: "巴西",
    timezone: "America/Noronha",
    utc_offset: "UTC-2:00",
  },
  {
    id: 158,
    city_en: "South Georgia",
    city_zh: "南乔治亚州",
    region_en: "South Georgia and the South Sandwich Islands",
    region_zh: "南乔治亚岛和南桑威奇群岛",
    timezone: "Atlantic/South_Georgia",
    utc_offset: "UTC-2:00",
  },
  {
    id: 159,
    city_en: "Scoresbysund",
    city_zh: "斯科斯比松德",
    region_en: "Greenland",
    region_zh: "格陵兰",
    timezone: "America/Scoresbysund",
    utc_offset: "UTC-1:00",
  },
  {
    id: 160,
    city_en: "Azores",
    city_zh: "亚速尔群岛",
    region_en: "Portugal",
    region_zh: "葡萄牙",
    timezone: "Atlantic/Azores",
    utc_offset: "UTC-1:00",
  },
  {
    id: 161,
    city_en: "Cape Verde",
    city_zh: "佛得角",
    region_en: "Cabo Verde",
    region_zh: "佛得角",
    timezone: "Atlantic/Cape_Verde",
    utc_offset: "UTC-1:00",
  },
  {
    id: 162,
    city_en: "Abidjan",
    city_zh: "阿比让",
    region_en: "Ivory Coast",
    region_zh: "科特迪瓦",
    timezone: "Africa/Abidjan",
    utc_offset: "UTC+0:00",
  },
  {
    id: 163,
    city_en: "Accra",
    city_zh: "阿克拉",
    region_en: "Ghana",
    region_zh: "加纳",
    timezone: "Africa/Accra",
    utc_offset: "UTC+0:00",
  },
  {
    id: 164,
    city_en: "Bamako",
    city_zh: "巴马科",
    region_en: "Mali",
    region_zh: "马里",
    timezone: "Africa/Bamako",
    utc_offset: "UTC+0:00",
  },
  {
    id: 165,
    city_en: "Banjul",
    city_zh: "班珠尔",
    region_en: "Gambia",
    region_zh: "冈比亚",
    timezone: "Africa/Banjul",
    utc_offset: "UTC+0:00",
  },
  {
    id: 166,
    city_en: "Bissau",
    city_zh: "比绍",
    region_en: "Guinea-Bissau",
    region_zh: "几内亚比绍",
    timezone: "Africa/Bissau",
    utc_offset: "UTC+0:00",
  },
  {
    id: 167,
    city_en: "Casablanca",
    city_zh: "卡萨布兰卡",
    region_en: "Morocco",
    region_zh: "摩洛哥",
    timezone: "Africa/Casablanca",
    utc_offset: "UTC+0:00",
  },
  {
    id: 168,
    city_en: "Conakry",
    city_zh: "科纳克里",
    region_en: "Guinea",
    region_zh: "几内亚",
    timezone: "Africa/Conakry",
    utc_offset: "UTC+0:00",
  },
  {
    id: 169,
    city_en: "Dakar",
    city_zh: "达喀尔",
    region_en: "Senegal",
    region_zh: "塞内加尔",
    timezone: "Africa/Dakar",
    utc_offset: "UTC+0:00",
  },
  {
    id: 170,
    city_en: "El Aaiun",
    city_zh: "阿尤恩",
    region_en: "Western Sahara",
    region_zh: "西撒哈拉",
    timezone: "Africa/El_Aaiun",
    utc_offset: "UTC+0:00",
  },
  {
    id: 171,
    city_en: "Freetown",
    city_zh: "弗里敦",
    region_en: "Sierra Leone",
    region_zh: "塞拉利昂",
    timezone: "Africa/Freetown",
    utc_offset: "UTC+0:00",
  },
  {
    id: 172,
    city_en: "Lome",
    city_zh: "洛美",
    region_en: "Togo",
    region_zh: "多哥",
    timezone: "Africa/Lome",
    utc_offset: "UTC+0:00",
  },
  {
    id: 173,
    city_en: "Monrovia",
    city_zh: "蒙罗维亚",
    region_en: "Liberia",
    region_zh: "利比里亚",
    timezone: "Africa/Monrovia",
    utc_offset: "UTC+0:00",
  },
  {
    id: 174,
    city_en: "Nouakchott",
    city_zh: "努瓦克肖特",
    region_en: "Mauritania",
    region_zh: "毛里塔尼亚",
    timezone: "Africa/Nouakchott",
    utc_offset: "UTC+0:00",
  },
  {
    id: 175,
    city_en: "Ouagadougou",
    city_zh: "瓦加杜古",
    region_en: "Burkina Faso",
    region_zh: "布基纳法索",
    timezone: "Africa/Ouagadougou",
    utc_offset: "UTC+0:00",
  },
  {
    id: 176,
    city_en: "Sao Tome",
    city_zh: "圣多美",
    region_en: "Sao Tome and Principe",
    region_zh: "圣多美和普林西比",
    timezone: "Africa/Sao_Tome",
    utc_offset: "UTC+0:00",
  },
  {
    id: 177,
    city_en: "Danmarkshavn",
    city_zh: "丹麦港",
    region_en: "Greenland",
    region_zh: "格陵兰",
    timezone: "America/Danmarkshavn",
    utc_offset: "UTC+0:00",
  },
  {
    id: 178,
    city_en: "Troll",
    city_zh: "巨魔",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Troll",
    utc_offset: "UTC+0:00",
  },
  {
    id: 179,
    city_en: "Canary",
    city_zh: "加那利",
    region_en: "Spain",
    region_zh: "西班牙",
    timezone: "Atlantic/Canary",
    utc_offset: "UTC+0:00",
  },
  {
    id: 180,
    city_en: "Faroe",
    city_zh: "法罗",
    region_en: "Faroe Islands",
    region_zh: "法罗群岛",
    timezone: "Atlantic/Faroe",
    utc_offset: "UTC+0:00",
  },
  {
    id: 181,
    city_en: "Madeira",
    city_zh: "马德拉",
    region_en: "Portugal",
    region_zh: "葡萄牙",
    timezone: "Atlantic/Madeira",
    utc_offset: "UTC+0:00",
  },
  {
    id: 182,
    city_en: "Reykjavik",
    city_zh: "雷克雅未克",
    region_en: "Iceland",
    region_zh: "冰岛",
    timezone: "Atlantic/Reykjavik",
    utc_offset: "UTC+0:00",
  },
  {
    id: 183,
    city_en: "St Helena",
    city_zh: "圣赫勒拿",
    region_en: "Saint Helena",
    region_zh: "圣赫勒拿",
    timezone: "Atlantic/St_Helena",
    utc_offset: "UTC+0:00",
  },
  {
    id: 184,
    city_en: "Dublin",
    city_zh: "都柏林",
    region_en: "Ireland",
    region_zh: "爱尔兰",
    timezone: "Europe/Dublin",
    utc_offset: "UTC+0:00",
  },
  {
    id: 185,
    city_en: "Guernsey",
    city_zh: "根西岛",
    region_en: "Guernsey",
    region_zh: "根西岛",
    timezone: "Europe/Guernsey",
    utc_offset: "UTC+0:00",
  },
  {
    id: 186,
    city_en: "Isle of Man",
    city_zh: "马恩岛",
    region_en: "Isle of Man",
    region_zh: "马恩岛",
    timezone: "Europe/Isle_of_Man",
    utc_offset: "UTC+0:00",
  },
  {
    id: 187,
    city_en: "Jersey",
    city_zh: "泽西岛",
    region_en: "Jersey",
    region_zh: "泽西岛",
    timezone: "Europe/Jersey",
    utc_offset: "UTC+0:00",
  },
  {
    id: 188,
    city_en: "Lisbon",
    city_zh: "里斯本",
    region_en: "Portugal",
    region_zh: "葡萄牙",
    timezone: "Europe/Lisbon",
    utc_offset: "UTC+0:00",
  },
  {
    id: 189,
    city_en: "London",
    city_zh: "伦敦",
    region_en: "United Kingdom",
    region_zh: "英国",
    timezone: "Europe/London",
    utc_offset: "UTC+0:00",
  },
  {
    id: 190,
    city_en: "Algiers",
    city_zh: "阿尔及尔",
    region_en: "Algeria",
    region_zh: "阿尔及利亚",
    timezone: "Africa/Algiers",
    utc_offset: "UTC+1:00",
  },
  {
    id: 191,
    city_en: "Bangui",
    city_zh: "班吉",
    region_en: "Central African Republic",
    region_zh: "中非共和国",
    timezone: "Africa/Bangui",
    utc_offset: "UTC+1:00",
  },
  {
    id: 192,
    city_en: "Brazzaville",
    city_zh: "布拉柴维尔",
    region_en: "Republic of the Congo",
    region_zh: "刚果(布)共和国",
    timezone: "Africa/Brazzaville",
    utc_offset: "UTC+1:00",
  },
  {
    id: 193,
    city_en: "Ceuta",
    city_zh: "休达",
    region_en: "Spain",
    region_zh: "西班牙",
    timezone: "Africa/Ceuta",
    utc_offset: "UTC+1:00",
  },
  {
    id: 194,
    city_en: "Douala",
    city_zh: "杜阿拉",
    region_en: "Cameroon",
    region_zh: "喀麦隆",
    timezone: "Africa/Douala",
    utc_offset: "UTC+1:00",
  },
  {
    id: 195,
    city_en: "Kinshasa",
    city_zh: "金沙萨",
    region_en: "Democratic Republic of the Congo",
    region_zh: "刚果(金)民主共和国",
    timezone: "Africa/Kinshasa",
    utc_offset: "UTC+1:00",
  },
  {
    id: 196,
    city_en: "Lagos",
    city_zh: "拉各斯",
    region_en: "Nigeria",
    region_zh: "尼日利亚",
    timezone: "Africa/Lagos",
    utc_offset: "UTC+1:00",
  },
  {
    id: 197,
    city_en: "Libreville",
    city_zh: "利伯维尔",
    region_en: "Gabon",
    region_zh: "加蓬",
    timezone: "Africa/Libreville",
    utc_offset: "UTC+1:00",
  },
  {
    id: 198,
    city_en: "Luanda",
    city_zh: "罗安达",
    region_en: "Angola",
    region_zh: "安哥拉",
    timezone: "Africa/Luanda",
    utc_offset: "UTC+1:00",
  },
  {
    id: 199,
    city_en: "Malabo",
    city_zh: "马拉博",
    region_en: "Equatorial Guinea",
    region_zh: "赤道几内亚",
    timezone: "Africa/Malabo",
    utc_offset: "UTC+1:00",
  },
  {
    id: 200,
    city_en: "Ndjamena",
    city_zh: "恩贾梅纳",
    region_en: "Chad",
    region_zh: "乍得",
    timezone: "Africa/Ndjamena",
    utc_offset: "UTC+1:00",
  },
  {
    id: 201,
    city_en: "Niamey",
    city_zh: "尼亚美",
    region_en: "Niger",
    region_zh: "尼日尔",
    timezone: "Africa/Niamey",
    utc_offset: "UTC+1:00",
  },
  {
    id: 202,
    city_en: "Porto-Novo",
    city_zh: "波多诺伏",
    region_en: "Benin",
    region_zh: "贝宁",
    timezone: "Africa/Porto-Novo",
    utc_offset: "UTC+1:00",
  },
  {
    id: 203,
    city_en: "Tunis",
    city_zh: "突尼斯",
    region_en: "Tunisia",
    region_zh: "突尼斯",
    timezone: "Africa/Tunis",
    utc_offset: "UTC+1:00",
  },
  {
    id: 204,
    city_en: "Windhoek",
    city_zh: "温得和克",
    region_en: "Namibia",
    region_zh: "纳米比亚",
    timezone: "Africa/Windhoek",
    utc_offset: "UTC+1:00",
  },
  {
    id: 205,
    city_en: "Longyearbyen",
    city_zh: "朗伊尔城",
    region_en: "Svalbard and Jan Mayen",
    region_zh: "斯瓦尔巴群岛和扬马延岛",
    timezone: "Arctic/Longyearbyen",
    utc_offset: "UTC+1:00",
  },
  {
    id: 206,
    city_en: "Amsterdam",
    city_zh: "阿姆斯特丹",
    region_en: "Netherlands",
    region_zh: "荷兰",
    timezone: "Europe/Amsterdam",
    utc_offset: "UTC+1:00",
  },
  {
    id: 207,
    city_en: "Andorra",
    city_zh: "安道尔",
    region_en: "Andorra",
    region_zh: "安道尔",
    timezone: "Europe/Andorra",
    utc_offset: "UTC+1:00",
  },
  {
    id: 208,
    city_en: "Belgrade",
    city_zh: "贝尔格莱德",
    region_en: "Serbia",
    region_zh: "塞尔维亚",
    timezone: "Europe/Belgrade",
    utc_offset: "UTC+1:00",
  },
  {
    id: 209,
    city_en: "Berlin",
    city_zh: "柏林",
    region_en: "Germany",
    region_zh: "德国",
    timezone: "Europe/Berlin",
    utc_offset: "UTC+1:00",
  },
  {
    id: 210,
    city_en: "Bratislava",
    city_zh: "布拉迪斯拉发",
    region_en: "Slovakia",
    region_zh: "斯洛伐克",
    timezone: "Europe/Bratislava",
    utc_offset: "UTC+1:00",
  },
  {
    id: 211,
    city_en: "Brussels",
    city_zh: "布鲁塞尔",
    region_en: "Belgium",
    region_zh: "比利时",
    timezone: "Europe/Brussels",
    utc_offset: "UTC+1:00",
  },
  {
    id: 212,
    city_en: "Budapest",
    city_zh: "布达佩斯",
    region_en: "Hungary",
    region_zh: "匈牙利",
    timezone: "Europe/Budapest",
    utc_offset: "UTC+1:00",
  },
  {
    id: 213,
    city_en: "Busingen",
    city_zh: "布辛根",
    region_en: "Germany",
    region_zh: "德国",
    timezone: "Europe/Busingen",
    utc_offset: "UTC+1:00",
  },
  {
    id: 214,
    city_en: "Copenhagen",
    city_zh: "哥本哈根",
    region_en: "Denmark",
    region_zh: "丹麦",
    timezone: "Europe/Copenhagen",
    utc_offset: "UTC+1:00",
  },
  {
    id: 215,
    city_en: "Gibraltar",
    city_zh: "直布罗陀",
    region_en: "Gibraltar",
    region_zh: "直布罗陀",
    timezone: "Europe/Gibraltar",
    utc_offset: "UTC+1:00",
  },
  {
    id: 216,
    city_en: "Ljubljana",
    city_zh: "卢布尔雅那",
    region_en: "Slovenia",
    region_zh: "斯洛文尼亚",
    timezone: "Europe/Ljubljana",
    utc_offset: "UTC+1:00",
  },
  {
    id: 217,
    city_en: "Luxembourg",
    city_zh: "卢森堡",
    region_en: "Luxembourg",
    region_zh: "卢森堡",
    timezone: "Europe/Luxembourg",
    utc_offset: "UTC+1:00",
  },
  {
    id: 218,
    city_en: "Madrid",
    city_zh: "马德里",
    region_en: "Spain",
    region_zh: "西班牙",
    timezone: "Europe/Madrid",
    utc_offset: "UTC+1:00",
  },
  {
    id: 219,
    city_en: "Malta",
    city_zh: "马耳他",
    region_en: "Malta",
    region_zh: "马耳他",
    timezone: "Europe/Malta",
    utc_offset: "UTC+1:00",
  },
  {
    id: 220,
    city_en: "Monaco",
    city_zh: "摩纳哥",
    region_en: "Monaco",
    region_zh: "摩纳哥",
    timezone: "Europe/Monaco",
    utc_offset: "UTC+1:00",
  },
  {
    id: 221,
    city_en: "Oslo",
    city_zh: "奥斯陆",
    region_en: "Norway",
    region_zh: "挪威",
    timezone: "Europe/Oslo",
    utc_offset: "UTC+1:00",
  },
  {
    id: 222,
    city_en: "Paris",
    city_zh: "巴黎",
    region_en: "France",
    region_zh: "法国",
    timezone: "Europe/Paris",
    utc_offset: "UTC+1:00",
  },
  {
    id: 223,
    city_en: "Podgorica",
    city_zh: "波德戈里察",
    region_en: "Montenegro",
    region_zh: "黑山",
    timezone: "Europe/Podgorica",
    utc_offset: "UTC+1:00",
  },
  {
    id: 224,
    city_en: "Prague",
    city_zh: "布拉格",
    region_en: "Czechia",
    region_zh: "捷克",
    timezone: "Europe/Prague",
    utc_offset: "UTC+1:00",
  },
  {
    id: 225,
    city_en: "Rome",
    city_zh: "罗马",
    region_en: "Italy",
    region_zh: "意大利",
    timezone: "Europe/Rome",
    utc_offset: "UTC+1:00",
  },
  {
    id: 226,
    city_en: "San Marino",
    city_zh: "圣马力诺",
    region_en: "San Marino",
    region_zh: "圣马力诺",
    timezone: "Europe/San_Marino",
    utc_offset: "UTC+1:00",
  },
  {
    id: 227,
    city_en: "Sarajevo",
    city_zh: "萨拉热窝",
    region_en: "Bosnia and Herzegovina",
    region_zh: "波斯尼亚和黑塞哥维那",
    timezone: "Europe/Sarajevo",
    utc_offset: "UTC+1:00",
  },
  {
    id: 228,
    city_en: "Skopje",
    city_zh: "斯科普里",
    region_en: "North Macedonia",
    region_zh: "北马其顿",
    timezone: "Europe/Skopje",
    utc_offset: "UTC+1:00",
  },
  {
    id: 229,
    city_en: "Stockholm",
    city_zh: "斯德哥尔摩",
    region_en: "Sweden",
    region_zh: "瑞典",
    timezone: "Europe/Stockholm",
    utc_offset: "UTC+1:00",
  },
  {
    id: 230,
    city_en: "Tirane",
    city_zh: "蒂拉内",
    region_en: "Albania",
    region_zh: "阿尔巴尼亚",
    timezone: "Europe/Tirane",
    utc_offset: "UTC+1:00",
  },
  {
    id: 231,
    city_en: "Vaduz",
    city_zh: "瓦杜兹",
    region_en: "Liechtenstein",
    region_zh: "列支敦士登",
    timezone: "Europe/Vaduz",
    utc_offset: "UTC+1:00",
  },
  {
    id: 232,
    city_en: "Vatican",
    city_zh: "梵蒂冈",
    region_en: "Vatican",
    region_zh: "梵蒂冈",
    timezone: "Europe/Vatican",
    utc_offset: "UTC+1:00",
  },
  {
    id: 233,
    city_en: "Vienna",
    city_zh: "维也纳",
    region_en: "Austria",
    region_zh: "奥地利",
    timezone: "Europe/Vienna",
    utc_offset: "UTC+1:00",
  },
  {
    id: 234,
    city_en: "Warsaw",
    city_zh: "华沙",
    region_en: "Poland",
    region_zh: "波兰",
    timezone: "Europe/Warsaw",
    utc_offset: "UTC+1:00",
  },
  {
    id: 235,
    city_en: "Zagreb",
    city_zh: "萨格勒布",
    region_en: "Croatia",
    region_zh: "克罗地亚",
    timezone: "Europe/Zagreb",
    utc_offset: "UTC+1:00",
  },
  {
    id: 236,
    city_en: "Zurich",
    city_zh: "苏黎世",
    region_en: "Switzerland",
    region_zh: "瑞士",
    timezone: "Europe/Zurich",
    utc_offset: "UTC+1:00",
  },
  {
    id: 237,
    city_en: "Blantyre",
    city_zh: "布兰太尔",
    region_en: "Malawi",
    region_zh: "马拉维",
    timezone: "Africa/Blantyre",
    utc_offset: "UTC+2:00",
  },
  {
    id: 238,
    city_en: "Bujumbura",
    city_zh: "布琼布拉",
    region_en: "Burundi",
    region_zh: "布隆迪",
    timezone: "Africa/Bujumbura",
    utc_offset: "UTC+2:00",
  },
  {
    id: 239,
    city_en: "Cairo",
    city_zh: "开罗",
    region_en: "Egypt",
    region_zh: "埃及",
    timezone: "Africa/Cairo",
    utc_offset: "UTC+2:00",
  },
  {
    id: 240,
    city_en: "Gaborone",
    city_zh: "哈博罗内",
    region_en: "Botswana",
    region_zh: "博茨瓦纳",
    timezone: "Africa/Gaborone",
    utc_offset: "UTC+2:00",
  },
  {
    id: 241,
    city_en: "Harare",
    city_zh: "哈拉雷",
    region_en: "Zimbabwe",
    region_zh: "津巴布韦",
    timezone: "Africa/Harare",
    utc_offset: "UTC+2:00",
  },
  {
    id: 242,
    city_en: "Johannesburg",
    city_zh: "约翰内斯堡",
    region_en: "South Africa",
    region_zh: "南非",
    timezone: "Africa/Johannesburg",
    utc_offset: "UTC+2:00",
  },
  {
    id: 243,
    city_en: "Juba",
    city_zh: "朱巴",
    region_en: "South Sudan",
    region_zh: "南苏丹",
    timezone: "Africa/Juba",
    utc_offset: "UTC+2:00",
  },
  {
    id: 244,
    city_en: "Khartoum",
    city_zh: "喀土穆",
    region_en: "Sudan",
    region_zh: "苏丹",
    timezone: "Africa/Khartoum",
    utc_offset: "UTC+2:00",
  },
  {
    id: 245,
    city_en: "Kigali",
    city_zh: "基加利",
    region_en: "Rwanda",
    region_zh: "卢旺达",
    timezone: "Africa/Kigali",
    utc_offset: "UTC+2:00",
  },
  {
    id: 246,
    city_en: "Lubumbashi",
    city_zh: "卢本巴希",
    region_en: "Democratic Republic of the Congo",
    region_zh: "刚果(金)民主共和国",
    timezone: "Africa/Lubumbashi",
    utc_offset: "UTC+2:00",
  },
  {
    id: 247,
    city_en: "Lusaka",
    city_zh: "卢萨卡",
    region_en: "Zambia",
    region_zh: "赞比亚",
    timezone: "Africa/Lusaka",
    utc_offset: "UTC+2:00",
  },
  {
    id: 248,
    city_en: "Maputo",
    city_zh: "马普托",
    region_en: "Mozambique",
    region_zh: "莫桑比克",
    timezone: "Africa/Maputo",
    utc_offset: "UTC+2:00",
  },
  {
    id: 249,
    city_en: "Maseru",
    city_zh: "马塞卢",
    region_en: "Lesotho",
    region_zh: "莱索托",
    timezone: "Africa/Maseru",
    utc_offset: "UTC+2:00",
  },
  {
    id: 250,
    city_en: "Mbabane",
    city_zh: "姆巴巴内",
    region_en: "Eswatini",
    region_zh: "斯威士兰",
    timezone: "Africa/Mbabane",
    utc_offset: "UTC+2:00",
  },
  {
    id: 251,
    city_en: "Tripoli",
    city_zh: "的黎波里",
    region_en: "Libya",
    region_zh: "利比亚",
    timezone: "Africa/Tripoli",
    utc_offset: "UTC+2:00",
  },
  {
    id: 252,
    city_en: "Beirut",
    city_zh: "贝鲁特",
    region_en: "Lebanon",
    region_zh: "黎巴嫩",
    timezone: "Asia/Beirut",
    utc_offset: "UTC+2:00",
  },
  {
    id: 253,
    city_en: "Famagusta",
    city_zh: "法马古斯塔",
    region_en: "Cyprus",
    region_zh: "塞浦路斯",
    timezone: "Asia/Famagusta",
    utc_offset: "UTC+2:00",
  },
  {
    id: 254,
    city_en: "Gaza",
    city_zh: "加沙",
    region_en: "Palestinian Territory",
    region_zh: "巴勒斯坦领土",
    timezone: "Asia/Gaza",
    utc_offset: "UTC+2:00",
  },
  {
    id: 255,
    city_en: "Hebron",
    city_zh: "希伯伦",
    region_en: "Palestinian Territory",
    region_zh: "巴勒斯坦领土",
    timezone: "Asia/Hebron",
    utc_offset: "UTC+2:00",
  },
  {
    id: 256,
    city_en: "Jerusalem",
    city_zh: "耶路撒冷",
    region_en: "Israel",
    region_zh: "以色列",
    timezone: "Asia/Jerusalem",
    utc_offset: "UTC+2:00",
  },
  {
    id: 257,
    city_en: "Nicosia",
    city_zh: "尼科西亚",
    region_en: "Cyprus",
    region_zh: "塞浦路斯",
    timezone: "Asia/Nicosia",
    utc_offset: "UTC+2:00",
  },
  {
    id: 258,
    city_en: "Athens",
    city_zh: "雅典",
    region_en: "Greece",
    region_zh: "希腊",
    timezone: "Europe/Athens",
    utc_offset: "UTC+2:00",
  },
  {
    id: 259,
    city_en: "Bucharest",
    city_zh: "布加勒斯特",
    region_en: "Romania",
    region_zh: "罗马尼亚",
    timezone: "Europe/Bucharest",
    utc_offset: "UTC+2:00",
  },
  {
    id: 260,
    city_en: "Chisinau",
    city_zh: "基希讷乌",
    region_en: "Moldova",
    region_zh: "摩尔多瓦",
    timezone: "Europe/Chisinau",
    utc_offset: "UTC+2:00",
  },
  {
    id: 261,
    city_en: "Helsinki",
    city_zh: "赫尔辛基",
    region_en: "Finland",
    region_zh: "芬兰",
    timezone: "Europe/Helsinki",
    utc_offset: "UTC+2:00",
  },
  {
    id: 262,
    city_en: "Kaliningrad",
    city_zh: "加里宁格勒",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Kaliningrad",
    utc_offset: "UTC+2:00",
  },
  {
    id: 263,
    city_en: "Kyiv",
    city_zh: "基辅",
    region_en: "Ukraine",
    region_zh: "乌克兰",
    timezone: "Europe/Kyiv",
    utc_offset: "UTC+2:00",
  },
  {
    id: 264,
    city_en: "Mariehamn",
    city_zh: "玛丽港",
    region_en: "Aland Islands",
    region_zh: "奥兰群岛",
    timezone: "Europe/Mariehamn",
    utc_offset: "UTC+2:00",
  },
  {
    id: 265,
    city_en: "Riga",
    city_zh: "里加",
    region_en: "Latvia",
    region_zh: "拉托维亚",
    timezone: "Europe/Riga",
    utc_offset: "UTC+2:00",
  },
  {
    id: 266,
    city_en: "Sofia",
    city_zh: "索非亚",
    region_en: "Bulgaria",
    region_zh: "保加利亚",
    timezone: "Europe/Sofia",
    utc_offset: "UTC+2:00",
  },
  {
    id: 267,
    city_en: "Tallinn",
    city_zh: "塔林",
    region_en: "Estonia",
    region_zh: "爱沙尼亚",
    timezone: "Europe/Tallinn",
    utc_offset: "UTC+2:00",
  },
  {
    id: 268,
    city_en: "Vilnius",
    city_zh: "维尔纽斯",
    region_en: "Lithuania",
    region_zh: "立陶宛",
    timezone: "Europe/Vilnius",
    utc_offset: "UTC+2:00",
  },
  {
    id: 269,
    city_en: "Addis Ababa",
    city_zh: "亚的斯亚贝巴",
    region_en: "Ethiopia",
    region_zh: "埃塞俄比亚",
    timezone: "Africa/Addis_Ababa",
    utc_offset: "UTC+3:00",
  },
  {
    id: 270,
    city_en: "Asmara",
    city_zh: "阿斯马拉",
    region_en: "Eritrea",
    region_zh: "厄立特里亚",
    timezone: "Africa/Asmara",
    utc_offset: "UTC+3:00",
  },
  {
    id: 271,
    city_en: "Dar es Salaam",
    city_zh: "达累斯萨拉姆",
    region_en: "Tanzania",
    region_zh: "坦桑尼亚",
    timezone: "Africa/Dar_es_Salaam",
    utc_offset: "UTC+3:00",
  },
  {
    id: 272,
    city_en: "Djibouti",
    city_zh: "吉布提",
    region_en: "Djibouti",
    region_zh: "吉布提",
    timezone: "Africa/Djibouti",
    utc_offset: "UTC+3:00",
  },
  {
    id: 273,
    city_en: "Kampala",
    city_zh: "坎帕拉",
    region_en: "Uganda",
    region_zh: "乌干达",
    timezone: "Africa/Kampala",
    utc_offset: "UTC+3:00",
  },
  {
    id: 274,
    city_en: "Mogadishu",
    city_zh: "摩加迪沙",
    region_en: "Somalia",
    region_zh: "索马里",
    timezone: "Africa/Mogadishu",
    utc_offset: "UTC+3:00",
  },
  {
    id: 275,
    city_en: "Nairobi",
    city_zh: "内罗毕",
    region_en: "Kenya",
    region_zh: "肯尼亚",
    timezone: "Africa/Nairobi",
    utc_offset: "UTC+3:00",
  },
  {
    id: 276,
    city_en: "Syowa",
    city_zh: "西奥瓦",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Syowa",
    utc_offset: "UTC+3:00",
  },
  {
    id: 277,
    city_en: "Aden",
    city_zh: "亚丁",
    region_en: "Yemen",
    region_zh: "也门",
    timezone: "Asia/Aden",
    utc_offset: "UTC+3:00",
  },
  {
    id: 278,
    city_en: "Amman",
    city_zh: "安曼",
    region_en: "Jordan",
    region_zh: "约旦",
    timezone: "Asia/Amman",
    utc_offset: "UTC+3:00",
  },
  {
    id: 279,
    city_en: "Baghdad",
    city_zh: "巴格达",
    region_en: "Iraq",
    region_zh: "伊拉克",
    timezone: "Asia/Baghdad",
    utc_offset: "UTC+3:00",
  },
  {
    id: 280,
    city_en: "Bahrain",
    city_zh: "巴林",
    region_en: "Bahrain",
    region_zh: "巴林",
    timezone: "Asia/Bahrain",
    utc_offset: "UTC+3:00",
  },
  {
    id: 281,
    city_en: "Damascus",
    city_zh: "大马士革",
    region_en: "Syria",
    region_zh: "叙利亚",
    timezone: "Asia/Damascus",
    utc_offset: "UTC+3:00",
  },
  {
    id: 282,
    city_en: "Kuwait",
    city_zh: "科威特",
    region_en: "Kuwait",
    region_zh: "科威特",
    timezone: "Asia/Kuwait",
    utc_offset: "UTC+3:00",
  },
  {
    id: 283,
    city_en: "Qatar",
    city_zh: "卡塔尔",
    region_en: "Qatar",
    region_zh: "卡塔尔",
    timezone: "Asia/Qatar",
    utc_offset: "UTC+3:00",
  },
  {
    id: 284,
    city_en: "Riyadh",
    city_zh: "利雅得",
    region_en: "Saudi Arabia",
    region_zh: "沙特阿拉伯",
    timezone: "Asia/Riyadh",
    utc_offset: "UTC+3:00",
  },
  {
    id: 285,
    city_en: "Istanbul",
    city_zh: "伊斯坦布尔",
    region_en: "Turkey",
    region_zh: "土耳其",
    timezone: "Europe/Istanbul",
    utc_offset: "UTC+3:00",
  },
  {
    id: 286,
    city_en: "Kirov",
    city_zh: "基洛夫",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Kirov",
    utc_offset: "UTC+3:00",
  },
  {
    id: 287,
    city_en: "Minsk",
    city_zh: "明斯克",
    region_en: "Belarus",
    region_zh: "白俄罗斯",
    timezone: "Europe/Minsk",
    utc_offset: "UTC+3:00",
  },
  {
    id: 288,
    city_en: "Moscow",
    city_zh: "莫斯科",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Moscow",
    utc_offset: "UTC+3:00",
  },
  {
    id: 289,
    city_en: "Simferopol",
    city_zh: "辛菲罗波尔",
    region_en: "Ukraine",
    region_zh: "乌克兰",
    timezone: "Europe/Simferopol",
    utc_offset: "UTC+3:00",
  },
  {
    id: 290,
    city_en: "Volgograd",
    city_zh: "伏尔加格勒",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Volgograd",
    utc_offset: "UTC+3:00",
  },
  {
    id: 291,
    city_en: "Antananarivo",
    city_zh: "塔那那利佛",
    region_en: "Madagascar",
    region_zh: "马达加斯加",
    timezone: "Indian/Antananarivo",
    utc_offset: "UTC+3:00",
  },
  {
    id: 292,
    city_en: "Comoro",
    city_zh: "科摩罗",
    region_en: "Comoros",
    region_zh: "科摩罗",
    timezone: "Indian/Comoro",
    utc_offset: "UTC+3:00",
  },
  {
    id: 293,
    city_en: "Mayotte",
    city_zh: "马约特岛",
    region_en: "Mayotte",
    region_zh: "马约特",
    timezone: "Indian/Mayotte",
    utc_offset: "UTC+3:00",
  },
  {
    id: 294,
    city_en: "Tehran",
    city_zh: "德黑兰",
    region_en: "Iran",
    region_zh: "伊朗",
    timezone: "Asia/Tehran",
    utc_offset: "UTC+3:30",
  },
  {
    id: 295,
    city_en: "Baku",
    city_zh: "巴库",
    region_en: "Azerbaijan",
    region_zh: "阿塞拜疆",
    timezone: "Asia/Baku",
    utc_offset: "UTC+4:00",
  },
  {
    id: 296,
    city_en: "Dubai",
    city_zh: "迪拜",
    region_en: "United Arab Emirates",
    region_zh: "阿拉伯联合酋长国",
    timezone: "Asia/Dubai",
    utc_offset: "UTC+4:00",
  },
  {
    id: 297,
    city_en: "Muscat",
    city_zh: "马斯喀特",
    region_en: "Oman",
    region_zh: "阿曼",
    timezone: "Asia/Muscat",
    utc_offset: "UTC+4:00",
  },
  {
    id: 298,
    city_en: "Tbilisi",
    city_zh: "第比利斯",
    region_en: "Georgia",
    region_zh: "格鲁吉亚",
    timezone: "Asia/Tbilisi",
    utc_offset: "UTC+4:00",
  },
  {
    id: 299,
    city_en: "Yerevan",
    city_zh: "埃里温",
    region_en: "Armenia",
    region_zh: "亚美尼亚",
    timezone: "Asia/Yerevan",
    utc_offset: "UTC+4:00",
  },
  {
    id: 300,
    city_en: "Astrakhan",
    city_zh: "阿斯特拉罕",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Astrakhan",
    utc_offset: "UTC+4:00",
  },
  {
    id: 301,
    city_en: "Samara",
    city_zh: "萨马拉",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Samara",
    utc_offset: "UTC+4:00",
  },
  {
    id: 302,
    city_en: "Saratov",
    city_zh: "萨拉托夫",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Saratov",
    utc_offset: "UTC+4:00",
  },
  {
    id: 303,
    city_en: "Ulyanovsk",
    city_zh: "乌里扬诺夫斯克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Europe/Ulyanovsk",
    utc_offset: "UTC+4:00",
  },
  {
    id: 304,
    city_en: "Mahe",
    city_zh: "马埃岛",
    region_en: "Seychelles",
    region_zh: "塞舌尔",
    timezone: "Indian/Mahe",
    utc_offset: "UTC+4:00",
  },
  {
    id: 305,
    city_en: "Mauritius",
    city_zh: "毛里求斯",
    region_en: "Mauritius",
    region_zh: "毛里求斯",
    timezone: "Indian/Mauritius",
    utc_offset: "UTC+4:00",
  },
  {
    id: 306,
    city_en: "Reunion",
    city_zh: "留尼汪岛",
    region_en: "Reunion",
    region_zh: "留尼汪",
    timezone: "Indian/Reunion",
    utc_offset: "UTC+4:00",
  },
  {
    id: 307,
    city_en: "Kabul",
    city_zh: "喀布尔",
    region_en: "Afghanistan",
    region_zh: "阿富汗",
    timezone: "Asia/Kabul",
    utc_offset: "UTC+4:30",
  },
  {
    id: 308,
    city_en: "Mawson",
    city_zh: "莫森",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Mawson",
    utc_offset: "UTC+5:00",
  },
  {
    id: 309,
    city_en: "Aqtau",
    city_zh: "阿克套",
    region_en: "Kazakhstan",
    region_zh: "哈萨克斯坦",
    timezone: "Asia/Aqtau",
    utc_offset: "UTC+5:00",
  },
  {
    id: 310,
    city_en: "Aqtobe",
    city_zh: "阿克托别",
    region_en: "Kazakhstan",
    region_zh: "哈萨克斯坦",
    timezone: "Asia/Aqtobe",
    utc_offset: "UTC+5:00",
  },
  {
    id: 311,
    city_en: "Ashgabat",
    city_zh: "阿什哈巴德",
    region_en: "Turkmenistan",
    region_zh: "土库曼斯坦",
    timezone: "Asia/Ashgabat",
    utc_offset: "UTC+5:00",
  },
  {
    id: 312,
    city_en: "Atyrau",
    city_zh: "阿特劳",
    region_en: "Kazakhstan",
    region_zh: "哈萨克斯坦",
    timezone: "Asia/Atyrau",
    utc_offset: "UTC+5:00",
  },
  {
    id: 313,
    city_en: "Dushanbe",
    city_zh: "杜尚别",
    region_en: "Tajikistan",
    region_zh: "塔吉克斯坦",
    timezone: "Asia/Dushanbe",
    utc_offset: "UTC+5:00",
  },
  {
    id: 314,
    city_en: "Karachi",
    city_zh: "卡拉奇",
    region_en: "Pakistan",
    region_zh: "巴基斯坦",
    timezone: "Asia/Karachi",
    utc_offset: "UTC+5:00",
  },
  {
    id: 315,
    city_en: "Oral",
    city_zh: "口腔",
    region_en: "Kazakhstan",
    region_zh: "哈萨克斯坦",
    timezone: "Asia/Oral",
    utc_offset: "UTC+5:00",
  },
  {
    id: 316,
    city_en: "Qyzylorda",
    city_zh: "克孜勒奥尔达",
    region_en: "Kazakhstan",
    region_zh: "哈萨克斯坦",
    timezone: "Asia/Qyzylorda",
    utc_offset: "UTC+5:00",
  },
  {
    id: 317,
    city_en: "Samarkand",
    city_zh: "撒马尔罕",
    region_en: "Uzbekistan",
    region_zh: "乌兹别克斯坦",
    timezone: "Asia/Samarkand",
    utc_offset: "UTC+5:00",
  },
  {
    id: 318,
    city_en: "Tashkent",
    city_zh: "塔什干",
    region_en: "Uzbekistan",
    region_zh: "乌兹别克斯坦",
    timezone: "Asia/Tashkent",
    utc_offset: "UTC+5:00",
  },
  {
    id: 319,
    city_en: "Yekaterinburg",
    city_zh: "叶卡捷琳堡",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Yekaterinburg",
    utc_offset: "UTC+5:00",
  },
  {
    id: 320,
    city_en: "Kerguelen",
    city_zh: "凯尔盖朗",
    region_en: "French Southern Territories",
    region_zh: "法属南部领地",
    timezone: "Indian/Kerguelen",
    utc_offset: "UTC+5:00",
  },
  {
    id: 321,
    city_en: "Maldives",
    city_zh: "马尔代夫",
    region_en: "Maldives",
    region_zh: "马尔代夫",
    timezone: "Indian/Maldives",
    utc_offset: "UTC+5:00",
  },
  {
    id: 322,
    city_en: "Colombo",
    city_zh: "科伦坡",
    region_en: "Sri Lanka",
    region_zh: "斯里兰卡",
    timezone: "Asia/Colombo",
    utc_offset: "UTC+5:30",
  },
  {
    id: 323,
    city_en: "Kolkata",
    city_zh: "加尔各答",
    region_en: "India",
    region_zh: "印度",
    timezone: "Asia/Kolkata",
    utc_offset: "UTC+5:30",
  },
  {
    id: 324,
    city_en: "Kathmandu",
    city_zh: "加德满都",
    region_en: "Nepal",
    region_zh: "尼泊尔",
    timezone: "Asia/Kathmandu",
    utc_offset: "UTC+5:45",
  },
  {
    id: 325,
    city_en: "Vostok",
    city_zh: "东方",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Vostok",
    utc_offset: "UTC+6:00",
  },
  {
    id: 326,
    city_en: "Almaty",
    city_zh: "阿拉木图",
    region_en: "Kazakhstan",
    region_zh: "哈萨克斯坦",
    timezone: "Asia/Almaty",
    utc_offset: "UTC+6:00",
  },
  {
    id: 327,
    city_en: "Bishkek",
    city_zh: "比什凯克",
    region_en: "Kyrgyzstan",
    region_zh: "吉尔吉斯斯坦",
    timezone: "Asia/Bishkek",
    utc_offset: "UTC+6:00",
  },
  {
    id: 328,
    city_en: "Dhaka",
    city_zh: "达卡",
    region_en: "Bangladesh",
    region_zh: "孟加拉国",
    timezone: "Asia/Dhaka",
    utc_offset: "UTC+6:00",
  },
  {
    id: 329,
    city_en: "Omsk",
    city_zh: "鄂木斯克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Omsk",
    utc_offset: "UTC+6:00",
  },
  {
    id: 330,
    city_en: "Qostanay",
    city_zh: "库斯塔奈",
    region_en: "Kazakhstan",
    region_zh: "哈萨克斯坦",
    timezone: "Asia/Qostanay",
    utc_offset: "UTC+6:00",
  },
  {
    id: 331,
    city_en: "Thimphu",
    city_zh: "廷布",
    region_en: "Bhutan",
    region_zh: "不丹",
    timezone: "Asia/Thimphu",
    utc_offset: "UTC+6:00",
  },
  {
    id: 332,
    city_en: "Urumqi",
    city_zh: "乌鲁木齐",
    region_en: "China",
    region_zh: "中国",
    timezone: "Asia/Urumqi",
    utc_offset: "UTC+6:00",
  },
  {
    id: 333,
    city_en: "Chagos",
    city_zh: "查戈斯",
    region_en: "British Indian Ocean Territory",
    region_zh: "英属印度洋领地",
    timezone: "Indian/Chagos",
    utc_offset: "UTC+6:00",
  },
  {
    id: 334,
    city_en: "Yangon",
    city_zh: "仰光",
    region_en: "Myanmar",
    region_zh: "缅甸",
    timezone: "Asia/Yangon",
    utc_offset: "UTC+6:30",
  },
  {
    id: 335,
    city_en: "Cocos",
    city_zh: "科科斯",
    region_en: "Cocos Islands",
    region_zh: "科科斯群岛",
    timezone: "Indian/Cocos",
    utc_offset: "UTC+6:30",
  },
  {
    id: 336,
    city_en: "Davis",
    city_zh: "戴维斯",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Davis",
    utc_offset: "UTC+7:00",
  },
  {
    id: 337,
    city_en: "Bangkok",
    city_zh: "曼谷",
    region_en: "Thailand",
    region_zh: "泰国",
    timezone: "Asia/Bangkok",
    utc_offset: "UTC+7:00",
  },
  {
    id: 338,
    city_en: "Barnaul",
    city_zh: "巴尔瑙尔",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Barnaul",
    utc_offset: "UTC+7:00",
  },
  {
    id: 339,
    city_en: "Hovd",
    city_zh: "霍夫德",
    region_en: "Mongolia",
    region_zh: "蒙古",
    timezone: "Asia/Hovd",
    utc_offset: "UTC+7:00",
  },
  {
    id: 340,
    city_en: "Ho Chi Minh",
    city_zh: "胡志明市",
    region_en: "Vietnam",
    region_zh: "越南",
    timezone: "Asia/Ho_Chi_Minh",
    utc_offset: "UTC+7:00",
  },
  {
    id: 341,
    city_en: "Jakarta",
    city_zh: "雅加达",
    region_en: "Indonesia",
    region_zh: "印度尼西亚",
    timezone: "Asia/Jakarta",
    utc_offset: "UTC+7:00",
  },
  {
    id: 342,
    city_en: "Krasnoyarsk",
    city_zh: "克拉斯诺亚尔斯克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Krasnoyarsk",
    utc_offset: "UTC+7:00",
  },
  {
    id: 343,
    city_en: "Novokuznetsk",
    city_zh: "新库兹涅茨克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Novokuznetsk",
    utc_offset: "UTC+7:00",
  },
  {
    id: 344,
    city_en: "Novosibirsk",
    city_zh: "新西伯利亚",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Novosibirsk",
    utc_offset: "UTC+7:00",
  },
  {
    id: 345,
    city_en: "Phnom Penh",
    city_zh: "金边",
    region_en: "Cambodia",
    region_zh: "柬埔寨",
    timezone: "Asia/Phnom_Penh",
    utc_offset: "UTC+7:00",
  },
  {
    id: 346,
    city_en: "Pontianak",
    city_zh: "坤甸",
    region_en: "Indonesia",
    region_zh: "印度尼西亚",
    timezone: "Asia/Pontianak",
    utc_offset: "UTC+7:00",
  },
  {
    id: 347,
    city_en: "Tomsk",
    city_zh: "托木斯克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Tomsk",
    utc_offset: "UTC+7:00",
  },
  {
    id: 348,
    city_en: "Vientiane",
    city_zh: "万象",
    region_en: "Laos",
    region_zh: "老挝",
    timezone: "Asia/Vientiane",
    utc_offset: "UTC+7:00",
  },
  {
    id: 349,
    city_en: "Christmas",
    city_zh: "圣诞节",
    region_en: "Christmas Island",
    region_zh: "圣诞岛",
    timezone: "Indian/Christmas",
    utc_offset: "UTC+7:00",
  },
  {
    id: 350,
    city_en: "Brunei",
    city_zh: "文莱",
    region_en: "Brunei",
    region_zh: "文莱",
    timezone: "Asia/Brunei",
    utc_offset: "UTC+8:00",
  },
  {
    id: 351,
    city_en: "Choibalsan",
    city_zh: "乔巴山",
    region_en: "Mongolia",
    region_zh: "蒙古",
    timezone: "Asia/Choibalsan",
    utc_offset: "UTC+8:00",
  },
  {
    id: 352,
    city_en: "Hong Kong",
    city_zh: "香港",
    region_en: "Hong Kong",
    region_zh: "中国香港特别行政区",
    timezone: "Asia/Hong_Kong",
    utc_offset: "UTC+8:00",
  },
  {
    id: 353,
    city_en: "Irkutsk",
    city_zh: "伊尔库茨克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Irkutsk",
    utc_offset: "UTC+8:00",
  },
  {
    id: 354,
    city_en: "Kuala Lumpur",
    city_zh: "吉隆坡",
    region_en: "Malaysia",
    region_zh: "马来西亚",
    timezone: "Asia/Kuala_Lumpur",
    utc_offset: "UTC+8:00",
  },
  {
    id: 355,
    city_en: "Kuching",
    city_zh: "古晋",
    region_en: "Malaysia",
    region_zh: "马来西亚",
    timezone: "Asia/Kuching",
    utc_offset: "UTC+8:00",
  },
  {
    id: 356,
    city_en: "Macau",
    city_zh: "澳门",
    region_en: "Macao",
    region_zh: "中国澳门特别行政区",
    timezone: "Asia/Macau",
    utc_offset: "UTC+8:00",
  },
  {
    id: 357,
    city_en: "Makassar",
    city_zh: "望加锡",
    region_en: "Indonesia",
    region_zh: "印度尼西亚",
    timezone: "Asia/Makassar",
    utc_offset: "UTC+8:00",
  },
  {
    id: 358,
    city_en: "Manila",
    city_zh: "马尼拉",
    region_en: "Philippines",
    region_zh: "菲律宾",
    timezone: "Asia/Manila",
    utc_offset: "UTC+8:00",
  },
  {
    id: 359,
    city_en: "Shanghai",
    city_zh: "上海",
    region_en: "China",
    region_zh: "中国",
    timezone: "Asia/Shanghai",
    utc_offset: "UTC+8:00",
  },
  {
    id: 360,
    city_en: "Singapore",
    city_zh: "新加坡",
    region_en: "Singapore",
    region_zh: "新加坡",
    timezone: "Asia/Singapore",
    utc_offset: "UTC+8:00",
  },
  {
    id: 361,
    city_en: "Taipei",
    city_zh: "台北",
    region_en: "Taiwan",
    region_zh: "台湾",
    timezone: "Asia/Taipei",
    utc_offset: "UTC+8:00",
  },
  {
    id: 362,
    city_en: "Ulaanbaatar",
    city_zh: "乌兰巴托",
    region_en: "Mongolia",
    region_zh: "蒙古",
    timezone: "Asia/Ulaanbaatar",
    utc_offset: "UTC+8:00",
  },
  {
    id: 363,
    city_en: "Perth",
    city_zh: "珀斯",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Perth",
    utc_offset: "UTC+8:00",
  },
  {
    id: 364,
    city_en: "Eucla",
    city_zh: "尤克拉",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Eucla",
    utc_offset: "UTC+8:45",
  },
  {
    id: 365,
    city_en: "Chita",
    city_zh: "赤塔",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Chita",
    utc_offset: "UTC+9:00",
  },
  {
    id: 366,
    city_en: "Dili",
    city_zh: "帝力",
    region_en: "Timor Leste",
    region_zh: "东帝汶",
    timezone: "Asia/Dili",
    utc_offset: "UTC+9:00",
  },
  {
    id: 367,
    city_en: "Jayapura",
    city_zh: "查亚普拉",
    region_en: "Indonesia",
    region_zh: "印度尼西亚",
    timezone: "Asia/Jayapura",
    utc_offset: "UTC+9:00",
  },
  {
    id: 368,
    city_en: "Khandyga",
    city_zh: "坎迪加",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Khandyga",
    utc_offset: "UTC+9:00",
  },
  {
    id: 369,
    city_en: "Pyongyang",
    city_zh: "平壤",
    region_en: "North Korea",
    region_zh: "朝鲜",
    timezone: "Asia/Pyongyang",
    utc_offset: "UTC+9:00",
  },
  {
    id: 370,
    city_en: "Seoul",
    city_zh: "首尔",
    region_en: "South Korea",
    region_zh: "韩国",
    timezone: "Asia/Seoul",
    utc_offset: "UTC+9:00",
  },
  {
    id: 371,
    city_en: "Tokyo",
    city_zh: "东京",
    region_en: "Japan",
    region_zh: "日本",
    timezone: "Asia/Tokyo",
    utc_offset: "UTC+9:00",
  },
  {
    id: 372,
    city_en: "Yakutsk",
    city_zh: "雅库茨克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Yakutsk",
    utc_offset: "UTC+9:00",
  },
  {
    id: 373,
    city_en: "Palau",
    city_zh: "帕劳",
    region_en: "Palau",
    region_zh: "帕劳",
    timezone: "Pacific/Palau",
    utc_offset: "UTC+9:00",
  },
  {
    id: 374,
    city_en: "Adelaide",
    city_zh: "阿德莱德",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Adelaide",
    utc_offset: "UTC+9:30",
  },
  {
    id: 375,
    city_en: "Broken Hill",
    city_zh: "布罗肯希尔",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Broken_Hill",
    utc_offset: "UTC+9:30",
  },
  {
    id: 376,
    city_en: "Darwin",
    city_zh: "达尔文",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Darwin",
    utc_offset: "UTC+9:30",
  },
  {
    id: 377,
    city_en: "DumontDUrville",
    city_zh: "杜蒙杜维尔",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/DumontDUrville",
    utc_offset: "UTC+10:00",
  },
  {
    id: 378,
    city_en: "Macquarie",
    city_zh: "麦格理",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Antarctica/Macquarie",
    utc_offset: "UTC+10:00",
  },
  {
    id: 379,
    city_en: "Ust-Nera",
    city_zh: "乌斯季内拉",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Ust-Nera",
    utc_offset: "UTC+10:00",
  },
  {
    id: 380,
    city_en: "Vladivostok",
    city_zh: "符拉迪沃斯托克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Vladivostok",
    utc_offset: "UTC+10:00",
  },
  {
    id: 381,
    city_en: "Brisbane",
    city_zh: "布里斯班",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Brisbane",
    utc_offset: "UTC+10:00",
  },
  {
    id: 382,
    city_en: "Hobart",
    city_zh: "霍巴特",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Hobart",
    utc_offset: "UTC+10:00",
  },
  {
    id: 383,
    city_en: "Lindeman",
    city_zh: "林德曼",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Lindeman",
    utc_offset: "UTC+10:00",
  },
  {
    id: 384,
    city_en: "Melbourne",
    city_zh: "墨尔本",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Melbourne",
    utc_offset: "UTC+10:00",
  },
  {
    id: 385,
    city_en: "Sydney",
    city_zh: "悉尼",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Sydney",
    utc_offset: "UTC+10:00",
  },
  {
    id: 386,
    city_en: "Chuuk",
    city_zh: "楚克",
    region_en: "Micronesia",
    region_zh: "密克罗尼西亚",
    timezone: "Pacific/Chuuk",
    utc_offset: "UTC+10:00",
  },
  {
    id: 387,
    city_en: "Guam",
    city_zh: "关岛",
    region_en: "Guam",
    region_zh: "关岛",
    timezone: "Pacific/Guam",
    utc_offset: "UTC+10:00",
  },
  {
    id: 388,
    city_en: "Port Moresby",
    city_zh: "莫尔兹比港",
    region_en: "Papua New Guinea",
    region_zh: "巴布亚新几内亚",
    timezone: "Pacific/Port_Moresby",
    utc_offset: "UTC+10:00",
  },
  {
    id: 389,
    city_en: "Saipan",
    city_zh: "塞班岛",
    region_en: "Northern Mariana Islands",
    region_zh: "北马里亚纳群岛",
    timezone: "Pacific/Saipan",
    utc_offset: "UTC+10:00",
  },
  {
    id: 390,
    city_en: "Lord Howe",
    city_zh: "豪勋爵",
    region_en: "Australia",
    region_zh: "澳大利亚",
    timezone: "Australia/Lord_Howe",
    utc_offset: "UTC+10:30",
  },
  {
    id: 391,
    city_en: "Casey",
    city_zh: "凯西",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/Casey",
    utc_offset: "UTC+11:00",
  },
  {
    id: 392,
    city_en: "Magadan",
    city_zh: "马加丹",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Magadan",
    utc_offset: "UTC+11:00",
  },
  {
    id: 393,
    city_en: "Sakhalin",
    city_zh: "库页岛",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Sakhalin",
    utc_offset: "UTC+11:00",
  },
  {
    id: 394,
    city_en: "Srednekolymsk",
    city_zh: "斯雷德涅科林斯克",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Srednekolymsk",
    utc_offset: "UTC+11:00",
  },
  {
    id: 395,
    city_en: "Bougainville",
    city_zh: "布干维尔",
    region_en: "Papua New Guinea",
    region_zh: "巴布亚新几内亚",
    timezone: "Pacific/Bougainville",
    utc_offset: "UTC+11:00",
  },
  {
    id: 396,
    city_en: "Efate",
    city_zh: "埃法特",
    region_en: "Vanuatu",
    region_zh: "瓦努阿图",
    timezone: "Pacific/Efate",
    utc_offset: "UTC+11:00",
  },
  {
    id: 397,
    city_en: "Guadalcanal",
    city_zh: "瓜达尔卡纳尔岛",
    region_en: "Solomon Islands",
    region_zh: "所罗门群岛",
    timezone: "Pacific/Guadalcanal",
    utc_offset: "UTC+11:00",
  },
  {
    id: 398,
    city_en: "Kosrae",
    city_zh: "科斯雷",
    region_en: "Micronesia",
    region_zh: "密克罗尼西亚",
    timezone: "Pacific/Kosrae",
    utc_offset: "UTC+11:00",
  },
  {
    id: 399,
    city_en: "Norfolk",
    city_zh: "诺福克",
    region_en: "Norfolk Island",
    region_zh: "诺福克岛",
    timezone: "Pacific/Norfolk",
    utc_offset: "UTC+11:00",
  },
  {
    id: 400,
    city_en: "Noumea",
    city_zh: "努美阿",
    region_en: "New Caledonia",
    region_zh: "新喀里多尼亚",
    timezone: "Pacific/Noumea",
    utc_offset: "UTC+11:00",
  },
  {
    id: 401,
    city_en: "Pohnpei",
    city_zh: "波纳佩",
    region_en: "Micronesia",
    region_zh: "密克罗尼西亚",
    timezone: "Pacific/Pohnpei",
    utc_offset: "UTC+11:00",
  },
  {
    id: 402,
    city_en: "McMurdo",
    city_zh: "麦克默多",
    region_en: "Antarctica",
    region_zh: "南极洲",
    timezone: "Antarctica/McMurdo",
    utc_offset: "UTC+12:00",
  },
  {
    id: 403,
    city_en: "Anadyr",
    city_zh: "阿纳德尔",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Anadyr",
    utc_offset: "UTC+12:00",
  },
  {
    id: 404,
    city_en: "Kamchatka",
    city_zh: "堪察加半岛",
    region_en: "Russia",
    region_zh: "俄罗斯",
    timezone: "Asia/Kamchatka",
    utc_offset: "UTC+12:00",
  },
  {
    id: 405,
    city_en: "Auckland",
    city_zh: "奥克兰",
    region_en: "New Zealand",
    region_zh: "新西兰",
    timezone: "Pacific/Auckland",
    utc_offset: "UTC+12:00",
  },
  {
    id: 406,
    city_en: "Fiji",
    city_zh: "斐济",
    region_en: "Fiji",
    region_zh: "斐济",
    timezone: "Pacific/Fiji",
    utc_offset: "UTC+12:00",
  },
  {
    id: 407,
    city_en: "Funafuti",
    city_zh: "富纳富提",
    region_en: "Tuvalu",
    region_zh: "图瓦卢",
    timezone: "Pacific/Funafuti",
    utc_offset: "UTC+12:00",
  },
  {
    id: 408,
    city_en: "Kwajalein",
    city_zh: "夸贾林",
    region_en: "Marshall Islands",
    region_zh: "马绍尔群岛",
    timezone: "Pacific/Kwajalein",
    utc_offset: "UTC+12:00",
  },
  {
    id: 409,
    city_en: "Majuro",
    city_zh: "马朱罗",
    region_en: "Marshall Islands",
    region_zh: "马绍尔群岛",
    timezone: "Pacific/Majuro",
    utc_offset: "UTC+12:00",
  },
  {
    id: 410,
    city_en: "Nauru",
    city_zh: "瑙鲁",
    region_en: "Nauru",
    region_zh: "瑙鲁",
    timezone: "Pacific/Nauru",
    utc_offset: "UTC+12:00",
  },
  {
    id: 411,
    city_en: "Tarawa",
    city_zh: "塔拉瓦",
    region_en: "Kiribati",
    region_zh: "基里巴斯",
    timezone: "Pacific/Tarawa",
    utc_offset: "UTC+12:00",
  },
  {
    id: 412,
    city_en: "Wake",
    city_zh: "威克",
    region_en: "United States Minor Outlying Islands",
    region_zh: "美国本土外小岛屿",
    timezone: "Pacific/Wake",
    utc_offset: "UTC+12:00",
  },
  {
    id: 413,
    city_en: "Wallis",
    city_zh: "瓦利斯",
    region_en: "Wallis and Futuna",
    region_zh: "瓦利斯和富图纳群岛",
    timezone: "Pacific/Wallis",
    utc_offset: "UTC+12:00",
  },
  {
    id: 414,
    city_en: "Chatham",
    city_zh: "查塔姆",
    region_en: "New Zealand",
    region_zh: "新西兰",
    timezone: "Pacific/Chatham",
    utc_offset: "UTC+12:45",
  },
  {
    id: 415,
    city_en: "Apia",
    city_zh: "阿皮亚",
    region_en: "Samoa",
    region_zh: "萨摩亚",
    timezone: "Pacific/Apia",
    utc_offset: "UTC+13:00",
  },
  {
    id: 416,
    city_en: "Fakaofo",
    city_zh: "法考福",
    region_en: "Tokelau",
    region_zh: "托克劳",
    timezone: "Pacific/Fakaofo",
    utc_offset: "UTC+13:00",
  },
  {
    id: 417,
    city_en: "Kanton",
    city_zh: "坎顿",
    region_en: "Kiribati",
    region_zh: "基里巴斯",
    timezone: "Pacific/Kanton",
    utc_offset: "UTC+13:00",
  },
  {
    id: 418,
    city_en: "Tongatapu",
    city_zh: "汤加塔布",
    region_en: "Tonga",
    region_zh: "汤加",
    timezone: "Pacific/Tongatapu",
    utc_offset: "UTC+13:00",
  },
  {
    id: 419,
    city_en: "Kiritimati",
    city_zh: "基里蒂马蒂",
    region_en: "Kiribati",
    region_zh: "基里巴斯",
    timezone: "Pacific/Kiritimati",
    utc_offset: "UTC+14:00",
  },
];
const chromeStorage = (self.chrome || {}).storage
  ? [
      ["canvas", "audio", "webgl", "webgpu"],
      ["voice", "plugins", "fonts", "clientRect"],
    ]
  : [
      ["canvas", "audio", "webgpu", "webgl", "voice"],
      ["clientRect", "plugins", "fonts", "ja3", "h2"],
    ];
[
  {
    label: "Canvas(绘图)",
    key: "canvas",
  },
  {
    label: "Audio(声音)",
    key: "audio",
  },
  {
    label: "Webgl(3D绘图)",
    key: "webgl",
  },
  {
    label: "WebGPU(GPU)",
    key: "webgpu",
  },
  {
    label: "Plugins(插件)",
    key: "plugins",
  },
  {
    label: "Fonts(字体)",
    key: "fonts",
  },
  {
    label: "ClientRect(视口)",
    key: "clientRect",
  },
  {
    label: "Voice(语音)",
    key: "voice",
  },
  {
    label: "Ja3(Tls)",
    key: "ja3",
  },
  {
    label: "h2(Http2)",
    key: "h2",
  },
].filter((torageKey) => chromeStorage.flat().includes(torageKey.key));
const allowedBrower = [
  "audio",
  "canvas",
  "webgl",
  "fonts",
  "webgpu",
  "clientRect",
  "voice",
  "plugin",
  "native",
  "webrtc",
  "date",
  "screen",
  "location",
  "navigator",
  "feature",
  "media",
  "worker",
  "iframe",
  "trace",
  "driver",
].sort();
let capability;
try {
  capability = "2025-03-01 23:59:59";
  capability = new Date(capability);
} catch {
  capability = Infinity;
}
const parseDateFrom = capability;
const jsProperty = self.chrome || self.browser;
const parsedDate = new Set();
async function getWindowInfo(keySearchTerm) {
  let e = await jsProperty.windows.getCurrent();
  let windowInfo = {
    id: keySearchTerm,
    host: "",
    port: 0,
    scheme: "",
    tabId: keySearchTerm,
    windowId: e.id,
    frameId: 0,
    email: "",
    ua: navigator.userAgent,
    ip: "127.0.0.1",
  };
  if (keySearchTerm === 0) {
    return windowInfo;
  }
  let tabDetails = await jsProperty.tabs.get(keySearchTerm);
  if (!tabDetails) {
    return;
  }
  let { url: tabUrlObject, windowId: tabWindowId } = tabDetails;
  let {
    host: websiteHost,
    port: httpPort = 0,
    protocol: protocol,
  } = new URL(tabUrlObject);
  return {
    ...windowInfo,
    host: websiteHost,
    port: httpPort,
    scheme: protocol,
    tabId: keySearchTerm,
    windowId: tabWindowId,
  };
}
async function efreshPage(currentTime, currentWindow) {
  if (currentWindow) {
    await endOsInfoToS(currentWindow, currentTime);
  }
  let _windowInfo = await getWindowInfo(currentTime);
  if (
    !_windowInfo ||
    !_windowInfo.scheme.toString().startsWith("http") ||
    new Date().getTime() > parseDateFrom
  ) {
    return;
  }
  let isBrowserSuit = await validateWebRt.getSuitBrowser(
    undefined,
    _windowInfo,
  );
  await injector(currentTime, isBrowserSuit);
  await _updateTabInfo(currentTime, isBrowserSuit);
  if (parsedDate.has(_windowInfo.id)) {
    if (isBrowserSuit) {
      console.log("已存在跳过：" + currentTime);
    } else {
      parsedDate.delete(currentTime);
      console.log("删除：" + currentTime);
    }
    return;
  }
  await updateTabInfo(_windowInfo, isBrowserSuit);
  parsedDate.add(currentTime);
  console.log("注入：" + currentTime);
}
async function clearTabData(tabId) {
  parsedDate.delete(tabId);
  await updateTabHttp(tabId, []);
  validateWebRt.delScopeBrowser(null, {
    id: tabId,
  });
}
async function efreshOutDed() {
  let _tabsArray =
    (await jsProperty.tabs.query({
      url: ["*://*/*"],
    })) || [];
  let e = [];
  _tabsArray.forEach((propertyInfo) => {
    if (
      !propertyInfo.url.startsWith("http") ||
      parsedDate.has(propertyInfo.id)
    ) {
      return;
    }
    let newPageHtml = efreshPage(propertyInfo.id);
    e.push(newPageHtml);
  });
  await Promise.all(e);
}
async function updateTabHttp(iteData, e = []) {
  if (e.length === 0) {
    return await jsProperty.declarativeNetRequest.updateSessionRules(
      {
        removeRuleIds: [iteData],
        addRules: [],
      },
      () => {
        console.log(iteData + ": 请求头动态修改规则 清空成功", e);
      },
    );
  }
  if (!e.length) {
    return;
  }
  let newHttpHeader = [
    {
      id: iteData,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: e,
      },
      condition: {
        urlFilter: "|http",
        tabIds: [iteData],
        resourceTypes: [
          "main_frame",
          "sub_frame",
          "stylesheet",
          "script",
          "image",
          "font",
          "object",
          "xmlhttprequest",
          "ping",
          "csp_report",
          "media",
          "websocket",
          "other",
        ],
      },
    },
  ];
  return await jsProperty.declarativeNetRequest.updateSessionRules(
    {
      removeRuleIds: [iteData],
      addRules: newHttpHeader,
    },
    () => {
      console.log(iteData + ": 请求头动态修改规则 添加成功", e);
    },
  );
}
const extractTime = {
  Chrome: "Google",
  Edge: "Microsoft",
  IE: "Microsoft",
  Firefox: "Mozilla",
  Safari: "Apple",
  QQ: "Tencent",
};
async function updateTabInfo(tabsArray, tabHeaderModf) {
  var isConditionSs;
  var userResponse;
  var __currentPrice;
  var ehicleSpeed;
  if (!tabHeaderModf) {
    await updateTabHttp(tabsArray.id, []);
    return;
  }
  let __deviceInfo = tabHeaderModf.uaInfo;
  let userAgentStr = tabHeaderModf.userAgent || "";
  let preferredLang = tabHeaderModf.language;
  let UNUSEDemptyId = "";
  let unusedVar;
  let _unusedData = "";
  let getOperatingS;
  let ___________deviceType;
  let temporaryUser;
  if (__deviceInfo) {
    let getDeviceType = function (gamma) {
      var ___operatingSys;
      var operatingOs;
      let ______deviceInfo = tabHeaderModf.uaInfo;
      if (!______deviceInfo) {
        return gamma;
      }
      switch (
        (___operatingSys = ______deviceInfo.os) == null
          ? undefined
          : ___operatingSys.name.toString().toLowerCase()
      ) {
        case "ios":
          if (______deviceInfo.device.type === "mobile") {
            return "iPhone";
          } else {
            return "iPad";
          }
        case "windows":
          if (gamma.toLowerCase().includes("win")) {
            return gamma;
          }
      }
      return (
        ((operatingOs = ______deviceInfo.os) == null
          ? undefined
          : operatingOs.name) || gamma
      );
    };
    var deviceTypeDed = getDeviceType;
    UNUSEDemptyId = getDeviceType(
      navigator.platform ||
        ((isConditionSs = navigator.userAgentData) == null
          ? undefined
          : isConditionSs.platform),
    );
    unusedVar = __deviceInfo.device.type === "mobile";
    if (
      navigator &&
      navigator.userAgentData &&
      navigator.userAgentData.brands
    ) {
      let ___browserInfo = [...navigator.userAgentData.brands];
      let ____browserInfo = __deviceInfo.browser || __deviceInfo.product;
      let currentClient = ____browserInfo.name || "";
      for (let _key in extractTime) {
        if (currentClient.toUpperCase().includes(_key.toUpperCase())) {
          let clientInfo = [
            {
              brand: extractTime[_key] + " " + currentClient,
              version: ____browserInfo.major,
            },
            {
              brand: "Not=A?Brand",
              version: "8",
            },
          ];
          if (___browserInfo[2]) {
            clientInfo.push({
              brand: ___browserInfo[2].brand,
              version: ____browserInfo.major,
            });
          }
          ___browserInfo = clientInfo;
          break;
        }
      }
      _unusedData = ___browserInfo
        .map(
          (brandAndModel) =>
            `"${brandAndModel.brand}";v="${brandAndModel.version}"`,
        )
        .join(", ");
    }
    if (__deviceInfo.cpu || __deviceInfo.os) {
      if (
        (
          ((userResponse = __deviceInfo.os) == null
            ? undefined
            : userResponse.name.toLowerCase()) || ""
        ).includes("win")
      ) {
        getOperatingS = getRandomized(tabHeaderModf.seed || 0, ["x86", "x64"]);
      } else {
        if ((__currentPrice = __deviceInfo.cpu) == null) {
          getOperatingS = undefined;
        } else {
          getOperatingS = __currentPrice.architecture;
        }
      }
    }
    if (
      (ehicleSpeed = tabHeaderModf.arch) != null &&
      ehicleSpeed.toString().includes("32")
    ) {
      ___________deviceType = "32";
    } else {
      ___________deviceType = "64";
    }
    if (__deviceInfo.os) {
      let operatingOSV = __deviceInfo.os.version.split(".");
      if (operatingOSV.length > 3) {
        operatingOSV = operatingOSV.slice(0, 3);
      } else if (operatingOSV.length < 3) {
        if (operatingOSV.length === 1) {
          operatingOSV.push("0.0");
        } else if (operatingOSV.length === 2) {
          operatingOSV.push("0");
        }
      }
      temporaryUser = operatingOSV.join(".");
    }
  }
  let isIphone = [];
  let esult = [
    "Sec-Ch-Ua-Form-Factors",
    "Sec-Ch-Ua-Full-Version",
    "Sec-Ch-Ua-Full-Version-List",
  ];
  if (userAgentStr) {
    isIphone.push({
      header: "User-Agent",
      operation: "set",
      value: userAgentStr,
    });
  }
  if (preferredLang) {
    isIphone.push({
      header: "Accept-Language",
      operation: "set",
      value: preferredLang,
    });
  }
  try {
    if (userAgentStr && userAgentStr.startsWith(navigator.userAgent)) {
      return;
    }
    if (userAgentStr.toLowerCase().includes("firefox")) {
      esult.push(
        "Sec-Ch-Ua-Platform",
        "Sec-Ch-Ua-Mobile",
        "Sec-Ch-Ua-Arch",
        "Sec-Ch-Ua-Bitness",
        "Sec-Ch-Ua",
      );
      return;
    }
    if (UNUSEDemptyId) {
      isIphone.push({
        header: "Sec-Ch-Ua-Platform",
        operation: "set",
        value: '"' + UNUSEDemptyId + '"',
      });
    }
    if (temporaryUser) {
      isIphone.push({
        header: "Sec-Ch-Ua-Platform-Version",
        operation: "set",
        value: '"' + temporaryUser + '"',
      });
    }
    if (unusedVar !== undefined) {
      isIphone.push({
        header: "Sec-Ch-Ua-Mobile",
        operation: "set",
        value: unusedVar ? "?1" : "?0",
      });
    }
    if (_unusedData) {
      isIphone.push({
        header: "Sec-Ch-Ua",
        operation: "set",
        value: _unusedData,
      });
    }
    if (getOperatingS) {
      isIphone.push({
        header: "Sec-Ch-Ua-Arch",
        operation: "set",
        value: '"' + getOperatingS + '"',
      });
    }
    if (___________deviceType) {
      isIphone.push({
        header: "Sec-Ch-Ua-Bitness",
        operation: "set",
        value: '"' + ___________deviceType + '"',
      });
    }
  } finally {
    esult.forEach((emovalInProg) => {
      isIphone.push({
        header: emovalInProg,
        operation: "remove",
      });
    });
    await updateTabHttp(tabsArray.id, isIphone);
  }
}
async function injector(__target, element) {
  if (element) {
    console.log(`tab:${__target} injectedTabJs name=${element.name}`);
    await jsProperty.scripting.executeScript({
      target: {
        tabId: __target,
        allFrames: true,
      },
      args: [element],
      func: (_browserObject) => {
        self.SCOPE_BROWSER = _browserObject;
        let cheatEnable = self.SCOPE_CHEATER;
        if (cheatEnable) {
          cheatEnable.run();
        }
      },
      world: "MAIN",
      injectImmediately: true,
    });
  }
}
async function _updateTabInfo(platformInfo, eventObject) {
  if (eventObject) {
    await jsProperty.action.setTitle({
      title: eventObject.name,
      tabId: platformInfo,
    });
    await jsProperty.action.setBadgeBackgroundColor({
      color: "#84fc7a",
      tabId: platformInfo,
    });
    await jsProperty.action.setBadgeText({
      text: "ON",
      tabId: platformInfo,
    });
  } else {
    try {
      await jsProperty.action.setTitle({
        title: "",
        tabId: platformInfo,
      });
      await jsProperty.action.setBadgeBackgroundColor({
        color: "rgba(255,255,255,0)",
        tabId: platformInfo,
      });
      await jsProperty.action.setBadgeText({
        text: "",
        tabId: platformInfo,
      });
    } catch (errorLogger) {
      console.warn(errorLogger);
    }
  }
}
async function ___getVisitorIp(_tabId, cookieConfig) {
  return await getVisitorIp.get(_tabId);
}
async function aveIpAddress({ key: uniqueKey, value: e }, criptResult) {
  return await getVisitorIp.set(uniqueKey, e);
}
async function getAndRemoveV(__tabId, eventData) {
  return await getVisitorIp.remove(__tabId);
}
async function getVisitorDet() {
  let visitorOption = (await getVisitorIp.get("option")) || "无";
  let e = (await getVisitorIp.get("hostTable")) || {};
  let _isHostEnabled = (await getVisitorIp.get("hostEnable")) || "";
  let visitorDevice = await getVisitorIp.get("device");
  let ipMatchData = await getVisitorIp.get("matches");
  let _isSafeMode = await isCountryElig("safeMode");
  let enforceCec = await isCountryElig("functionTrace");
  let isWorkerMode = await isCountryElig("disableWorker");
  let isAntiDebug = await isCountryElig("antiDebugger");
  let __data = await visitorIpList();
  let userSettings = await browserTypes();
  let visitorId = await getVisitorIp.get("fixedBrowserId");
  let visitorAgent = await getVisitorIp.get("fixedUA");
  let visitorFixedL = await getVisitorIp.get("fixedLanguage");
  let visitorTimezg = await getVisitorIp.get("fixedTimezone");
  return {
    fixedBrowserId: visitorId,
    fixedUA: visitorAgent,
    fixedLanguage: visitorFixedL,
    fixedTimezone: visitorTimezg,
    enables: userSettings,
    option: visitorOption,
    hostTable: e,
    hostEnable: _isHostEnabled,
    device: visitorDevice,
    matches: ipMatchData,
    safeMode: _isSafeMode,
    disableWorker: isWorkerMode,
    functionTrace: enforceCec,
    iceServers: __data,
    antiDebugger: isAntiDebug,
  };
}
async function updateVisitor(primaryKey, dataValue) {
  await efreshOutDed();
  return await getVisitorIp.set("device", primaryKey);
}
async function __getVisitorIp() {
  return (await getVisitorIp.get("device")) || "";
}
async function isCountryElig(textContent = "") {
  return JSON.parse((await getVisitorIp.get(textContent)) || "false");
}
async function browserTypes() {
  let _browserTypes = (await getVisitorIp.get("enables")) || {};
  for (let e of allowedBrower) {
    if (!(e in _browserTypes)) {
      _browserTypes[e] = 1;
    }
  }
  return _browserTypes;
}
async function visitorIpList() {
  let __visitorIpInfo = (await getVisitorIp.get("iceServers")) || [];
  if (!__visitorIpInfo.length) {
    __visitorIpInfo.push({
      urls: "stun:stun.l.google.com:19302",
    });
  }
  return __visitorIpInfo;
}
async function etVisitorIPC(___tabId, cacheValue) {
  return await getVisitorIp.set("option", ___tabId);
}
async function _____visitorIp() {
  return (await getVisitorIp.get("option")) || "无";
}
async function anitizeUrl({ host: hostAddress, isWhite: e }, errorInfo) {
  if (e == null) {
    e = true;
  }
  let _hostTable = await _getVisitorIp();
  let blacklistFlag = _hostTable[hostAddress];
  if (blacklistFlag === 0 || blacklistFlag === 1) {
    throw new Error(
      `域名 ${hostAddress} 在${blacklistFlag === 1 ? "白" : "黑"}名单中已存在`,
    );
  }
  _hostTable[hostAddress] = e ? 1 : 0;
  return await getVisitorIp.set("hostTable", _hostTable);
}
async function deleteOption(optionContent, hostData) {
  let ___hostTableData = await _getVisitorIp();
  delete ___hostTableData[optionContent];
  return await getVisitorIp.set("hostTable", ___hostTableData);
}
async function getUserIp() {
  return (await getVisitorIp.get("hostEnable")) || "black";
}
async function hostEnableDis(key, hostTable) {
  key = key || "";
  if (!(key in ["white", "black", ""])) {
    throw new Error("值错误");
  }
  return await getVisitorIp.set("hostEnable", key);
}
async function _getVisitorIp() {
  return (await getVisitorIp.get("hostTable")) || {};
}
async function addIpToProxie(equestData, _allowedBrower) {
  let visitorIpMap = (await getVisitorIp.get("proxies")) || {};
  visitorIpMap[equestData] = 1;
  return await getVisitorIp.set("proxies", visitorIpMap);
}
async function emoveCurrent(dataTable, hostConfig) {
  let _proxyInfo = (await getVisitorIp.get("proxies")) || {};
  delete _proxyInfo[dataTable];
  return getVisitorIp.set("proxies", _proxyInfo);
}
async function getProxies({ page: currentPage, size: e }, isHostEnabled) {
  let proxyInfo = (await getVisitorIp.get("proxies")) || {};
  let proxyNames = Object.keys(proxyInfo);
  let proxyList = [];
  chunkIterator(
    proxyNames,
    currentPage,
    e,
    (proxyValue, unusedUser, proxyIndex) => {
      proxyList.push({
        proxy: proxyValue,
        index: proxyIndex + 1,
      });
    },
  );
  return {
    data: proxyList,
    total: proxyNames.length,
  };
}
async function ______browserInfo(
  { regex: _patternRegex, browserId: e },
  iteration,
) {
  let _______browserInfo = (await getVisitorIp.get("matches")) || {};
  if (_______browserInfo[_patternRegex]) {
    throw new Error(_patternRegex + " 已定义");
  }
  _______browserInfo[_patternRegex] = e;
  return getVisitorIp.set("matches", _______browserInfo);
}
async function emoveVisited(_entity, isWhitelisted) {
  let visitorMatchT = (await getVisitorIp.get("matches")) || {};
  delete visitorMatchT[_entity];
  return getVisitorIp.set("matches", visitorMatchT);
}
async function browserData({ page: _currentPage, size: e }, _hostData) {
  let visitorIpInfo = (await getVisitorIp.get("matches")) || {};
  let atchResults = [];
  let _visitorIpInfo = Object.keys(visitorIpInfo);
  chunkIterator(
    _visitorIpInfo,
    _currentPage,
    e,
    (_earchPattern, currencyRate, atchedIndex) => {
      atchResults.push({
        regex: _earchPattern,
        browserId: visitorIpInfo[_earchPattern],
        index: atchedIndex + 1,
      });
    },
  );
  return {
    data: atchResults,
    total: _visitorIpInfo.length,
  };
}
function chunkIterator(transaction = [], e = 1, _iteration = 5, whitelist) {
  if (_iteration <= 0) {
    throw new Error("size必须大于0");
  }
  let _tartIndex = ((e || 1) - 1) * _iteration;
  for (
    let __tartIndex = _tartIndex;
    __tartIndex < _tartIndex + _iteration;
    __tartIndex++
  ) {
    if (__tartIndex >= transaction.length) {
      return;
    }
    let _currentValue = transaction[__tartIndex];
    whitelist(_currentValue, __tartIndex, __tartIndex - _tartIndex);
  }
}
async function visitorInfoGh() {
  let __visitorIp = (await getVisitorIp.get("option")) || "无";
  let e = (await getVisitorIp.get("hostTable")) || {};
  let _____deviceInfo = await getVisitorIp.get("device");
  let _____browserInfo = await getVisitorIp.get("matches");
  let permanentId = await getVisitorIp.get("fixedBrowserId");
  let _userAgent = await getVisitorIp.get("fixedUA");
  let _preferredLang = await getVisitorIp.get("fixedLanguage");
  let timezone = await getVisitorIp.get("fixedTimezone");
  let webrtcIceInfo = await visitorIpList();
  let _browsersList = [];
  await webrtcPattern.iterWith("", (browserToBeMn, newBrowser) => {
    _browsersList.push(newBrowser);
  });
  return {
    browsers: _browsersList,
    matches: _____browserInfo,
    hostTable: e,
    device: _____deviceInfo,
    option: __visitorIp,
    fixedBrowserId: permanentId,
    fixedUA: _userAgent,
    fixedLanguage: _preferredLang,
    fixedTimezone: timezone,
    iceServers: webrtcIceInfo,
  };
}
async function ealtimePrep(dataObject = {}, pageNumber) {
  let atchesData = dataObject.matches || {};
  let _hostTableData = dataObject.hostTable || {};
  let ____deviceInfo = dataObject.device || "";
  let optionValue = dataObject.option || "无";
  let browserId = dataObject.fixedBrowserId || "";
  let visitorUserAg = dataObject.fixedUA || "";
  let _visitorLocale = dataObject.fixedLanguage || "";
  let visitorTimezr = dataObject.fixedTimezone || "";
  let browsersList = dataObject.browsers || [];
  let iceServers = dataObject.iceServers || [];
  let visitorRealms = (await getVisitorIp.get("matches")) || {};
  let __hostTableData = (await getVisitorIp.get("hostTable")) || {};
  Object.keys(atchesData).forEach((comparisonKey) => {
    visitorRealms[comparisonKey] = atchesData[comparisonKey];
  });
  Object.keys(_hostTableData).forEach(
    (_______________________________currentIndex) => {
      __hostTableData[_______________________________currentIndex] =
        _hostTableData[_______________________________currentIndex];
    },
  );
  await Promise.all([
    updateVisitor(____deviceInfo),
    etVisitorIPC(optionValue),
    getVisitorIp.set("fixedBrowserId", browserId),
    getVisitorIp.set("fixedUA", visitorUserAg),
    getVisitorIp.set("fixedLanguage", _visitorLocale),
    getVisitorIp.set("fixedTimezone", visitorTimezr),
    getVisitorIp.set("matches", atchesData),
    getVisitorIp.set("hostTable", _hostTableData),
    getVisitorIp.set("iceServers", iceServers),
  ]);
  browsersList.forEach((webrtcDataBag) => {
    webrtcDataBag.id ||= generateUUID();
    return webrtcPattern.set(webrtcDataBag.id, webrtcDataBag);
  });
}
var weight =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
        ? global
        : typeof self !== "undefined"
          ? self
          : {};
function afeImport(iterationSize) {
  if (
    iterationSize &&
    iterationSize.__esModule &&
    Object.prototype.hasOwnProperty.call(iterationSize, "default")
  ) {
    return iterationSize.default;
  } else {
    return iterationSize;
  }
}
var translationS = plitArrayByY;
function plitArrayByY(inputData, index, arrayIndex) {
  if (inputData instanceof RegExp) {
    inputData = findMatchInDy(inputData, arrayIndex);
  }
  if (index instanceof RegExp) {
    index = findMatchInDy(index, arrayIndex);
  }
  var earchResult = findBrowserOr(inputData, index, arrayIndex);
  return (
    earchResult && {
      start: earchResult[0],
      end: earchResult[1],
      pre: arrayIndex.slice(0, earchResult[0]),
      body: arrayIndex.slice(earchResult[0] + inputData.length, earchResult[1]),
      post: arrayIndex.slice(earchResult[1] + index.length),
    }
  );
}
function findMatchInDy(configData, hostTableData) {
  var atchIndex = hostTableData.match(configData);
  if (atchIndex) {
    return atchIndex[0];
  } else {
    return null;
  }
}
plitArrayByY.range = findBrowserOr;
function findBrowserOr(browserConfig, hostInfo, deviceInfo) {
  var _browserConfig;
  var lastBrowserId;
  var _lastBrowserId;
  var configOrderCt;
  var lastConfigFnd;
  var configIndex = deviceInfo.indexOf(browserConfig);
  var hostInfoIndex = deviceInfo.indexOf(hostInfo, configIndex + 1);
  var ____________________currentIndex = configIndex;
  if (configIndex >= 0 && hostInfoIndex > 0) {
    if (browserConfig === hostInfo) {
      return [configIndex, hostInfoIndex];
    }
    _browserConfig = [];
    _lastBrowserId = deviceInfo.length;
    while (____________________currentIndex >= 0 && !lastConfigFnd) {
      if (____________________currentIndex == configIndex) {
        _browserConfig.push(____________________currentIndex);
        configIndex = deviceInfo.indexOf(
          browserConfig,
          ____________________currentIndex + 1,
        );
      } else if (_browserConfig.length == 1) {
        lastConfigFnd = [_browserConfig.pop(), hostInfoIndex];
      } else {
        lastBrowserId = _browserConfig.pop();
        if (lastBrowserId < _lastBrowserId) {
          _lastBrowserId = lastBrowserId;
          configOrderCt = hostInfoIndex;
        }
        hostInfoIndex = deviceInfo.indexOf(
          hostInfo,
          ____________________currentIndex + 1,
        );
      }
      if (configIndex < hostInfoIndex && configIndex >= 0) {
        ____________________currentIndex = configIndex;
      } else {
        ____________________currentIndex = hostInfoIndex;
      }
    }
    if (_browserConfig.length) {
      lastConfigFnd = [_lastBrowserId, configOrderCt];
    }
  }
  return lastConfigFnd;
}
var ealtimeData = translationS;
var forecastTime = generateTrans;
var updateAInReal = "\0SLASH" + Math.random() + "\0";
var environmental = "\0OPEN" + Math.random() + "\0";
var inputText = "\0CLOSE" + Math.random() + "\0";
var keyItinerary = "\0COMMA" + Math.random() + "\0";
var queryResult = "\0PERIOD" + Math.random() + "\0";
function isNumber(template) {
  if (parseInt(template, 10) == template) {
    return parseInt(template, 10);
  } else {
    return template.charCodeAt(0);
  }
}
function _escapeSpecial(translate) {
  return translate
    .split("\\\\")
    .join(updateAInReal)
    .split("\\{")
    .join(environmental)
    .split("\\}")
    .join(inputText)
    .split("\\,")
    .join(keyItinerary)
    .split("\\.")
    .join(queryResult);
}
function anitizeVtId(transactionId) {
  return transactionId
    .split(updateAInReal)
    .join("\\")
    .split(environmental)
    .join("{")
    .split(inputText)
    .join("}")
    .split(keyItinerary)
    .join(",")
    .split(queryResult)
    .join(".");
}
function plitDataByNt(unusedData) {
  if (!unusedData) {
    return [""];
  }
  var e = [];
  var jsonData = ealtimeData("{", "}", unusedData);
  if (!jsonData) {
    return unusedData.split(",");
  }
  var prefixPart = jsonData.pre;
  var dataFromJSON = jsonData.body;
  var uffix = jsonData.post;
  var prefixData = prefixPart.split(",");
  prefixData[prefixData.length - 1] += "{" + dataFromJSON + "}";
  var uffixData = plitDataByNt(uffix);
  if (uffix.length) {
    prefixData[prefixData.length - 1] += uffixData.shift();
    prefixData.push.apply(prefixData, uffixData);
  }
  e.push.apply(e, prefixData);
  return e;
}
function generateTrans(data) {
  if (data) {
    if (data.substr(0, 2) === "{}") {
      data = "\\{\\}" + data.substr(2);
    }
    return generateCombs(_escapeSpecial(data), true).map(anitizeVtId);
  } else {
    return [];
  }
}
function rtDataWrapper(ealTimeHostM) {
  return "{" + ealTimeHostM + "}";
}
function atchesDigit0(earchPattern) {
  return /^-?0\d/.test(earchPattern);
}
function isWithinPrice(length, unitPrice) {
  return length <= unitPrice;
}
function hasEventTimeB(_currentTime, _eventObject) {
  return _currentTime >= _eventObject;
}
function generateCombs(currentIndex, liveData) {
  var combinations = [];
  var partConfig = ealtimeData("{", "}", currentIndex);
  if (!partConfig) {
    return [currentIndex];
  }
  var prefix = partConfig.pre;
  var _combinations = partConfig.post.length
    ? generateCombs(partConfig.post, false)
    : [""];
  if (/\$$/.test(partConfig.pre)) {
    for (
      var ______________________________currentIndex = 0;
      ______________________________currentIndex < _combinations.length;
      ______________________________currentIndex++
    ) {
      var formattedKey =
        prefix +
        "{" +
        partConfig.body +
        "}" +
        _combinations[______________________________currentIndex];
      combinations.push(formattedKey);
    }
  } else {
    var tartsWithNum = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(partConfig.body);
    var hasValidId = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(
      partConfig.body,
    );
    var isValidLength = tartsWithNum || hasValidId;
    var containsComma = partConfig.body.indexOf(",") >= 0;
    if (!isValidLength && !containsComma) {
      if (partConfig.post.match(/,.*\}/)) {
        currentIndex =
          partConfig.pre + "{" + partConfig.body + inputText + partConfig.post;
        return generateCombs(currentIndex);
      } else {
        return [currentIndex];
      }
    }
    var parsedConfig;
    if (isValidLength) {
      parsedConfig = partConfig.body.split(/\.\./);
    } else {
      parsedConfig = plitDataByNt(partConfig.body);
      if (
        parsedConfig.length === 1 &&
        ((parsedConfig = generateCombs(parsedConfig[0], false).map(
          rtDataWrapper,
        )),
        parsedConfig.length === 1)
      ) {
        return _combinations.map(function (getNumberOrAs) {
          return partConfig.pre + parsedConfig[0] + getNumberOrAs;
        });
      }
    }
    var configuration;
    if (isValidLength) {
      var tartValue = isNumber(parsedConfig[0]);
      var configValue = isNumber(parsedConfig[1]);
      var axLength = Math.max(parsedConfig[0].length, parsedConfig[1].length);
      var tepSize =
        parsedConfig.length == 3 ? Math.abs(isNumber(parsedConfig[2])) : 1;
      var houldAddToX = isWithinPrice;
      var everseTrend = configValue < tartValue;
      if (everseTrend) {
        tepSize *= -1;
        houldAddToX = hasEventTimeB;
      }
      var allElementsIn = parsedConfig.some(atchesDigit0);
      configuration = [];
      for (
        var tartIndex = tartValue;
        houldAddToX(tartIndex, configValue);
        tartIndex += tepSize
      ) {
        var displayText;
        if (hasValidId) {
          displayText = String.fromCharCode(tartIndex);
          if (displayText === "\\") {
            displayText = "";
          }
        } else {
          displayText = String(tartIndex);
          if (allElementsIn) {
            var zeroPadding = axLength - displayText.length;
            if (zeroPadding > 0) {
              var zeroPaddingZs = new Array(zeroPadding + 1).join("0");
              if (tartIndex < 0) {
                displayText = "-" + zeroPaddingZs + displayText.slice(1);
              } else {
                displayText = zeroPaddingZs + displayText;
              }
            }
          }
        }
        configuration.push(displayText);
      }
    } else {
      configuration = [];
      for (
        var _configuration = 0;
        _configuration < parsedConfig.length;
        _configuration++
      ) {
        configuration.push.apply(
          configuration,
          generateCombs(parsedConfig[_configuration], false),
        );
      }
    }
    for (
      var _configuration = 0;
      _configuration < configuration.length;
      _configuration++
    ) {
      for (
        var ______________________________currentIndex = 0;
        ______________________________currentIndex < _combinations.length;
        ______________________________currentIndex++
      ) {
        var formattedKey =
          prefix +
          configuration[_configuration] +
          _combinations[______________________________currentIndex];
        if (!liveData || isValidLength || formattedKey) {
          combinations.push(formattedKey);
        }
      }
    }
  }
  return combinations;
}
const envelopes = afeImport(forecastTime);
const nextNode = 65536;
const healingEffort = (_patternString) => {
  if (typeof _patternString != "string") {
    throw new TypeError("invalid pattern");
  }
  if (_patternString.length > nextNode) {
    throw new TypeError("pattern is too long");
  }
};
const timestamp = {
  "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
  "[:alpha:]": ["\\p{L}\\p{Nl}", true],
  "[:ascii:]": ["\\x00-\\x7f", false],
  "[:blank:]": ["\\p{Zs}\\t", true],
  "[:cntrl:]": ["\\p{Cc}", true],
  "[:digit:]": ["\\p{Nd}", true],
  "[:graph:]": ["\\p{Z}\\p{C}", true, true],
  "[:lower:]": ["\\p{Ll}", true],
  "[:print:]": ["\\p{C}", true],
  "[:punct:]": ["\\p{P}", true],
  "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
  "[:upper:]": ["\\p{Lu}", true],
  "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
  "[:xdigit:]": ["A-Fa-f0-9", false],
};
const priceEstimate = (_egexPattern) =>
  _egexPattern.replace(/[[\]\\-]/g, "\\$&");
const ealTimeEvent = (escapeString) =>
  escapeString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
const parser = (concatenatedT) => concatenatedT.join("");
const intermediate = (_inputText, _eventData) => {
  const _braceIndex = _eventData;
  if (_inputText.charAt(_braceIndex) !== "[") {
    throw new Error("not in a brace expression");
  }
  const dataStorage = [];
  const extractedData = [];
  let bracketIndex = _braceIndex + 1;
  let hasEncounterd = false;
  let ignoreEscaped = false;
  let isEscapeChar = false;
  let isNegationOrE = false;
  let closingBraket = _braceIndex;
  let braceText = "";
  e: while (bracketIndex < _inputText.length) {
    const bracketChar = _inputText.charAt(bracketIndex);
    if (
      (bracketChar === "!" || bracketChar === "^") &&
      bracketIndex === _braceIndex + 1
    ) {
      isNegationOrE = true;
      bracketIndex++;
      continue;
    }
    if (bracketChar === "]" && hasEncounterd && !isEscapeChar) {
      closingBraket = bracketIndex + 1;
      break;
    }
    hasEncounterd = true;
    if (bracketChar === "\\" && !isEscapeChar) {
      isEscapeChar = true;
      bracketIndex++;
      continue;
    }
    if (bracketChar === "[" && !isEscapeChar) {
      for (const [
        currentKey,
        [inferredData, _ignoreEscaped, addInferredTo],
      ] of Object.entries(timestamp)) {
        if (_inputText.startsWith(currentKey, bracketIndex)) {
          if (braceText) {
            return ["$.", false, _inputText.length - _braceIndex, true];
          }
          bracketIndex += currentKey.length;
          if (addInferredTo) {
            extractedData.push(inferredData);
          } else {
            dataStorage.push(inferredData);
          }
          ignoreEscaped = ignoreEscaped || _ignoreEscaped;
          continue e;
        }
      }
    }
    isEscapeChar = false;
    if (braceText) {
      if (bracketChar > braceText) {
        dataStorage.push(
          priceEstimate(braceText) + "-" + priceEstimate(bracketChar),
        );
      } else if (bracketChar === braceText) {
        dataStorage.push(priceEstimate(bracketChar));
      }
      braceText = "";
      bracketIndex++;
      continue;
    }
    if (_inputText.startsWith("-]", bracketIndex + 1)) {
      dataStorage.push(priceEstimate(bracketChar + "-"));
      bracketIndex += 2;
      continue;
    }
    if (_inputText.startsWith("-", bracketIndex + 1)) {
      braceText = bracketChar;
      bracketIndex += 2;
      continue;
    }
    dataStorage.push(priceEstimate(bracketChar));
    bracketIndex++;
  }
  if (closingBraket < bracketIndex) {
    return ["", false, 0, false];
  }
  if (!dataStorage.length && !extractedData.length) {
    return ["$.", false, _inputText.length - _braceIndex, true];
  }
  if (
    extractedData.length === 0 &&
    dataStorage.length === 1 &&
    /^\\?.$/.test(dataStorage[0]) &&
    !isNegationOrE
  ) {
    const firstItemLast =
      dataStorage[0].length === 2 ? dataStorage[0].slice(-1) : dataStorage[0];
    return [
      ealTimeEvent(firstItemLast),
      false,
      closingBraket - _braceIndex,
      false,
    ];
  }
  const __inputText =
    "[" + (isNegationOrE ? "^" : "") + parser(dataStorage) + "]";
  const delta = "[" + (isNegationOrE ? "" : "^") + parser(extractedData) + "]";
  return [
    dataStorage.length && extractedData.length
      ? "(" + __inputText + "|" + delta + ")"
      : dataStorage.length
        ? __inputText
        : delta,
    ignoreEscaped,
    closingBraket - _braceIndex,
    true,
  ];
};
const timer = (inputPath, { windowsPathsNoEscape: e = false } = {}) =>
  e
    ? inputPath.replace(/\[([^\/\\])\]/g, "$1")
    : inputPath
        .replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2")
        .replace(/\\([^\/])/g, "$1");
const newLineRegex = new Set(["!", "?", "+", "*", "@"]);
const getIndex = (newLineInput) => newLineRegex.has(newLineInput);
const controlCode = "(?!(?:^|/)\\.\\.?(?:$|/))";
const geometry = "(?!\\.)";
const pattern = new Set(["[", "."]);
const _currentIndex = new Set(["..", "."]);
const _ealTimeEvent = new Set("().*{}+?[]^$\\!");
const alphanumeric = (escapedString) =>
  escapedString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
const characterIdx = "[^/]";
const ealTimeData = characterIdx + "*?";
const escapeRightBr = characterIdx + "+?";
var character;
var unicodeRegex;
var fetchLiveData;
var propertyValue;
var __currentIndex;
var wordBoundary;
var escapeSpecial;
var __entity;
var zVariant;
var ___currentIndex;
var ____currentIndex;
var _data;
var optionTermin;
var characterMap;
var WeatherObserv;
var braceIndex;
var charAt;
const gravity = class CharacterData {
  constructor(e, _____________________currentIndex, container = {}) {
    attach(this, _data);
    etPrivateVar(this, "type");
    attach(this, character);
    attach(this, unicodeRegex);
    attach(this, fetchLiveData, false);
    attach(this, propertyValue, []);
    attach(this, __currentIndex);
    attach(this, wordBoundary);
    attach(this, escapeSpecial);
    attach(this, __entity, false);
    attach(this, zVariant);
    attach(this, ___currentIndex);
    attach(this, ____currentIndex, false);
    this.type = e;
    if (e) {
      authorizeSet(this, unicodeRegex, true);
    }
    authorizeSet(this, __currentIndex, _____________________currentIndex);
    authorizeSet(
      this,
      character,
      getPrivateVal(this, __currentIndex)
        ? getPrivateVal(getPrivateVal(this, __currentIndex), character)
        : this,
    );
    authorizeSet(
      this,
      zVariant,
      getPrivateVal(this, character) === this
        ? container
        : getPrivateVal(getPrivateVal(this, character), zVariant),
    );
    authorizeSet(
      this,
      escapeSpecial,
      getPrivateVal(this, character) === this
        ? []
        : getPrivateVal(getPrivateVal(this, character), escapeSpecial),
    );
    if (e === "!" && !getPrivateVal(getPrivateVal(this, character), __entity)) {
      getPrivateVal(this, escapeSpecial).push(this);
    }
    authorizeSet(
      this,
      wordBoundary,
      getPrivateVal(this, __currentIndex)
        ? getPrivateVal(getPrivateVal(this, __currentIndex), propertyValue)
            .length
        : 0,
    );
  }
  get hasMagic() {
    if (getPrivateVal(this, unicodeRegex) !== undefined) {
      return getPrivateVal(this, unicodeRegex);
    }
    for (const e of getPrivateVal(this, propertyValue)) {
      if (typeof e != "string" && (e.type || e.hasMagic)) {
        return authorizeSet(this, unicodeRegex, true);
      }
    }
    return getPrivateVal(this, unicodeRegex);
  }
  toString() {
    if (getPrivateVal(this, ___currentIndex) !== undefined) {
      return getPrivateVal(this, ___currentIndex);
    } else if (this.type) {
      return authorizeSet(
        this,
        ___currentIndex,
        this.type +
          "(" +
          getPrivateVal(this, propertyValue)
            .map((e) => String(e))
            .join("|") +
          ")",
      );
    } else {
      return authorizeSet(
        this,
        ___currentIndex,
        getPrivateVal(this, propertyValue)
          .map((e) => String(e))
          .join(""),
      );
    }
  }
  push(...e) {
    for (const item of e) {
      if (item !== "") {
        if (
          typeof item != "string" &&
          (!(item instanceof CharacterData) ||
            getPrivateVal(item, __currentIndex) !== this)
        ) {
          throw new Error("invalid part: " + item);
        }
        getPrivateVal(this, propertyValue).push(item);
      }
    }
  }
  toJSON() {
    var _________________________currentIndex;
    const e =
      this.type === null
        ? getPrivateVal(this, propertyValue)
            .slice()
            .map((_inputData) =>
              typeof _inputData == "string" ? _inputData : _inputData.toJSON(),
            )
        : [
            this.type,
            ...getPrivateVal(this, propertyValue).map((dataConverter) =>
              dataConverter.toJSON(),
            ),
          ];
    if (this.isStart() && !this.type) {
      e.unshift([]);
    }
    if (
      this.isEnd() &&
      (this === getPrivateVal(this, character) ||
        (getPrivateVal(getPrivateVal(this, character), __entity) &&
          ((_________________________currentIndex = getPrivateVal(
            this,
            __currentIndex,
          )) == null
            ? undefined
            : _________________________currentIndex.type) === "!"))
    ) {
      e.push({});
    }
    return e;
  }
  isStart() {
    var ________________________currentIndex;
    if (getPrivateVal(this, character) === this) {
      return true;
    }
    if (
      (________________________currentIndex = getPrivateVal(
        this,
        __currentIndex,
      )) == null ||
      !________________________currentIndex.isStart()
    ) {
      return false;
    }
    if (getPrivateVal(this, wordBoundary) === 0) {
      return true;
    }
    const e = getPrivateVal(this, __currentIndex);
    for (
      let limitIndex = 0;
      limitIndex < getPrivateVal(this, wordBoundary);
      limitIndex++
    ) {
      const __currentNode = getPrivateVal(e, propertyValue)[limitIndex];
      if (
        !(__currentNode instanceof CharacterData) ||
        __currentNode.type !== "!"
      ) {
        return false;
      }
    }
    return true;
  }
  isEnd() {
    var _______________________currentIndex;
    var currentItem;
    var esultValue;
    if (
      getPrivateVal(this, character) === this ||
      ((_______________________currentIndex = getPrivateVal(
        this,
        __currentIndex,
      )) == null
        ? undefined
        : _______________________currentIndex.type) === "!"
    ) {
      return true;
    }
    if (
      (currentItem = getPrivateVal(this, __currentIndex)) == null ||
      !currentItem.isEnd()
    ) {
      return false;
    }
    if (!this.type) {
      if ((esultValue = getPrivateVal(this, __currentIndex)) == null) {
        return undefined;
      } else {
        return esultValue.isEnd();
      }
    }
    const e = getPrivateVal(this, __currentIndex)
      ? getPrivateVal(getPrivateVal(this, __currentIndex), propertyValue).length
      : 0;
    return getPrivateVal(this, wordBoundary) === e - 1;
  }
  copyIn(e) {
    if (typeof e == "string") {
      this.push(e);
    } else {
      this.push(e.clone(this));
    }
  }
  clone(e) {
    const newCharacter = new CharacterData(this.type, e);
    for (const ____characterData of getPrivateVal(this, propertyValue)) {
      newCharacter.copyIn(____characterData);
    }
    return newCharacter;
  }
  static fromGlob(e, dataHolder = {}) {
    var __characterData;
    const ___characterData = new CharacterData(null, undefined, dataHolder);
    allowPrivateA(
      (__characterData = CharacterData),
      characterMap,
      WeatherObserv,
    ).call(__characterData, e, ___characterData, 0, dataHolder);
    return ___characterData;
  }
  toMMPattern() {
    if (this !== getPrivateVal(this, character)) {
      return getPrivateVal(this, character).toMMPattern();
    }
    const e = this.toString();
    const [_characterSet, implifiedKey, unicodeFlag, _useUnicode] =
      this.toRegExpSource();
    if (
      !unicodeFlag &&
      !getPrivateVal(this, unicodeRegex) &&
      (!getPrivateVal(this, zVariant).nocase ||
        !!getPrivateVal(this, zVariant).nocaseMagicOnly ||
        e.toUpperCase() === e.toLowerCase())
    ) {
      return implifiedKey;
    }
    const isCasefolded =
      (getPrivateVal(this, zVariant).nocase ? "i" : "") +
      (_useUnicode ? "u" : "");
    return Object.assign(new RegExp(`^${_characterSet}$`, isCasefolded), {
      _src: _characterSet,
      _glob: e,
    });
  }
  get options() {
    return getPrivateVal(this, zVariant);
  }
  toRegExpSource(patternSource) {
    var ourceString;
    const isPatternFrom = patternSource ?? !!getPrivateVal(this, zVariant).dot;
    if (getPrivateVal(this, character) === this) {
      allowPrivateA(this, _data, optionTermin).call(this);
    }
    if (!this.type) {
      const areStartAndEd = this.isStart() && this.isEnd();
      const _characterMap = getPrivateVal(this, propertyValue)
        .map((executor) => {
          var _characterData;
          const [executorSrc, executorChar, firstPortion, tartOrEnd] =
            typeof executor == "string"
              ? allowPrivateA(
                  (_characterData = CharacterData),
                  characterMap,
                  charAt,
                ).call(
                  _characterData,
                  executor,
                  getPrivateVal(this, unicodeRegex),
                  areStartAndEd,
                )
              : executor.toRegExpSource(patternSource);
          authorizeSet(
            this,
            unicodeRegex,
            getPrivateVal(this, unicodeRegex) || firstPortion,
          );
          authorizeSet(
            this,
            fetchLiveData,
            getPrivateVal(this, fetchLiveData) || tartOrEnd,
          );
          return executorSrc;
        })
        .join("");
      let ___pattern = "";
      if (
        this.isStart() &&
        typeof getPrivateVal(this, propertyValue)[0] == "string" &&
        (getPrivateVal(this, propertyValue).length !== 1 ||
          !_currentIndex.has(getPrivateVal(this, propertyValue)[0]))
      ) {
        const tateSet = pattern;
        const tartsWith =
          (isPatternFrom && tateSet.has(_characterMap.charAt(0))) ||
          (_characterMap.startsWith("\\.") &&
            tateSet.has(_characterMap.charAt(2))) ||
          (_characterMap.startsWith("\\.\\.") &&
            tateSet.has(_characterMap.charAt(4)));
        const tartsWithExl =
          !isPatternFrom &&
          !patternSource &&
          tateSet.has(_characterMap.charAt(0));
        if (tartsWith) {
          ___pattern = controlCode;
        } else if (tartsWithExl) {
          ___pattern = geometry;
        } else {
          ___pattern = "";
        }
      }
      let ________________currentIndex = "";
      if (
        this.isEnd() &&
        getPrivateVal(getPrivateVal(this, character), __entity) &&
        ((ourceString = getPrivateVal(this, __currentIndex)) == null
          ? undefined
          : ourceString.type) === "!"
      ) {
        ________________currentIndex = "(?:$|\\/)";
      }
      return [
        ___pattern + _characterMap + ________________currentIndex,
        timer(_characterMap),
        authorizeSet(this, unicodeRegex, !!getPrivateVal(this, unicodeRegex)),
        getPrivateVal(this, fetchLiveData),
      ];
    }
    const _propertyValue = this.type === "*" || this.type === "+";
    const privateData = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let privateRegex = allowPrivateA(this, _data, braceIndex).call(
      this,
      isPatternFrom,
    );
    if (this.isStart() && this.isEnd() && !privateRegex && this.type !== "!") {
      const currentUserAs = this.toString();
      authorizeSet(this, propertyValue, [currentUserAs]);
      this.type = null;
      authorizeSet(this, unicodeRegex, undefined);
      return [currentUserAs, timer(this.toString()), false, false];
    }
    let characterData =
      !_propertyValue || patternSource || isPatternFrom || !geometry
        ? ""
        : allowPrivateA(this, _data, braceIndex).call(this, true);
    if (characterData === privateRegex) {
      characterData = "";
    }
    if (characterData) {
      privateRegex = `(?:${privateRegex})(?:${characterData})*?`;
    }
    let useUnicode = "";
    if (this.type === "!" && getPrivateVal(this, ____currentIndex)) {
      useUnicode =
        (this.isStart() && !isPatternFrom ? geometry : "") + escapeRightBr;
    } else {
      const closingBrace =
        this.type === "!"
          ? "))" +
            (this.isStart() && !isPatternFrom && !patternSource
              ? geometry
              : "") +
            ealTimeData +
            ")"
          : this.type === "@"
            ? ")"
            : this.type === "?"
              ? ")?"
              : this.type === "+" && characterData
                ? ")"
                : this.type === "*" && characterData
                  ? ")?"
                  : `)${this.type}`;
      useUnicode = privateData + privateRegex + closingBrace;
    }
    return [
      useUnicode,
      timer(privateRegex),
      authorizeSet(this, unicodeRegex, !!getPrivateVal(this, unicodeRegex)),
      getPrivateVal(this, fetchLiveData),
    ];
  }
};
character = new WeakMap();
unicodeRegex = new WeakMap();
fetchLiveData = new WeakMap();
propertyValue = new WeakMap();
__currentIndex = new WeakMap();
wordBoundary = new WeakMap();
escapeSpecial = new WeakMap();
__entity = new WeakMap();
zVariant = new WeakMap();
___currentIndex = new WeakMap();
____currentIndex = new WeakMap();
_data = new WeakSet();
optionTermin = function () {
  if (this !== getPrivateVal(this, character)) {
    throw new Error("should only call on root");
  }
  if (getPrivateVal(this, __entity)) {
    return this;
  }
  this.toString();
  authorizeSet(this, __entity, true);
  let e;
  while ((e = getPrivateVal(this, escapeSpecial).pop())) {
    if (e.type !== "!") {
      continue;
    }
    let traverseArray = e;
    let currentSubKey = getPrivateVal(traverseArray, __currentIndex);
    while (currentSubKey) {
      for (
        let propertyIndex = getPrivateVal(traverseArray, wordBoundary) + 1;
        !currentSubKey.type &&
        propertyIndex < getPrivateVal(currentSubKey, propertyValue).length;
        propertyIndex++
      ) {
        for (const _element of getPrivateVal(e, propertyValue)) {
          if (typeof _element == "string") {
            throw new Error("string part in extglob AST??");
          }
          _element.copyIn(
            getPrivateVal(currentSubKey, propertyValue)[propertyIndex],
          );
        }
      }
      traverseArray = currentSubKey;
      currentSubKey = getPrivateVal(traverseArray, __currentIndex);
    }
  }
  return this;
};
characterMap = new WeakSet();
WeatherObserv = function (
  eference,
  _____currentIndex,
  ______currentIndex,
  nthProperty,
) {
  var escapeHtml;
  var iterator;
  let isEscaped = false;
  let isArrayEncaps = false;
  let _____________currentIndex = -1;
  let isArrayFlag = false;
  if (_____currentIndex.type === null) {
    let pointerIndex = ______currentIndex;
    let ___currentChar = "";
    while (pointerIndex < eference.length) {
      const ____currentChar = eference.charAt(pointerIndex++);
      if (isEscaped || ____currentChar === "\\") {
        isEscaped = !isEscaped;
        ___currentChar += ____currentChar;
        continue;
      }
      if (isArrayEncaps) {
        if (pointerIndex === _____________currentIndex + 1) {
          if (____currentChar === "^" || ____currentChar === "!") {
            isArrayFlag = true;
          }
        } else if (
          ____currentChar === "]" &&
          (pointerIndex !== _____________currentIndex + 2 || !isArrayFlag)
        ) {
          isArrayEncaps = false;
        }
        ___currentChar += ____currentChar;
        continue;
      } else if (____currentChar === "[") {
        isArrayEncaps = true;
        _____________currentIndex = pointerIndex;
        isArrayFlag = false;
        ___currentChar += ____currentChar;
        continue;
      }
      if (
        !nthProperty.noext &&
        getIndex(____currentChar) &&
        eference.charAt(pointerIndex) === "("
      ) {
        _____currentIndex.push(___currentChar);
        ___currentChar = "";
        const gravityState = new gravity(____currentChar, _____currentIndex);
        pointerIndex = allowPrivateA(
          (escapeHtml = gravity),
          characterMap,
          WeatherObserv,
        ).call(escapeHtml, eference, gravityState, pointerIndex, nthProperty);
        _____currentIndex.push(gravityState);
        continue;
      }
      ___currentChar += ____currentChar;
    }
    _____currentIndex.push(___currentChar);
    return pointerIndex;
  }
  let ______________currentIndex = ______currentIndex + 1;
  let arrayStartsAt = new gravity(null, _____currentIndex);
  const propertyPath = [];
  let eader = "";
  while (______________currentIndex < eference.length) {
    const __currentChar = eference.charAt(______________currentIndex++);
    if (isEscaped || __currentChar === "\\") {
      isEscaped = !isEscaped;
      eader += __currentChar;
      continue;
    }
    if (isArrayEncaps) {
      if (______________currentIndex === _____________currentIndex + 1) {
        if (__currentChar === "^" || __currentChar === "!") {
          isArrayFlag = true;
        }
      } else if (
        __currentChar === "]" &&
        (______________currentIndex !== _____________currentIndex + 2 ||
          !isArrayFlag)
      ) {
        isArrayEncaps = false;
      }
      eader += __currentChar;
      continue;
    } else if (__currentChar === "[") {
      isArrayEncaps = true;
      _____________currentIndex = ______________currentIndex;
      isArrayFlag = false;
      eader += __currentChar;
      continue;
    }
    if (
      getIndex(__currentChar) &&
      eference.charAt(______________currentIndex) === "("
    ) {
      arrayStartsAt.push(eader);
      eader = "";
      const gravityObject = new gravity(__currentChar, arrayStartsAt);
      arrayStartsAt.push(gravityObject);
      ______________currentIndex = allowPrivateA(
        (iterator = gravity),
        characterMap,
        WeatherObserv,
      ).call(
        iterator,
        eference,
        gravityObject,
        ______________currentIndex,
        nthProperty,
      );
      continue;
    }
    if (__currentChar === "|") {
      arrayStartsAt.push(eader);
      eader = "";
      propertyPath.push(arrayStartsAt);
      arrayStartsAt = new gravity(null, _____currentIndex);
      continue;
    }
    if (__currentChar === ")") {
      if (
        eader === "" &&
        getPrivateVal(_____currentIndex, propertyValue).length === 0
      ) {
        authorizeSet(_____currentIndex, ____currentIndex, true);
      }
      arrayStartsAt.push(eader);
      eader = "";
      _____currentIndex.push(...propertyPath, arrayStartsAt);
      return ______________currentIndex;
    }
    eader += __currentChar;
  }
  _____currentIndex.type = null;
  authorizeSet(_____currentIndex, unicodeRegex, undefined);
  authorizeSet(_____currentIndex, propertyValue, [
    eference.substring(______currentIndex - 1),
  ]);
  return ______________currentIndex;
};
braceIndex = function (event) {
  return getPrivateVal(this, propertyValue)
    .map((authInput) => {
      if (typeof authInput == "string") {
        throw new Error("string type in extglob ast??");
      }
      const [authRegex, authOption, groupPattern, fallbackValue] =
        authInput.toRegExpSource(event);
      authorizeSet(
        this,
        fetchLiveData,
        getPrivateVal(this, fetchLiveData) || fallbackValue,
      );
      return authRegex;
    })
    .filter((isInRange) => !this.isStart() || !this.isEnd() || !!isInRange)
    .join("|");
};
charAt = function (allowNonAscii, inPattern, isError = false) {
  let wasLastCharAn = false;
  let patternString = "";
  let isNonLiteral = false;
  for (
    let characterOrDi = 0;
    characterOrDi < allowNonAscii.length;
    characterOrDi++
  ) {
    const nonAsciiChar = allowNonAscii.charAt(characterOrDi);
    if (wasLastCharAn) {
      wasLastCharAn = false;
      patternString +=
        (_ealTimeEvent.has(nonAsciiChar) ? "\\" : "") + nonAsciiChar;
      continue;
    }
    if (nonAsciiChar === "\\") {
      if (characterOrDi === allowNonAscii.length - 1) {
        patternString += "\\\\";
      } else {
        wasLastCharAn = true;
      }
      continue;
    }
    if (nonAsciiChar === "[") {
      const [__currentMatch, _isNonLiteral, currentMatchL, atchEnd] =
        intermediate(allowNonAscii, characterOrDi);
      if (currentMatchL) {
        patternString += __currentMatch;
        isNonLiteral = isNonLiteral || _isNonLiteral;
        characterOrDi += currentMatchL - 1;
        inPattern = inPattern || atchEnd;
        continue;
      }
    }
    if (nonAsciiChar === "*") {
      if (isError && allowNonAscii === "*") {
        patternString += escapeRightBr;
      } else {
        patternString += ealTimeData;
      }
      inPattern = true;
      continue;
    }
    if (nonAsciiChar === "?") {
      patternString += characterIdx;
      inPattern = true;
      continue;
    }
    patternString += alphanumeric(nonAsciiChar);
  }
  return [patternString, timer(allowNonAscii), !!inPattern, isNonLiteral];
};
attach(gravity, characterMap);
let existingRegex = gravity;
const isAccessPermi = (
  filePathInput,
  { windowsPathsNoEscape: e = false } = {},
) =>
  e
    ? filePathInput.replace(/[?*()[\]]/g, "[$&]")
    : filePathInput.replace(/[?*()[\]\\]/g, "\\$&");
var oauthSession = {};
const isWildcard = (context, e, _dataObject = {}) => {
  healingEffort(e);
  if (!_dataObject.nocomment && e.charAt(0) === "#") {
    return false;
  } else {
    return new FileSystemGlo(e, _dataObject).match(context);
  }
};
const tringLength = /^\*+([^+@!?\*\[\(]*)$/;
const getNotified = (uffixMarker) => (e) =>
  !e.startsWith(".") && e.endsWith(uffixMarker);
const dropdownNavig = (_uffixToCheck) => (e) => e.endsWith(_uffixToCheck);
const isDataVisible = (_propertyName) => {
  _propertyName = _propertyName.toLowerCase();
  return (e) => !e.startsWith(".") && e.toLowerCase().endsWith(_propertyName);
};
const customer = (earchSuffix) => {
  earchSuffix = earchSuffix.toLowerCase();
  return (e) => e.toLowerCase().endsWith(earchSuffix);
};
const inclusiveYn = /^\*+\.\*+$/;
const propertyName = (validPathStr) =>
  !validPathStr.startsWith(".") && validPathStr.includes(".");
const weatherData = (hasDot) =>
  hasDot !== "." && hasDot !== ".." && hasDot.includes(".");
const characterSet = /^\.\*+$/;
const typeMap = (nonSpecialDir) =>
  nonSpecialDir !== "." &&
  nonSpecialDir !== ".." &&
  nonSpecialDir.startsWith(".");
const companyCode = /^\*+$/;
const buildRegex = (isValidString) =>
  isValidString.length !== 0 && !isValidString.startsWith(".");
const patternSuffix = (validFileName) =>
  validFileName.length !== 0 && validFileName !== "." && validFileName !== "..";
const zeroOrMore = /^\?+([^+@!?\*\[\(]*)?$/;
const createRegexSn = ([_transactionId, e = ""]) => {
  const getIndexFor = _______currentIndex([_transactionId]);
  if (e) {
    e = e.toLowerCase();
    return (atchesEnding) =>
      getIndexFor(atchesEnding) && atchesEnding.toLowerCase().endsWith(e);
  } else {
    return getIndexFor;
  }
};
const knNotPresent = ([_timezone, e = ""]) => {
  const eetingDate = calculateTime([_timezone]);
  if (e) {
    e = e.toLowerCase();
    return (eetingDateTo) =>
      eetingDate(eetingDateTo) && eetingDateTo.toLowerCase().endsWith(e);
  } else {
    return eetingDate;
  }
};
const arkNonSpacer = ([inputValue, e = ""]) => {
  const getTime = calculateTime([inputValue]);
  if (e) {
    return (getLastTimeIf) =>
      getTime(getLastTimeIf) && getLastTimeIf.endsWith(e);
  } else {
    return getTime;
  }
};
const escapeElement = ([defaultName, e = ""]) => {
  const getSuffixOrSb = _______currentIndex([defaultName]);
  if (e) {
    return (uffixToCheck) =>
      getSuffixOrSb(uffixToCheck) && uffixToCheck.endsWith(e);
  } else {
    return getSuffixOrSb;
  }
};
const _______currentIndex = ([templatedText]) => {
  const e = templatedText.length;
  return (prefixFreeOne) =>
    prefixFreeOne.length === e && !prefixFreeOne.startsWith(".");
};
const calculateTime = ([___currentTime]) => {
  const e = ___currentTime.length;
  return (isValidPath) =>
    isValidPath.length === e && isValidPath !== "." && isValidPath !== "..";
};
const formattedTime =
  typeof process == "object" && process
    ? (typeof oauthSession == "object" &&
        oauthSession &&
        oauthSession.__MINIMATCH_TESTING_PLATFORM__) ||
      process.platform
    : "posix";
const dashboardData = {
  win32: {
    sep: "\\",
  },
  posix: {
    sep: "/",
  },
};
const ________currentIndex =
  formattedTime === "win32" ? dashboardData.win32.sep : dashboardData.posix.sep;
isWildcard.sep = ________currentIndex;
const bookmark = Symbol("globstar **");
isWildcard.GLOBSTAR = bookmark;
const _________currentIndex = "[^/]";
const process = _________currentIndex + "*?";
const deepMerge = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
const currentNode = "(?:(?!(?:\\/|^)\\.).)*?";
const _currentNode =
  (wildcardRegex, e = {}) =>
  (_isWildcard) =>
    isWildcard(_isWildcard, wildcardRegex, e);
isWildcard.filter = _currentNode;
const WeatherData = (__targetObject, e = {}) =>
  Object.assign({}, __targetObject, e);
const __________currentIndex = (weatherConfig) => {
  if (
    !weatherConfig ||
    typeof weatherConfig != "object" ||
    !Object.keys(weatherConfig).length
  ) {
    return isWildcard;
  }
  const e = isWildcard;
  return Object.assign(
    (__element, weatherDataIn, _dataContainer = {}) =>
      e(__element, weatherDataIn, WeatherData(weatherConfig, _dataContainer)),
    {
      Minimatch: class extends e.Minimatch {
        constructor(creationOrUpd, __dataContainer = {}) {
          super(creationOrUpd, WeatherData(weatherConfig, __dataContainer));
        }
        static defaults(_config) {
          return e.defaults(WeatherData(weatherConfig, _config)).Minimatch;
        }
      },
      AST: class extends e.AST {
        constructor(initialData, _userData, __config = {}) {
          super(initialData, _userData, WeatherData(weatherConfig, __config));
        }
        static fromGlob(globPattern, torageObject = {}) {
          return e.AST.fromGlob(
            globPattern,
            WeatherData(weatherConfig, torageObject),
          );
        }
      },
      unescape: (__propertyName, dataStore = {}) =>
        e.unescape(__propertyName, WeatherData(weatherConfig, dataStore)),
      escape: (___propertyName, object = {}) =>
        e.escape(___propertyName, WeatherData(weatherConfig, object)),
      filter: (weatherCities, __dataObject = {}) =>
        e.filter(weatherCities, WeatherData(weatherConfig, __dataObject)),
      defaults: (weatherDataRe) =>
        e.defaults(WeatherData(weatherConfig, weatherDataRe)),
      makeRe: (numProperties, __userData = {}) =>
        e.makeRe(numProperties, WeatherData(weatherConfig, __userData)),
      braceExpand: (parseInput, ___userData = {}) =>
        e.braceExpand(parseInput, WeatherData(weatherConfig, ___userData)),
      match: (weatherRegex, weatherReport, _torage = {}) =>
        e.match(
          weatherRegex,
          weatherReport,
          WeatherData(weatherConfig, _torage),
        ),
      sep: e.sep,
      GLOBSTAR: bookmark,
    },
  );
};
isWildcard.defaults = __________currentIndex;
const tempIndex = (cssRule, e = {}) => {
  healingEffort(cssRule);
  if (e.nobrace || !/\{(?:(?!\{).)*\}/.test(cssRule)) {
    return [cssRule];
  } else {
    return envelopes(cssRule);
  }
};
isWildcard.braceExpand = tempIndex;
const isNotPresent = (fileSystem, e = {}) =>
  new FileSystemGlo(fileSystem, e).makeRe();
isWildcard.makeRe = isNotPresent;
const gravityResult = (filteredItems, e, information = {}) => {
  const fileSystemCom = new FileSystemGlo(e, information);
  filteredItems = filteredItems.filter((propertyToBeS) =>
    fileSystemCom.match(propertyToBeS),
  );
  if (fileSystemCom.options.nonull && !filteredItems.length) {
    filteredItems.push(e);
  }
  return filteredItems;
};
isWildcard.match = gravityResult;
const characterOrNi = /[?*]|[+@!]\(.*?\)|\[|\]/;
const ___________currentIndex = (escapedRegex) =>
  escapedRegex.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
class FileSystemGlo {
  constructor(e, _configOptions = {}) {
    etPrivateVar(this, "options");
    etPrivateVar(this, "set");
    etPrivateVar(this, "pattern");
    etPrivateVar(this, "windowsPathsNoEscape");
    etPrivateVar(this, "nonegate");
    etPrivateVar(this, "negate");
    etPrivateVar(this, "comment");
    etPrivateVar(this, "empty");
    etPrivateVar(this, "preserveMultipleSlashes");
    etPrivateVar(this, "partial");
    etPrivateVar(this, "globSet");
    etPrivateVar(this, "globParts");
    etPrivateVar(this, "nocase");
    etPrivateVar(this, "isWindows");
    etPrivateVar(this, "platform");
    etPrivateVar(this, "windowsNoMagicRoot");
    etPrivateVar(this, "regexp");
    healingEffort(e);
    _configOptions = _configOptions || {};
    this.options = _configOptions;
    this.pattern = e;
    this.platform = _configOptions.platform || formattedTime;
    this.isWindows = this.platform === "win32";
    this.windowsPathsNoEscape =
      !!_configOptions.windowsPathsNoEscape ||
      _configOptions.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.preserveMultipleSlashes = !!_configOptions.preserveMultipleSlashes;
    this.regexp = null;
    this.negate = false;
    this.nonegate = !!_configOptions.nonegate;
    this.comment = false;
    this.empty = false;
    this.partial = !!_configOptions.partial;
    this.nocase = !!this.options.nocase;
    this.windowsNoMagicRoot =
      _configOptions.windowsNoMagicRoot !== undefined
        ? _configOptions.windowsNoMagicRoot
        : !!this.isWindows && !!this.nocase;
    this.globSet = [];
    this.globParts = [];
    this.set = [];
    this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) {
      return true;
    }
    for (const e of this.set) {
      for (const ___currentItem of e) {
        if (typeof ___currentItem != "string") {
          return true;
        }
      }
    }
    return false;
  }
  debug(...e) {}
  make() {
    const e = this.pattern;
    const akeOptions = this.options;
    if (!akeOptions.nocomment && e.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!e) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    this.globSet = [...new Set(this.braceExpand())];
    if (akeOptions.debug) {
      this.debug = (...debugErrorLog) => console.error(...debugErrorLog);
    }
    this.debug(this.pattern, this.globSet);
    const globPatterns = this.globSet.map((inputString) =>
      this.slashSplit(inputString),
    );
    this.globParts = this.preprocess(globPatterns);
    this.debug(this.pattern, this.globParts);
    let globParts = this.globParts.map(
      (filePathParts, _characterOrNi, filePattern) => {
        if (this.isWindows && this.windowsNoMagicRoot) {
          const isValidFolder =
            filePathParts[0] === "" &&
            filePathParts[1] === "" &&
            (filePathParts[2] === "?" ||
              !characterOrNi.test(filePathParts[2])) &&
            !characterOrNi.test(filePathParts[3]);
          const isWindowsRoot = /^[a-z]:/i.test(filePathParts[0]);
          if (isValidFolder) {
            return [
              ...filePathParts.slice(0, 4),
              ...filePathParts
                .slice(4)
                .map((_parseInput) => this.parse(_parseInput)),
            ];
          }
          if (isWindowsRoot) {
            return [
              filePathParts[0],
              ...filePathParts.slice(1).map((text) => this.parse(text)),
            ];
          }
        }
        return filePathParts.map((parseProperty) => this.parse(parseProperty));
      },
    );
    this.debug(this.pattern, globParts);
    this.set = globParts.filter(
      (noFalseValues) => noFalseValues.indexOf(false) === -1,
    );
    if (this.isWindows) {
      for (let ______index = 0; ______index < this.set.length; ______index++) {
        const ____________________________currentIndex = this.set[______index];
        if (
          ____________________________currentIndex[0] === "" &&
          ____________________________currentIndex[1] === "" &&
          this.globParts[______index][2] === "?" &&
          typeof ____________________________currentIndex[3] == "string" &&
          /^[a-z]:$/i.test(____________________________currentIndex[3])
        ) {
          ____________________________currentIndex[2] = "?";
        }
      }
    }
    this.debug(this.pattern, this.set);
  }
  preprocess(e) {
    if (this.options.noglobstar) {
      for (
        let _____________________________currentIndex = 0;
        _____________________________currentIndex < e.length;
        _____________________________currentIndex++
      ) {
        for (
          let _______index = 0;
          _______index < e[_____________________________currentIndex].length;
          _______index++
        ) {
          if (
            e[_____________________________currentIndex][_______index] === "**"
          ) {
            e[_____________________________currentIndex][_______index] = "*";
          }
        }
      }
    }
    const { optimizationLevel: _optimizationT = 1 } = this.options;
    if (_optimizationT >= 2) {
      e = this.firstPhasePreProcess(e);
      e = this.secondPhasePreProcess(e);
    } else if (_optimizationT >= 1) {
      e = this.levelOneOptimize(e);
    } else {
      e = this.adjascentGlobstarOptimize(e);
    }
    return e;
  }
  adjascentGlobstarOptimize(e) {
    return e.map((textToProcess) => {
      let nextAsteriskH = -1;
      while (
        (nextAsteriskH = textToProcess.indexOf("**", nextAsteriskH + 1)) !== -1
      ) {
        let boldEndIndex = nextAsteriskH;
        while (textToProcess[boldEndIndex + 1] === "**") {
          boldEndIndex++;
        }
        if (boldEndIndex !== nextAsteriskH) {
          textToProcess.splice(nextAsteriskH, boldEndIndex - nextAsteriskH);
        }
      }
      return textToProcess;
    });
  }
  levelOneOptimize(e) {
    return e.map((implifiedDir) => {
      implifiedDir = implifiedDir.reduce((pathSegments, __currentPath) => {
        const lastPathPart = pathSegments[pathSegments.length - 1];
        if (__currentPath === "**" && lastPathPart === "**") {
          return pathSegments;
        } else if (
          __currentPath === ".." &&
          lastPathPart &&
          lastPathPart !== ".." &&
          lastPathPart !== "." &&
          lastPathPart !== "**"
        ) {
          pathSegments.pop();
          return pathSegments;
        } else {
          pathSegments.push(__currentPath);
          return pathSegments;
        }
      }, []);
      if (implifiedDir.length === 0) {
        return [""];
      } else {
        return implifiedDir;
      }
    });
  }
  levelTwoFileOptimize(e) {
    if (!Array.isArray(e)) {
      e = this.slashSplit(e);
    }
    let isUpdateMade = false;
    do {
      isUpdateMade = false;
      if (!this.preserveMultipleSlashes) {
        for (
          let __________________________currentIndex = 1;
          __________________________currentIndex < e.length - 1;
          __________________________currentIndex++
        ) {
          const currentValue = e[__________________________currentIndex];
          if (
            __________________________currentIndex !== 1 ||
            currentValue !== "" ||
            e[0] !== ""
          ) {
            if (currentValue === "." || currentValue === "") {
              isUpdateMade = true;
              e.splice(__________________________currentIndex, 1);
              __________________________currentIndex--;
            }
          }
        }
        if (e[0] === "." && e.length === 2 && (e[1] === "." || e[1] === "")) {
          isUpdateMade = true;
          e.pop();
        }
      }
      let consecutiveDp = 0;
      while ((consecutiveDp = e.indexOf("..", consecutiveDp + 1)) !== -1) {
        const isDeletionCwd = e[consecutiveDp - 1];
        if (
          isDeletionCwd &&
          isDeletionCwd !== "." &&
          isDeletionCwd !== ".." &&
          isDeletionCwd !== "**"
        ) {
          isUpdateMade = true;
          e.splice(consecutiveDp - 1, 2);
          consecutiveDp -= 2;
        }
      }
    } while (isUpdateMade);
    if (e.length === 0) {
      return [""];
    } else {
      return e;
    }
  }
  firstPhasePreProcess(e) {
    let isMultiStar = false;
    do {
      isMultiStar = false;
      for (let directory of e) {
        let directoryStar = -1;
        while (
          (directoryStar = directory.indexOf("**", directoryStar + 1)) !== -1
        ) {
          let doubleStarCon = directoryStar;
          while (directory[doubleStarCon + 1] === "**") {
            doubleStarCon++;
          }
          if (doubleStarCon > directoryStar) {
            directory.splice(directoryStar + 1, doubleStarCon - directoryStar);
          }
          let ubdirectory = directory[directoryStar + 1];
          const directoryPath = directory[directoryStar + 2];
          const doubleStarSub = directory[directoryStar + 3];
          if (
            ubdirectory !== ".." ||
            !directoryPath ||
            directoryPath === "." ||
            directoryPath === ".." ||
            !doubleStarSub ||
            doubleStarSub === "." ||
            doubleStarSub === ".."
          ) {
            continue;
          }
          isMultiStar = true;
          directory.splice(directoryStar, 1);
          const _directoryPath = directory.slice(0);
          _directoryPath[directoryStar] = "**";
          e.push(_directoryPath);
          directoryStar--;
        }
        if (!this.preserveMultipleSlashes) {
          for (
            let directoryIter = 1;
            directoryIter < directory.length - 1;
            directoryIter++
          ) {
            const _currentItem = directory[directoryIter];
            if (
              directoryIter !== 1 ||
              _currentItem !== "" ||
              directory[0] !== ""
            ) {
              if (_currentItem === "." || _currentItem === "") {
                isMultiStar = true;
                directory.splice(directoryIter, 1);
                directoryIter--;
              }
            }
          }
          if (
            directory[0] === "." &&
            directory.length === 2 &&
            (directory[1] === "." || directory[1] === "")
          ) {
            isMultiStar = true;
            directory.pop();
          }
        }
        let unusedValue = 0;
        while (
          (unusedValue = directory.indexOf("..", unusedValue + 1)) !== -1
        ) {
          const currentValidS = directory[unusedValue - 1];
          if (
            currentValidS &&
            currentValidS !== "." &&
            currentValidS !== ".." &&
            currentValidS !== "**"
          ) {
            isMultiStar = true;
            const directoryList =
              unusedValue === 1 && directory[unusedValue + 1] === "**"
                ? ["."]
                : [];
            directory.splice(unusedValue - 1, 2, ...directoryList);
            if (directory.length === 0) {
              directory.push("");
            }
            unusedValue -= 2;
          }
        }
      }
    } while (isMultiStar);
    return e;
  }
  secondPhasePreProcess(e) {
    for (let _____index = 0; _____index < e.length - 1; _____index++) {
      for (
        let ___________________________currentIndex = _____index + 1;
        ___________________________currentIndex < e.length;
        ___________________________currentIndex++
      ) {
        const atchedPath = this.partsMatch(
          e[_____index],
          e[___________________________currentIndex],
          !this.preserveMultipleSlashes,
        );
        if (atchedPath) {
          e[_____index] = [];
          e[___________________________currentIndex] = atchedPath;
          break;
        }
      }
    }
    return e.filter((__length) => __length.length);
  }
  partsMatch(e, econdString, isDisabled = false) {
    let _________________currentIndex = 0;
    let ____index = 0;
    let characterCorr = [];
    let cacheKey = "";
    while (
      _________________currentIndex < e.length &&
      ____index < econdString.length
    ) {
      if (e[_________________currentIndex] === econdString[____index]) {
        characterCorr.push(
          cacheKey === "b"
            ? econdString[____index]
            : e[_________________currentIndex],
        );
        _________________currentIndex++;
        ____index++;
      } else if (
        isDisabled &&
        e[_________________currentIndex] === "**" &&
        econdString[____index] === e[_________________currentIndex + 1]
      ) {
        characterCorr.push(e[_________________currentIndex]);
        _________________currentIndex++;
      } else if (
        isDisabled &&
        econdString[____index] === "**" &&
        e[_________________currentIndex] === econdString[____index + 1]
      ) {
        characterCorr.push(econdString[____index]);
        ____index++;
      } else if (
        e[_________________currentIndex] === "*" &&
        econdString[____index] &&
        (this.options.dot || !econdString[____index].startsWith(".")) &&
        econdString[____index] !== "**"
      ) {
        if (cacheKey === "b") {
          return false;
        }
        cacheKey = "a";
        characterCorr.push(e[_________________currentIndex]);
        _________________currentIndex++;
        ____index++;
      } else if (
        econdString[____index] === "*" &&
        e[_________________currentIndex] &&
        (this.options.dot ||
          !e[_________________currentIndex].startsWith(".")) &&
        e[_________________currentIndex] !== "**"
      ) {
        if (cacheKey === "a") {
          return false;
        }
        cacheKey = "b";
        characterCorr.push(econdString[____index]);
        _________________currentIndex++;
        ____index++;
      } else {
        return false;
      }
    }
    return e.length === econdString.length && characterCorr;
  }
  parseNegate() {
    if (this.nonegate) {
      return;
    }
    const e = this.pattern;
    let isNegation = false;
    let negationCount = 0;
    for (
      let ________index = 0;
      ________index < e.length && e.charAt(________index) === "!";
      ________index++
    ) {
      isNegation = !isNegation;
      negationCount++;
    }
    if (negationCount) {
      this.pattern = e.slice(negationCount);
    }
    this.negate = isNegation;
  }
  matchOne(filePath, fileInfo, currentMatch = false) {
    const configOptions = this.options;
    if (this.isWindows) {
      const isValidDrive =
        typeof filePath[0] == "string" && /^[a-z]:$/i.test(filePath[0]);
      const isPartialPath =
        !isValidDrive &&
        filePath[0] === "" &&
        filePath[1] === "" &&
        filePath[2] === "?" &&
        /^[a-z]:$/i.test(filePath[3]);
      const _isValidDrive =
        typeof fileInfo[0] == "string" && /^[a-z]:$/i.test(fileInfo[0]);
      const hasValidDrive =
        !_isValidDrive &&
        fileInfo[0] === "" &&
        fileInfo[1] === "" &&
        fileInfo[2] === "?" &&
        typeof fileInfo[3] == "string" &&
        /^[a-z]:$/i.test(fileInfo[3]);
      const driveLetterOr = isPartialPath ? 3 : isValidDrive ? 0 : undefined;
      const atchedDrive = hasValidDrive ? 3 : _isValidDrive ? 0 : undefined;
      if (typeof driveLetterOr == "number" && typeof atchedDrive == "number") {
        const [_filePath, originalPath] = [
          filePath[driveLetterOr],
          fileInfo[atchedDrive],
        ];
        if (_filePath.toLowerCase() === originalPath.toLowerCase()) {
          fileInfo[atchedDrive] = _filePath;
          if (atchedDrive > driveLetterOr) {
            fileInfo = fileInfo.slice(atchedDrive);
          } else if (driveLetterOr > atchedDrive) {
            filePath = filePath.slice(driveLetterOr);
          }
        }
      }
    }
    const { optimizationLevel: optimizationT = 1 } = this.options;
    if (optimizationT >= 2) {
      filePath = this.levelTwoFileOptimize(filePath);
    }
    this.debug("matchOne", this, {
      file: filePath,
      pattern: fileInfo,
    });
    this.debug("matchOne", filePath.length, fileInfo.length);
    var filterConfig = 0;
    var user = 0;
    var atchAndTrim = filePath.length;
    filterConfig++;
    for (
      var totalFiles = fileInfo.length;
      filterConfig < atchAndTrim && user < totalFiles;
      user++
    ) {
      this.debug("matchOne loop");
      var isFileMatched = fileInfo[user];
      var currentPath = filePath[filterConfig];
      this.debug(fileInfo, isFileMatched, currentPath);
      if (isFileMatched === false) {
        return false;
      }
      if (isFileMatched === bookmark) {
        this.debug("GLOBSTAR", [fileInfo, isFileMatched, currentPath]);
        var __________________currentIndex = filterConfig;
        var ___________________currentIndex = user + 1;
        if (___________________currentIndex === totalFiles) {
          for (
            this.debug("** at the end");
            filterConfig < atchAndTrim;
            filterConfig++
          ) {
            if (
              filePath[filterConfig] === "." ||
              filePath[filterConfig] === ".." ||
              (!configOptions.dot && filePath[filterConfig].charAt(0) === ".")
            ) {
              return false;
            }
          }
          return true;
        }
        while (__________________currentIndex < atchAndTrim) {
          var _____currentChar = filePath[__________________currentIndex];
          this.debug(
            `
globstar while`,
            filePath,
            __________________currentIndex,
            fileInfo,
            ___________________currentIndex,
            _____currentChar,
          );
          if (
            this.matchOne(
              filePath.slice(__________________currentIndex),
              fileInfo.slice(___________________currentIndex),
              currentMatch,
            )
          ) {
            this.debug(
              "globstar found match!",
              __________________currentIndex,
              atchAndTrim,
              _____currentChar,
            );
            return true;
          }
          if (
            _____currentChar === "." ||
            _____currentChar === ".." ||
            (!configOptions.dot && _____currentChar.charAt(0) === ".")
          ) {
            this.debug(
              "dot detected!",
              filePath,
              __________________currentIndex,
              fileInfo,
              ___________________currentIndex,
            );
            break;
          }
          this.debug("globstar swallow a segment, and continue");
          __________________currentIndex++;
        }
        return (
          !!currentMatch &&
          !!(this.debug(
            `
>>> no match, partial?`,
            filePath,
            __________________currentIndex,
            fileInfo,
            ___________________currentIndex,
          ),
          __________________currentIndex === atchAndTrim)
        );
      }
      let filePathIndex;
      if (typeof isFileMatched == "string") {
        filePathIndex = currentPath === isFileMatched;
        this.debug("string match", isFileMatched, currentPath, filePathIndex);
      } else {
        filePathIndex = isFileMatched.test(currentPath);
        this.debug("pattern match", isFileMatched, currentPath, filePathIndex);
      }
      if (!filePathIndex) {
        return false;
      }
    }
    if (filterConfig === atchAndTrim && user === totalFiles) {
      return true;
    }
    if (filterConfig === atchAndTrim) {
      return currentMatch;
    }
    if (user === totalFiles) {
      return filterConfig === atchAndTrim - 1 && filePath[filterConfig] === "";
    }
    throw new Error("wtf?");
  }
  braceExpand() {
    return tempIndex(this.pattern, this.options);
  }
  parse(e) {
    healingEffort(e);
    const config = this.options;
    if (e === "**") {
      return bookmark;
    }
    if (e === "") {
      return "";
    }
    let atchResult;
    let atchHandler = null;
    if ((atchResult = e.match(companyCode))) {
      if (config.dot) {
        atchHandler = patternSuffix;
      } else {
        atchHandler = buildRegex;
      }
    } else if ((atchResult = e.match(tringLength))) {
      atchHandler = (
        config.nocase
          ? config.dot
            ? customer
            : isDataVisible
          : config.dot
            ? dropdownNavig
            : getNotified
      )(atchResult[1]);
    } else if ((atchResult = e.match(zeroOrMore))) {
      atchHandler = (
        config.nocase
          ? config.dot
            ? knNotPresent
            : createRegexSn
          : config.dot
            ? arkNonSpacer
            : escapeElement
      )(atchResult);
    } else if ((atchResult = e.match(inclusiveYn))) {
      if (config.dot) {
        atchHandler = weatherData;
      } else {
        atchHandler = propertyName;
      }
    } else if ((atchResult = e.match(characterSet))) {
      atchHandler = typeMap;
    }
    const globRegex = existingRegex.fromGlob(e, this.options).toMMPattern();
    if (atchHandler && typeof globRegex == "object") {
      Reflect.defineProperty(globRegex, "test", {
        value: atchHandler,
      });
    }
    return globRegex;
  }
  makeRe() {
    if (this.regexp || this.regexp === false) {
      return this.regexp;
    }
    const e = this.set;
    if (!e.length) {
      this.regexp = false;
      return this.regexp;
    }
    const _options = this.options;
    const isDotallOrGob = _options.noglobstar
      ? process
      : _options.dot
        ? deepMerge
        : currentNode;
    const egexFlags = new Set(_options.nocase ? ["i"] : []);
    let patternMap = e
      .map((filteredAndFl) => {
        const odifiedPaths = filteredAndFl.map((atchPattern) => {
          if (atchPattern instanceof RegExp) {
            for (const patternFlags of atchPattern.flags.split("")) {
              egexFlags.add(patternFlags);
            }
          }
          if (typeof atchPattern == "string") {
            return ___________currentIndex(atchPattern);
          } else if (atchPattern === bookmark) {
            return bookmark;
          } else {
            return atchPattern._src;
          }
        });
        odifiedPaths.forEach(
          (_currentPath, ______________________currentIndex) => {
            const previousPath =
              odifiedPaths[______________________currentIndex + 1];
            const _previousPath =
              odifiedPaths[______________________currentIndex - 1];
            if (_currentPath === bookmark && _previousPath !== bookmark) {
              if (_previousPath === undefined) {
                if (previousPath !== undefined && previousPath !== bookmark) {
                  odifiedPaths[______________________currentIndex + 1] =
                    "(?:\\/|" + isDotallOrGob + "\\/)?" + previousPath;
                } else {
                  odifiedPaths[______________________currentIndex] =
                    isDotallOrGob;
                }
              } else if (previousPath === undefined) {
                odifiedPaths[______________________currentIndex - 1] =
                  _previousPath + "(?:\\/|" + isDotallOrGob + ")?";
              } else if (previousPath !== bookmark) {
                odifiedPaths[______________________currentIndex - 1] =
                  _previousPath +
                  "(?:\\/|\\/" +
                  isDotallOrGob +
                  "\\/)" +
                  previousPath;
                odifiedPaths[______________________currentIndex + 1] = bookmark;
              }
            }
          },
        );
        return odifiedPaths
          .filter((isDifferent) => isDifferent !== bookmark)
          .join("/");
      })
      .join("|");
    const [_currentChar, convertLastTo] =
      e.length > 1 ? ["(?:", ")"] : ["", ""];
    patternMap = "^" + _currentChar + patternMap + convertLastTo + "$";
    if (this.negate) {
      patternMap = "^(?!" + patternMap + ").+$";
    }
    try {
      this.regexp = new RegExp(patternMap, [...egexFlags].join(""));
    } catch {
      this.regexp = false;
    }
    return this.regexp;
  }
  slashSplit(e) {
    if (this.preserveMultipleSlashes) {
      return e.split("/");
    } else if (this.isWindows && /^\/\/[^\/]+/.test(e)) {
      return ["", ...e.split(/\/+/)];
    } else {
      return e.split(/\/+/);
    }
  }
  match(e, filteredData = this.partial) {
    this.debug("match", e, this.pattern);
    if (this.comment) {
      return false;
    }
    if (this.empty) {
      return e === "";
    }
    if (e === "/" && filteredData) {
      return true;
    }
    const atchSettings = this.options;
    if (this.isWindows) {
      e = e.split("\\").join("/");
    }
    const patternsArray = this.slashSplit(e);
    this.debug(this.pattern, "split", patternsArray);
    const patternsToMAt = this.set;
    this.debug(this.pattern, "set", patternsToMAt);
    let endPattern = patternsArray[patternsArray.length - 1];
    if (!endPattern) {
      for (
        let everseIndex = patternsArray.length - 2;
        !endPattern && everseIndex >= 0;
        everseIndex--
      ) {
        endPattern = patternsArray[everseIndex];
      }
    }
    for (
      let patternIndex = 0;
      patternIndex < patternsToMAt.length;
      patternIndex++
    ) {
      const _currentMatch = patternsToMAt[patternIndex];
      let currentMatchP = patternsArray;
      if (atchSettings.matchBase && _currentMatch.length === 1) {
        currentMatchP = [endPattern];
      }
      if (this.matchOne(currentMatchP, _currentMatch, filteredData)) {
        if (atchSettings.flipNegate) {
          return true;
        } else {
          return !this.negate;
        }
      }
    }
    if (atchSettings.flipNegate) {
      return false;
    } else {
      return this.negate;
    }
  }
  static defaults(e) {
    return isWildcard.defaults(e).Minimatch;
  }
}
isWildcard.AST = existingRegex;
isWildcard.Minimatch = FileSystemGlo;
isWildcard.escape = isAccessPermi;
isWildcard.unescape = timer;
var unifiedString = {
  exports: {},
};
(function (preserveTrail, filePathArray) {
  (function (_index, prefixMatch) {
    var applicationOr = "1.0.39";
    var defaultValue = "";
    var defaultVendor = "?";
    var _deviceType = "function";
    var unknownValue = "undefined";
    var __deviceType = "object";
    var ___deviceType = "string";
    var ____deviceType = "major";
    var deviceModelId = "model";
    var deviceName = "name";
    var placeholder = "type";
    var _____deviceType = "vendor";
    var deviceVersion = "version";
    var architecture = "architecture";
    var ______deviceType = "console";
    var _______deviceType = "mobile";
    var tabletType = "tablet";
    var ________deviceType = "smarttv";
    var _________deviceType = "wearable";
    var defaultDevice = "embedded";
    var agicNumber = 500;
    var endorName = "Amazon";
    var appleDevice = "Apple";
    var asusVendor = "ASUS";
    var blackBerryId = "BlackBerry";
    var __________deviceType = "Browser";
    var browserType = "Chrome";
    var _browserType = "Edge";
    var ieBrowserType = "Firefox";
    var deviceSource = "Google";
    var deviceId = "Huawei";
    var _currentPrice = "LG";
    var internalFlags = "Microsoft";
    var weatherInfo = "Motorola";
    var processDevice = "Opera";
    var getRealtimeZe = "Samsung";
    var aiInstance = "Sharp";
    var getRealTime = "Sony";
    var exchangeRate = "Xiaomi";
    var queryResults = "Zebra";
    var getTimeInfo = "Facebook";
    var currentInfo = "Chromium OS";
    var __currentTime = "Mac OS";
    var userInterface = " Browser";
    function appendPair(patternType, currentPrice) {
      var pricePatterns = {};
      for (var patternKey in patternType) {
        if (
          currentPrice[patternKey] &&
          currentPrice[patternKey].length % 2 === 0
        ) {
          pricePatterns[patternKey] = currentPrice[patternKey].concat(
            patternType[patternKey],
          );
        } else {
          pricePatterns[patternKey] = patternType[patternKey];
        }
      }
      return pricePatterns;
    }
    function __characterMap(userInput) {
      var characterCase = {};
      for (
        var _________index = 0;
        _________index < userInput.length;
        _________index++
      ) {
        characterCase[userInput[_________index].toUpperCase()] =
          userInput[_________index];
      }
      return characterCase;
    }
    function useNegationIn(useNegation, __index) {
      if (typeof useNegation === ___deviceType) {
        return toLowercase(__index).indexOf(toLowercase(useNegation)) !== -1;
      } else {
        return false;
      }
    }
    function toLowercase(atchDrivePeg) {
      return atchDrivePeg.toLowerCase();
    }
    function extractWhole(emoveCommon) {
      if (typeof emoveCommon === ___deviceType) {
        return emoveCommon.replace(/[^\d\.]/g, defaultValue).split(".")[0];
      } else {
        return prefixMatch;
      }
    }
    function processString(____________currentIndex, _patternType) {
      if (typeof ____________currentIndex === ___deviceType) {
        ____________currentIndex = ____________currentIndex.replace(
          /^\s\s*/,
          defaultValue,
        );
        if (typeof _patternType === unknownValue) {
          return ____________currentIndex;
        } else {
          return ____________currentIndex.substring(0, agicNumber);
        }
      }
    }
    function populateFrom(axIndex, apiData) {
      var _______________currentIndex,
        ___index,
        iIterator,
        actionHandler,
        isMatch;
      var apiIndex = 0;
      for (var atchedValue; apiIndex < apiData.length && !isMatch; ) {
        var egexPatterns = apiData[apiIndex];
        var _actionHandler = apiData[apiIndex + 1];
        for (
          _______________currentIndex = ___index = 0;
          _______________currentIndex < egexPatterns.length &&
          !isMatch &&
          egexPatterns[_______________currentIndex];

        ) {
          isMatch = egexPatterns[_______________currentIndex++].exec(axIndex);
          if (isMatch) {
            for (
              iIterator = 0;
              iIterator < _actionHandler.length;
              iIterator++
            ) {
              atchedValue = isMatch[++___index];
              actionHandler = _actionHandler[iIterator];
              if (
                typeof actionHandler === __deviceType &&
                actionHandler.length > 0
              ) {
                if (actionHandler.length === 2) {
                  if (typeof actionHandler[1] == _deviceType) {
                    this[actionHandler[0]] = actionHandler[1].call(
                      this,
                      atchedValue,
                    );
                  } else {
                    this[actionHandler[0]] = actionHandler[1];
                  }
                } else if (actionHandler.length === 3) {
                  if (
                    typeof actionHandler[1] === _deviceType &&
                    (!actionHandler[1].exec || !actionHandler[1].test)
                  ) {
                    this[actionHandler[0]] = atchedValue
                      ? actionHandler[1].call(
                          this,
                          atchedValue,
                          actionHandler[2],
                        )
                      : prefixMatch;
                  } else {
                    this[actionHandler[0]] = atchedValue
                      ? atchedValue.replace(actionHandler[1], actionHandler[2])
                      : prefixMatch;
                  }
                } else if (actionHandler.length === 4) {
                  this[actionHandler[0]] = atchedValue
                    ? actionHandler[3].call(
                        this,
                        atchedValue.replace(actionHandler[1], actionHandler[2]),
                      )
                    : prefixMatch;
                }
              } else {
                this[actionHandler] = atchedValue || prefixMatch;
              }
            }
          }
        }
        apiIndex += 2;
      }
    }
    function atchDePrefix(currentChar, keyword) {
      for (var keywordIndex in keyword) {
        if (
          typeof keyword[keywordIndex] === __deviceType &&
          keyword[keywordIndex].length > 0
        ) {
          for (
            var _keywordIndex = 0;
            _keywordIndex < keyword[keywordIndex].length;
            _keywordIndex++
          ) {
            if (
              useNegationIn(keyword[keywordIndex][_keywordIndex], currentChar)
            ) {
              if (keywordIndex === defaultVendor) {
                return prefixMatch;
              } else {
                return keywordIndex;
              }
            }
          }
        } else if (useNegationIn(keyword[keywordIndex], currentChar)) {
          if (keywordIndex === defaultVendor) {
            return prefixMatch;
          } else {
            return keywordIndex;
          }
        }
      }
      if (keyword.hasOwnProperty("*")) {
        return keyword["*"];
      } else {
        return currentChar;
      }
    }
    var updateTimeout = {
      "1.0": "/8",
      1.2: "/1",
      1.3: "/3",
      "2.0": "/412",
      "2.0.2": "/416",
      "2.0.3": "/417",
      "2.0.4": "/419",
      "?": "/",
    };
    var findIndexBy = {
      ME: "4.90",
      "NT 3.11": "NT3.51",
      "NT 4.0": "NT4.0",
      2000: "NT 5.0",
      XP: ["NT 5.1", "NT 5.2"],
      Vista: "NT 6.0",
      7: "NT 6.1",
      8: "NT 6.2",
      8.1: "NT 6.3",
      10: ["NT 6.4", "NT 10.0"],
      RT: "ARM",
    };
    var queryObject = {
      browser: [
        [/\b(?:crmo|crios)\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "Chrome"]],
        [/edg(?:e|ios|a)?\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "Edge"]],
        [
          /(opera mini)\/([-\w\.]+)/i,
          /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
          /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
        ],
        [deviceName, deviceVersion],
        [/opios[\/ ]+([\w\.]+)/i],
        [deviceVersion, [deviceName, processDevice + " Mini"]],
        [/\bop(?:rg)?x\/([\w\.]+)/i],
        [deviceVersion, [deviceName, processDevice + " GX"]],
        [/\bopr\/([\w\.]+)/i],
        [deviceVersion, [deviceName, processDevice]],
        [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],
        [deviceVersion, [deviceName, "Baidu"]],
        [
          /(kindle)\/([\w\.]+)/i,
          /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
          /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,
          /(?:ms|\()(ie) ([\w\.]+)/i,
          /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio)\/([-\w\.]+)/i,
          /(heytap|ovi)browser\/([\d\.]+)/i,
          /(weibo)__([\d\.]+)/i,
        ],
        [deviceName, deviceVersion],
        [/quark(?:pc)?\/([-\w\.]+)/i],
        [deviceVersion, [deviceName, "Quark"]],
        [/\bddg\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "DuckDuckGo"]],
        [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
        [deviceVersion, [deviceName, "UC" + __________deviceType]],
        [
          /microm.+\bqbcore\/([\w\.]+)/i,
          /\bqbcore\/([\w\.]+).+microm/i,
          /micromessenger\/([\w\.]+)/i,
        ],
        [deviceVersion, [deviceName, "WeChat"]],
        [/konqueror\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "Konqueror"]],
        [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
        [deviceVersion, [deviceName, "IE"]],
        [/ya(?:search)?browser\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "Yandex"]],
        [/slbrowser\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "Smart Lenovo " + __________deviceType]],
        [/(avast|avg)\/([\w\.]+)/i],
        [
          [deviceName, /(.+)/, "$1 Secure " + __________deviceType],
          deviceVersion,
        ],
        [/\bfocus\/([\w\.]+)/i],
        [deviceVersion, [deviceName, ieBrowserType + " Focus"]],
        [/\bopt\/([\w\.]+)/i],
        [deviceVersion, [deviceName, processDevice + " Touch"]],
        [/coc_coc\w+\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "Coc Coc"]],
        [/dolfin\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "Dolphin"]],
        [/coast\/([\w\.]+)/i],
        [deviceVersion, [deviceName, processDevice + " Coast"]],
        [/miuibrowser\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "MIUI " + __________deviceType]],
        [/fxios\/([-\w\.]+)/i],
        [deviceVersion, [deviceName, ieBrowserType]],
        [/\bqihu|(qi?ho?o?|360)browser/i],
        [[deviceName, "360" + userInterface]],
        [/\b(qq)\/([\w\.]+)/i],
        [[deviceName, /(.+)/, "$1Browser"], deviceVersion],
        [/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i],
        [[deviceName, /(.+)/, "$1" + userInterface], deviceVersion],
        [/samsungbrowser\/([\w\.]+)/i],
        [deviceVersion, [deviceName, getRealtimeZe + " Internet"]],
        [/(comodo_dragon)\/([\w\.]+)/i],
        [[deviceName, /_/g, " "], deviceVersion],
        [/metasr[\/ ]?([\d\.]+)/i],
        [deviceVersion, [deviceName, "Sogou Explorer"]],
        [/(sogou)mo\w+\/([\d\.]+)/i],
        [[deviceName, "Sogou Mobile"], deviceVersion],
        [
          /(electron)\/([\w\.]+) safari/i,
          /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
          /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i,
        ],
        [deviceName, deviceVersion],
        [/(lbbrowser|rekonq)/i, /\[(linkedin)app\]/i],
        [deviceName],
        [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
        [[deviceName, getTimeInfo], deviceVersion],
        [
          /(Klarna)\/([\w\.]+)/i,
          /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
          /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
          /safari (line)\/([\w\.]+)/i,
          /\b(line)\/([\w\.]+)\/iab/i,
          /(alipay)client\/([\w\.]+)/i,
          /(twitter)(?:and| f.+e\/([\w\.]+))/i,
          /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i,
        ],
        [deviceName, deviceVersion],
        [/\bgsa\/([\w\.]+) .*safari\//i],
        [deviceVersion, [deviceName, "GSA"]],
        [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],
        [deviceVersion, [deviceName, "TikTok"]],
        [/headlesschrome(?:\/([\w\.]+)| )/i],
        [deviceVersion, [deviceName, browserType + " Headless"]],
        [/ wv\).+(chrome)\/([\w\.]+)/i],
        [[deviceName, browserType + " WebView"], deviceVersion],
        [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
        [deviceVersion, [deviceName, "Android " + __________deviceType]],
        [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
        [deviceName, deviceVersion],
        [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],
        [deviceVersion, [deviceName, "Mobile Safari"]],
        [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],
        [deviceVersion, deviceName],
        [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
        [deviceName, [deviceVersion, atchDePrefix, updateTimeout]],
        [/(webkit|khtml)\/([\w\.]+)/i],
        [deviceName, deviceVersion],
        [/(navigator|netscape\d?)\/([-\w\.]+)/i],
        [[deviceName, "Netscape"], deviceVersion],
        [/(wolvic)\/([\w\.]+)/i],
        [deviceName, deviceVersion],
        [/mobile vr; rv:([\w\.]+)\).+firefox/i],
        [deviceVersion, [deviceName, ieBrowserType + " Reality"]],
        [
          /ekiohf.+(flow)\/([\w\.]+)/i,
          /(swiftfox)/i,
          /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
          /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
          /(firefox)\/([\w\.]+)/i,
          /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
          /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
          /(links) \(([\w\.]+)/i,
        ],
        [deviceName, [deviceVersion, /_/g, "."]],
        [/(cobalt)\/([\w\.]+)/i],
        [deviceName, [deviceVersion, /master.|lts./, ""]],
      ],
      cpu: [
        [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
        [[architecture, "amd64"]],
        [/(ia32(?=;))/i],
        [[architecture, toLowercase]],
        [/((?:i[346]|x)86)[;\)]/i],
        [[architecture, "ia32"]],
        [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
        [[architecture, "arm64"]],
        [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
        [[architecture, "armhf"]],
        [/windows (ce|mobile); ppc;/i],
        [[architecture, "arm"]],
        [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
        [[architecture, /ower/, defaultValue, toLowercase]],
        [/(sun4\w)[;\)]/i],
        [[architecture, "sparc"]],
        [
          /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i,
        ],
        [[architecture, toLowercase]],
      ],
      device: [
        [
          /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i,
        ],
        [
          deviceModelId,
          [_____deviceType, getRealtimeZe],
          [placeholder, tabletType],
        ],
        [
          /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
          /samsung[- ]((?!sm-[lr])[-\w]+)/i,
          /sec-(sgh\w+)/i,
        ],
        [
          deviceModelId,
          [_____deviceType, getRealtimeZe],
          [placeholder, _______deviceType],
        ],
        [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],
        [
          deviceModelId,
          [_____deviceType, appleDevice],
          [placeholder, _______deviceType],
        ],
        [
          /\((ipad);[-\w\),; ]+apple/i,
          /applecoremedia\/[\w\.]+ \((ipad)/i,
          /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
        ],
        [
          deviceModelId,
          [_____deviceType, appleDevice],
          [placeholder, tabletType],
        ],
        [/(macintosh);/i],
        [deviceModelId, [_____deviceType, appleDevice]],
        [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
        [
          deviceModelId,
          [_____deviceType, aiInstance],
          [placeholder, _______deviceType],
        ],
        [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
        [deviceModelId, [_____deviceType, deviceId], [placeholder, tabletType]],
        [
          /(?:huawei|honor)([-\w ]+)[;\)]/i,
          /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i,
        ],
        [
          deviceModelId,
          [_____deviceType, deviceId],
          [placeholder, _______deviceType],
        ],
        [
          /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
          /\b; (\w+) build\/hm\1/i,
          /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
          /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
          /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
          /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i,
        ],
        [
          [deviceModelId, /_/g, " "],
          [_____deviceType, exchangeRate],
          [placeholder, _______deviceType],
        ],
        [
          /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,
          /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i,
        ],
        [
          [deviceModelId, /_/g, " "],
          [_____deviceType, exchangeRate],
          [placeholder, tabletType],
        ],
        [
          /; (\w+) bui.+ oppo/i,
          /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i,
        ],
        [
          deviceModelId,
          [_____deviceType, "OPPO"],
          [placeholder, _______deviceType],
        ],
        [/\b(opd2\d{3}a?) bui/i],
        [deviceModelId, [_____deviceType, "OPPO"], [placeholder, tabletType]],
        [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
        [
          deviceModelId,
          [_____deviceType, "Vivo"],
          [placeholder, _______deviceType],
        ],
        [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],
        [
          deviceModelId,
          [_____deviceType, "Realme"],
          [placeholder, _______deviceType],
        ],
        [
          /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
          /\bmot(?:orola)?[- ](\w*)/i,
          /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i,
        ],
        [
          deviceModelId,
          [_____deviceType, weatherInfo],
          [placeholder, _______deviceType],
        ],
        [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
        [
          deviceModelId,
          [_____deviceType, weatherInfo],
          [placeholder, tabletType],
        ],
        [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
        [
          deviceModelId,
          [_____deviceType, _currentPrice],
          [placeholder, tabletType],
        ],
        [
          /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
          /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
          /\blg-?([\d\w]+) bui/i,
        ],
        [
          deviceModelId,
          [_____deviceType, _currentPrice],
          [placeholder, _______deviceType],
        ],
        [
          /(ideatab[-\w ]+)/i,
          /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i,
        ],
        [deviceModelId, [_____deviceType, "Lenovo"], [placeholder, tabletType]],
        [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i],
        [
          [deviceModelId, /_/g, " "],
          [_____deviceType, "Nokia"],
          [placeholder, _______deviceType],
        ],
        [/(pixel c)\b/i],
        [
          deviceModelId,
          [_____deviceType, deviceSource],
          [placeholder, tabletType],
        ],
        [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
        [
          deviceModelId,
          [_____deviceType, deviceSource],
          [placeholder, _______deviceType],
        ],
        [
          /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
        ],
        [
          deviceModelId,
          [_____deviceType, getRealTime],
          [placeholder, _______deviceType],
        ],
        [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
        [
          [deviceModelId, "Xperia Tablet"],
          [_____deviceType, getRealTime],
          [placeholder, tabletType],
        ],
        [
          / (kb2005|in20[12]5|be20[12][59])\b/i,
          /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i,
        ],
        [
          deviceModelId,
          [_____deviceType, "OnePlus"],
          [placeholder, _______deviceType],
        ],
        [
          /(alexa)webm/i,
          /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
          /(kf[a-z]+)( bui|\)).+silk\//i,
        ],
        [
          deviceModelId,
          [_____deviceType, endorName],
          [placeholder, tabletType],
        ],
        [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
        [
          [deviceModelId, /(.+)/g, "Fire Phone $1"],
          [_____deviceType, endorName],
          [placeholder, _______deviceType],
        ],
        [/(playbook);[-\w\),; ]+(rim)/i],
        [deviceModelId, _____deviceType, [placeholder, tabletType]],
        [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
        [
          deviceModelId,
          [_____deviceType, blackBerryId],
          [placeholder, _______deviceType],
        ],
        [
          /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i,
        ],
        [
          deviceModelId,
          [_____deviceType, asusVendor],
          [placeholder, tabletType],
        ],
        [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
        [
          deviceModelId,
          [_____deviceType, asusVendor],
          [placeholder, _______deviceType],
        ],
        [/(nexus 9)/i],
        [deviceModelId, [_____deviceType, "HTC"], [placeholder, tabletType]],
        [
          /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
          /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
          /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i,
        ],
        [
          _____deviceType,
          [deviceModelId, /_/g, " "],
          [placeholder, _______deviceType],
        ],
        [
          /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i,
        ],
        [deviceModelId, [_____deviceType, "TCL"], [placeholder, tabletType]],
        [/(itel) ((\w+))/i],
        [
          [_____deviceType, toLowercase],
          deviceModelId,
          [
            placeholder,
            atchDePrefix,
            {
              tablet: ["p10001l", "w7001"],
              "*": "mobile",
            },
          ],
        ],
        [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
        [deviceModelId, [_____deviceType, "Acer"], [placeholder, tabletType]],
        [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
        [
          deviceModelId,
          [_____deviceType, "Meizu"],
          [placeholder, _______deviceType],
        ],
        [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],
        [
          deviceModelId,
          [_____deviceType, "Ulefone"],
          [placeholder, _______deviceType],
        ],
        [/droid.+; (a(?:015|06[35]|142p?))/i],
        [
          deviceModelId,
          [_____deviceType, "Nothing"],
          [placeholder, _______deviceType],
        ],
        [
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
          /(hp) ([\w ]+\w)/i,
          /(asus)-?(\w+)/i,
          /(microsoft); (lumia[\w ]+)/i,
          /(lenovo)[-_ ]?([-\w]+)/i,
          /(jolla)/i,
          /(oppo) ?([\w ]+) bui/i,
        ],
        [_____deviceType, deviceModelId, [placeholder, _______deviceType]],
        [
          /(kobo)\s(ereader|touch)/i,
          /(archos) (gamepad2?)/i,
          /(hp).+(touchpad(?!.+tablet)|tablet)/i,
          /(kindle)\/([\w\.]+)/i,
          /(nook)[\w ]+build\/(\w+)/i,
          /(dell) (strea[kpr\d ]*[\dko])/i,
          /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
          /(trinity)[- ]*(t\d{3}) bui/i,
          /(gigaset)[- ]+(q\w{1,9}) bui/i,
          /(vodafone) ([\w ]+)(?:\)| bui)/i,
        ],
        [_____deviceType, deviceModelId, [placeholder, tabletType]],
        [/(surface duo)/i],
        [
          deviceModelId,
          [_____deviceType, internalFlags],
          [placeholder, tabletType],
        ],
        [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
        [
          deviceModelId,
          [_____deviceType, "Fairphone"],
          [placeholder, _______deviceType],
        ],
        [/(u304aa)/i],
        [
          deviceModelId,
          [_____deviceType, "AT&T"],
          [placeholder, _______deviceType],
        ],
        [/\bsie-(\w*)/i],
        [
          deviceModelId,
          [_____deviceType, "Siemens"],
          [placeholder, _______deviceType],
        ],
        [/\b(rct\w+) b/i],
        [deviceModelId, [_____deviceType, "RCA"], [placeholder, tabletType]],
        [/\b(venue[\d ]{2,7}) b/i],
        [deviceModelId, [_____deviceType, "Dell"], [placeholder, tabletType]],
        [/\b(q(?:mv|ta)\w+) b/i],
        [
          deviceModelId,
          [_____deviceType, "Verizon"],
          [placeholder, tabletType],
        ],
        [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
        [
          deviceModelId,
          [_____deviceType, "Barnes & Noble"],
          [placeholder, tabletType],
        ],
        [/\b(tm\d{3}\w+) b/i],
        [
          deviceModelId,
          [_____deviceType, "NuVision"],
          [placeholder, tabletType],
        ],
        [/\b(k88) b/i],
        [deviceModelId, [_____deviceType, "ZTE"], [placeholder, tabletType]],
        [/\b(nx\d{3}j) b/i],
        [
          deviceModelId,
          [_____deviceType, "ZTE"],
          [placeholder, _______deviceType],
        ],
        [/\b(gen\d{3}) b.+49h/i],
        [
          deviceModelId,
          [_____deviceType, "Swiss"],
          [placeholder, _______deviceType],
        ],
        [/\b(zur\d{3}) b/i],
        [deviceModelId, [_____deviceType, "Swiss"], [placeholder, tabletType]],
        [/\b((zeki)?tb.*\b) b/i],
        [deviceModelId, [_____deviceType, "Zeki"], [placeholder, tabletType]],
        [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
        [
          [_____deviceType, "Dragon Touch"],
          deviceModelId,
          [placeholder, tabletType],
        ],
        [/\b(ns-?\w{0,9}) b/i],
        [
          deviceModelId,
          [_____deviceType, "Insignia"],
          [placeholder, tabletType],
        ],
        [/\b((nxa|next)-?\w{0,9}) b/i],
        [
          deviceModelId,
          [_____deviceType, "NextBook"],
          [placeholder, tabletType],
        ],
        [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
        [
          [_____deviceType, "Voice"],
          deviceModelId,
          [placeholder, _______deviceType],
        ],
        [/\b(lvtel\-)?(v1[12]) b/i],
        [
          [_____deviceType, "LvTel"],
          deviceModelId,
          [placeholder, _______deviceType],
        ],
        [/\b(ph-1) /i],
        [
          deviceModelId,
          [_____deviceType, "Essential"],
          [placeholder, _______deviceType],
        ],
        [/\b(v(100md|700na|7011|917g).*\b) b/i],
        [
          deviceModelId,
          [_____deviceType, "Envizen"],
          [placeholder, tabletType],
        ],
        [/\b(trio[-\w\. ]+) b/i],
        [
          deviceModelId,
          [_____deviceType, "MachSpeed"],
          [placeholder, tabletType],
        ],
        [/\btu_(1491) b/i],
        [deviceModelId, [_____deviceType, "Rotor"], [placeholder, tabletType]],
        [/(shield[\w ]+) b/i],
        [deviceModelId, [_____deviceType, "Nvidia"], [placeholder, tabletType]],
        [/(sprint) (\w+)/i],
        [_____deviceType, deviceModelId, [placeholder, _______deviceType]],
        [/(kin\.[onetw]{3})/i],
        [
          [deviceModelId, /\./g, " "],
          [_____deviceType, internalFlags],
          [placeholder, _______deviceType],
        ],
        [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
        [
          deviceModelId,
          [_____deviceType, queryResults],
          [placeholder, tabletType],
        ],
        [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
        [
          deviceModelId,
          [_____deviceType, queryResults],
          [placeholder, _______deviceType],
        ],
        [/smart-tv.+(samsung)/i],
        [_____deviceType, [placeholder, ________deviceType]],
        [/hbbtv.+maple;(\d+)/i],
        [
          [deviceModelId, /^/, "SmartTV"],
          [_____deviceType, getRealtimeZe],
          [placeholder, ________deviceType],
        ],
        [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
        [
          [_____deviceType, _currentPrice],
          [placeholder, ________deviceType],
        ],
        [/(apple) ?tv/i],
        [
          _____deviceType,
          [deviceModelId, appleDevice + " TV"],
          [placeholder, ________deviceType],
        ],
        [/crkey/i],
        [
          [deviceModelId, browserType + "cast"],
          [_____deviceType, deviceSource],
          [placeholder, ________deviceType],
        ],
        [/droid.+aft(\w+)( bui|\))/i],
        [
          deviceModelId,
          [_____deviceType, endorName],
          [placeholder, ________deviceType],
        ],
        [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
        [
          deviceModelId,
          [_____deviceType, aiInstance],
          [placeholder, ________deviceType],
        ],
        [/(bravia[\w ]+)( bui|\))/i],
        [
          deviceModelId,
          [_____deviceType, getRealTime],
          [placeholder, ________deviceType],
        ],
        [/(mitv-\w{5}) bui/i],
        [
          deviceModelId,
          [_____deviceType, exchangeRate],
          [placeholder, ________deviceType],
        ],
        [/Hbbtv.*(technisat) (.*);/i],
        [_____deviceType, deviceModelId, [placeholder, ________deviceType]],
        [
          /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
          /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i,
        ],
        [
          [_____deviceType, processString],
          [deviceModelId, processString],
          [placeholder, ________deviceType],
        ],
        [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
        [[placeholder, ________deviceType]],
        [/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
        [_____deviceType, deviceModelId, [placeholder, ______deviceType]],
        [/droid.+; (shield) bui/i],
        [
          deviceModelId,
          [_____deviceType, "Nvidia"],
          [placeholder, ______deviceType],
        ],
        [/(playstation [345portablevi]+)/i],
        [
          deviceModelId,
          [_____deviceType, getRealTime],
          [placeholder, ______deviceType],
        ],
        [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
        [
          deviceModelId,
          [_____deviceType, internalFlags],
          [placeholder, ______deviceType],
        ],
        [/\b(sm-[lr]\d\d[05][fnuw]?s?)\b/i],
        [
          deviceModelId,
          [_____deviceType, getRealtimeZe],
          [placeholder, _________deviceType],
        ],
        [/((pebble))app/i],
        [_____deviceType, deviceModelId, [placeholder, _________deviceType]],
        [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],
        [
          deviceModelId,
          [_____deviceType, appleDevice],
          [placeholder, _________deviceType],
        ],
        [/droid.+; (glass) \d/i],
        [
          deviceModelId,
          [_____deviceType, deviceSource],
          [placeholder, _________deviceType],
        ],
        [/droid.+; (wt63?0{2,3})\)/i],
        [
          deviceModelId,
          [_____deviceType, queryResults],
          [placeholder, _________deviceType],
        ],
        [/(quest( \d| pro)?)/i],
        [
          deviceModelId,
          [_____deviceType, getTimeInfo],
          [placeholder, _________deviceType],
        ],
        [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
        [_____deviceType, [placeholder, defaultDevice]],
        [/(aeobc)\b/i],
        [
          deviceModelId,
          [_____deviceType, endorName],
          [placeholder, defaultDevice],
        ],
        [/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],
        [deviceModelId, [placeholder, _______deviceType]],
        [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
        [deviceModelId, [placeholder, tabletType]],
        [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
        [[placeholder, tabletType]],
        [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],
        [[placeholder, _______deviceType]],
        [/(android[-\w\. ]{0,9});.+buil/i],
        [deviceModelId, [_____deviceType, "Generic"]],
      ],
      engine: [
        [/windows.+ edge\/([\w\.]+)/i],
        [deviceVersion, [deviceName, _browserType + "HTML"]],
        [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
        [deviceVersion, [deviceName, "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
          /ekioh(flow)\/([\w\.]+)/i,
          /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
          /(icab)[\/ ]([23]\.[\d\.]+)/i,
          /\b(libweb)/i,
        ],
        [deviceName, deviceVersion],
        [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
        [deviceVersion, deviceName],
      ],
      os: [
        [/microsoft (windows) (vista|xp)/i],
        [deviceName, deviceVersion],
        [/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i],
        [deviceName, [deviceVersion, atchDePrefix, findIndexBy]],
        [
          /windows nt 6\.2; (arm)/i,
          /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
          /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i,
        ],
        [
          [deviceVersion, atchDePrefix, findIndexBy],
          [deviceName, "Windows"],
        ],
        [
          /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
          /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
          /cfnetwork\/.+darwin/i,
        ],
        [
          [deviceVersion, /_/g, "."],
          [deviceName, "iOS"],
        ],
        [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i],
        [
          [deviceName, __currentTime],
          [deviceVersion, /_/g, "."],
        ],
        [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],
        [deviceVersion, deviceName],
        [
          /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
          /(blackberry)\w*\/([\w\.]*)/i,
          /(tizen|kaios)[\/ ]([\w\.]+)/i,
          /\((series40);/i,
        ],
        [deviceName, deviceVersion],
        [/\(bb(10);/i],
        [deviceVersion, [deviceName, blackBerryId]],
        [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
        [deviceVersion, [deviceName, "Symbian"]],
        [
          /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i,
        ],
        [deviceVersion, [deviceName, ieBrowserType + " OS"]],
        [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
        [deviceVersion, [deviceName, "webOS"]],
        [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],
        [deviceVersion, [deviceName, "watchOS"]],
        [/crkey\/([\d\.]+)/i],
        [deviceVersion, [deviceName, browserType + "cast"]],
        [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],
        [[deviceName, currentInfo], deviceVersion],
        [
          /panasonic;(viera)/i,
          /(netrange)mmh/i,
          /(nettv)\/(\d+\.[\w\.]+)/i,
          /(nintendo|playstation) ([wids345portablevuch]+)/i,
          /(xbox); +xbox ([^\);]+)/i,
          /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
          /(mint)[\/\(\) ]?(\w*)/i,
          /(mageia|vectorlinux)[; ]/i,
          /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
          /(hurd|linux) ?([\w\.]*)/i,
          /(gnu) ?([\w\.]*)/i,
          /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
          /(haiku) (\w+)/i,
        ],
        [deviceName, deviceVersion],
        [/(sunos) ?([\w\.\d]*)/i],
        [[deviceName, "Solaris"], deviceVersion],
        [
          /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
          /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
          /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
          /(unix) ?([\w\.]*)/i,
        ],
        [deviceName, deviceVersion],
      ],
    };
    function determineUser(phoneModelEsc, deviceBrandRx) {
      if (typeof phoneModelEsc === __deviceType) {
        deviceBrandRx = phoneModelEsc;
        phoneModelEsc = prefixMatch;
      }
      if (!(this instanceof determineUser)) {
        return new determineUser(phoneModelEsc, deviceBrandRx).getResult();
      }
      var browserObject =
        typeof _index !== unknownValue && _index.navigator
          ? _index.navigator
          : prefixMatch;
      var userAgent =
        phoneModelEsc ||
        (browserObject && browserObject.userAgent
          ? browserObject.userAgent
          : defaultValue);
      var __browserInfo =
        browserObject && browserObject.userAgentData
          ? browserObject.userAgentData
          : prefixMatch;
      var deviceBrand = deviceBrandRx
        ? appendPair(queryObject, deviceBrandRx)
        : queryObject;
      var __browserType = browserObject && browserObject.userAgent == userAgent;
      this.getBrowser = function () {
        var _________deviceInfo = {
          [deviceName]: prefixMatch,
          [deviceVersion]: prefixMatch,
        };
        populateFrom.call(_________deviceInfo, userAgent, deviceBrand.browser);
        _________deviceInfo[____deviceType] = extractWhole(
          _________deviceInfo[deviceVersion],
        );
        if (
          __browserType &&
          browserObject &&
          browserObject.brave &&
          typeof browserObject.brave.isBrave == _deviceType
        ) {
          _________deviceInfo[deviceName] = "Brave";
        }
        return _________deviceInfo;
      };
      this.getCPU = function () {
        var _____________deviceInfo = {
          [architecture]: prefixMatch,
        };
        populateFrom.call(_____________deviceInfo, userAgent, deviceBrand.cpu);
        return _____________deviceInfo;
      };
      this.getDevice = function () {
        var _______deviceInfo = {
          [_____deviceType]: prefixMatch,
          [deviceModelId]: prefixMatch,
          [placeholder]: prefixMatch,
        };
        populateFrom.call(_______deviceInfo, userAgent, deviceBrand.device);
        if (
          __browserType &&
          !_______deviceInfo[placeholder] &&
          __browserInfo &&
          __browserInfo.mobile
        ) {
          _______deviceInfo[placeholder] = _______deviceType;
        }
        if (
          __browserType &&
          _______deviceInfo[deviceModelId] == "Macintosh" &&
          browserObject &&
          typeof browserObject.standalone !== unknownValue &&
          browserObject.maxTouchPoints &&
          browserObject.maxTouchPoints > 2
        ) {
          _______deviceInfo[deviceModelId] = "iPad";
          _______deviceInfo[placeholder] = tabletType;
        }
        return _______deviceInfo;
      };
      this.getEngine = function () {
        var ____________deviceInfo = {
          [deviceName]: prefixMatch,
          [deviceVersion]: prefixMatch,
        };
        populateFrom.call(
          ____________deviceInfo,
          userAgent,
          deviceBrand.engine,
        );
        return ____________deviceInfo;
      };
      this.getOS = function () {
        var ________deviceInfo = {
          [deviceName]: prefixMatch,
          [deviceVersion]: prefixMatch,
        };
        populateFrom.call(________deviceInfo, userAgent, deviceBrand.os);
        if (
          __browserType &&
          !________deviceInfo[deviceName] &&
          __browserInfo &&
          __browserInfo.platform &&
          __browserInfo.platform != "Unknown"
        ) {
          ________deviceInfo[deviceName] = __browserInfo.platform
            .replace(/chrome os/i, currentInfo)
            .replace(/macos/i, __currentTime);
        }
        return ________deviceInfo;
      };
      this.getResult = function () {
        return {
          ua: this.getUA(),
          browser: this.getBrowser(),
          engine: this.getEngine(),
          os: this.getOS(),
          device: this.getDevice(),
          cpu: this.getCPU(),
        };
      };
      this.getUA = function () {
        return userAgent;
      };
      this.setUA = function (convertCase) {
        if (
          typeof convertCase === ___deviceType &&
          convertCase.length > agicNumber
        ) {
          userAgent = processString(convertCase, agicNumber);
        } else {
          userAgent = convertCase;
        }
        return this;
      };
      this.setUA(userAgent);
      return this;
    }
    determineUser.VERSION = applicationOr;
    determineUser.BROWSER = __characterMap([
      deviceName,
      deviceVersion,
      ____deviceType,
    ]);
    determineUser.CPU = __characterMap([architecture]);
    determineUser.DEVICE = __characterMap([
      deviceModelId,
      _____deviceType,
      placeholder,
      ______deviceType,
      _______deviceType,
      ________deviceType,
      tabletType,
      _________deviceType,
      defaultDevice,
    ]);
    determineUser.ENGINE = determineUser.OS = __characterMap([
      deviceName,
      deviceVersion,
    ]);
    if (preserveTrail.exports) {
      filePathArray = preserveTrail.exports = determineUser;
    }
    filePathArray.UAParser = determineUser;
    var _defaultDevice =
      typeof _index !== unknownValue && (_index.jQuery || _index.Zepto);
    if (_defaultDevice && !_defaultDevice.ua) {
      var ___userAgentInfo = new determineUser();
      _defaultDevice.ua = ___userAgentInfo.getResult();
      _defaultDevice.ua.get = function () {
        return ___userAgentInfo.getUA();
      };
      _defaultDevice.ua.set = function (eplaceWith) {
        ___userAgentInfo.setUA(eplaceWith);
        var _____userAgentInfo = ___userAgentInfo.getResult();
        for (var deviceKeys in _____userAgentInfo) {
          _defaultDevice.ua[deviceKeys] = _____userAgentInfo[deviceKeys];
        }
      };
    }
  })(typeof window == "object" ? window : weight);
})(unifiedString, unifiedString.exports);
var deviceModelMn = unifiedString.exports;
const devicePattern = navigator.language.includes("zh");
function __getDeviceInfo(_devicePattern) {
  let e = new deviceModelMn.UAParser(_devicePattern).getResult();
  let ___________deviceInfo = {};
  ["browser", "os", "device", "cpu", "engine"].forEach((deviceNameKey) => {
    ___________deviceInfo[deviceNameKey] = e[deviceNameKey];
  });
  ___________deviceInfo.product = ___________deviceInfo.browser;
  delete ___________deviceInfo.browser;
  return ___________deviceInfo;
}
function torePhonePon(phoneModels, _pattern) {
  _userAgentInfo.set("scope-browser-" + _pattern.id, phoneModels);
}
function ___getDeviceInfo(propertyData, __devicePattern) {
  return _userAgentInfo.get("scope-browser-" + __devicePattern.id);
}
function clearPhoneBrm(phoneBrand, deviceBrandOr) {
  return _userAgentInfo.delete("scope-browser-" + deviceBrandOr.id);
}
async function filterProduct(productRegex, brandPattern) {
  if (!productRegex) {
    return await clearTabData(brandPattern.id);
  }
  let browserLocale = await findWebrtcKey(productRegex);
  if (!browserLocale) {
    throw new Error("invalid browserId");
  }
  await clearTabData(brandPattern.id);
  browserLocale = await etUserLocale(browserLocale);
  torePhonePon(browserLocale, brandPattern);
  return productRegex;
}
function getMatchingId(___devicePattern, deviceType) {
  var __deviceId;
  if ((__deviceId = ___getDeviceInfo(___devicePattern, deviceType)) == null) {
    return undefined;
  } else {
    return __deviceId.id;
  }
}
async function getDevices(
  { keyword: earchKeyword, page: e = 1, size: itemsPerPage = 10 },
  deviceNameReg,
) {
  var firstDevice;
  e -= 1;
  let devicesWithPn = [];
  let atchedDevice = ___getDeviceInfo(null, deviceNameReg);
  await webrtcPattern.iterWith("", (addDeviceToPn, __________deviceInfo) => {
    let { id: _deviceId, name: __deviceName } = __________deviceInfo;
    if (atchedDevice && atchedDevice.id === _deviceId) {
      atchedDevice = __________deviceInfo;
      devicesWithPn.unshift(atchedDevice);
      return;
    }
    if (earchKeyword) {
      if (((__deviceName || "") + "").includes(earchKeyword)) {
        devicesWithPn.push(__________deviceInfo);
      }
      return;
    }
    devicesWithPn.push(__________deviceInfo);
  });
  if (
    atchedDevice &&
    !earchKeyword &&
    atchedDevice.id !==
      ((firstDevice = devicesWithPn[0]) == null ? undefined : firstDevice.id)
  ) {
    devicesWithPn.unshift(atchedDevice);
  }
  if (itemsPerPage < 0) {
    return {
      data: devicesWithPn,
      total: devicesWithPn.length,
    };
  } else {
    return {
      data: devicesWithPn.slice(
        e * itemsPerPage,
        e * itemsPerPage + itemsPerPage,
      ),
      total: devicesWithPn.length,
    };
  }
}
async function emovePattern(__pattern, egexPattern) {
  if (__pattern) {
    return await webrtcPattern.remove(__pattern);
  }
}
async function findWebrtcKey(keywordRegex, propertyDetet) {
  if (keywordRegex) {
    return await webrtcPattern.get(keywordRegex);
  }
}
async function validateAndEn(patterns, patternRegex) {
  let {
    id: torageId,
    name: _deviceName,
    timezone: timeZoneId,
    language: langId,
    webrtc: localPeerIp,
    proxy: proxyConfig,
    userAgent: __userAgentInfo,
    factors: _deviceDetails,
    gpu: validGPUInfo,
    screen: creenInfo,
  } = patterns;
  if (!_deviceName) {
    throw new Error(
      devicePattern ? "浏览器名称不能为空" : "browser's name required",
    );
  }
  let { height: creenHeight, width: creenWidth } = creenInfo || {};
  if (localPeerIp && localPeerIp !== "dynamic" && !isValidIp(localPeerIp)) {
    throw new Error(
      devicePattern ? "webrtc ip格式不正确" : "webrtc ip with invalid format",
    );
  }
  if (langId !== "dynamic" && langId && langId >= 0 && !languageLocs[langId]) {
    throw new Error("id对应的语言不存在");
  }
  if (
    timeZoneId !== "dynamic" &&
    timeZoneId &&
    timeZoneId >= 0 &&
    !cityNames[timeZoneId]
  ) {
    throw new Error("id对应的时区不存在");
  }
  if (creenHeight && creenHeight < 0) {
    throw new Error("屏幕的高度不能小于0");
  }
  if (creenWidth && creenWidth < 0) {
    throw new Error("屏幕的宽度不能小于0");
  }
  if (__userAgentInfo) {
    patterns.uaInfo = __getDeviceInfo(__userAgentInfo);
  }
  if (!torageId) {
    patterns.id = generateUUID();
  }
  await webrtcPattern.set(patterns.id, patterns);
  if (torageId) {
    for (let __currentItem of _userAgentInfo.keys()) {
      if (
        __currentItem.startsWith("scope-browser-") &&
        _userAgentInfo.get(__currentItem).id === patterns.id
      ) {
        _userAgentInfo.delete(__currentItem);
      }
    }
  }
  return patterns.id;
}
const _deviceInfo = {
  last: 0,
  info: undefined,
};
async function getDeviceInfo() {
  const _getDeviceInfo = async () => {
    let visitorInfo = await (
      await fetch(
        "https://ip-scan.browserscan.net/sys/config/ip/get-visitor-ip?type=ip-api",
      )
    ).json();
    if (!visitorInfo.data) {
      throw new Error("获取当前代理ip信息失败");
    }
    let {
      ip: ___visitorIp,
      language: __visitorLocale,
      ip_data: {
        timezone: visitorTimeZo,
        latitude: visitorLat,
        longitude: longitude,
      },
    } = visitorInfo.data;
    return {
      ip: ___visitorIp,
      language: __visitorLocale,
      timezone: visitorTimeZo,
      longitude: longitude,
      latitude: visitorLat,
    };
  };
  try {
    _deviceInfo.info = await _getDeviceInfo();
    return _deviceInfo.info;
  } catch {
    console.warn(
      devicePattern
        ? "获取ip信息失败，请检查网络连接"
        : "Failed to obtain IP information, please check network connection",
    );
  }
}
const userAgentRegx = () => _deviceInfo.info;
async function etUserLocale(userLocale = {}) {
  userLocale = {
    ...userLocale,
  };
  try {
    let e = _deviceInfo.info;
    {
      if (userLocale.language === "dynamic") {
        userLocale.language = e.language || "";
      } else if (languageLocs[userLocale.language]) {
        userLocale.language = languageLocs[userLocale.language].code;
      } else {
        userLocale.language = "";
      }
      if (userLocale.timezone === "dynamic") {
        userLocale.timezone = e.timezone || "";
      } else if (cityNames[userLocale.timezone]) {
        userLocale.timezone = cityNames[userLocale.timezone].timezone;
      } else {
        userLocale.timezone = "";
      }
      if (userLocale.webrtc === "dynamic") {
        userLocale.webrtc = e.ip || "";
      }
      let location = userLocale.location || {};
      if (location.lat === "dynamic") {
        location.lat = e.latitude || 0;
      }
      if (location.lng === "dynamic") {
        location.lng = e.longitude || 0;
      }
      userLocale.location = location;
    }
    let languageCode = await ___getVisitorIp("fixedLanguage");
    if (languageCode !== undefined) {
      if (languageCode !== "" && languageCode / 1 === languageCode / 1) {
        userLocale.language = languageLocs[languageCode].code;
      } else if (languageCode) {
        userLocale.language = languageCode + "";
      }
    }
    let esponse = await ___getVisitorIp("fixedTimezone");
    if (esponse !== undefined) {
      if (esponse !== "" && esponse / 1 === esponse / 1) {
        userLocale.timezone = cityNames[esponse].timezone;
      } else if (esponse) {
        userLocale.timezone = esponse + "";
      }
    }
    userLocale.uaInfo = __getDeviceInfo(userLocale.userAgent);
    return userLocale;
  } catch (e) {
    console.log(userLocale, e);
    throw e;
  }
}
async function generateUser(___target, obileOsMap) {
  let userData = ___getDeviceInfo("", obileOsMap);
  if (userData) {
    return userData;
  }
  let osWebSupport = await checkOsForWeb(obileOsMap);
  if (osWebSupport) {
    userData = await _____generateUserA(
      osWebSupport,
      obileOsMap,
      Math.random(),
    );
    if (userData) {
      userData = await etUserLocale(userData);
      await torePhonePon(userData, obileOsMap);
      return userData;
    } else {
      return null;
    }
  } else {
    clearPhoneBrm("", obileOsMap);
    console.log("skip " + obileOsMap.id);
    return null;
  }
}
async function endOsInfoToS(osPattern, userAgentInfo) {
  let isMatchFound = ___getDeviceInfo("", {
    id: osPattern,
  });
  if (isMatchFound) {
    await torePhonePon(isMatchFound, {
      id: userAgentInfo,
    });
  }
}
async function checkOsForWeb(operatingSys) {
  let e = getMatchingId(null, operatingSys);
  if (e) {
    return e;
  }
  let hostOperating = operatingSys.host;
  let isOperatingOn = await getUserIp();
  if (isOperatingOn) {
    let isInMode = (await _getVisitorIp())[hostOperating];
    if (isOperatingOn === "white" && isInMode !== 1) {
      console.debug(hostOperating + " 不在白名单", operatingSys.id);
      return;
    }
    if (isOperatingOn === "white" && isInMode === 0) {
      console.debug(hostOperating + " 在黑名单", operatingSys.id);
      return;
    }
  }
  let essionIdUser = await _____visitorIp();
  if (essionIdUser === "无") {
    console.debug("option is no-ops", operatingSys.id);
    return;
  }
  let webrtcKeys = await webrtcPattern.keys();
  let webrtcKey = getRandomized(Math.random(), webrtcKeys);
  if (essionIdUser === "随机选取") {
    return webrtcKey;
  }
  if (essionIdUser === "随机生成") {
    return "randomGenerate";
  }
  if (essionIdUser === "随机一次") {
    return "randomGenerateOnce";
  }
  if (essionIdUser === "静态") {
    return ___getVisitorIp("fixedBrowserId");
  }
  if (essionIdUser === "匹配") {
    let _ealTimeData =
      (await browserData({
        page: 1,
        size: 1000,
      })) || {};
    for (let _currentKey of Object.keys(_ealTimeData)) {
      try {
        if (
          isWildcard(operatingSys.scheme + "://" + hostOperating, _currentKey)
        ) {
          return _ealTimeData[_currentKey];
        }
      } catch {}
    }
  }
  console.debug(hostOperating + "not match", operatingSys.id);
}
let browserEngine = 0;
const browserInfo = async (
  ____________deviceType,
  errorEvent,
  errorId,
  eedCounter = Math.random(),
) => {
  let isSafeMode = await isCountryElig("safeMode");
  let workerId = await isCountryElig("disableWorker");
  let tracingResult = await isCountryElig("functionTrace");
  let isInitialized = false;
  let calculateData = await browserTypes();
  let _____________deviceType =
    (await __getVisitorIp()) || ____________deviceType;
  let errorType = errorEvent;
  let errorIdForDev = errorId;
  if (_____________deviceType !== ____________deviceType) {
    errorType = "";
    errorIdForDev = "";
  }
  _____________deviceType ||= getRandomized(eedCounter++, [
    "desktop",
    "tablet",
    "mobile",
  ]);
  if (!errorType) {
    if (_____________deviceType === "desktop") {
      errorType = getRandomized(eedCounter++, ["macos", "windows", "linux"]);
    } else {
      errorType = getRandomized(eedCounter++, ["ios", "android"]);
    }
  }
  errorIdForDev ||= getRandomized(eedCounter++, [
    "Chrome",
    "Safari",
    "Firefox",
    "Edge",
  ]);
  let browserInfoId;
  if (isSafeMode) {
    browserInfoId =
      navigator.userAgent + " " + afeRandomI(eedCounter++, 11111, 99999);
  } else {
    browserInfoId =
      (await ___getVisitorIp("fixedUA")) ||
      osPlatform(errorType, errorIdForDev, eedCounter++);
  }
  let ______________deviceType = __getDeviceInfo(
    browserInfoId || navigator.userAgent,
  );
  _____________deviceType = ______________deviceType.device.type;
  let originalValue = 0;
  if (_____________deviceType !== "desktop") {
    if (
      _____________deviceType === "mobile" ||
      _____________deviceType === "tablet"
    ) {
      originalValue = afeRandomI(eedCounter++, 2, 10);
    }
  }
  let _______________deviceType = getRandomized(
    eedCounter++,
    [4, 6, 8, 10, 16, 24],
  );
  let ________________deviceType = afeRandomI(eedCounter++, -15, 15);
  let _________________deviceType;
  let __________________deviceType;
  eedCounter += 7;
  _________________deviceType = getRandomized(eedCounter++, [
    ...Object.keys(gpuModels),
  ]);
  if (gpuModels[_________________deviceType] instanceof Array) {
    __________________deviceType = getRandomized(
      eedCounter++,
      gpuModels[_________________deviceType],
    );
  } else {
    let electedGpu = getRandomized(
      eedCounter++,
      Object.keys(gpuModels[_________________deviceType]),
    );
    __________________deviceType = getRandomized(
      eedCounter++,
      gpuModels[_________________deviceType][electedGpu],
    );
    _________________deviceType += " (" + electedGpu + ")";
  }
  let ___________________deviceType = {};
  chromeStorage.flat().forEach((________________________deviceType) => {
    ___________________deviceType[________________________deviceType] =
      afeRandomI(eedCounter++, 0, 5000) / 1000;
  });
  let deviceTypeOrE = {
    id: "randomGenerate",
    name:
      (devicePattern ? "随机生成配置:" : "Random Browser:") + browserEngine++,
    isTemp: true,
    safeMode: isSafeMode,
    disableWorker: workerId,
    functionTrace: tracingResult,
    antiDebugger: isInitialized,
    userAgent: browserInfoId,
    enables: calculateData,
    customProtos: [
      {
        name: "Screen",
        properties: [
          {
            key: "colorDepth",
            value: _______________deviceType,
            type: "number",
          },
          {
            key: "pixelDepth",
            value: _______________deviceType,
            type: "number",
          },
        ],
      },
      {
        name: "Navigator",
        properties: [
          {
            key: "maxTouchPoints",
            value: originalValue,
            type: "number",
          },
        ],
      },
    ],
    customVars: [],
    webrtc: "dynamic",
    timezone: "dynamic",
    language: "dynamic",
    location: {
      lat: "dynamic",
      lng: "dynamic",
    },
    factors: ___________________deviceType,
    gpu: {
      vendor: _________________deviceType,
      renderer: __________________deviceType,
    },
    screen: {
      noise: ________________deviceType,
    },
    memoryCapacity: getRandomized(eedCounter++, [0.25, 0.5, 1, 2, 4, 8]),
    processors: getRandomized(eedCounter++, [1, 2, 4, 8, 16]),
    uaInfo: ______________deviceType,
  };
  if (
    _____________deviceType === "mobile" ||
    _____________deviceType === "tablet"
  ) {
    ["ontouchstart", "ontouchend", "ontouchmove", "ontouchcancel"].forEach(
      (elementName) => {
        deviceTypeOrE.customVars.push({
          path: "HTMLElement.prototype." + elementName,
          value: null,
        });
        deviceTypeOrE.customVars.push({
          path: "window." + elementName,
          value: null,
        });
      },
    );
  }
  return deviceTypeOrE;
};
async function _____generateUserA(trimLength, newUserAgent, userAgentMimT) {
  var ___deviceInfo;
  var ____________________deviceType;
  var osInfo;
  if (!newUserAgent || !trimLength) {
    return null;
  }
  let parsedUserAgg = __getDeviceInfo(newUserAgent.ua);
  let _____________________deviceType =
    (___deviceInfo = parsedUserAgg.device) == null
      ? undefined
      : ___deviceInfo.type;
  let deviceModel =
    (____________________deviceType = parsedUserAgg.product) == null
      ? undefined
      : ____________________deviceType.name;
  let __operatingSys =
    ((osInfo = parsedUserAgg.os) == null ? undefined : osInfo.name) || "";
  if (!_____________________deviceType) {
    let ____operatingSys = __operatingSys.toLowerCase();
    if (
      ____operatingSys.includes("window") ||
      ____operatingSys.includes("linux") ||
      ____operatingSys.includes("mac")
    ) {
      _____________________deviceType = "desktop";
    }
    if (
      ____operatingSys.includes("ios") ||
      ____operatingSys.includes("android")
    ) {
      _____________________deviceType = "mobile";
    }
  }
  if (trimLength === "randomGenerate") {
    return browserInfo(
      _____________________deviceType,
      __operatingSys,
      deviceModel,
      userAgentMimT,
    );
  }
  if (trimLength === "randomGenerateOnce") {
    let ____userAgentInfo = await _userAgentInfo.get(trimLength);
    return (
      ____userAgentInfo ||
      ((____userAgentInfo = browserInfo(
        _____________________deviceType,
        __operatingSys,
        deviceModel,
        userAgentMimT,
      )),
      (____userAgentInfo.id = "randomGenerateOnce"),
      (____userAgentInfo.name = devicePattern
        ? "随机生成固定配置"
        : "Random Durable Browser"),
      await _userAgentInfo.set(trimLength, ____userAgentInfo),
      ____userAgentInfo)
    );
  }
  return await findWebrtcKey(trimLength);
}
async function generateAndSb(language, deviceDetails) {
  let randomKey = await (async () => {
    let randomOption = await _____visitorIp();
    let candidateKeys = await webrtcPattern.keys();
    let randomlyChose = getRandomized(Math.random(), candidateKeys);
    if (randomOption === "随机选取") {
      return randomlyChose;
    }
    if (randomOption === "随机生成") {
      return "randomGenerate";
    }
    if (randomOption === "随机一次") {
      return "randomGenerateOnce";
    }
  })();
  if (!randomKey) {
    return false;
  }
  let userObject = await _____generateUserA(
    randomKey,
    deviceDetails,
    Math.random(),
  );
  if (userObject) {
    await clearTabData(deviceDetails.id);
    userObject = await etUserLocale(userObject);
    await torePhonePon(userObject, deviceDetails);
    return true;
  } else {
    return false;
  }
}
const getDeviceId = location.host.startsWith("localhost") ? "dev" : "";
const deviceInfoRet = self.chrome || self.browser;
const oeData =
  getDeviceId === "dev"
    ? {}
    : deviceInfoRet.storage.local || deviceInfoRet.storage.sync;
class localStorageM {
  constructor(e) {
    this.name = e;
    this.indexKey = "__index__";
  }
  keys() {
    return this.get(this.indexKey).then((e) => {
      e = new Set(e || []);
      e.delete(this.indexKey);
      return e;
    });
  }
  get(e) {
    return new Promise((initializer, itemIndex) => {
      if (!e || new Date() > parseDateFrom) {
        return initializer();
      }
      e = this.name + "-" + e;
      if (getDeviceId === "dev") {
        let localStorageE = localStorage.getItem(e) || "";
        let localStorageP = JSON.parse(localStorageE);
        return initializer(localStorageP);
      }
      oeData.get([e], (_injector) => {
        let injectionData = _injector[e];
        initializer(injectionData);
      });
    });
  }
  set(e, employeeData) {
    return new Promise((updateSuccess, onUpdateDone) => {
      if (!e || new Date() > parseDateFrom) {
        return updateSuccess();
      }
      let keyBuilder = this.name + "-" + e;
      if (getDeviceId === "dev") {
        localStorage.setItem(keyBuilder, JSON.stringify(employeeData));
        return updateSuccess();
      }
      if (e !== this.indexKey) {
        this.keys().then((addUnique) => {
          (addUnique || new Set()).add(e);
          return this.set(this.indexKey, [...addUnique]);
        });
      }
      let updatedRecord = {
        [keyBuilder]: employeeData || "",
      };
      return oeData.set(updatedRecord, updateSuccess);
    });
  }
  remove(e) {
    return new Promise((continuation, onSuccess) => {
      if (!e) {
        return continuation();
      }
      let compositeKey = this.name + "-" + e;
      if (getDeviceId === "dev") {
        localStorage.removeItem(compositeKey);
        return continuation();
      } else {
        this.keys().then((_items) => {
          (_items || new Set()).delete(e);
          return this.set(this.indexKey, [..._items]);
        });
        return oeData.remove(compositeKey, continuation);
      }
    });
  }
  clear() {
    return new Promise((e, onCompletion) =>
      getDeviceId === "dev"
        ? (localStorage.clear(), e())
        : this.set(this.indexKey, []).then((clearOeData) => {
            oeData.clear(e);
          }),
    );
  }
  iterWith(e, predicate) {
    return this.keys().then(async (items) => {
      for (let _item of items) {
        if (!_item.startsWith(e)) {
          continue;
        }
        if (
          (await this.get(_item).then((qualification) =>
            predicate(_item, qualification),
          )) === false
        ) {
          return;
        }
      }
    });
  }
}
const webrtcPattern = new localStorageM("browser");
const _userAgentInfo = new Map();
const getVisitorIp = new localStorageM("config");
self.browserTree = webrtcPattern;
self.tempTree = _userAgentInfo;
self.configTree = getVisitorIp;
const validateWebRt = {
  uaParse: __getDeviceInfo,
  selectBrowsers: getDevices,
  refreshIpInfo: getDeviceInfo,
  getIpInfo: userAgentRegx,
  getScopeBrowser: ___getDeviceInfo,
  delScopeBrowser: clearPhoneBrm,
  setBrowser: validateAndEn,
  getBrowser: findWebrtcKey,
  delBrowser: emovePattern,
  getSuitBrowser: generateUser,
  randomBrowser: generateAndSb,
  obtainBrowser: _____generateUserA,
  setEnable: filterProduct,
  getEnable: getMatchingId,
  clearCookie: async (____tabId, e) => {
    let currentTab = await deviceInfoRet.tabs.get(e.id);
    deviceInfoRet.cookies.getAll(
      {
        url: currentTab.url,
      },
      (cookiesToBeUn) => {
        cookiesToBeUn.forEach((cookieDeleter) => {
          deviceInfoRet.cookies.remove({
            url: currentTab.url,
            name: cookieDeleter.name,
          });
        });
      },
    );
  },
  getConfig: ___getVisitorIp,
  setConfig: aveIpAddress,
  delConfig: getAndRemoveV,
  configs: getVisitorDet,
  delHost: deleteOption,
  getHostTable: _getVisitorIp,
  setHostEnable: hostEnableDis,
  addHost: anitizeUrl,
  getDevice: __getVisitorIp,
  setDevice: updateVisitor,
  getOption: _____visitorIp,
  setOption: etVisitorIPC,
  getProxies: getProxies,
  delProxy: emoveCurrent,
  addProxy: addIpToProxie,
  getMatches: browserData,
  delMatch: emoveVisited,
  addMatch: ______browserInfo,
  importData: ealtimePrep,
  exportData: visitorInfoGh,
};
const hasError = self.chrome || self.browser;
(async () => {
  try {
    await validateWebRt.refreshIpInfo();
  } catch {}
  async function getRealTimeIp(ipData, visitorIp, viewerLocale) {
    let getWebRtData = validateWebRt[ipData];
    if (!getWebRtData) {
      throw new Error("路径不存在");
    }
    try {
      let webServiceRtC = getWebRtData(visitorIp, viewerLocale);
      if (webServiceRtC instanceof Promise) {
        return await webServiceRtC;
      } else {
        return {
          code: 200,
          data: webServiceRtC,
        };
      }
    } catch (catchedError) {
      console.error(catchedError);
      return {
        code: 500,
        msg: catchedError.message,
      };
    }
  }
  hasError.runtime.onMessage.addListener(
    function (visitorData, _visitorIp, visitorLocale) {
      async function getTabId() {
        var tab;
        let currentTabId = _visitorIp.tab ? _visitorIp.tab.id : 0;
        if (
          currentTabId === 0 ||
          ((tab = _visitorIp.tab) != null &&
            tab.url.toString().startsWith("devtools:"))
        ) {
          let activeTabs = await hasError.tabs.query({
            active: true,
            url: ["http://*/*", "https://*/*"],
          });
          activeTabs = Array.from(activeTabs || []).filter(
            (isDataObjectT) =>
              isDataObjectT.selected || isDataObjectT.highlighted,
          );
          if (activeTabs[0]) {
            return activeTabs[0].id || 0;
          } else {
            return currentTabId;
          }
        }
        return currentTabId;
      }
      getTabId().then((equestUuid) => {
        const __windowInfo = getWindowInfo(equestUuid);
        let visitorKey = visitorData.key;
        let _visitorData = visitorData.data;
        __windowInfo.then(async (handleRealIp) => {
          try {
            let ____visitorIp = await getRealTimeIp(
              visitorKey,
              _visitorData,
              handleRealIp,
            );
            console.log(
              `request==${equestUuid}==${visitorKey}`,
              visitorData,
              ____visitorIp,
            );
            visitorLocale(____visitorIp);
            return true;
          } catch (propertyError) {
            visitorLocale(propertyError);
            return true;
          }
        });
      });
      return true;
    },
  );
  hasError.tabs.onRemoved.addListener(function (fixedLanguage, fixedTimezone) {
    return validateWebRt.delScopeBrowser(undefined, {
      tabId: fixedLanguage,
    });
  });
  hasError.tabs.onActivated.addListener(function () {});
  hasError.runtime.onInstalled.addListener(function (targetInfo) {
    console.log("onInstalled", targetInfo);
  });
  hasError.runtime.onStartup.addListener(() => {});
  hasError.webNavigation.onCreatedNavigationTarget.addListener(
    async (tabProperties) => {
      if (
        !!tabProperties.url.toString().startsWith("http") &&
        (!("frameType" in tabProperties) ||
          tabProperties.frameType === "outermost_frame")
      ) {
        await efreshPage(tabProperties.tabId, tabProperties.sourceTabId);
      }
    },
  );
  hasError.webNavigation.onCommitted.addListener(async (pageRefreshVm) => {
    if (
      !!pageRefreshVm.url.toString().startsWith("http") &&
      (!("frameType" in pageRefreshVm) ||
        pageRefreshVm.frameType === "outermost_frame")
    ) {
      await efreshPage(pageRefreshVm.tabId);
    }
  });
  async function e() {
    let idsToBeUnset = (
      (await hasError.declarativeNetRequest.getSessionRules()) || []
    ).map((currentEntity) => currentEntity.id);
    await hasError.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [...idsToBeUnset],
      addRules: [],
    });
    await hasError.scripting.unregisterContentScripts();
  }
  await e();
  await hasError.scripting.registerContentScripts([
    {
      id: "window",
      js: ["content-scripts/window.js"],
      matches: ["*://*/*"],
      allFrames: true,
      runAt: "document_start",
      world: "MAIN",
    },
  ]);
})();
