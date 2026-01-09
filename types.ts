
export type Language = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ru' | 'zh' | 'ja' | 'hi';

export interface Translations {
  pref: string; unit: string; lang: string; formato: string; load: string;
  port: string; land: string; width_cm: string; height_cm: string;
  width: string; height: string; m_label: string; ov_label: string;
  m_sup: string; m_inf: string; m_esq: string; m_dir: string;
  poster_title: string; align_title: string; mode_res: string;
  mode_total: string; mode_pages: string; mode_perc: string;
  pg_w: string; pg_h: string; save: string; success: string;
  pages_txt: string; overwrite: string; custom: string;
  file_suffix: string; pdf_success: string; yes: string; no: string; error: string;
}

export const LANGS: Record<Language, Translations> = {
  pt: {
    pref: 'Preferências', unit: 'Unidade', lang: 'Idioma', formato: 'Formato de papel', load: 'Abrir Imagem',
    port: 'Retrato', land: 'Paisagem', width_cm: 'Largura (cm)', height_cm: 'Altura (cm)',
    width: 'Largura', height: 'Altura', m_label: 'Margens da folha (cm)', ov_label: 'Superposição (cm)',
    m_sup: 'Superior', m_inf: 'Inferior', m_esq: 'Esquerda', m_dir: 'Direita',
    poster_title: 'Tamanho do Pôster', align_title: 'Alinhamento da Imagem',
    mode_res: 'Tamanho em resolução Real (DPI)', mode_total: 'Tamanho total',
    mode_pages: 'Tamanho em páginas', mode_perc: 'Tamanho em porcentagem (%)',
    pg_w: 'Páginas na largura', pg_h: 'Páginas na altura',
    save: 'GERAR PDF', success: 'Sucesso!', pages_txt: 'páginas',
    overwrite: 'já existe.\nDeseja substituí-lo?', custom: 'Personalizar',
    file_suffix: '- Múltiplas páginas', pdf_success: 'PDF salvo com {} páginas.',
    yes: 'Sim', no: 'Não', error: 'Erro'
  },
  en: {
    pref: 'Preferences', unit: 'Unit', lang: 'Language', formato: 'Paper Format', load: 'Open Image',
    port: 'Portrait', land: 'Landscape', width_cm: 'Width (cm)', height_cm: 'Height (cm)',
    width: 'Width', height: 'Height', m_label: 'Sheet Margins (cm)', ov_label: 'Overlap (cm)',
    m_sup: 'Top', m_inf: 'Bottom', m_esq: 'Left', m_dir: 'Right',
    poster_title: 'Poster Size', align_title: 'Image Alignment',
    mode_res: 'Real Resolution (DPI)', mode_total: 'Total size',
    mode_pages: 'Size in pages', mode_perc: 'Size in percentage (%)',
    pg_w: 'Pages across', pg_h: 'Pages down',
    save: 'GENERATE PDF', success: 'Success!', pages_txt: 'pages',
    overwrite: 'already exists.\nOverwrite?', custom: 'Custom',
    file_suffix: '- Multiple pages', pdf_success: 'PDF saved with {} pages.',
    yes: 'Yes', no: 'No', error: 'Error'
  },
  es: { pref: 'Preferencias', unit: 'Unidad', lang: 'Idioma', formato: 'Formato de papel', load: 'Abrir Imagen', port: 'Retrato', land: 'Paisaje', width_cm: 'Ancho (cm)', height_cm: 'Altura (cm)', width: 'Ancho', height: 'Altura', m_label: 'Márgenes de hoja', ov_label: 'Superposición', m_sup: 'Superior', m_inf: 'Inferior', m_esq: 'Izquierda', m_dir: 'Derecha', poster_title: 'Tamaño del Póster', align_title: 'Alineación', mode_res: 'Resolución Real', mode_total: 'Tamaño total', mode_pages: 'Páginas', mode_perc: 'Porcentaje', pg_w: 'Páginas ancho', pg_h: 'Páginas alto', save: 'GENERAR PDF', success: '¡Éxito!', pages_txt: 'páginas', overwrite: '¿Sobrescribir?', custom: 'Personalizar', file_suffix: '- Varias páginas', pdf_success: 'PDF guardado.', yes: 'Sí', no: 'No', error: 'Error' },
  fr: { pref: 'Préférences', unit: 'Unité', lang: 'Langue', formato: 'Format de papier', load: 'Ouvrir Image', port: 'Portrait', land: 'Paysage', width_cm: 'Largeur (cm)', height_cm: 'Hauteur (cm)', width: 'Largeur', height: 'Hauteur', m_label: 'Marges', ov_label: 'Superposition', m_sup: 'Haut', m_inf: 'Bas', m_esq: 'Gauche', m_dir: 'Droite', poster_title: 'Tamanho du Poster', align_title: 'Alignement', mode_res: 'Résolution Réelle', mode_total: 'Tamanho total', mode_pages: 'Pages', mode_perc: 'Pourcentage', pg_w: 'Pages largura', pg_h: 'Pages hauteur', save: 'GÉNÉRER PDF', success: 'Succès!', pages_txt: 'pages', overwrite: 'Remplacer?', custom: 'Personnaliser', file_suffix: '- Pages multiples', pdf_success: 'PDF enregistré.', yes: 'Oui', no: 'Non', error: 'Erreur' },
  de: { pref: 'Einstellungen', unit: 'Einheit', lang: 'Sprache', formato: 'Papierformat', load: 'Bild öffnen', port: 'Hochformat', land: 'Querformat', width_cm: 'Breite (cm)', height_cm: 'Höhe (cm)', width: 'Breite', height: 'Höhe', m_label: 'Ränder', ov_label: 'Überlappung', m_sup: 'Oben', m_inf: 'Unten', m_esq: 'Links', m_dir: 'Rechts', poster_title: 'Postergröße', align_title: 'Ausrichtung', mode_res: 'Originalauflösung', mode_total: 'Gesamtgröße', mode_pages: 'Größe in Seiten', mode_perc: 'Prozentsatz', pg_w: 'Seiten Breite', pg_h: 'Seiten Höhe', save: 'PDF GENERIEREN', success: 'Erfolg!', pages_txt: 'Seiten', overwrite: 'Ersetzen?', custom: 'Anpassen', file_suffix: '- Mehrere Seiten', pdf_success: 'PDF gespeichert.', yes: 'Ja', no: 'Nein', error: 'Fehler' },
  it: { pref: 'Preferenze', unit: 'Unità', lang: 'Lingua', formato: 'Formato carta', load: 'Apri Immagine', port: 'Ritratto', land: 'Paesaggio', width_cm: 'Larghezza (cm)', height_cm: 'Altezza (cm)', width: 'Larghezza', height: 'Altezza', m_label: 'Margini', ov_label: 'Sovrapposizione', m_sup: 'Superiore', m_inf: 'Inferiore', m_esq: 'Sinistra', m_dir: 'Destra', poster_title: 'Dimensione Poster', align_title: 'Allineamento', mode_res: 'Risoluzione Reale', mode_total: 'Tamanho total', mode_pages: 'Dimensione in pagine', mode_perc: 'Percentuale', pg_w: 'Pagine larghezza', pg_h: 'Pagine altezza', save: 'GENERA PDF', success: 'Successo!', pages_txt: 'pagine', overwrite: 'Sostituire?', custom: 'Personalizza', file_suffix: '- Pagine multiple', pdf_success: 'PDF salvato.', yes: 'Sì', no: 'No', error: 'Errore' },
  ru: { pref: 'Настройки', unit: 'Единица', lang: 'Язык', formato: 'Формат бумаги', load: 'Открыть', port: 'Портрет', land: 'Пейзаж', width_cm: 'Ширина (см)', height_cm: 'Высота (см)', width: 'Ширина', height: 'Высота', m_label: 'Поля', ov_label: 'Перекрытие', m_sup: 'Верх', m_inf: 'Низ', m_esq: 'Слева', m_dir: 'Справа', poster_title: 'Размер плаката', align_title: 'Выравнивание', mode_res: 'Реальное разрешение', mode_total: 'Tamanho total', mode_pages: 'Размер в страницах', mode_perc: 'Процент', pg_w: 'Страниц в ширину', pg_h: 'Страниц в высоту', save: 'СОЗДАТЬ PDF', success: 'Успех!', pages_txt: 'страниц', overwrite: 'Заменить?', custom: 'Настроить', file_suffix: '- Несколько страниц', pdf_success: 'PDF сохранен.', yes: 'Да', no: 'Нет', error: 'ошибка' },
  zh: { pref: '偏好设置', unit: '单位', lang: '语言', formato: '纸张格式', load: '打开图片', port: '纵向', land: '横向', width_cm: '宽度 (cm)', height_cm: '高度 (cm)', width: '宽度', height: '高度', m_label: '页边距', ov_label: '重叠', m_sup: '上', m_inf: '下', m_esq: '左', m_dir: '右', poster_title: '海报尺寸', align_title: '对齐方式', mode_res: '真实分辨率', mode_total: 'Tamanho total', mode_pages: '页面数量', mode_perc: '百分比', pg_w: '横向页面', pg_h: '纵向页面', save: '生成 PDF', success: '成功！', pages_txt: '页', overwrite: '覆盖现有文件？', custom: '自定义', file_suffix: '- 多页', pdf_success: 'PDF 已保存。', yes: '是', no: '否', error: '错误' },
  ja: { pref: '設定', unit: '単位', lang: '言語', formato: '用紙サイズ', load: '画像を開く', port: '縦', land: '横', width_cm: '幅 (cm)', height_cm: '高さ (cm)', width: '幅', height: '高さ', m_label: '余白', ov_label: '重なり', m_sup: '上', m_inf: '下', m_esq: '左', m_dir: '右', poster_title: 'ポスターのサイズ', align_title: '配置', mode_res: '実解像度', mode_total: 'Tamanho total', mode_pages: 'ページ数', mode_perc: 'パーセンテージ', pg_w: '横のページ数', pg_h: '縦 de ページ数', save: 'PDF作成', success: '成功！', pages_txt: 'ページ', overwrite: '上書きしますか？', custom: 'カスタム', file_suffix: '- 複数ページ', pdf_success: 'PDFが保存されました。', yes: 'はい', no: 'いいえ', error: 'エラー' },
  hi: { pref: 'वरीयताएँ', unit: 'इकाई', lang: 'भाषा', formato: 'कागज का आकार', load: 'छवि खोलें', port: 'पोर्ट्रेट', land: 'लैंडस्केp', width_cm: 'चौड़ाई (cm)', height_cm: 'ऊंचाई (cm)', width: 'चौड़ाई', height: 'ऊंचाई', m_label: 'मार्जिन', ov_label: 'ओवरलैप', m_sup: 'ऊper', m_inf: 'नीche', m_esq: 'बाएं', m_dir: 'daएं', poster_title: 'पोster का आकार', align_title: 'संरेखण', mode_res: 'वास्तविक रिज़ॉल्यूशन', mode_total: 'Tamanho total', mode_pages: 'पृष्ठों में आकार', mode_perc: 'प्रतिशत', pg_w: 'चौड़ाई में पृष्ठ', pg_h: 'ऊंचाई में पृष्ठ', save: 'PDF बनाएँ', success: 'सफलता!', pages_txt: 'पृष्ठ', overwrite: 'क्या आप बदलना चाहते हैं?', custom: 'कस्टम', file_suffix: '- एकाधिक पृष्ठ', pdf_success: 'PDF {} पृष्ठों के साथ सहेja गया।', yes: 'हाँ', no: 'não', error: 'त्रुटि' }
};

