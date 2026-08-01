// === КАЛЬКУЛЯТОР ПОТЕНЦИАЛЬНОГО ДОХОДА ===
const range = document.getElementById('clientsRange');
const clientsVal = document.getElementById('clientsVal');
const resClients = document.getElementById('resClients');
const resMoney = document.getElementById('resMoney');

range.addEventListener('input', (e) => {
    const val = e.target.value;
    clientsVal.textContent = val;
    
    // Формула: 15% возвращаются
    const returned = Math.round(val * 0.15);
    
    // Меняем слово "клиент" в зависимости от языка
    const clientWord = currentLang === 'est' ? 'klienti' : (currentLang === 'eng' ? 'clients' : 'клиентов');
    
    resClients.textContent = `~${returned} ${clientWord}`;
    resMoney.textContent = `${returned * 50} €`;
});


// === ЛОГИКА МУЛЬТИЯЗЫЧНОСТИ ===
let currentLang = 'est'; // Язык по умолчанию

const translations = {
    est: {
        nav: ["Kellele", "Kuidas see töötab", "Hinnad", "Kontakt"],
        heroTitle: "Automatiseerime teie autoteeninduse kliendihalduse.",
        heroDesc: "Kliendid unustavad hooldusaja? Meie süsteem saadab neile SMS-meeldetuletuse ja toob nad teie juurde tagasi – ilma kalli tarkvarata.",
        heroBtn: "Alusta tasuta pilooti",
        stat1: "Klientidest unustab tähtajalise õlivahetuse või rehvivahetuse",
        stat2: "Lisaseadmete või keerulise koolituse kulu",
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
        priceH: "Pilootprojekt",
        priceP: "Otsime esimest partnerit Eestis. Saate süsteemi tasuta kasutada, et aidata meil seda teie vajaduste järgi täiustada ja luua suurepärane tööriist.",
        priceBtn: "Liitu piloodiga",
        footerTop: "Võta ühendust",
        footerHeading: "Teeme teie teeninduse nutikamaks.",
        footerSub: "Kirjutage meile, et arutada koostööd ja saada esimeseks pilootpartneriks.",
        footerBtn: "Esita tellimust",
        linkPrivacy: "Privaatsus",
        linkTerms: "Kasutustingimused"
    },
    eng: {
        nav: ["For Whom", "How it works", "Pricing", "Contact"],
        heroTitle: "Automating customer management for your auto service.",
        heroDesc: "Customers forgetting maintenance? Our system sends them SMS reminders and brings them back – without expensive software.",
        heroBtn: "Start free pilot",
        stat1: "Of customers forget scheduled oil or tire changes",
        stat2: "Cost of additional hardware or complex training",
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
        priceH: "Pilot Project",
        priceP: "Looking for our first partner in Estonia. Use the system for free to help us tailor it to your needs and build an amazing tool.",
        priceBtn: "Join pilot",
        footerTop: "Get in touch",
        footerHeading: "Let's make your service smarter.",
        footerSub: "Write to us to discuss cooperation and become our first pilot partner.",
        footerBtn: "Place order",
        linkPrivacy: "Privacy",
        linkTerms: "Terms of Use"
    },
    rus: {
        nav: ["Для кого", "Как это работает", "Цены", "Контакт"],
        heroTitle: "Автоматизируем управление клиентами вашего автосервиса.",
        heroDesc: "Клиенты забывают вовремя делать ТО? Наша система отправит им SMS-напоминание и вернет к вам – без дорогого софта.",
        heroBtn: "Начать бесплатный пилот",
        stat1: "Клиентов забывают вовремя сменить масло или резину",
        stat2: "Затраты на оборудование или сложное обучение",
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
        priceH: "Пилотный проект",
        priceP: "Ищем первого партнера в Эстонии. Вы можете использовать систему бесплатно, помогая нам улучшить ее под ваши задачи.",
        priceBtn: "Участвовать в пилоте",
        footerTop: "Связаться с нами",
        footerHeading: "Сделаем ваш сервис умнее.",
        footerSub: "Напишите нам, чтобы обсудить сотрудничество и стать первым пилотным партнером.",
        footerBtn: "Оставить заявку",
        linkPrivacy: "Конфиденциальность",
        linkTerms: "Условия использования"
    }
};

function changeLang(lang) {
    currentLang = lang;
    
    // Обновляем визуальный статус кнопок языка
    document.getElementById('langEst').classList.remove('active');
    document.getElementById('langEng').classList.remove('active');
    document.getElementById('langRus').classList.remove('active');
    document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1)).classList.add('active');

    const t = translations[lang];

    // Перевод навигации (берёт ТОЛЬКО теги <a> внутри меню, игнорируя <div> логотип)
    const navLinks = document.querySelectorAll('#navMenu a');
    navLinks.forEach((link, index) => {
        link.textContent = t.nav[index];
    });

    // Перевод текстовых блоков
    document.getElementById('heroTitle').textContent = t.heroTitle;
    document.getElementById('heroDesc').textContent = t.heroDesc;
    document.getElementById('heroBtn').textContent = t.heroBtn;
    
    document.getElementById('stat1').textContent = t.stat1;
    document.getElementById('stat2').textContent = t.stat2;
    document.getElementById('stat3').textContent = t.stat3;
    
    document.getElementById('titleKellele').textContent = t.titleKellele;
    document.getElementById('kelleleH1').textContent = t.kelleleH1;
    document.getElementById('kelleleP1').textContent = t.kelleleP1;
    document.getElementById('kelleleH2').textContent = t.kelleleH2;
    document.getElementById('kelleleP2').textContent = t.kelleleP2;
    
    document.getElementById('titlePakume').textContent = t.titlePakume;
    document.getElementById('cardH1').textContent = t.cardH1;
    document.getElementById('cardP1').textContent = t.cardP1;
    document.getElementById('cardH2').textContent = t.cardH2;
    document.getElementById('cardP2').textContent = t.cardP2;
    document.getElementById('cardH3').textContent = t.cardH3;
    document.getElementById('cardP3').textContent = t.cardP3;
    
    document.getElementById('smsTitle').textContent = t.smsTitle;
    document.getElementById('smsText').textContent = t.smsText;
    
    document.getElementById('calcTitle').textContent = t.calcTitle;
    document.getElementById('calcLabel').textContent = t.calcLabel;
    document.getElementById('calcRes1').textContent = t.calcRes1;
    document.getElementById('calcRes2').textContent = t.calcRes2;
    
    document.getElementById('titleHinnad').textContent = t.titleHinnad;
    document.getElementById('priceH').textContent = t.priceH;
    document.getElementById('priceP').textContent = t.priceP;
    document.getElementById('priceBtn').textContent = t.priceBtn;
    
    document.getElementById('footerTop').textContent = t.footerTop;
    document.getElementById('footerHeading').textContent = t.footerHeading;
    document.getElementById('footerSub').textContent = t.footerSub;
    document.getElementById('footerBtn').textContent = t.footerBtn;
    
    document.getElementById('linkPrivacy').textContent = t.linkPrivacy;
    document.getElementById('linkTerms').textContent = t.linkTerms;

    // Имитируем событие input, чтобы калькулятор обновил слово "клиентов" на нужном языке
    range.dispatchEvent(new Event('input')); 
}

// === ЛОГИКА МОБИЛЬНОГО МЕНЮ (ГАМБУРГЕР) ===
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuBtn.classList.toggle('open');
    
    // Блокируем прокрутку страницы под открытым меню
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Закрываем меню при клике на любую ссылку в нем (включая текстовый логотип)
const navLinksItems = document.querySelectorAll('#navMenu a, .mobile-logo');
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
    });
});