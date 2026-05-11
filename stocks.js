// BIST hisse listesi — ticker, tam ad, arama aliasları
export const STOCKS = [
  { ticker: 'AKBNK', name: 'Akbank', aliases: ['akbank', 'ak bank', 'ak banka'] },
  { ticker: 'ARCLK', name: 'Arçelik', aliases: ['arcelik', 'arçelik', 'arcelik as'] },
  { ticker: 'ASELS', name: 'Aselsan', aliases: ['aselsan', 'asels'] },
  { ticker: 'ASTOR', name: 'Astor Enerji', aliases: ['astor', 'astor enerji'] },
  { ticker: 'BIMAS', name: 'BİM', aliases: ['bim', 'bimas', 'bim mağazaları', 'bim magazalari'] },
  { ticker: 'DOHOL', name: 'Doğan Holding', aliases: ['dogan holding', 'doğan holding', 'dohol'] },
  { ticker: 'EKGYO', name: 'Emlak Konut GYO', aliases: ['emlak konut', 'emlak gyo', 'ekgyo'] },
  { ticker: 'ENKAI', name: 'Enka İnşaat', aliases: ['enka', 'enkai', 'enka insaat', 'enka inşaat'] },
  { ticker: 'EREGL', name: 'Ereğli Demir Çelik', aliases: ['eregli', 'ereğli', 'erdemir', 'eregli demir'] },
  { ticker: 'FROTO', name: 'Ford Otosan', aliases: ['ford', 'ford otosan', 'froto'] },
  { ticker: 'GARAN', name: 'Garanti Bankası', aliases: ['garanti', 'garanti bankasi', 'garanti banka', 'garan'] },
  { ticker: 'HEKTS', name: 'Hektaş', aliases: ['hektas', 'hektaş'] },
  { ticker: 'ISCTR', name: 'İş Bankası', aliases: ['is bankasi', 'iş bankası', 'isbank', 'işbank', 'isctr'] },
  { ticker: 'KCHOL', name: 'Koç Holding', aliases: ['koc holding', 'koç holding', 'koc', 'kochol'] },
  { ticker: 'KOZAL', name: 'Koza Altın', aliases: ['koza altin', 'koza altın', 'kozal', 'koza gold'] },
  { ticker: 'KOZAA', name: 'Koza Anadolu Metal', aliases: ['koza anadolu', 'kozaa'] },
  { ticker: 'KRDMD', name: 'Kardemir', aliases: ['kardemir', 'krdmd'] },
  { ticker: 'LOGO',  name: 'Logo Yazılım', aliases: ['logo', 'logo yazilim', 'logo yazılım'] },
  { ticker: 'MGROS', name: 'Migros', aliases: ['migros', 'mgros'] },
  { ticker: 'ODAS',  name: 'Odaş Elektrik', aliases: ['odas', 'odaş', 'odas elektrik'] },
  { ticker: 'PETKM', name: 'Petkim', aliases: ['petkim', 'petkm'] },
  { ticker: 'PGSUS', name: 'Pegasus', aliases: ['pegasus', 'pgsus'] },
  { ticker: 'SAHOL', name: 'Sabancı Holding', aliases: ['sabanci', 'sabancı', 'sahol', 'sabanci holding'] },
  { ticker: 'SASA',  name: 'SASA Polyester', aliases: ['sasa', 'sasa polyester'] },
  { ticker: 'SISE',  name: 'Şişe Cam', aliases: ['sise', 'sişe cam', 'sisecam', 'şişecam'] },
  { ticker: 'TAVHL', name: 'TAV Havalimanları', aliases: ['tav', 'tavhl', 'tav havalimanlari'] },
  { ticker: 'TCELL', name: 'Turkcell', aliases: ['turkcell', 'tcell'] },
  { ticker: 'THYAO', name: 'Türk Hava Yolları', aliases: ['thy', 'turk hava yollari', 'türk hava yolları', 'turkish airlines', 'thyao'] },
  { ticker: 'TOASO', name: 'Tofaş', aliases: ['tofas', 'tofaş', 'toaso'] },
  { ticker: 'TTKOM', name: 'Türk Telekom', aliases: ['turk telekom', 'türk telekom', 'ttkom', 'telekom'] },
  { ticker: 'TUPRS', name: 'Tüpraş', aliases: ['tupras', 'tüpraş', 'tuprs'] },
  { ticker: 'YKBNK', name: 'Yapı Kredi Bankası', aliases: ['yapi kredi', 'yapı kredi', 'ykbnk', 'yapi kredi bankasi'] },
  { ticker: 'CCOLA', name: 'Coca Cola İçecek', aliases: ['coca cola', 'ccola', 'coca cola icecek'] },
  { ticker: 'AGHOL', name: 'AG Anadolu Grubu', aliases: ['anadolu grubu', 'ag holding', 'aghol'] },
  { ticker: 'ALARK', name: 'Alarko Holding', aliases: ['alarko', 'alark'] },
  { ticker: 'ALBRK', name: 'Albaraka Türk', aliases: ['albaraka', 'albrk'] },
  { ticker: 'ANACM', name: 'Anadolu Cam', aliases: ['anadolu cam', 'anacm'] },
  { ticker: 'ASUZU', name: 'Anadolu Isuzu', aliases: ['isuzu', 'anadolu isuzu', 'asuzu'] },
  { ticker: 'AYDEM', name: 'Aydem Enerji', aliases: ['aydem', 'aydem enerji'] },
  { ticker: 'AYEN',  name: 'Aydem Yenilenebilir', aliases: ['aydem yenilenebilir', 'ayen'] },
  { ticker: 'BERA',  name: 'Bera Holding', aliases: ['bera', 'bera holding'] },
  { ticker: 'BRSAN', name: 'Borçelik', aliases: ['borcelik', 'borçelik', 'brsan'] },
  { ticker: 'CANTE', name: 'Çan2 Termik', aliases: ['can2', 'cante'] },
  { ticker: 'DEVA',  name: 'Deva Holding', aliases: ['deva', 'deva holding'] },
  { ticker: 'ECILC', name: 'Eczacıbaşı İlaç', aliases: ['eczacibasi ilac', 'ecilc'] },
  { ticker: 'EGEEN', name: 'Ege Endüstri', aliases: ['ege endustri', 'egeen'] },
  { ticker: 'ENJSA', name: 'Enerjisa', aliases: ['enerjisa', 'enjsa'] },
  { ticker: 'ERBOS', name: 'Erbosan', aliases: ['erbosan', 'erbos'] },
  { ticker: 'EREGL', name: 'Ereğli Demir Çelik', aliases: ['erdemir', 'eregli'] },
  { ticker: 'EUPWR', name: 'Europower Enerji', aliases: ['europower', 'eupwr'] },
  { ticker: 'FENER', name: 'Fenerbahçe', aliases: ['fenerbahce', 'fenerbahçe', 'fener'] },
  { ticker: 'GSDHO', name: 'GSD Holding', aliases: ['gsd', 'gsdho'] },
  { ticker: 'GUBRF', name: 'Gübre Fabrikaları', aliases: ['gubre', 'gübre', 'gubrf'] },
  { ticker: 'IPEKE', name: 'İpek Doğal Enerji', aliases: ['ipek', 'ipeke'] },
  { ticker: 'ISDMR', name: 'İskenderun Demir', aliases: ['iskenderun demir', 'isdmr', 'isdemir'] },
  { ticker: 'ISGYO', name: 'İş GYO', aliases: ['is gyo', 'iş gyo', 'isgyo'] },
  { ticker: 'ISGSY', name: 'İş Girişim', aliases: ['is girisim', 'isgsy'] },
  { ticker: 'KAREL', name: 'Karel Elektronik', aliases: ['karel', 'karel elektronik'] },
  { ticker: 'KONTR', name: 'Kontrolmatik', aliases: ['kontrolmatik', 'kontr'] },
  { ticker: 'KORDS', name: 'Kordsa', aliases: ['kordsa', 'kords'] },
  { ticker: 'KRONT', name: 'Kronos', aliases: ['kronos', 'kront'] },
  { ticker: 'MAVI',  name: 'Mavi Giyim', aliases: ['mavi', 'mavi giyim'] },
  { ticker: 'NETAS', name: 'Netaş Telekomünikasyon', aliases: ['netas', 'netaş'] },
  { ticker: 'NTHOL', name: 'Net Holding', aliases: ['net holding', 'nthol'] },
  { ticker: 'OTKAR', name: 'Otokar', aliases: ['otokar', 'otkar'] },
  { ticker: 'OYAKC', name: 'Oyak Çimento', aliases: ['oyak cimento', 'oyak çimento', 'oyakc'] },
  { ticker: 'PARSN', name: 'Parsan', aliases: ['parsan', 'parsn'] },
  { ticker: 'PEKGY', name: 'Pek GYO', aliases: ['pek gyo', 'pekgy'] },
  { ticker: 'SELEC', name: 'Selçuk Ecza', aliases: ['selcuk ecza', 'selçuk ecza', 'selec'] },
  { ticker: 'SMRTG', name: 'Smart Güneş', aliases: ['smart gunes', 'smrtg'] },
  { ticker: 'SOKM',  name: 'Şok Marketler', aliases: ['sok', 'şok', 'sok market', 'sokm'] },
  { ticker: 'TATGD', name: 'Tat Gıda', aliases: ['tat gida', 'tat gıda', 'tatgd'] },
  { ticker: 'TCELL', name: 'Turkcell', aliases: ['turkcell'] },
  { ticker: 'TKFEN', name: 'Tekfen Holding', aliases: ['tekfen', 'tkfen'] },
  { ticker: 'TOASO', name: 'Tofaş', aliases: ['tofas', 'tofaş'] },
  { ticker: 'TRGYO', name: 'Torunlar GYO', aliases: ['torunlar', 'trgyo'] },
  { ticker: 'TRILC', name: 'Türkiye İş Leasing', aliases: ['is leasing', 'trilc'] },
  { ticker: 'TTRAK', name: 'Türk Traktör', aliases: ['turk traktor', 'türk traktör', 'ttrak'] },
  { ticker: 'TUKAS', name: 'Tukaş', aliases: ['tukas', 'tukaş'] },
  { ticker: 'ULKER', name: 'Ülker', aliases: ['ulker', 'ülker'] },
  { ticker: 'VESTL', name: 'Vestel', aliases: ['vestel'] },
  { ticker: 'YEOTK', name: 'Yeo Teknoloji', aliases: ['yeo', 'yeotk'] },
  { ticker: 'YYLGD', name: 'Yayla Agro', aliases: ['yayla agro', 'yylgd'] },
  { ticker: 'ZRGYO', name: 'Ziraat GYO', aliases: ['ziraat gyo', 'zrgyo'] },
];

// Hisse bul — ticker veya şirket adıyla
export function findStock(query) {
  const q = query.toLowerCase().trim()
    .replace(/[^a-z0-9ğüşıöçğ ]/gi, '')
    .trim();

  // 1. Tam ticker eşleşmesi
  const byTicker = STOCKS.find(s => s.ticker.toLowerCase() === q);
  if (byTicker) return byTicker;

  // 2. Tam isim eşleşmesi
  const byName = STOCKS.find(s => s.name.toLowerCase() === q);
  if (byName) return byName;

  // 3. Alias eşleşmesi
  const byAlias = STOCKS.find(s => s.aliases.includes(q));
  if (byAlias) return byAlias;

  // 4. Kısmi eşleşme (ticker veya isim içeriyor mu)
  const partial = STOCKS.find(s =>
    s.ticker.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.aliases.some(a => a.includes(q) || q.includes(a))
  );
  return partial || null;
}
