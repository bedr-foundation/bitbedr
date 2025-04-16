$(document).ready(function () {
    //언어 값 세팅
    let language = getCookie("WEX_language");
    if (language == "" || language == undefined) {
        setCookie("WEX_language", "en", "30");
        changeLang("en");
    } else {
        changeLang(language);
        $('.language').selectpicker('val', language);
    }
});

window.addEventListener("resize", function () {
    let language = getCookie("WEX_language");
    changeLang(language);
})

function openMenu() {
    $(".m_menu .list").css("display", "flex");
}
function closeMenu() {
    $(".m_menu .list").css("display", "none");
}

// function languageActive(langStr) {
//     switch (langStr) {
//         case "en":
//             $("#m_lang_en").addClass("active");
//             $("#m_lang_ko").removeClass("active");
//             break;
//         case "ko":
//             $("#m_lang_en").removeClass("active");
//             $("#m_lang_ko").addClass("active");
//             break;
//         default:
//             break;
//     }
//     closeMenu();
// }

function changeLang(langStr) {
    let language = "";
    if (langStr == "" || langStr == undefined) {
        language = $(".language")[1].value;
    } else {
        language = langStr;
    }
    let path = window.location.pathname;
    let page = path.split("/").pop();

    setCookie("WEX_language", language, "30");
    // languageActive(language);

    let intro_li_txt01 = "";
    let intro_li_txt02 = "";
    let intro_li_txt03 = "";
    let intro_li_txt04 = "";
    let intro_li_txt05 = "";
    let intro_li_txt06 = "";

    let point_txt01 = "";
    let point_txt02 = "";

    let bottom_txt = "";
    
    switch (language) {
        case "en":
            intro_txt01 = "The BEDR Fondation builds a decentraized-based virtual asset ecosystem";
            intro_txt02 = "We keep the corporate spirit of working together and sharing together.";

            point_li_txt01 = "Security-enhanced payment system";
            point_li_txt02 = "Various swap handling";
            point_li_txt03 = "Fast deposit and withdrawal processing";
            point_li_txt04 = "Coin information provided";

            bottom_txt = "This site is exclusively for BEDR wallet";
            $(".middle_01_span_01").removeClass("kr");
            $(".middle_01_span_02").removeClass("kr");
            $(".middle_02_li_01").removeClass("kr");
            $(".middle_02_li_02").removeClass("kr");
            $(".middle_02_li_03").removeClass("kr");
            $(".middle_02_li_04").removeClass("kr");
            break;
        case "ko":
            intro_txt01 = "BEDR 재단은 탈중앙화 기반의 가상자산 생태계를 구축하며";
            intro_txt02 = "함께 일하고 함께 나누는 기업정신을 지켜 나갑니다.";

            point_li_txt01 = "보안이 강화된 결제 시스템";
            point_li_txt02 = "다양한 스왑 처리";
            point_li_txt03 = "빠른 입출금 처리";
            point_li_txt04 = "코인 등락 정보 제공";

            bottom_txt = "이 사이트는 BEDR Wallet 전용 사이트 입니다.";

            $(".middle_01_span_01").addClass("kr");
            $(".middle_01_span_02").addClass("kr");
            $(".middle_02_li_01").addClass("kr");
            $(".middle_02_li_02").addClass("kr");
            $(".middle_02_li_03").addClass("kr");
            $(".middle_02_li_04").addClass("kr");
            break;
        default:
            break;
    }

    $(".middle-01 .intro span").eq(0).text(intro_txt01);
    $(".middle-01 .intro span").eq(1).text(intro_txt02);

    $(".middle-02 .point ul li:nth-child(1)").text(point_li_txt01);
    $(".middle-02 .point ul li:nth-child(2)").text(point_li_txt02);
    $(".middle-02 .point ul li:nth-child(3)").text(point_li_txt03);
    $(".middle-02 .point ul li:nth-child(4)").text(point_li_txt04);

    $(".middle-02 .text p").text(bottom_txt);
}

function popup_off(e, num) {
    // document.getElementById("popup").style.display = "none";

    //부모 태그 찾기
    var parentTrTag = e.target;
    //부모 태그 명이 TR이 나올때까지 자동순회
    for (; parentTrTag.id != ('popup_' + num); parentTrTag = parentTrTag.parentElement);
    parentTrTag.style.display = 'none';
}

function getParams() {
    var url = window.location.search.replace('?', '');
    var params = {};
    var urlArray = url.split('&');

    for (var i in urlArray) {
        var param = urlArray[i].split('=');
        params[param[0]] = param[1];
    }
    return params;
}
const params = getParams();

function move(type) {
    let url = "";
    switch (type) {
        case "aos":
            alert("준비중 입니다.");
            // url = "./down/btb_240402.apk";
            break;
        case "ios":
            alert("준비중 입니다.");
            // url = "https://wallet.btbank.io/";
            break;
        default:
            break;
    }
    // if (params.referral != "" && params.referral != undefined) {
    //     url += "?referral=" + params.referral;
    // }
    window.open(url);
}

const BASE_URL = $('base[href]').attr('href');

const $_SELECT_PICKER = $('.language');

$_SELECT_PICKER.find('option').each((idx, elem) => {
    const $OPTION = $(elem);
    const IMAGE_URL = $OPTION.attr('data-thumbnail');

    if (IMAGE_URL) {
        $OPTION.attr('data-content', "<img src='%i'/> %s".replace(/%i/, BASE_URL + IMAGE_URL).replace(/%s/, $OPTION.text()))
    }

    // console.warn('option:', idx, $OPTION)
});
$('select.selectpicker').selectpicker({
    caretIcon: 'fa fa-angle-down'
});

$_SELECT_PICKER.selectpicker();


function setCookie(cookie_name, value, days) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정

    var cookie_value = escape(value) + ((days == null) ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
}

function getCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');

    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}

function openMenu() {
    $(".m_menu .list").css("display", "flex");
}
function closeMenu() {
    $(".m_menu .list").css("display", "none");
}

function moveWhite() {
    let language = getCookie("WEX_language");
    switch (language) {
        case "ko":
            window.open("whitePaper/paper_Ver1.0_Kor.pdf");
            break;
        default:
            window.open("whitePaper/paper_Ver1.0_Eng.pdf");
            break;
    }
}
