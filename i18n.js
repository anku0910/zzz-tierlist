/**
 * i18n system for TheWeb ZZZ Tier List Maker
 * Supports: zh-TW, en, ja, ko
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'zzz-tierlist-locale';
  const SUPPORTED_LOCALES = ['zh-TW', 'en', 'ja', 'ko'];
  const LOCALE_LABELS = {
    'zh-TW': '繁體中文',
    'en': 'English',
    'ja': '日本語',
    'ko': '한국어'
  };

  // 翻譯字典
  const DICT = {
    'zh-TW': {
      // 語言選單
      'locale.zh-TW': '繁體中文',
      'locale.en': 'English',
      'locale.ja': '日本語',
      'locale.ko': '한국어',
      // 通用
      'app.title': '絕區零 Tier List 製作器',
      'app.title.placeholder': '排行標題',
      'app.defaultTitle': '{name}的絕區零排行',
      'app.defaultTitle.default': '絕區零排行',
      'app.saved': '已儲存在目前瀏覽器',
      'app.reset.confirm': '確定要重新開始嗎？這將清除所有排名與圖表資料。',
      'app.toast.copied': '分享連結已複製到剪貼簿',
      'app.toast.downloaded': '已下載 PNG',
      'app.toast.downloaded_offline': '已使用離線模式下載 PNG',
      'app.toast.download_failed': '下載失敗',
      'app.toast.community_soon': '社群分享功能開發中',
      'app.toast.filters_cleared': '已清除所有篩選',
      'app.toast.reset_done': '已重新開始',
      'app.toast.tier_added': '已新增階級',
      'app.toast.tier_updated': '已更新階級',
      'app.toast.tier_deleted': '已刪除階級',
      'app.toast.returned_pool': '已移回角色庫',
      'app.toast.tier_picked': '已選擇「{name}」，點擊板面放置',
      'app.toast.chart_exported': '已匯出圖表 PNG',
      'app.toast.img_changed': '已切換為「{mode}」',
      'app.toast.tier_moved': '已移動「{name}」',
      'app.toast.tier_exists': '階級已存在',
      'app.toast.invalid_input': '請輸入有效內容',

      // Header
      'header.title': '絕區零 Tier List 製作器',
      'header.title.placeholder': '排行標題',
      'header.saved': '已儲存在目前瀏覽器',
      'tab.tier': '階級表',
      'tab.chart': '二維圖',
      'btn.download': '下載 PNG',
      'btn.share': '分享與匯出',
      'menu.share_link': '複製分享連結',
      'menu.community_share': '分享到社群',
      'menu.preview': '預覽匯出',
      'menu.export_json': '匯出 JSON',
      'menu.import_json': '匯入 JSON',
      'btn.tutorial': '使用教學',
      'btn.reset': '重設',
      'btn.add_tier': '＋ 新增階級',
      'btn.clear_filters': '清除篩選',
      'btn.chart_front': '移至最前',
      'btn.chart_remove': '從圖上移除',
      'btn.chart_export': '匯出圖表 PNG',
      'btn.tier_save': '儲存',
      'btn.tier_cancel': '取消',
      'btn.tier_delete': '刪除',

      // Board
      'board.eyebrow': 'Tier Board',
      'board.hint': '<b>02</b> 拖曳角色到階級 · 雙擊卡片移回角色庫 · 點階級名可編輯',
      'board.ranked': '已排行 {n}',
      'board.add_tier': '＋ 新增階級',
      'board.clear_filters': '清除篩選',
      'board.foot.filter_label': '顯示職業',
      'board.foot.filter_note': '僅影響顯示 · 不影響排行資料',

      // Chart
      'chart.eyebrow': '2-Axis Chart',
      'chart.none_selected': '未選取角色',
      'chart.strength': '強度',
      'chart.ease': '易用度',
      'chart.front': '移至最前',
      'chart.remove': '從圖上移除',
      'chart.axis_y_label': 'Y 軸',
      'chart.axis_x_label': 'X 軸',
      'chart.placed': '已配置',
      'chart.export_png': '匯出圖表 PNG',
      'chart.axis.strong': '強',
      'chart.axis.weak': '弱',
      'chart.axis.hard': '← 難用',
      'chart.axis.easy': '好用 →',
      'chart.guide.summary': '操作說明',
      'chart.guide.1': '點選右側角色庫角色，再點擊板面放置；或直接拖曳進板面。',
      'chart.guide.2': '拖動圓點調整位置；選取後可用方向鍵或 WASD 微調（Shift 加速）。',
      'chart.guide.3': '圓點重疊時雙擊循環選取；「移至最前」調整層級。',
      'chart.guide.4': '選取後按「從圖上移除」可放回角色庫重排。',
      'chart.guide.5': 'Y／X 軸名稱可直接在左側欄編輯。',

      // Sidebar
      'sidebar.title': '角色庫',
      'sidebar.count': '{n} 未排行',
      'sidebar.count.chart': '{n} 未配置',
      'sidebar.mode.square': '立繪',
      'sidebar.mode.round': 'Q版',
      'sidebar.mode.profile': '頭貼',
      'sidebar.search.placeholder': '搜尋角色或陣營',
      'filter.all_roles': '全部職業',
      'filter.all_attrs': '全部屬性',
      'filter.faction': '陣營：{faction}',
      'sort.default': '預設排序',
      'sort.name': '依名稱',
      'sort.role': '依職業',
      'sort.attribute': '依屬性',
      'sort.rank': '依稀有度',
      'pool.head.tier': '未排行角色',
      'pool.head.chart': '未配置角色',
      'pool.show_names': '名稱',
      'pool.visible': '顯示 {x} / {y}',

      // Tutorial
      'tutorial.title': '使用教學',
      'tutorial.close': '開始使用',
      'tutorial.section1.title': '階級表',
      'tutorial.section1.1': '從右側<b>角色庫拖曳</b>角色到階級列；或<b>點擊</b>角色卡快速放入第一個階級',
      'tutorial.section1.2': '<b>雙擊</b>卡片移回角色庫；也可直接拖回角色庫',
      'tutorial.section1.3': '點擊<b>階級名</b>編輯標籤與顏色，「＋ 新增階級」自訂階級',
      'tutorial.section1.4': '<b>右鍵</b>卡片切換圖片樣式（立繪／Q版／頭貼）',
      'tutorial.section1.5': '板下「顯示職業」只影響顯示，不影響排行資料',
      'tutorial.section2.title': '二維圖',
      'tutorial.section2.1': '點選角色庫角色後<b>點擊板面</b>放置，或直接<b>拖曳</b>進板面',
      'tutorial.section2.2': '<b>拖動圓點</b>調整位置；重疊時<b>雙擊</b>循環選取',
      'tutorial.section2.3': '選取後可用<b>方向鍵或 WASD</b>微調（Shift 加速），並可「移至最前」「從圖上移除」',
      'tutorial.section2.4': 'Y／X <b>軸名稱</b>可自訂編輯；兩介面的放置狀態互不影響',
      'tutorial.section3.title': '標記與匯出',
      'tutorial.section3.1': '屬性含<b>特殊</b>（流明／凜刃／烈霜／玄墨）的角色，卡片右下角有<b>圓點標記</b>',
      'tutorial.section3.2': '「<b>下載 PNG</b>」依當前檢視匯出階級表或二維圖',
      'tutorial.section3.3': '「<b>分享與匯出</b>」：複製分享連結、預覽匯出、JSON 匯入／匯出',
      'tutorial.close': '開始使用',

      // Tier Editor
      'tier.editor.edit': '編輯階級',
      'tier.editor.add': '新增階級',
      'tier.editor.label': '階級標籤',
      'tier.editor.color': '顏色',
      'tier.editor.delete': '刪除',
      'tier.editor.cancel': '取消',
      'tier.editor.save': '儲存',
      'tier.editor.delete_confirm': '確定要刪除此階級？其中的角色將移回未排行池。',

      // Chart axis defaults
      'chart.axis.y.default': '強度',
      'chart.axis.x.default': '易用度',

      // Image modes
      'img.mode.square': '立繪',
      'img.mode.round': 'Q版',
      'img.mode.profile': '頭貼',

      // Name prompt
      'name_prompt.title': '你的名字',
      'name_prompt.question': '怎麼稱呼你？',
      'name_prompt.hint': '用於預設排行標題（可隨時直接修改標題，不影響其他資料）',
      'name_prompt.placeholder': '例如：繩匠',
      'name_prompt.skip': '略過',
      'name_prompt.save': '儲存',

      // Roles
      'role.強攻': '強攻',
      'role.擊破': '擊破',
      'role.異常': '異常',
      'role.支援': '支援',
      'role.防護': '防護',
      'role.命破': '命破',
      'role.鋒御': '鋒御',

      // Attributes
      'attr.物理': '物理',
      'attr.電': '電',
      'attr.火': '火',
      'attr.冰': '冰',
      'attr.以太': '以太',
      'attr.風': '風',
      'attr.流明': '流明',
      'attr.凜刃': '凜刃',
      'attr.烈霜': '烈霜',
      'attr.玄墨': '玄墨',
      'attr.特殊': '特殊',

      // Factions
      'faction.狡兔屋': '狡兔屋',
      'faction.維多利亞家政': '維多利亞家政',
      'faction.白祇重工': '白祇重工',
      'faction.卡呂冬之子': '卡呂冬之子',
      'faction.奧波勒斯小隊': '奧波勒斯小隊',
      'faction.對空六課': '對空六課',
      'faction.刑偵特勤組': '刑偵特勤組',
      'faction.卡吕冬之子': '卡吕冬之子',
      'faction.天琴座': '天琴座',
      'faction.反舌鳥': '反舌鳥',
      'faction.雲巋山': '雲巋山',
      'faction.怪啖屋': '怪啖屋',
      'faction.坎卜斯合規局': '坎卜斯合規局',
      'faction.妄想天使': '妄想天使',
      'faction.都會秩序局': '都會秩序局',
      'faction.對外戰略部': '對外戰略部',
      'faction.達雅特聖約': '達雅特聖約',
      'faction.空中巡邏隊': '空中巡邏隊',
      'faction.燧石工坊': '燧石工坊',
      'faction.羅斯凱利法': '羅斯凱利法',

      // Special attributes
      'special.流明': '流明',
      'special.凜刃': '凜刃',
      'special.烈霜': '烈霜',
      'special.玄墨': '玄墨',

      // Filters
      'filter.attr.special': '特殊',

      // Rank
      'rank.S': 'S',
      'rank.A': 'A',
      'rank.∞': '∞',

      // ARIA labels
      'aria.title': '排行標題',
      'aria.view_tabs': '檢視切換',
      'aria.locale': '語言',
      'aria.img_mode': '圖片樣式',
      'aria.search': '搜尋角色或陣營',
      'aria.role_filter': '職業篩選',
      'aria.attr_filter': '屬性篩選',
      'aria.sort': '排序',
      'aria.tier_role_view': '階級表顯示職業過濾',
      'aria.chart_role_view': '二維圖顯示職業過濾',
      'aria.chart_board': '拖曳或點擊放置角色',
    },
    'en': {
      // Language selector
      'locale.zh-TW': '繁體中文',
      'locale.en': 'English',
      'locale.ja': '日本語',
      'locale.ko': '한국어',
      // Common
      'app.title': 'ZZZ Tier List Maker',
      'app.title.placeholder': 'Tier List Title',
      'app.defaultTitle': "{name}'s ZZZ Tier List",
      'app.defaultTitle.default': 'ZZZ Tier List',
      'app.saved': 'Saved in this browser',
      'app.reset.confirm': 'Are you sure you want to start over? This will clear all rankings and chart data.',
      'app.toast.copied': 'Share link copied to clipboard',
      'app.toast.downloaded': 'PNG downloaded',
      'app.toast.downloaded_offline': 'PNG downloaded (offline mode)',
      'app.toast.download_failed': 'Download failed',
      'app.toast.community_soon': 'Community sharing coming soon',
      'app.toast.filters_cleared': 'All filters cleared',
      'app.toast.reset_done': 'Started over',
      'app.toast.tier_added': 'Tier added',
      'app.toast.tier_updated': 'Tier updated',
      'app.toast.tier_deleted': 'Tier deleted',
      'app.toast.returned_pool': 'Returned to pool',
      'app.toast.tier_picked': 'Selected "{name}" – click the board to place',
      'app.toast.chart_exported': 'Chart PNG exported',
      'app.toast.img_changed': 'Switched to "{mode}"',
      'app.toast.tier_moved': 'Moved "{name}"',
      'app.toast.tier_exists': 'Tier already exists',
      'app.toast.invalid_input': 'Please enter valid input',

      // Header
      'header.title': 'ZZZ Tier List Maker',
      'header.title.placeholder': 'Tier List Title',
      'header.saved': 'Saved in this browser',
      'tab.tier': 'Tier List',
      'tab.chart': '2-Axis Chart',
      'btn.download': 'Download PNG',
      'btn.share': 'Share & Export',
      'menu.share_link': 'Copy share link',
      'menu.community_share': 'Share to community',
      'menu.preview': 'Preview export',
      'menu.export_json': 'Export JSON',
      'menu.import_json': 'Import JSON',
      'btn.tutorial': 'Guide',
      'btn.reset': 'Reset',
      'btn.add_tier': '+ Add tier',
      'btn.clear_filters': 'Clear filters',
      'btn.chart_front': 'Bring to front',
      'btn.chart_remove': 'Remove from chart',
      'btn.chart_export': 'Export chart PNG',
      'btn.tier_save': 'Save',
      'btn.tier_cancel': 'Cancel',
      'btn.tier_delete': 'Delete',

      // Board
      'board.eyebrow': 'Tier Board',
      'board.hint': '<b>02</b> Drag agents to tiers · Double-click to return to pool · Click tier name to edit',
      'board.ranked': '{n} ranked',
      'board.add_tier': '+ Add tier',
      'board.clear_filters': 'Clear filters',
      'board.foot.filter_label': 'Show role',
      'board.foot.filter_note': 'Display only · Does not affect ranking data',

      // Chart
      'chart.eyebrow': '2-Axis Chart',
      'chart.none_selected': 'No agent selected',
      'chart.strength': 'Strength',
      'chart.ease': 'Ease of Use',
      'chart.front': 'Bring to front',
      'chart.remove': 'Remove from chart',
      'chart.axis_y_label': 'Y Axis',
      'chart.axis_x_label': 'X Axis',
      'chart.placed': 'Placed',
      'chart.export_png': 'Export chart PNG',
      'chart.axis.strong': 'Strong',
      'chart.axis.weak': 'Weak',
      'chart.axis.hard': '← Hard',
      'chart.axis.easy': 'Easy →',
      'chart.guide.summary': 'How to use',
      'chart.guide.1': 'Select an agent from the library on the right, then click the board to place; or drag directly onto the board.',
      'chart.guide.2': 'Drag dots to adjust position; nudge with arrow keys or WASD (Shift for 5x speed). Double-click overlapping dots to cycle selection.',
      'chart.guide.3': 'Use arrow keys to nudge (Shift for 5x speed).',
      'chart.guide.4': 'Click "Remove from chart" to return agent to library.',
      'chart.guide.5': 'Y/X axis labels can be edited in the sidebar.',

      // Sidebar
      'sidebar.title': 'Agent Library',
      'sidebar.count': '{n} unranked',
      'sidebar.count.chart': '{n} unplaced',
      'sidebar.mode.square': 'Portrait',
      'sidebar.mode.round': 'Chibi',
      'sidebar.mode.profile': 'Avatar',
      'sidebar.search.placeholder': 'Search agents or factions',
      'filter.all_roles': 'All roles',
      'filter.all_attrs': 'All attributes',
      'filter.faction': 'Faction: {faction}',
      'sort.default': 'Default order',
      'sort.name': 'By name',
      'sort.role': 'By role',
      'sort.attribute': 'By attribute',
      'sort.rank': 'By rarity',
      'pool.head.tier': 'Unranked agents',
      'pool.head.chart': 'Unplaced agents',
      'pool.show_names': 'Names',
      'pool.visible': 'Showing {x} / {y}',

      // Tutorial
      'tutorial.title': 'How to Use',
      'tutorial.close': 'Start Using',
      'tutorial.section1.title': 'Tier List',
      'tutorial.section1.1': 'Drag agents from the <b>library</b> into tiers; or <b>click</b> a card to quick-place into the first tier.',
      'tutorial.section1.2': '<b>Double-click</b> a card to return it to the library; or drag it back to the library.',
      'tutorial.section1.3': 'Click a <b>tier name</b> to edit its label and color; "<b>+ Add tier</b>" creates a custom tier.',
      'tutorial.section1.4': '<b>Right-click</b> a card to cycle image styles (Portrait / Chibi / Avatar).',
      'tutorial.section1.5': 'The "Show role" filter below the board only affects visibility, not ranking data.',
      'tutorial.section2.title': '2-Axis Chart',
      'tutorial.section2.1': 'Pick an agent from the library, then <b>click the board</b> to place; or <b>drag</b> directly onto the board.',
      'tutorial.section2.2': '<b>Drag dots</b> to adjust position; <b>double-click</b> overlapping dots to cycle selection.',
      'tutorial.section2.3': 'After selecting, use <b>arrow keys or WASD</b> to nudge (Shift for 5x speed). "Bring to front" and "Remove" available.',
      'tutorial.section2.4': 'Y/X <b>axis labels</b> are editable in the sidebar; tier and chart placements are independent.',
      'tutorial.section3.title': 'Badges & Export',
      'tutorial.section3.1': 'Agents with <b>special</b> attributes (Lumen / Rime / Frost / Ink) show a <b>dot badge</b> on their card.',
      'tutorial.section3.2': '<b>Download PNG</b> exports the current view (tier list or 2-axis chart).',
      'tutorial.section3.3': '<b>Share & Export</b>: copy share link, preview export, JSON import/export.',
      'tutorial.close': 'Get Started',

      // Tier Editor
      'tier.editor.edit': 'Edit Tier',
      'tier.editor.add': 'Add Tier',
      'tier.editor.label': 'Tier Label',
      'tier.editor.color': 'Color',
      'tier.editor.delete': 'Delete',
      'tier.editor.cancel': 'Cancel',
      'tier.editor.save': 'Save',
      'tier.editor.delete_confirm': 'Delete this tier? Its agents will return to the unranked pool.',

      // Chart axis defaults
      'chart.axis.y.default': 'Strength',
      'chart.axis.x.default': 'Ease of Use',

      // Image modes
      'img.mode.square': 'Portrait',
      'img.mode.round': 'Chibi',
      'img.mode.profile': 'Avatar',

      // Name prompt
      'name_prompt.title': 'Your Name',
      'name_prompt.question': 'What should we call you?',
      'name_prompt.hint': 'Used for default tier list title (you can always edit the title later; name not included in share links).',
      'name_prompt.placeholder': 'e.g. Rope',
      'name_prompt.skip': 'Skip',
      'name_prompt.save': 'Save',

      // Roles
      'role.強攻': 'Attack',
      'role.擊破': 'Stun',
      'role.異常': 'Anomaly',
      'role.支援': 'Support',
      'role.防護': 'Defense',
      'role.命破': 'Rupture',
      'role.鋒御': 'Vanguard',

      // Attributes
      'attr.物理': 'Physical',
      'attr.電': 'Electric',
      'attr.火': 'Fire',
      'attr.冰': 'Ice',
      'attr.以太': 'Ether',
      'attr.風': 'Wind',
      'attr.流明': 'Lumen',
      'attr.凜刃': 'Rime',
      'attr.烈霜': 'Frost',
      'attr.玄墨': 'Ink',
      'attr.特殊': 'Special',

      // Factions
      'faction.狡兔屋': 'Cunning Hares',
      'faction.維多利亞家政': 'Victoria Housekeeping',
      'faction.白祇重工': 'Belobog Heavy Industries',
      'faction.卡呂冬之子': 'Sons of Calydon',
      'faction.奧波勒斯小隊': 'Obol Squad',
      'faction.對空六課': 'Hollow Special Operations Section 6',
      'faction.刑偵特勤組': 'Criminal Investigation Special Response Team',
      'faction.卡吕冬之子': 'Sons of Calydon',
      'faction.天琴座': 'Stars of Lyra',
      'faction.反舌鳥': 'Mockingbird',
      'faction.雲巋山': 'Yunkui Summit',
      'faction.怪啖屋': 'Spook Shack',
      'faction.坎卜斯合規局': 'Krampus Compliance Authority',
      'faction.妄想天使': 'Angels of Delusion',
      'faction.都會秩序局': 'Metropolitan Order Division',
      'faction.對外戰略部': 'External Strategy Department',
      'faction.達雅特聖約': 'Covenant of Dayat',
      'faction.空中巡邏隊': 'Aerial Patrol Division',
      'faction.燧石工坊': 'Flint Workshop',
      'faction.羅斯凱利法': 'Roscalifa',

      // Special attributes
      'special.流明': 'Lumen',
      'special.凜刃': 'Rime',
      'special.烈霜': 'Frost',
      'special.玄墨': 'Ink',

      // Filters
      'filter.attr.special': 'Special',

      // Rank
      'rank.S': 'S',
      'rank.A': 'A',
      'rank.∞': '∞',

      // ARIA labels
      'aria.title': 'Tier list title',
      'aria.view_tabs': 'View switcher',
      'aria.locale': 'Language',
      'aria.img_mode': 'Image style',
      'aria.search': 'Search agents or factions',
      'aria.role_filter': 'Role filter',
      'aria.attr_filter': 'Attribute filter',
      'aria.sort': 'Sort',
      'aria.tier_role_view': 'Tier board role filter',
      'aria.chart_role_view': 'Chart role filter',
      'aria.chart_board': 'Drag or click to place agents',
    },
    'ja': {
      // 言語選択
      'locale.zh-TW': '繁體中文',
      'locale.en': 'English',
      'locale.ja': '日本語',
      'locale.ko': '한국어',
      // Common
      'app.title': 'ゼンゼロ Tier List 製作器',
      'app.defaultTitle': '{name}のゼンゼロティアリスト',
      'app.defaultTitle.default': 'ゼンゼロティアリスト',
      'app.title.placeholder': 'ティアリストのタイトル',
      'app.saved': 'このブラウザに保存済み',
      'app.reset.confirm': '本当に最初から始めますか？全てのランキングとチャートデータが消去されます。',
      'app.toast.copied': '共有リンクをクリップボードにコピーしました',
      'app.toast.downloaded': 'PNGをダウンロードしました',
      'app.toast.downloaded_offline': 'オフラインモードでPNGをダウンロードしました',
      'app.toast.download_failed': 'ダウンロードに失敗しました',
      'app.toast.community_soon': 'コミュニティ共有機能は開発中です',
      'app.toast.filters_cleared': 'すべてのフィルターをクリアしました',
      'app.toast.reset_done': '最初からやり直しました',
      'app.toast.tier_added': 'ティアを追加しました',
      'app.toast.tier_updated': 'ティアを更新しました',
      'app.toast.tier_deleted': 'ティアを削除しました',
      'app.toast.returned_pool': 'キャラクターをプールに戻しました',
      'app.toast.tier_picked': '「{name}」を選択しました。ボードをクリックして配置してください',
      'app.toast.chart_exported': 'チャートPNGをエクスポートしました',
      'app.toast.img_changed': '「{mode}」に切り替えました',
      'app.toast.tier_moved': '「{name}」を移動しました',
      'app.toast.tier_exists': 'そのティアは既に存在します',
      'app.toast.invalid_input': '有効な値を入力してください',

      // Header
      'header.title': 'ゼンゼロ Tier List 製作器',
      'header.title.placeholder': 'ティアリストのタイトル',
      'header.saved': 'このブラウザに保存済み',
      'tab.tier': '階級表',
      'tab.chart': '2軸チャート',
      'btn.download': 'PNGダウンロード',
      'btn.share': '共有とエクスポート',
      'menu.share_link': '共有リンクをコピー',
      'menu.community_share': 'コミュニティに共有',
      'menu.preview': 'プレビュー',
      'menu.export_json': 'JSONをエクスポート',
      'menu.import_json': 'JSONをインポート',
      'btn.tutorial': '使い方',
      'btn.reset': 'リセット',
      'btn.add_tier': '＋ ティア追加',
      'btn.clear_filters': 'フィルターをクリア',
      'btn.chart_front': '最前面へ',
      'btn.chart_remove': 'チャートから削除',
      'btn.chart_export': 'チャートPNG出力',
      'btn.tier_save': '保存',
      'btn.tier_cancel': 'キャンセル',
      'btn.tier_delete': '削除',

      // Board
      'board.eyebrow': 'Tier Board',
      'board.hint': '<b>02</b> エージェントをティアへドラッグ · ダブルクリックでプールへ戻す · ティア名クリックで編集',
      'board.ranked': '{n} 位',
      'board.add_tier': '＋ ティア追加',
      'board.clear_filters': 'フィルターをクリア',
      'board.foot.filter_label': '職業表示',
      'board.foot.filter_note': '表示のみ変更 · データには影響しません',

      // Chart
      'chart.eyebrow': '2軸チャート',
      'chart.none_selected': '未選択',
      'chart.strength': '強度',
      'chart.ease': '易用度',
      'chart.front': '最前面へ',
      'chart.remove': 'チャートから削除',
      'chart.axis_y_label': 'Y軸',
      'chart.axis_x_label': 'X軸',
      'chart.placed': '配置済み',
      'chart.export_png': 'チャートPNG出力',
      'chart.axis.strong': '強',
      'chart.axis.weak': '弱',
      'chart.axis.hard': '← 難',
      'chart.axis.easy': '易 →',
      'chart.guide.summary': '操作説明',
      'chart.guide.1': '右側のライブラリで<b>エージェントを選択</b>後、<b>ボードをクリック</b>して配置。または直接<b>ドラッグ＆ドロップ</b>。',
      'chart.guide.2': '<b>ドットをドラッグ</b>して位置調整。選択後は矢印キー／WASD で微調整（Shift で5倍速）。重なった場合は<b>ダブルクリック</b>で循環選択。',
      'chart.guide.3': '選択後は<b>方向キー</b>で微調整（Shiftで高速）。',
      'chart.guide.3': '選択後は<b>方向キー</b>で微調整（Shiftで高速）。',
      'chart.guide.4': '選択後に<b>「最前面へ」</b>で重なり順変更。<b>「チャートから削除」</b>でプールに戻す。',
      'chart.guide.5': 'Y/X軸の<b>ラベル名は左サイドバーで編集可能</b>。',

      // Sidebar
      'sidebar.title': 'エージェントライブラリ',
      'sidebar.count': '{n} 未配置',
      'sidebar.count.chart': '{n} 未配置',
      'sidebar.mode.square': '立ち絵',
      'sidebar.mode.round': 'ちびキャラ',
      'sidebar.mode.profile': 'アバター',
      'sidebar.search.placeholder': 'エージェントまたは陣営を検索',
      'filter.all_roles': 'すべての職業',
      'filter.all_attrs': 'すべての属性',
      'filter.faction': '陣営：{faction}',
      'sort.default': 'デフォルト順',
      'sort.name': '名前順',
      'sort.role': '職業順',
      'sort.attribute': '属性順',
      'sort.rank': 'レア度順',
      'pool.head.tier': '未ランク',
      'pool.head.chart': '未配置',
      'pool.show_names': '名前表示',
      'pool.visible': '表示 {x} / {y}',

      // Tutorial
      'tutorial.title': '使い方',
      'tutorial.close': '始める',
      'tutorial.section1.title': '階級表',
      'tutorial.section1.1': '右側の<b>ライブラリからエージェントをドラッグ</b>してティアに配置。または<b>クリック</b>で最初のティアに即配置。',
      'tutorial.section1.2': '<b>ダブルクリック</b>でカードをライブラリに戻す。ライブラリにドラッグしても戻せます。',
      'tutorial.section1.3': '<b>ティア名をクリック</b>してラベルと色を編集。「＋ティア追加」でカスタムティア作成。',
      'tutorial.section1.4': '<b>右クリック</b>で画像スタイル切り替え（立ち絵／ちびキャラ／アバター）。',
      'tutorial.section1.5': 'ボード下部の「職業表示」は見た目のみ変更。ランキングデータには影響しません。',
      'tutorial.section2.title': '2軸チャート',
      'tutorial.section2.1': 'ライブラリでキャラクターを<b>選択</b>後、<b>ボードをクリック</b>して配置。または直接<b>ドラッグ＆ドロップ</b>。',
      'tutorial.section2.2': '<b>ドットをドラッグ</b>して位置調整。重なり時は<b>ダブルクリック</b>で循環選択。',
      'tutorial.section2.2': '<b>ドットをドラッグ</b>して位置調整。重なり時は<b>ダブルクリック</b>で循環選択。',
      'tutorial.section2.3': '選択後は<b>方向キーまたは WASD</b>で微調整（Shiftで5倍速）。「最前面へ」「チャートから削除」も可能。',
      'tutorial.section2.4': 'Y／X <b>軸ラベル</b>は左サイドバーで編集可。二つのビューの配置状態は独立。',
      'tutorial.section3.title': 'バッジとエクスポート',
      'tutorial.section3.1': '<b>特殊</b>属性（流明／凜刃／烈霜／玄墨）を持つキャラは、カード右下に<b>ドットバッジ</b>が表示されます。',
      'tutorial.section3.2': '<b>PNGダウンロード</b>で現在のビュー（階級表／二軸チャート）を書き出し。',
      'tutorial.section3.3': '<b>共有とエクスポート</b>：リンクコピー、プレビュー、JSONインポート／エクスポート。',
      'tutorial.close': '始める',

      // Tier Editor
      'tier.editor.edit': 'ティアを編集',
      'tier.editor.add': 'ティアを追加',
      'tier.editor.label': 'ティアラベル',
      'tier.editor.color': '色',
      'tier.editor.delete': '削除',
      'tier.editor.cancel': 'キャンセル',
      'tier.editor.save': '保存',
      'tier.editor.delete_confirm': 'このティアを削除しますか？中のエージェントは未配置プールに戻ります。',

      // Chart axis defaults
      'chart.axis.y.default': '強度',
      'chart.axis.x.default': '易用度',

      // Image modes
      'img.mode.square': '立ち絵',
      'img.mode.round': 'ちびキャラ',
      'img.mode.profile': 'アバター',

      // Name prompt
      'name_prompt.title': 'あなたの名前',
      'name_prompt.question': '何と呼ばれたいですか？',
      'name_prompt.hint': 'デフォルトのティアリストタイトルに使用されます（後でタイトルを直接編集可能。共有リンクには含まれません）。',
      'name_prompt.placeholder': '例：ロープ',
      'name_prompt.skip': 'スキップ',
      'name_prompt.save': '保存',

      // Roles
      'role.強攻': '強攻',
      'role.擊破': '撃破',
      'role.異常': '異常',
      'role.支援': '支援',
      'role.防護': '防護',
      'role.命破': '命破',
      'role.鋒御': '鋒禦',

      // Attributes
      'attr.物理': '物理',
      'attr.電': '電気',
      'attr.火': '火',
      'attr.冰': '氷',
      'attr.以太': 'エーテル',
      'attr.風': '風',
      'attr.流明': '流明',
      'attr.凜刃': '凜刃',
      'attr.烈霜': '烈霜',
      'attr.玄墨': '玄墨',
      'attr.特殊': '特殊',

      // Factions
      'faction.狡兔屋': '狡兔屋',
      'faction.維多利亞家政': 'ヴィクトリア家政',
      'faction.白祇重工': 'ベロボーグ重工',
      'faction.卡呂冬之子': 'カリュドーンの子',
      'faction.奧波勒斯小隊': 'オボルス小隊',
      'faction.對空六課': '対空六課',
      'faction.刑偵特勤組': '刑事特別捜査班',
      'faction.卡吕冬之子': 'カリュドーンの子',
      'faction.天琴座': '天琴座',
      'faction.反舌鳥': 'モッキンバード',
      'faction.雲巋山': '雲巋山',
      'faction.怪啖屋': '怪啖屋',
      'faction.坎卜斯合規局': '坎卜斯合規局',
      'faction.妄想天使': '妄想天使',
      'faction.都會秩序局': '都會秩序局',
      'faction.對外戰略部': '対外戦略部',
      'faction.達雅特聖約': '達雅特聖約',
      'faction.空中巡邏隊': '空中巡邏隊',
      'faction.燧石工坊': 'フリント工房',
      'faction.羅斯凱利法': 'ロスカリファ',

      // Special attributes
      'special.流明': '流明',
      'special.凜刃': '凜刃',
      'special.烈霜': '烈霜',
      'special.玄墨': '玄墨',

      // Filters
      'filter.attr.special': '特殊',

      // Rank
      'rank.S': 'S',
      'rank.A': 'A',
      'rank.∞': '∞',

      // ARIA labels
      'aria.title': 'ランキングタイトル',
      'aria.view_tabs': '表示切替',
      'aria.locale': '言語',
      'aria.img_mode': '画像スタイル',
      'aria.search': 'エージェントや陣営を検索',
      'aria.role_filter': '職業フィルター',
      'aria.attr_filter': '属性フィルター',
      'aria.sort': '並べ替え',
      'aria.tier_role_view': 'ティアボードの職業表示フィルター',
      'aria.chart_role_view': 'チャートの職業表示フィルター',
      'aria.chart_board': 'ドラッグまたはクリックで配置',
    },
    'ko': {
      // 언어 선택
      'locale.zh-TW': '繁體中文',
      'locale.en': 'English',
      'locale.ja': '日本語',
      'locale.ko': '한국어',
      // Common
      'app.title': '젠레스 존 제로 티어 리스트 메이커',
      'app.defaultTitle': '{name}의 젠레스 존 제로 티어 리스트',
      'app.defaultTitle.default': '젠레스 존 제로 티어 리스트',
      'app.title.placeholder': '티어리스트 제목',
      'app.saved': '현재 브라우저에 저장됨',
      'app.reset.confirm': '정말 처음부터 시작하시겠습니까? 모든 랭킹과 차트 데이터가 초기화됩니다.',
      'app.toast.copied': '공유 링크가 클립보드에 복사되었습니다',
      'app.toast.downloaded': 'PNG 다운로드 완료',
      'app.toast.downloaded_offline': '오프라인 모드로 PNG 다운로드됨',
      'app.toast.download_failed': '다운로드 실패',
      'app.toast.community_soon': '커뮤니티 공유 기능 개발 중',
      'app.toast.filters_cleared': '모든 필터 초기화됨',
      'app.toast.reset_done': '처음부터 다시 시작',
      'app.toast.tier_added': '티어 추가됨',
      'app.toast.tier_updated': '티어 업데이트됨',
      'app.toast.tier_deleted': '티어 삭제됨',
      'app.toast.returned_pool': '풀에 반환됨',
      'app.toast.tier_picked': '"{name}" 선택됨 - 보드를 클릭해 배치하세요',
      'app.toast.chart_exported': '차트 PNG 내보내기 완료',
      'app.toast.img_changed': '"{mode}"로 변경되었습니다',
      'app.toast.tier_moved': '"{name}"를 이동했습니다',
      'app.toast.tier_exists': '이미 존재하는 티어입니다',
      'app.toast.invalid_input': '올바른 값을 입력하세요',

      // Header
      'header.title': '젠레스 존 제로 티어 리스트 메이커',
      'header.title.placeholder': '내 티어리스트 제목',
      'header.saved': '현재 브라우저에 저장됨',
      'tab.tier': '티어 리스트',
      'tab.chart': '2축 차트',
      'btn.download': 'PNG 다운로드',
      'btn.share': '공유 및 내보내기',
      'menu.share_link': '공유 링크 복사',
      'menu.community_share': '커뮤니티에 공유',
      'menu.preview': '미리보기',
      'menu.export_json': 'JSON 내보내기',
      'menu.import_json': 'JSON 가져오기',
      'btn.tutorial': '사용법',
      'btn.reset': '초기화',
      'btn.add_tier': '＋ 티어 추가',
      'btn.clear_filters': '필터 초기화',
      'btn.chart_front': '맨 앞으로',
      'btn.chart_remove': '차트에서 제거',
      'btn.chart_export': '차트 PNG 내보내기',
      'btn.tier_save': '저장',
      'btn.tier_cancel': '취소',
      'btn.tier_delete': '삭제',

      // Board
      'board.eyebrow': 'Tier Board',
      'board.hint': '<b>02</b> 에이전트를 티어로 드래그 · 더블클릭으로 풀에 되돌리기 · 티어 이름 클릭으로 편집',
      'board.ranked': '{n} ranked',
      'board.add_tier': '＋ 티어 추가',
      'board.clear_filters': '필터 초기화',
      'board.foot.filter_label': '직업 표시',
      'board.foot.filter_note': '표시만 변경 · 데이터에는 영향 없음',

      // Chart
      'chart.eyebrow': '2축 차트',
      'chart.none_selected': '선택된 에이전트 없음',
      'chart.strength': '강도',
      'chart.ease': '편의성',
      'chart.front': '맨 앞으로',
      'chart.remove': '차트에서 제거',
      'chart.axis_y_label': 'Y 축',
      'chart.axis_x_label': 'X 축',
      'chart.placed': '배치됨',
      'chart.export_png': '차트 PNG 내보내기',
      'chart.axis.strong': '강',
      'chart.axis.weak': '약',
      'chart.axis.hard': '← 어려움',
      'chart.axis.easy': '쉬움 →',
      'chart.guide.summary': '사용법',
      'chart.guide.1': '오른쪽 라이브러리에서 <b>에이전트 선택</b> 후 <b>보드 클릭</b>으로 배치하거나 직접 <b>드래그</b>하세요.',
      'chart.guide.2': '<b>드래그</b>로 위치 조정 · 선택 후 방향키 또는 WASD로 미세 조정 (Shift로 5배) · 겹치면 <b>더블클릭</b>으로 순환 선택',
      'chart.guide.3': '선택 후 <b>방향키</b>로 미세 조정 (Shift로 5배 속도)',
      'chart.guide.4': '선택 후 <b>맨 앞으로</b>로 순서 변경 · <b>차트에서 제거</b>로 풀에 반환',
      'chart.guide.5': '<b>Y/X 축 라벨</b>은 왼쪽 사이드바에서 편집 가능',

      // Sidebar
      'sidebar.title': '에이전트 라이브러리',
      'sidebar.count': '{n} 미배치',
      'sidebar.count.chart': '{n} 미배치',
      'sidebar.mode.square': '일러스트',
      'sidebar.mode.round': '치비',
      'sidebar.mode.profile': '프로필',
      'sidebar.search.placeholder': '에이전트 또는 진영 검색',
      'filter.all_roles': '모든 직업',
      'filter.all_attrs': '모든 속성',
      'filter.faction': '진영: {faction}',
      'sort.default': '기본 정렬',
      'sort.name': '이름순',
      'sort.role': '직업순',
      'sort.attribute': '속성순',
      'sort.rank': '희귀도순',
      'pool.head.tier': '미랭크 에이전트',
      'pool.head.chart': '미배치 에이전트',
      'pool.show_names': '이름 표시',
      'pool.visible': '표시 {x} / {y}',

      // Tutorial
      'tutorial.title': '사용법',
      'tutorial.close': '시작하기',
      'tutorial.section1.title': '티어 리스트',
      'tutorial.section1.1': '오른쪽 <b>라이브러리에서 에이전트를 드래그</b>해 티어에 배치하거나 <b>클릭</b>으로 첫 티어에 즉시 배치하세요.',
      'tutorial.section1.2': '<b>더블클릭</b>으로 카드를 라이브러리로 돌려보내기. 라이브러리로 드래그해도 됩니다.',
      'tutorial.section1.3': '<b>티어 이름 클릭</b>으로 라벨과 색상 편집. "<b>＋ 티어 추가</b>"로 커스텀 티어 생성.',
      'tutorial.section1.4': '<b>우클릭</b>으로 이미지 스타일 전환 (일러스트 / 치비 / 아바타).',
      'tutorial.section1.5': '보드 하단의 "직업 표시"는 표시에만 영향. 랭킹 데이터엔 영향 없음.',

      // Tutorial section 2
      'tutorial.section2.title': '2축 차트',
      'tutorial.section2.1': '라이브러리에서 에이전트 <b>선택</b> 후 <b>보드 클릭</b>으로 배치하거나 직접 <b>드래그</b>해 보드에 배치.',
      'tutorial.section2.2': '<b>드래그</b>로 위치 조정. 겹칠 때 <b>더블클릭</b>으로 순환 선택.',
      'tutorial.section2.3': '선택 후 <b>방향키 또는 WASD</b>로 미세 조정 (Shift로 5배 속도). "맨 앞으로" "차트에서 제거" 가능.',
      'tutorial.section2.4': 'Y/X <b>축 이름</b>은 왼쪽 사이드바에서 편집 가능. 두 뷰의 배치 상태는 서로 독립적입니다.',

      // Tutorial section 3
      'tutorial.section3.title': '배지와 내보내기',
      'tutorial.section3.1': '<b>특수</b> 속성(류밍/린인/열상/현묵)을 가진 캐릭터는 카드 오른쪽 아래에 <b>점 배지</b>로 표시됩니다.',
      'tutorial.section3.2': '<b>PNG 다운로드</b>로 현재 뷰(티어 리스트 또는 2축 차트) 내보내기.',
      'tutorial.section3.3': '<b>공유와 내보내기</b>: 링크 복사, 미리보기, JSON 가져오기/내보내기.',
      'tutorial.close': '시작하기',

      // Tier Editor
      'tier.editor.edit': '티어 편집',
      'tier.editor.add': '티어 추가',
      'tier.editor.label': '티어 라벨',
      'tier.editor.color': '색상',
      'tier.editor.delete': '삭제',
      'tier.editor.cancel': '취소',
      'tier.editor.save': '저장',
      'tier.editor.delete_confirm': '이 티어를 삭제하시겠습니까? 해당 티어의 에이전트들은 미배치 풀로 돌아갑니다.',

      // Chart axis defaults
      'chart.axis.y.default': '강도',
      'chart.axis.x.default': '편의성',

      // Image modes
      'img.mode.square': '일러스트',
      'img.mode.round': '치비',
      'img.mode.profile': '프로필',

      // Name prompt
      'name_prompt.title': '당신의 이름',
      'name_prompt.question': '어떻게 불리고 싶으신가요?',
      'name_prompt.hint': '기본 티어리스트 제목에 사용됩니다 (나중에 제목 직접 수정 가능, 공유 링크엔 포함 안 됨).',
      'name_prompt.placeholder': '예: 로프',
      'name_prompt.skip': '건너뛰기',
      'name_prompt.save': '저장',

      // Roles
      'role.強攻': '강공',
      'role.擊破': '격파',
      'role.異常': '이상',
      'role.支援': '지원',
      'role.防護': '방어',
      'role.命破': '명파',
      'role.鋒御': '봉어',

      // Attributes
      'attr.物理': '물리',
      'attr.電': '전기',
      'attr.火': '불',
      'attr.冰': '얼음',
      'attr.以太': '에테르',
      'attr.風': '바람',
      'attr.流明': '류명',
      'attr.凜刃': '린인',
      'attr.烈霜': '열상',
      'attr.玄墨': '현묵',
      'attr.特殊': '특수',

      // Factions
      'faction.狡兔屋': '교활한 토끼굴',
      'faction.維多利亞家政': '빅토리아 가정관리',
      'faction.白祇重工': '벨로보그 중공업',
      'faction.卡呂冬之子': '칼리돈의 아이들',
      'faction.奧波勒斯小隊': '오볼 분대',
      'faction.對空六課': '대공 6과',
      'faction.刑偵特勤組': '형사 특수대응팀',
      'faction.卡呂冬之子': '칼리돈의 아이들',
      'faction.天琴座': '천금자리',
      'faction.反舌鳥': '흉내쟁이새',
      'faction.雲巋山': '운규산',
      'faction.怪啖屋': '기상천외한 집',
      'faction.坎卜斯合規局': '크람푸스 준수국',
      'faction.妄想天使': '망상 천사',
      'faction.都會秩序局': '도시 질서국',
      'faction.對外戰略部': '대외 전략부',
      'faction.達雅特聖約': '다야트 성약',
      'faction.空中巡邏隊': '공중 순찰대',
      'faction.燧石工坊': '부싯돌 공방',
      'faction.羅斯凱利法': '로스칼리파',

      // Special attributes
      'special.流明': '류밍',
      'special.凜刃': '린인',
      'special.烈霜': '열상',
      'special.玄墨': '현묵',

      // Filters
      'filter.attr.special': '특수',

      // Rank
      'rank.S': 'S',
      'rank.A': 'A',
      'rank.∞': '∞',

      // ARIA labels
      'aria.title': '순위 제목',
      'aria.view_tabs': '보기 전환',
      'aria.locale': '언어',
      'aria.img_mode': '이미지 스타일',
      'aria.search': '에이전트 또는 진영 검색',
      'aria.role_filter': '직업 필터',
      'aria.attr_filter': '속성 필터',
      'aria.sort': '정렬',
      'aria.tier_role_view': '티어 보드 직업 표시 필터',
      'aria.chart_role_view': '차트 직업 표시 필터',
      'aria.chart_board': '드래그 또는 클릭으로 배치',
    }
  };

  // Helper functions
  function getLocale() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LOCALES.includes(saved)) {
        return saved;
      }
    } catch (e) { /* noop */ }
    // Browser language detection
    const langs = navigator.languages || [navigator.language || ''];
    for (const l of langs) {
      const s = String(l).toLowerCase();
      if (s.startsWith('zh')) return 'zh-TW';
      if (s.startsWith('ja')) return 'ja';
      if (s.startsWith('ko')) return 'ko';
      if (s.startsWith('en')) return 'en';
    }
    return 'en'; // default fallback
  }

  let currentLocale = getLocale();

  function t(key, vars) {
    const dict = DICT[currentLocale] || DICT['en'];
    let str = dict[key] || DICT['en'][key] || DICT['zh-TW'][key] || key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return str;
  }

  function term(kind, value) {
    if (!value) return '';
    const key = kind + '.' + value;
    return t(key) || value;
  }

  // Localized agent display name (zh-TW uses data.js `name` directly)
  function agentName(agent) {
    if (!agent) return '';
    if (currentLocale === 'zh-TW') return agent.name;
    const table = (typeof AGENT_NAMES === 'object' && AGENT_NAMES) ? AGENT_NAMES[currentLocale] : null;
    return (table && table[agent.id]) || agent.name;
  }

  function applyStatic(root = document) {
    root.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]').forEach(el => {
      let vars = null;
      const varsRaw = el.getAttribute('data-i18n-vars');
      if (varsRaw) {
        try { vars = JSON.parse(varsRaw); } catch (e) { /* malformed vars: ignore */ }
      }
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = t(el.getAttribute('data-i18n-html'), vars);
      } else if (el.hasAttribute('data-i18n-placeholder')) {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'), vars);
      } else if (el.hasAttribute('data-i18n-title')) {
        const txt = t(el.getAttribute('data-i18n-title'), vars);
        el.title = txt;
        el.setAttribute('aria-label', txt);
      } else if (el.hasAttribute('data-i18n')) {
        el.textContent = t(el.getAttribute('data-i18n'), vars);
      }
      // aria is independent: may combine with placeholder/text above
      if (el.hasAttribute('data-i18n-aria')) {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), vars));
      }
    });
    // Update locale selector
    const sel = root.querySelector('#locale-select');
    if (sel) {
      sel.value = currentLocale;
    }
    // Update HTML lang
    document.documentElement.lang = currentLocale === 'zh-TW' ? 'zh-TW' : currentLocale;
  }

  function setLocale(loc) {
    if (!SUPPORTED_LOCALES.includes(loc)) return;
    currentLocale = loc;
    try {
      localStorage.setItem(STORAGE_KEY, loc);
    } catch (e) { /* noop */ }
    applyStatic(document);
    // Notify app layer to re-render dynamic content (agent names, counts, chart)
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { locale: loc } }));
  }

  function detectAndSetLocale() {
    const loc = getLocale();
    currentLocale = loc;
    applyStatic(document);
  }

  // Expose API
  window.I18N = {
    t: t,
    term: term,
    agentName: agentName,
    getLocale: () => currentLocale,
    setLocale: setLocale,
    applyStatic: applyStatic,
    detectAndSetLocale: detectAndSetLocale,
    SUPPORTED_LOCALES: SUPPORTED_LOCALES,
    LOCALE_LABELS: {
      'zh-TW': '繁體中文',
      'en': 'English',
      'ja': '日本語',
      'ko': '한국어'
    }
  };

  // Auto-init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectAndSetLocale);
  } else {
    detectAndSetLocale();
  }
})();