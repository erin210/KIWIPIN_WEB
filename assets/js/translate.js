// 設定 Cookie
function setCookie(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=" + (7 * 24 * 60 * 60);
}

// 取得 Cookie
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

// 刪除 Cookie
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}
var thisLang = getCookie('userLang') || navigator.language || 'en-US';

// 判斷用戶語系
function langSystem(ss, json) {
    let langDefault = 'en_US'; // 預設英文
    let ssLang = ss.replace('-', '_');
    let languageKeys = Object.keys(json.LanguageList); //支援語言List

    if (languageKeys.some(key => key.startsWith(ssLang))) {
        langDefault = languageKeys.find(key => key.startsWith(ssLang));
    }
    return langDefault;
}

//BASE64 to HTML
function base64toHTML(html) {
    const binaryString = atob(html);
    const binaryArray = Uint8Array.from(binaryString, c => c.charCodeAt(0));
    const decodedHtml = new TextDecoder('utf-8').decode(binaryArray);
    return html = decodedHtml
}




//初始化翻譯
function initTranslation(json) {
    let langDefault = json.LanguageDefault; // 預設語言
    let userLang = getCookie('userLang') || navigator.language || 'en-US';

    langDefault = langSystem(userLang, json);
    setCookie('userLang', langDefault); // 抓Cookie

    let lang = json.StringID[langDefault] || json.StringID['en_US'];
    let translationSelectors = Object.keys(lang).map(key => `.${key}`);

    // 翻譯
    function translate(json) {
        let selectedLang = json.StringID[langDefault];

        const base64IDs = Object.keys(selectedLang).filter(key => key.includes('_BASE64'));

        translationSelectors.forEach(selector => {
            const key = selector.substring(1);
            const elements = $(selector);

            if (elements.length > 0 && selectedLang[key]) {
                let value = selectedLang[key];

                if (base64IDs.includes(key)) {
                    // console.log(key, value);
                    value = base64toHTML(value);
                }

                elements.each(function () {
                    const el = $(this);
                    if (el.is('input, textarea')) {
                        el.attr('placeholder', value);
                    } else {
                        el.html(value);
                    }
                });
            }
        });

        //指定domain
        let kiwipin = '';
        let wallet = '';
        let imgCDN = '';

        if (window.location.href.includes('stage-')) {
            //Stage
            kiwipin = 'https://stage-www.kiwipin.com/';
            wallet = 'https://stage-wallet.kiwipin.com/';
            imgCDN = 'https://stage-www-page.kiwipin.com/';
        } else {
            //PROD
            kiwipin = 'https://www.kiwipin.com/';
            wallet = 'https://wallet.kiwipin.com/';
            imgCDN = 'https://www-page.kiwipin.com/';
        }

        $('a.walletGO[data-href]').each(function () {
            const walletLink = $(this).data('href');
            if (walletLink) {
                const realPath = walletLink.replace('{{WALLET_URL}}', wallet);
                $(this).attr('href', realPath);
            } else {
                console.warn('找不到 data-href：', this);
            }
        });
        $('a.kiwipinGO[data-href]').each(function () {
            const kiwipinLink = $(this).data('href');
            if (kiwipinLink) {
                const realPath = kiwipinLink.replace('{{KIWIPIN_URL}}', kiwipin);
                $(this).attr('href', realPath);
            } else {
                console.warn('找不到 data-href：', this);
            }
        });

        //更換css語系路徑
        $('link[data-href]').each(function () {
            // console.log(langDefault);

            const cdnPathCss = $(this).data('href');
            if (cdnPathCss) {
                const realPath = cdnPathCss.replace('{{LANG}}', langDefault);
                $(this).attr('href', realPath);
            } else {
                console.warn('⚠️ 找不到 data-href：', this);
            }
        });


        //更換圖片語系路徑
        $('.lang-img').each(function () {
            const rawSrc = $(this).data('src'); // 取得原始 data-src
            if (rawSrc) {
                let realPath = rawSrc
                    .replace('{{IMG_URL}}', imgCDN)
                    .replace('{{LANG}}', langDefault);
                $(this).attr('src', realPath);
            } else {
                console.warn('⚠️ 找不到 data-src：', this);
            }
        });

    }


    // 產生語言列表
    $('#landList').empty();
    $.each(json.LanguageList, function (key, value) {
        var listItem = $('<li></li>').attr('data-lang', key).text(value);
        $('#landList').append(listItem);
        // console.log("1111111");

    });

    // 設定當前語言名稱
    // if (json.LanguageList.hasOwnProperty(langDefault)) {
    //     // $('.lang_text').text(json.LanguageList[langDefault]);
    //     console.log(langDefault);

    // } else {
    //     // $('.lang_text').text('選擇語言');
    // }

    $('#landList li').each(function () {
        const langCode = $(this).data('lang');
        // console.log(langCode);

        if (langCode == langDefault) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });



    // 語言切換點擊事件

    $('#landList li').on('click', function () {
        let selectLang = $(this).data('lang');
        deleteCookie('userLang');
        setCookie('userLang', selectLang);
        $('#landList li').removeClass('active');
        $(this).addClass('active');
        window.location.reload();
    });



    translate(json);
}