document.addEventListener('DOMContentLoaded', () => {
    // ... (상수, DOM 요소, 상태 관리)

    // ==================================================================================
    // 4. 앱 초기화 (App Initialization)
    // ==================================================================================
    function initializeApp() {
        loadState();
        resetUsageIfNewDay();
        saveState();
        
        createDynamicButtons(); // 이 함수가 수정됩니다.
        initEventListeners();
        updateUsageDisplay();
        navigateTo('home');
    }

    // ==================================================================================
    // 5. 이벤트 리스너 및 동적 UI 생성 (Event Listeners & Dynamic UI)
    // ==================================================================================
    /**
     * Tailwind 유틸리티 클래스를 직접 사용하여 동적 버튼을 생성합니다.
     */
    function createDynamicButtons() {
        TONES.forEach(tone => {
            // `btn-tone` 대신 Tailwind 클래스 직접 추가
            elements.toneButtons.innerHTML += `<button data-value="${tone}" class="px-6 py-3 rounded-lg font-bold transition-all">${tone}</button>`;
            elements.defaultToneSelect.innerHTML += `<option value="${tone}">${tone}</option>`;
        });
        PLATFORMS.forEach(platform => {
            // `btn-platform` 대신 Tailwind 클래스 직접 추가
            elements.platformButtons.innerHTML += `<button data-value="${platform}" class="px-6 py-3 rounded-lg font-bold transition-all">${platform}</button>`;
            elements.defaultPlatformSelect.innerHTML += `<option value="${platform}">${platform}</option>`;
        });
    }

    // ... initEventListeners ...

    // ==================================================================================
    // 7. UI 업데이트 (UI Updates)
    // ==================================================================================
    
    // ... navigateTo, updateUsageDisplay ...
    
    function updateAllButtonStyles() {
        elements.toneButtons.querySelectorAll('button').forEach(btn => updateButtonStyles(btn, btn.dataset.active === 'true', 'tone'));
        elements.platformButtons.querySelectorAll('button').forEach(btn => updateButtonStyles(btn, btn.dataset.active === 'true', 'platform'));
    }

    /**
     * 버튼의 활성/비활성 상태에 따라 Tailwind 클래스를 토글(toggle)합니다.
     */
    function updateButtonStyles(button, isActive, type) {
        if (type === 'tone') {
            // Active
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('shadow-lg', isActive);
            // Inactive
            button.classList.toggle('bg-background-dark/20', !isActive);
            button.classList.toggle('text-slate-300', !isActive);
        } else { // platform
            // Active
            button.classList.toggle('dark:bg-background-dark', isActive);
            button.classList.toggle('text-primary', isActive);
            button.classList.toggle('shadow-sm', isActive);
            // Inactive
            button.classList.toggle('text-slate-500', !isActive);
            button.classList.toggle('bg-transparent', !isActive);
        }
    }

    // ... (나머지 코드, 이전과 동일)
});