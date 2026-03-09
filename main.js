document.addEventListener('DOMContentLoaded', () => {
    // ==================================================================================
    // 1. 설정 및 상수 (Configuration & Constants)
    // ==================================================================================
    const STORAGE_KEY = 'scriptGenAI_mvp';

    /**
     * 각 플랜별 제한 사항 정의
     * - 나중에 Pro 플랜을 추가하려면 이 객체에 `pro: { ... }` 를 추가하면 됩니다.
     */
    const PLAN_LIMITS = {
        free: {
            dailyGenerations: 3,
            maxTemplates: 2,
            maxHistory: 10
        },
        pro: {
            dailyGenerations: 100, // 예시 값
            maxTemplates: 50,    // 예시 값
            maxHistory: 1000   // 예시 값
        }
    };

    // ==================================================================================
    // 2. DOM 요소 관리 (DOM Element Management)
    // ==================================================================================
    const elements = {
        // Navigation
        navMenu: document.getElementById('navMenu'),
        // Plan & Usage
        planDisplay: document.getElementById('plan-display'),
        upgradeBtn: document.getElementById('upgradeBtn'),
        dailyGenerationsCount: document.getElementById('daily-generations-count'),
        templateCount: document.getElementById('template-count'),
        // Views
        views: { /* ... */ },
        // Home View
        topicInput: document.getElementById('topicInput'),
        toneButtons: document.getElementById('toneButtons'),
        platformButtons: document.getElementById('platformButtons'),
        generateBtn: document.getElementById('generateBtn'),
        saveTemplateBtn: document.getElementById('saveTemplateBtn'),
        resultContent: document.getElementById('resultContent'),
        // History View
        historyListContainer: document.getElementById('history-list-container'),
        // Settings View
        settingsForm: document.getElementById('settingsForm'),
        /* ... */
    };
    const initialResultHTML = elements.resultContent.innerHTML;

    // ==================================================================================
    // 3. 상태 관리 (State Management)
    // ==================================================================================
    let state;

    function getDefaultState() {
        return {
            // 현재는 'free'로 고정. 로그인/결제 기능 추가 시 이 값을 동적으로 변경.
            currentPlan: "free", 
            usage: {
                dailyGenerations: 0,
                lastUsedDate: new Date().toISOString().split('T')[0]
            },
            settings: { /* ... */ },
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
        
        initEventListeners();
        updateUsageDisplay();
        applySettingsToHome();
        navigateTo('home');
    }

    initializeApp();

    // ==================================================================================
    // 5. 이벤트 리스너 (Event Listeners)
    // ==================================================================================
    function initEventListeners() {
        elements.navMenu.addEventListener('click', handleNavClick);
        elements.generateBtn.addEventListener('click', handleGenerateClick);
        elements.saveTemplateBtn.addEventListener('click', handleSaveTemplateClick);
        elements.upgradeBtn.addEventListener('click', () => {
            alert('Pro 플랜으로 업그레이드하여 더 많은 기능을 사용해보세요! (현재 준비 중입니다.)');
        });
        // ... (기타 리스너)
    }

    // ==================================================================================
    // 6. 핵심 로직 핸들러 (Core Logic Handlers)
    // ==================================================================================
    
    function handleGenerateClick() {
        const canGenerate = checkUsageLimit('dailyGenerations');
        if (!canGenerate) return;

        // ... 생성 로직 (이전과 동일)
        // 생성 성공 후:
        state.usage.dailyGenerations++;
        addHistoryItem(newHistoryItem);
        saveState();
        updateUsageDisplay();
    }

    function handleSaveTemplateClick() {
        const canSave = checkUsageLimit('maxTemplates');
        if (!canSave) return;
        
        // ... 템플릿 저장 로직 (이전과 동일)
        // 저장 성공 후:
        addTemplate(newTemplate);
        updateUsageDisplay();
    }

    // ==================================================================================
    // 7. UI 업데이트 (UI Updates)
    // ==================================================================================

    /** 사이드바의 사용량 정보를 업데이트합니다. */
    function updateUsageDisplay() {
        const limits = PLAN_LIMITS[state.currentPlan];
        elements.planDisplay.textContent = `${state.currentPlan} plan`;
        elements.dailyGenerationsCount.textContent = `${state.usage.dailyGenerations}/${limits.dailyGenerations}`;
        elements.templateCount.textContent = `${state.templates.length}/${limits.maxTemplates}`;
    }

    // ... (navigateTo, renderHistoryList 등 UI 함수들)

    // ==================================================================================
    // 8. 데이터 및 유틸리티 (Data & Utilities)
    // ==================================================================================

    /**
     * 현재 플랜의 특정 사용량 제한을 확인하고, 초과 시 안내 메시지를 표시합니다.
     * @param {'dailyGenerations' | 'maxTemplates' | 'maxHistory'} type - 확인할 제한 종류
     * @returns {boolean} - 사용 가능 여부
     */
    function checkUsageLimit(type) {
        const limits = PLAN_LIMITS[state.currentPlan];
        let currentUsage;
        let limit;
        let message = '';

        switch (type) {
            case 'dailyGenerations':
                currentUsage = state.usage.dailyGenerations;
                limit = limits.dailyGenerations;
                message = `하루 생성 횟수(${limit}회)를 모두 사용하셨습니다.`;
                break;
            case 'maxTemplates':
                currentUsage = state.templates.length;
                limit = limits.maxTemplates;
                message = `템플릿은 최대 ${limit}개까지 저장할 수 있습니다.`;
                break;
            // 히스토리 제한은 addHistoryItem 내에서 별도 처리 (가장 오래된 것부터 자동 삭제)
            default:
                return true;
        }

        if (currentUsage >= limit) {
            alert(`${message}\nPro 플랜으로 업그레이드하여 제한 없이 이용해보세요!`);
            return false;
        }
        return true;
    }

    /** 날짜가 바뀌면 일일 사용량을 초기화합니다. */
    function resetUsageIfNewDay() {
        const today = new Date().toISOString().split('T')[0];
        if (state.usage.lastUsedDate !== today) {
            state.usage.dailyGenerations = 0;
            state.usage.lastUsedDate = today;
        }
    }

    /** 히스토리 아이템을 추가하고, 최대 개수 제한을 적용합니다. */
    function addHistoryItem(item) {
        if (!item) return;
        const limit = PLAN_LIMITS[state.currentPlan].maxHistory;
        
        state.history.unshift(item);
        
        if (state.history.length > limit) {
            state.history = state.history.slice(0, limit);
        }
    }

    // ... (나머지 create, add, get, save 함수들)
});
