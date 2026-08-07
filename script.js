const range = document.getElementById('clientsRange');
const clientsVal = document.getElementById('clientsVal');
const resClients = document.getElementById('resClients');
const resMoney = document.getElementById('resMoney');

if (range) {
    range.addEventListener('input', (e) => {
        const val = e.target.value;
        clientsVal.textContent = val;
        
        const returned = Math.round(val * 0.15);
        const clientWord = currentLang === 'est' ? 'klienti' : (currentLang === 'eng' ? 'clients' : 'клиентов');
        
        resClients.textContent = `~${returned} ${clientWord}`;
        resMoney.textContent = `${returned * 50} €`;
    });
}

// Забираем язык из памяти браузера
let currentLang = localStorage.getItem('siteLang') || 'est'; 

const translations = {
    est: {
        nav: ["Kellele", "Kuidas see töötab", "Hinnad", "Kontakt"],
        heroTitle: "Automatiseerime teie autoteeninduse kliendihalduse.",
        heroDesc: "Kliendid unustavad hooldusaja? Meie süsteem saadab neile SMS-meeldetuletuse ja toob nad teie juurde tagasi – ilma kalli tarkvarata.",
        heroBtn: "Alusta tasuta pilooti",
        stat1: "Klientidest unustab tähtajalise õlivahetuse või rehvivahetuse",
        stat2: "Piisab vaid arvutist või sülearvutist – lisaseadmeid pole vaja",  // ← изменено
        stat3: "Aega uue auto ja kliendi andmete sisestamiseks",
        titleKellele: "Kellele see loodud on?",
        kelleleH1: "Väikestele ja keskmistele töökodadele",
        kelleleP1: "Ideaalne lahendus autoteenindustele Eestis, kes kasutavad klientide arvestuseks märkmikku või Excelit ja ei soovi maksta sadu eurosid kuus keeruliste ERP-süsteemide (nagu Directo) eest.",
        kelleleH2: "Autoteeninduse meistritele ja omanikele",
        kelleleP2: "Säästke aega käsitöö arvelt. Süsteem hoiab meeles klientide ajalugu ja hoolitseb selle eest, et hooajalised tööd ja plaanilised hooldused ei ununeks.",
        titlePakume: "Kuidas süsteem toimib?",
        cardH1: "Minimaalne sisestus",
        cardP1: "Meister sisestab vaid auto numbri, tehtud töö ja kliendi telefoni. Edaspidi mäletab süsteem auto andmeid ise.",
        cardH2: "Nutikad SMS-id",
        cardP2: "Süsteem arvutab järgmise hoolduse kuupäeva ja saadab automaatselt isikupärastatud SMSi koos broneerimislingiga.",
        cardH3: "Kaitse topeltbroneeringute eest",
        cardP3: "Klient valib vaba aja ise. Süsteem kontrollib reaalajas graafikut ja välistab kattuvad ajad.",
        smsTitle: "Näide kliendile saadetavast SMS-ist:",
        smsText: "„Tere! 6 kuud tagasi hooldasime teie autot (Volvo, 123ABC). On aeg õlivahetuseks. Broneerige aeg siin: serviceremind.ee/b/auto“",
        calcTitle: "Arvutage oma potentsiaalne lisatulu",
        calcLabel: "Keskmiselt kliente kuus:",
        calcRes1: "Tagasi toodud kliente kuus",
        calcRes2: "Lisatulu kuus (hinnanguliselt)",
        
        titleHinnad: "Hinnakiri",
        priceH1: "Pilootprojekt",
        priceVal1: "Tasuta",
        priceP1: "Otsime esimest partnerit Eestis. Saate süsteemi tasuta kasutada, et aidata meil seda teie vajaduste järgi täiustada ja luua suurepärane tööriist.",
        priceBtn1: "Liitu piloodiga",
        priceH2: "Standard",
        priceVal2: "Arenduses",
        priceP2: "Täisväärtuslik pakett igapäevaseks tööks. Sisaldab automaatseid SMS-e, kalendrit ja kliendibaasi.",
        priceBtn2: "Varsti tulekul",
        
        footerTop: "Võta ühendust",
        footerHeading: "Teeme teie teeninduse nutikamaks.",
        footerSub: "Kirjutage meile, et arutada koostööd ja saada esimeseks pilootpartneriks.",
        footerBtn: "Esita tellimust",
        linkPrivacy: "Privaatsus",
        linkTerms: "Kasutustingimused",

        navBack: "← Tagasi",
        btnBack: "← Tagasi pealehele",
        policyContact: "Küsimuste korral võtke meiega ühendust:",
        privTitle: "Privaatsuspoliitika",
        privDesc: "Dokument on hetkel koostamisel ja täiendamisel seoses pilootprojekti käivitamisega. Kõiki kogutud andmeid töödeldakse konfidentsiaalselt ja rangelt teenuse toimimise eesmärgil.",
        termsTitle: "Kasutustingimused",
        termsDesc: "Dokument on hetkel koostamisel ja täiendamisel seoses pilootprojekti käivitamisega. Teenuse kasutamine toimub hetkel pilootprojekti raames kokkuleppel partneritega."
    },
    eng: {
        nav: ["For Whom", "How it works", "Pricing", "Contact"],
        heroTitle: "Automating customer management for your auto service.",
        heroDesc: "Customers forgetting maintenance? Our system sends them SMS reminders and brings them back – without expensive software.",
        heroBtn: "Start free pilot",
        stat1: "Of customers forget scheduled oil or tire changes",
        stat2: "Only a computer or laptop is enough – no extra hardware needed",  // ← изменено
        stat3: "Time to enter a new car and client details",
        titleKellele: "Who is this built for?",
        kelleleH1: "For small and medium repair shops",
        kelleleP1: "An ideal solution for auto services that track clients via notebooks or Excel and don't want to pay hundreds per month for complex ERP systems.",
        kelleleH2: "For service masters and owners",
        kelleleP2: "Save time on manual work. The system remembers customer history and ensures seasonal and planned maintenance are never forgotten.",
        titlePakume: "How does the system work?",
        cardH1: "Minimal input",
        cardP1: "The master enters only the car number, performed service, and client phone. The system remembers the car details thereafter.",
        cardH2: "Smart SMS",
        cardP2: "The system calculates the next maintenance date and automatically sends a personalized SMS with a booking link.",
        cardH3: "Double-booking protection",
        cardP3: "Clients pick available slots themselves. The system checks the schedule in real-time and prevents overlaps.",
        smsTitle: "Example of SMS sent to client:",
        smsText: "\"Hello! 6 months ago we serviced your car (Volvo, 123ABC). It's time for an oil change. Book your time here: serviceremind.ee/b/auto\"",
        calcTitle: "Calculate your potential extra revenue",
        calcLabel: "Average clients per month:",
        calcRes1: "Clients brought back monthly",
        calcRes2: "Monthly extra revenue (estimated)",
        
        titleHinnad: "Pricing",
        priceH1: "Pilot Project",
        priceVal1: "Free",
        priceP1: "Looking for our first partner in Estonia. Use the system for free to help us tailor it to your needs and build an amazing tool.",
        priceBtn1: "Join pilot",
        priceH2: "Standard",
        priceVal2: "In development",
        priceP2: "Full-featured package for daily work. Includes automated SMS, calendar, and client base.",
        priceBtn2: "Coming soon",

        footerTop: "Get in touch",
        footerHeading: "Let's make your service smarter.",
        footerSub: "Write to us to discuss cooperation and become our first pilot partner.",
        footerBtn: "Place order",
        linkPrivacy: "Privacy",
        linkTerms: "Terms of Use",

        navBack: "← Back",
        btnBack: "← Back to main page",
        policyContact: "If you have any questions, contact us:",
        privTitle: "Privacy Policy",
        privDesc: "This document is currently being drafted and updated in connection with the launch of the pilot project. All collected data is treated confidentially and strictly for the purpose of service operation.",
        termsTitle: "Terms of Use",
        termsDesc: "This document is currently being drafted and updated in connection with the launch of the pilot project. Use of the service is currently subject to agreement with partners within the pilot project."
    },
    rus: {
        nav: ["Для кого", "Как это работает", "Цены", "Контакт"],
        heroTitle: "Автоматизируем управление клиентами вашего автосервиса.",
        heroDesc: "Клиенты забывают вовремя делать ТО? Наша система отправит им SMS-напоминание и вернет к вам – без дорогого софта.",
        heroBtn: "Начать бесплатный пилот",
        stat1: "Клиентов забывают вовремя сменить масло или резину",
        stat2: "Достаточно только компьютера или ноутбука – дополнительное оборудование не требуется",  // ← изменено
        stat3: "Время на ввод нового авто и данных клиента",
        titleKellele: "Для кого это создано?",
        kelleleH1: "Для малых и средних автосервисов",
        kelleleP1: "Идеальное решение для мастерских, использующих блокноты или Excel и не желающих платить сотни евро в месяц за сложные ERP-системы.",
        kelleleH2: "Для мастеров и владельцев сервисов",
        kelleleP2: "Экономьте время на рутине. Система хранит историю клиентов и следит за тем, чтобы сезонные и плановые ТО не забывались.",
        titlePakume: "Как работает система?",
        cardH1: "Минимум ввода",
        cardP1: "Мастер вводит лишь номер авто, выполненную работу и телефон клиента. Дальше система помнит данные сама.",
        cardH2: "Умные SMS",
        cardP2: "Система рассчитывает дату следующего ТО и автоматически отправляет персонализированное SMS со ссылкой на запись.",
        cardH3: "Защита от двойной записи",
        cardP3: "Клиент выбирает свободное время сам. Система проверяет график в реальном времени и исключает пересечения.",
        smsTitle: "Пример SMS для клиента:",
        smsText: "«Здравствуйте! 6 месяцев назад мы обслуживали ваш автомобиль (Volvo, 123ABC). Пришло время для замены масла. Забронируйте время здесь: serviceremind.ee/b/auto»",
        calcTitle: "Рассчитайте ваш потенциальный дополнительный доход",
        calcLabel: "В среднем клиентов в месяц:",
        calcRes1: "Вернувшихся клиентов в месяц",
        calcRes2: "Доп. доход в месяц (оценка)",
        
        titleHinnad: "Цены",
        priceH1: "Пилотный проект",
        priceVal1: "Бесплатно",
        priceP1: "Ищем первого партнера в Эстонии. Вы можете использовать систему бесплатно, помогая нам улучшить ее под ваши задачи.",
        priceBtn1: "Участвовать в пилоте",
        priceH2: "Стандарт",
        priceVal2: "В разработке",
        priceP2: "Полноценный пакет для ежедневной работы. Включает автоматические SMS, календарь и базу клиентов.",
        priceBtn2: "Скоро",

        footerTop: "Связаться с нами",
        footerHeading: "Сделаем ваш сервис умнее.",
        footerSub: "Напишите нам, чтобы обсудить сотрудничество и стать первым пилотным партнером.",
        footerBtn: "Оставить заявку",
        linkPrivacy: "Конфиденциальность",
        linkTerms: "Условия использования",

        navBack: "← Назад",
        btnBack: "← Назад на главную",
        policyContact: "Если у вас есть вопросы, свяжитесь с нами:",
        privTitle: "Политика конфиденциальности",
        privDesc: "Документ в настоящее время составляется и дополняется в связи с запуском пилотного проекта. Все собранные данные обрабатываются конфиденциально и строго в целях работы сервиса.",
        termsTitle: "Условия использования",
        termsDesc: "Документ в настоящее время составляется и дополняется в связи с запуском пилотного проекта. Использование сервиса в настоящее время осуществляется по согласованию с партнерами в рамках пилотного проекта."
    }
};

