/*jshint esversion: 6 */

let lexlang = 'en'; // English: 'en', German: 'de', Dutch: 'nl', Chinese: 'ch1', Chinese incl. English: 'ch2'

document.addEventListener("DOMContentLoaded", function() {
    basic_times.page_loaded = Date.now();
    document.getElementById('finished_id').addEventListener("touchstart", touchstart, false);
    document.getElementById('finished_id').addEventListener("touchend", touchend, false);
});

let timer;

function touchstart(e) {
    e.preventDefault();
    if (!timer) {
        timer = setTimeout(show_feed, 900);
    }
}

function touchend() {
    if (timer) {
        clearTimeout(timer);
    }
}

function lex_next() {
    window.lexstim_item = lextale_items.shift();
    document.getElementById('lexstim').textContent = lexstim_item.word;
    start_time = Date.now();
}

let basic_times = {};
let full_data;
let corr_word = 0;
let corr_nonword = 0;
let start_time = 0;
let bool_dict = {
    0: 'false',
    1: 'true'
};
let resp = {};

function lexclick(lexrespd) {
    lexstim_item.response_time = Date.now() - start_time;
    lexstim_item.response = lexrespd;
    console.log(lexstim_item);
    let corrresp = 'no';
    if (lexstim_item.wstatus === 1 && lexrespd === 'yes') {
        corrresp = 'yes';
        if (lexstim_item.dummy === 0) {
            corr_word++;
        }
    } else if (lexstim_item.wstatus === 0 && lexrespd === 'no') {
        corrresp = 'yes';
        if (lexstim_item.dummy === 0) {
            corr_nonword++;
        }
    }
    full_data += [lexstim_item.word,
        bool_dict[lexstim_item.wstatus],
        bool_dict[lexstim_item.dummy],
        lexstim_item.response,
        corrresp,
        lexstim_item.response_time
    ].join('\t') + '\n';

    document.activeElement.blur();
    if (lextale_items.length > 0) {
        lex_next();
    } else {
        document.getElementById('div_lex_main').style.display = 'none';
        document.getElementById('div_end').style.display = 'block';
        console.log(full_data);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "https://europe-west3-rosy-phalanx-346619.cloudfunctions.net/lacon-quest-2");

        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => console.log(xhr.responseText);

        let data = '{ "message": ' + full_data + ',}';
        xhr.send(data);
    }
}

function get_times() {
    basic_times.test_end = Date.now();
    console.log(basic_times);
    let t_full = basic_times.test_end - basic_times.intro_shown;
    let t_test = basic_times.test_end - basic_times.test_start;
    return '<br><br>Duration from instruction shown to test completed: ' +
        format_ms(t_full) + '<br>Duration of test part only: ' + format_ms(t_test);
}

function format_ms(milis) {
    var mins = Math.floor(milis / 1000 / 60);
    var secs = Math.round(milis / 1000 - (mins * 60)).toFixed();
    return '<b>' + mins + ' min ' + secs + ' s</b>';
}

function show_feed() {
    document.getElementById('div_end').style.display = 'none';
    document.getElementById('div_feed').style.display = 'block';
    document.getElementById('full_data_disp').innerHTML = full_data;
}

function images_loaded() {
    console.log('All images loaded.');
    document.getElementById('loading_id').style.display = 'none';
    document.getElementById('startbuttn').style.display = 'block';
}

function fillsrcs_ex(src, i) {
    let chked = "";
    if (i == 0 || i == 3) {
        chked = " checked";
    }
    return '<hr><li><input id="' + src +
        '_cb" type="checkbox" ' + chked + ' disabled> <label for="' + src +
        '_cb">' + (i + 1) +
        '. <img class="question_class" src="" alt="是汉字"></label></li>' +
        '<img class="ch_chars" id="' + src + '" src="" alt="Image could not be loaded!">';
}

