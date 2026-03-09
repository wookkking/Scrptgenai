document.addEventListener('DOMContentLoaded', () => {
    // ==================================================================================
    // 1. 설정 및 상수 (Configuration & Constants)
    // ==================================================================================
    const STORAGE_KEY = 'scriptGenAI_mvp';

    const PLAN_LIMITS = {
        free: { dailyGenerations: 3, maxTemplates: 2, maxHistory: 10 },
        pro: { dailyGenerations: 100, maxTemplates: 50, maxHistory: 1000 }
    };

    const TONES = ['재미있는', '정보성', '감성적인', '전문적인'];
    const PLATFORMS = ['쇼츠', '릴스', '틱톡'];

    // ==================================================================================
    // 2. DOM 요소 관리 (DOM Element Management)
    // ==================================================================================
    const elements = {
        navMenu: document.getElementById('navMenu'),
        planDisplay: document.getElementById('plan-display'),
        upgradeBtn: document.getElementById('upgradeBtn'),
        dailyGenerationsCount: document.getElementById('daily-generations-count'),
        templateCount: document.getElementById('template-count'),
        views: {
            home: document.getElementById('view-home'),
            history: document.getElementById('view-history'),
            templates: document.getElementById('view-templates'),
            settings: document.getElementById('view-settings'),
        },
        topicInput: document.getElementById('topicInput'),
        toneButtons: document.getElementById('toneButtons'),
        platformButtons: document.getElementById('platformButtons'),
        generateBtn: document.getElementById('generateBtn'),
        saveTemplateBtn: document.getElementById('saveTemplateBtn'),
        resultContent: document.getElementById('resultContent'),
        historyListContainer: document.getElementById('history-list-container'),
        templateListContainer: document.getElementById('template-list-container'),
        settingsForm: document.getElementById('settingsForm'),
        defaultToneSelect: document.getElementById('defaultToneSelect'),
        defaultPlatformSelect: document.getElementById('defaultPlatformSelect'),
        readingSpeedInput: document.getElementById('readingSpeedInput'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        settingsSaveMsg: document.getElementById('settingsSaveMsg'),
    };

    // ==================================================================================
    // 3. 상태 관리 (State Management)
    // ==================================================================================
    let state;

    function getDefaultState() {
        return {
            currentPlan: 'free',
            usage: { dailyGenerations: 0, lastUsedDate: new Date().toISOString().split('T')[0] },
            settings: { defaultTone: '재미있는', defaultPlatform: '릴스', readingSpeed: 130 },
            history: [],
            templates: [],
        };
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function loadState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        state = savedState ? JSON.parse(savedState) : getDefaultState();
    }

    // ==================================================================================
    // 4. 앱 초기화 (App Initialization)
    // ==================================================================================
    function initializeApp() {
        loadState();
        resetUsageIfNewDay();
        saveState();
        createDynamicButtons();
        initEventListeners();
        updateUsageDisplay();
        navigateTo('home');
    }

    initializeApp(); // 앱 실행

    // ==================================================================================
    // 5. 이벤트 리스너 및 동적 UI 생성 (Event Listeners & Dynamic UI)
    // ==================================================================================
    function createDynamicButtons() {
        TONES.forEach(tone => {
            elements.toneButtons.innerHTML += `<button data-value="${tone}" class="px-6 py-3 rounded-lg font-bold transition-all">${tone}</button>`;
            elements.defaultToneSelect.innerHTML += `<option value="${tone}">${tone}</option>`;
        });
        PLATFORMS.forEach(platform => {
            elements.platformButtons.innerHTML += `<button data-value="${platform}" class="px-6 py-3 rounded-lg font-bold transition-all">${platform}</button>`;
            elements.defaultPlatformSelect.innerHTML += `<option value="${platform}">${platform}</option>`;
        });
    }

    function initEventListeners() {
        elements.navMenu.addEventListener('click', handleNavClick);
        elements.generateBtn.addEventListener('click', handleGenerateClick);
        elements.saveTemplateBtn.addEventListener('click', handleSaveTemplateClick);
        elements.saveSettingsBtn.addEventListener('click', saveSettings);
        elements.upgradeBtn.addEventListener('click', () => alert('Pro 플랜 업그레이드는 준비 중입니다!'));

        [elements.toneButtons, elements.platformButtons].forEach(container => {
            container.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (!button) return;
                container.querySelectorAll('button').forEach(btn => btn.dataset.active = 'false');
                button.dataset.active = 'true';
                updateAllButtonStyles();
            });
        });

        // 복사 버튼 이벤트 위임
        elements.resultContent.addEventListener('click', (event) => {
            const copyBtn = event.target.closest('.copy-btn');
            if (copyBtn) {
                const contentToCopy = copyBtn.closest('.result-card').querySelector('.result-card-content').textContent;
                navigator.clipboard.writeText(contentToCopy).then(() => {
                    copyBtn.textContent = '복사 완료!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = '복사';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('복사 실패:', err);
                    alert('클립보드 복사에 실패했습니다.');
                });
            }
        });
    }

    // ==================================================================================
    // 6. 핵심 로직 핸들러 (Core Logic Handlers)
    // ==================================================================================
    function handleNavClick(event) {
        const target = event.target.closest('.nav-item');
        if (target) {
            event.preventDefault();
            navigateTo(target.dataset.view);
        }
    }

    function handleGenerateClick() {
        if (!checkUsageLimit('dailyGenerations')) return;
        const topic = elements.topicInput.value.trim();
        if (!topic) {
            alert('주제 또는 키워드를 입력해주세요.');
            return;
        }
        displayLoadingState();
        setTimeout(() => {
            const tone = getSelectedOption('tone');
            const platform = getSelectedOption('platform');
            
            // 더미 데이터 구조 변경
            const generatedContent = {
                '훅 (Hook) - 3가지': [
                    `1. ${topic}에 대해 아무도 말해주지 않는 진실. 충격주의! `,
                    `2. 이 영상을 보고 ${topic}에 대한 생각이 180도 바뀌었습니다. `,
                    `3. 단 30초만 투자하세요. ${topic} 전문가가 되는 가장 빠른 방법.`
                ].join('\n'),
                '30초 대본 (예상 소요 시간: 30초)': `(오프닝 음악과 함께 화면 전환)\n안녕하세요! 오늘은 모두가 궁금해하는 '${topic}'에 대해 이야기해볼게요. (핵심 내용 1 설명)... (핵심 내용 2 설명)... (마무리 멘트와 함께 다음 영상 예고)`,
                '자막용 문장 (5개)': [
                    `* ${topic}, 이것만 알면 끝?`,
                    `* 충격적인 ${topic}의 실체`,
                    `* 전문가도 놀란 ${topic} 비법`,
                    `* 지금 바로 확인해야 할 ${topic} 트렌드`,
                    `* 당신만 모르고 있던 ${topic} 이야기`
                ].join('\n'),
                '캡션': `#${topic.replace(/\s/g, ''')} #${platform}꿀팁 #추천 #fyp #viral`,
                '댓글 유도 문장': `여러분이 알고 있는 ${topic}에 대한 다른 꿀팁이 있다면 댓글로 알려주세요! 👇`
            };

            renderResults(generatedContent);

            state.usage.dailyGenerations++;
            addHistoryItem({ topic, tone, platform, script: generatedContent, createdAt: new Date().toISOString() });
            updateUsageDisplay();
        }, 1000);
    }

    function handleSaveTemplateClick() {
        if (!checkUsageLimit('maxTemplates')) return;
        const topic = elements.topicInput.value.trim();
        if (!topic) {
            alert('템플릿으로 저장할 주제를 먼저 입력해주세요.');
            return;
        }
        const name = prompt('저장할 템플릿의 이름을 입력해주세요:', topic);
        if (!name) return;
        const newTemplate = { id: Date.now(), name, topic, tone: getSelectedOption('tone'), platform: getSelectedOption('platform'), createdAt: new Date().toISOString() };
        addTemplate(newTemplate);
        alert(`'${name}' 템플릿이 저장되었습니다.`);
    }

    // ==================================================================================
    // 7. UI 업데이트 (UI Updates)
    // ==================================================================================
    function navigateTo(viewName) {
        Object.values(elements.views).forEach(view => view.classList.add('hidden'));
        elements.views[viewName]?.classList.remove('hidden');
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('bg-white/10', item.dataset.view === viewName);
        });
        if (viewName === 'home') applySettingsToHome();
        else if (viewName === 'history') renderHistoryList();
        else if (viewName === 'templates') renderTemplateList();
        else if (viewName === 'settings') loadSettingsToUI();
    }

    function updateUsageDisplay() {
        const limits = PLAN_LIMITS[state.currentPlan];
        elements.dailyGenerationsCount.textContent = `${state.usage.dailyGenerations}/${limits.dailyGenerations}`;
        elements.templateCount.textContent = `${state.templates.length}/${limits.maxTemplates}`;
    }

    function updateAllButtonStyles() {
        elements.toneButtons.querySelectorAll('button').forEach(btn => updateButtonStyles(btn, btn.dataset.active === 'true', 'tone'));
        elements.platformButtons.querySelectorAll('button').forEach(btn => updateButtonStyles(btn, btn.dataset.active === 'true', 'platform'));
    }

    function updateButtonStyles(button, isActive, type) {
        if (type === 'tone') {
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('shadow-lg', isActive);
            button.classList.toggle('bg-background-dark/20', !isActive);
            button.classList.toggle('text-slate-300', !isActive);
        } else { // platform
            button.classList.toggle('dark:bg-background-dark', isActive);
            button.classList.toggle('text-primary', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('text-slate-500', !isActive);
            button.classList.toggle('bg-transparent', !isActive);
        }
    }

    function displayLoadingState() {
        elements.resultContent.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-primary animate-pulse"><span class="material-symbols-outlined text-6xl">auto_awesome</span><p class="mt-4 text-lg font-bold">AI가 대본을 생성하고 있습니다.</p></div>`;
    }

    function renderResults(content) {
        elements.resultContent.innerHTML = ''; // Clear previous results
        elements.resultContent.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4', 'p-4');

        for (const [title, text] of Object.entries(content)) {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <div class="result-card-header">
                    <h3 class="result-card-title">${title}</h3>
                    <button class="copy-btn">복사</button>
                </div>
                <pre class="result-card-content">${text}</pre>
            `;
            elements.resultContent.appendChild(card);
        }
    }

    function renderHistoryList() { /* Implementation needed */ }
    function renderTemplateList() { /* Implementation needed */ }

    function loadSettingsToUI() {
        elements.defaultToneSelect.value = state.settings.defaultTone;
        elements.defaultPlatformSelect.value = state.settings.defaultPlatform;
        elements.readingSpeedInput.value = state.settings.readingSpeed;
    }

    function applySettingsToHome() {
        elements.toneButtons.querySelectorAll('button').forEach(btn => btn.dataset.active = (btn.dataset.value === state.settings.defaultTone));
        elements.platformButtons.querySelectorAll('button').forEach(btn => btn.dataset.active = (btn.dataset.value === state.settings.defaultPlatform));
        updateAllButtonStyles();
    }

    // ==================================================================================
    // 8. 데이터 및 유틸리티 (Data & Utilities)
    // ==================================================================================
    function checkUsageLimit(type) {
        const { currentPlan, usage, templates } = state;
        const limit = PLAN_LIMITS[currentPlan][type];
        const current = type === 'dailyGenerations' ? usage.dailyGenerations : templates.length;
        if (current >= limit) {
            alert(`무료 플랜의 ${type === 'dailyGenerations' ? '하루 생성 횟수' : '템플릿 저장 개수'}(${limit}개)를 모두 사용하셨습니다.\nPro 플랜으로 업그레이드하여 제한 없이 이용해보세요!`);
            return false;
        }
        return true;
    }

    function resetUsageIfNewDay() {
        const today = new Date().toISOString().split('T')[0];
        if (state.usage.lastUsedDate !== today) {
            state.usage.dailyGenerations = 0;
            state.usage.lastUsedDate = today;
            saveState();
        }
    }

    function addHistoryItem(item) {
        state.history.unshift(item);
        const limit = PLAN_LIMITS[state.currentPlan].maxHistory;
        if (state.history.length > limit) {
            state.history = state.history.slice(0, limit);
        }
        saveState();
    }

    function addTemplate(template) {
        state.templates.unshift(template);
        saveState();
        updateUsageDisplay();
    }

    function getSelectedOption(type) {
        const container = type === 'tone' ? elements.toneButtons : elements.platformButtons;
        return container.querySelector('button[data-active="true"]')?.dataset.value;
    }

    function saveSettings() {
        const newSpeed = parseInt(elements.readingSpeedInput.value, 10);
        if (isNaN(newSpeed) || newSpeed < 50 || newSpeed > 300) {
            alert('읽기 속도는 50에서 300 사이의 숫자여야 합니다.');
            return;
        }
        state.settings.defaultTone = elements.defaultToneSelect.value;
        state.settings.defaultPlatform = elements.defaultPlatformSelect.value;
        state.settings.readingSpeed = newSpeed;
        saveState();
        elements.settingsSaveMsg.textContent = '설정이 저장되었습니다!';
        setTimeout(() => { elements.settingsSaveMsg.textContent = ''; }, 3000);
    }
});