export const PAPER_DATA: Record<string, [number, number]> = {
  "A0": [841, 1189],
  "A1": [594, 841],
  "A2": [420, 594],
  "A3": [297, 420],
  "A4": [210, 297],
  "A5": [148, 210],
  "A6": [105, 148],
  "A7": [74, 105],
  "A8": [52, 74],
  "B0": [1000, 1414],
  "B1": [707, 1000],
  "B2": [500, 707],
  "B3": [353, 500],
  "B4": [250, 353],
  "B5": [176, 250],
  "Letter": [215.9, 279.4],
  "Legal": [215.9, 355.6],
  "Tabloid": [279.4, 431.8],
  "Ledger": [431.8, 279.4],
  "Junior Legal": [127, 203.2],
  "Half Letter": [139.7, 215.9],
  "Executive": [184.1, 266.7],
  "Folio": [215.9, 330.2],
  "Statement": [139.7, 215.9],
  "Government Letter": [203.2, 266.7],
  "Government Legal": [215.9, 330.2],
  "Custom": [0, 0]
};

export const UNIT_CONV: Record<string, number> = {
  'cm': 10.0,
  'mm': 1.0,
  'm': 1000.0,
  'in': 25.4,
  'ft': 304.8,
  'pt': 0.3527,
  'px': 0.2645
};