function fillsrcs(src, i) {
    return '<hr><li><input id="' + src +
        '_cb" type="checkbox"> <label for="' + src +
        '_cb">' + (i + 1) +
        '. <img class="question_class" src="" alt="是汉字"></label></li>' +
        '<img class="ch_chars" id="' + src + '" src="" alt="Image could not be loaded!">';
}


function start() {
    let password = document.querySelector('input[name="password"]').value;
    if (password === "") {
        return;
    }
    console.log(password);

    let gen = document.querySelector('input[name="gen"]:checked');
    if (gen === null) {
        return;
    }
    console.log(gen.value);

    let bday = document.querySelector('input[name="bday"]').value;
    if (bday === "") {
        return;
    }
    console.log(bday);

    let mlan = document.querySelector('input[name="mlan"]').value;
    if (mlan === "") {
        return;
    }
    console.log(mlan);

    let fak = document.querySelector('input[name="fak"]').value;
    if (fak === "") {
        return;
    }
    console.log(fak);

    let gs = document.querySelector('input[name="gs"]').value;
    if (gs === "") {
        return;
    }
    console.log(gs);

    let izl = document.querySelector('input[name="izl"]').value;
    if (izl === "") {
        return;
    }
    console.log(izl);

    let pu = document.querySelector('input[name="pu"]').value;
    if (pu === "") {
        return;
    }
    console.log(pu);

    let engl = document.querySelector('#engl').value;
    console.log(engl);

    let ptime = document.querySelector('input[name="ptime"]:checked');
    if (ptime === null) {
        return;
    }
    console.log(ptime.value);


    
    document.getElementById('div_start').style.display = 'none';
    document.getElementById('div_lex_intro').style.display = 'block';

    
    full_data = ['Sifra: ' + password,
        'Spol: ' + gen.value,
        'Godina rodenha: ' + bday,
        'Materinski jezik: ' + mlan,
        'Fakultet: ' + fak,
        'Godina studija: ' + gs,
        'Navedite dob (u godinama starosti) početka izloženosti engleskom jeziku: ' + izl,
        'Navedite dob (u godinama starosti) u kojoj ste počeli učiti engleski jezik: ' + pu,
        'Odaberite tvrdnju koja najbolje opisuje Vaše znanje engleskog jezika: ' + engl,
        'Procijenite ukupno vrijeme koje provodite služeći se engleskim jezikom: ' + ptime.value,
        '\n'
    ].join('\n');

    full_data += ['word_shown',
        'valid',
        'dummy',
        'response',
        'correct',
        'response_time'
    ].join('\t') + '\n';
    window.lextale_items = lex_dict[lexlang];
    document.querySelectorAll('.lg_en').forEach((e) => {
        e.style.display = 'block';
    });
    basic_times.intro_shown = Date.now();
}

function lexmain() {
    basic_times.test_start = Date.now();
    document.getElementById('div_lex_intro').style.display = 'none';
    document.getElementById('div_lex_main').style.display = 'block';
    lex_next();
}

function copy_to_clip(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        return clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

function dl_as_file(filename_to_dl, data_to_dl) {
    let elemx = document.createElement('a');
    elemx.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data_to_dl);
    elemx.download = filename_to_dl;
    elemx.style.display = 'none';
    document.body.appendChild(elemx);
    elemx.click();
    document.body.removeChild(elemx);
}

function neat_date() {
    var m = new Date();
    return m.getFullYear() + "" + ("0" + (m.getMonth() + 1)).slice(-2) + "" + ("0" + m.getDate()).slice(-2) + "" + ("0" + m.getHours()).slice(-2) + "" + ("0" + m.getMinutes()).slice(-2) + "" + ("0" + m.getSeconds()).slice(-2);
}

const preload = src => new Promise(function(resolve, reject) {
    const img = document.getElementById(src);
    img.onload = function() {
        resolve(img);
    };
    img.onerror = reject;
    img.src = path_imgs + src;
});

const preloadAll = sources => Promise.all(sources.map(preload));