function changeLang(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
    
    const langEst = document.getElementById('langEst');
    const langEng = document.getElementById('langEng');
    const langRus = document.getElementById('langRus');
    
    if (langEst) langEst.classList.remove('active');
    if (langEng) langEng.classList.remove('active');
    if (langRus) langRus.classList.remove('active');
    
    const activeLangBtn = document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1));
    if (activeLangBtn) activeLangBtn.classList.add('active');

    const t = translations[lang];
    if (!t) return;

    const navLinks = document.querySelectorAll('#navMenu a');
    if (navLinks.length > 0 && t.nav) {
        navLinks.forEach((link, index) => {
            if (t.nav[index]) link.textContent = t.nav[index];
        });
    }

    const setEl = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setEl('heroTitle', t.heroTitle);
    setEl('heroDesc', t.heroDesc);
    setEl('heroBtn', t.heroBtn);
    
    setEl('stat1', t.stat1);
    setEl('stat2', t.stat2);
    setEl('stat3', t.stat3);
    
    setEl('titleKellele', t.titleKellele);
    setEl('kelleleH1', t.kelleleH1);
    setEl('kelleleP1', t.kelleleP1);
    setEl('kelleleH2', t.kelleleH2);
    setEl('kelleleP2', t.kelleleP2);
    
    setEl('titlePakume', t.titlePakume);
    setEl('cardH1', t.cardH1);
    setEl('cardP1', t.cardP1);
    setEl('cardH2', t.cardH2);
    setEl('cardP2', t.cardP2);
    setEl('cardH3', t.cardH3);
    setEl('cardP3', t.cardP3);
    
    setEl('smsTitle', t.smsTitle);
    setEl('smsText', t.smsText);
    
    setEl('calcTitle', t.calcTitle);
    setEl('calcLabel', t.calcLabel);
    setEl('calcRes1', t.calcRes1);
    setEl('calcRes2', t.calcRes2);
    
    setEl('titleHinnad', t.titleHinnad);
    
    setEl('priceH1', t.priceH1);
    setEl('priceVal1', t.priceVal1);
    setEl('priceP1', t.priceP1);
    setEl('priceBtn1', t.priceBtn1);

    setEl('priceH2', t.priceH2);
    setEl('priceVal2', t.priceVal2);
    setEl('priceP2', t.priceP2);
    setEl('priceBtn2', t.priceBtn2);
    
    setEl('footerTop', t.footerTop);
    setEl('footerHeading', t.footerHeading);
    setEl('footerSub', t.footerSub);
    setEl('footerBtn', t.footerBtn);
    
    setEl('linkPrivacy', t.linkPrivacy);
    setEl('linkTerms', t.linkTerms);

    setEl('navBack', t.navBack);
    setEl('btnBack', t.btnBack);
    setEl('policyContact', t.policyContact);
    setEl('privTitle', t.privTitle);
    setEl('privDesc', t.privDesc);
    setEl('termsTitle', t.termsTitle);
    setEl('termsDesc', t.termsDesc);

    if (range) range.dispatchEvent(new Event('input')); 
}

document.addEventListener('DOMContentLoaded', () => {
    changeLang(currentLang);
});

const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuBtn.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    const navLinksItems = document.querySelectorAll('#navMenu a, .mobile-logo');
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// --- АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ---
const elementsToAnimate = document.querySelectorAll(
    '.stat-item, .pricing-card, .text-block, .card, .calculator-box'
);
elementsToAnimate.forEach(el => el.classList.add('animate-on-scroll'));

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animationObserver.observe(el);
});