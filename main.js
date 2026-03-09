document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 요소 가져오기 ---
    const elements = {
        topicInput: document.getElementById('topicInput'),
        toneButtons: document.getElementById('toneButtons'),
        platformButtons: document.getElementById('platformButtons'),
        generateBtn: document.getElementById('generateBtn'),
        resultContent: document.getElementById('resultContent'),
        emptyState: document.getElementById('emptyState'),
    };

    // --- 2. 이벤트 리스너 등록 ---
    elements.generateBtn.addEventListener('click', handleGenerateClick);
    elements.toneButtons.addEventListener('click', (e) => handleOptionClick(e, 'tone'));
    elements.platformButtons.addEventListener('click', (e) => handleOptionClick(e, 'platform'));

    // --- 3. 핵심 동작 함수 ---
    /** "대본 생성하기" 버튼 클릭 시 실행되는 메인 함수 */
    function handleGenerateClick() {
        const topic = elements.topicInput.value.trim();
        if (!topic) {
            alert('주제 또는 키워드를 입력해주세요.');
            elements.topicInput.focus();
            return;
        }

        const selectedTone = elements.toneButtons.querySelector('[data-active="true"]').dataset.value;
        const selectedPlatform = elements.platformButtons.querySelector('[data-active="true"]').dataset.value;

        showLoadingState();

        setTimeout(() => {
            const dummyResult = generateDummyContent(topic, selectedTone, selectedPlatform);
            renderResults(dummyResult);
        }, 1000);
    }

    // --- 4. 보조 함수들 ---
    /** 로딩 상태를 UI에 표시하는 함수 */
    function showLoadingState() {
        // 초기 안내 메시지가 있다면 숨깁니다.
        if (elements.emptyState) {
            elements.emptyState.style.display = 'none';
        }
        elements.resultContent.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                <h3 class="text-slate-100 font-bold text-xl">대본을 생성하고 있습니다...</h3>
                <p class="text-slate-500 text-sm">선택하신 옵션으로 최고의 대본을 만들고 있어요.</p>
            </div>
        `;
    }

    /** 생성된 결과를 화면에 그리는 함수 */
    function renderResults(htmlContent) {
        elements.resultContent.innerHTML = htmlContent;
    }

    /** 톤/플랫폼 버튼 클릭을 처리하는 함수 */
    function handleOptionClick(event, type) {
        const clickedButton = event.target.closest('button');
        if (!clickedButton) return;

        const buttonGroup = (type === 'tone') ? elements.toneButtons : elements.platformButtons;
        const allButtons = buttonGroup.querySelectorAll('button');

        allButtons.forEach(btn => {
            btn.setAttribute('data-active', 'false');
            if (type === 'tone') {
                btn.classList.remove('bg-primary', 'text-white', 'border-primary');
                btn.classList.add('bg-white/10', 'text-slate-300', 'border-slate-700');
            } else {
                btn.classList.remove('bg-white/10', 'text-primary', 'shadow-md');
                btn.classList.add('text-slate-400');
            }
        });

        clickedButton.setAttribute('data-active', 'true');
        if (type === 'tone') {
            clickedButton.classList.add('bg-primary', 'text-white', 'border-primary');
            clickedButton.classList.remove('bg-white/10', 'text-slate-300', 'border-slate-700');
        } else {
            clickedButton.classList.add('bg-white/10', 'text-primary', 'shadow-md');
            clickedButton.classList.remove('text-slate-400');
        }
    }

    /** 더미(가짜) 결과 HTML을 생성하는 렌더링 함수 */
    function generateDummyContent(topic, tone, platform) {
        const toneKor = {
            '재미있는': '재미있고',
            '정보성': '정보가 풍부하고',
            '감성적인': '감성을 자극하고',
            '전문적인': '전문적인 느낌의'
        }[tone] || '멋진';

        const sections = {
            '훅 (Hook) - 3가지': `
                <p>1. ${topic}, 이 영상 하나로 끝내세요.</p>
                <p class="mt-2">2. 아무도 알려주지 않았던 ${topic}의 비밀</p>
                <p class="mt-2">3. 당신의 시간을 10배 아껴줄 ${topic} 꿀팁</p>
            `,
            `${platform}용 30초 대본 (${toneKor})`: `
                <p><span class="font-bold text-primary/90">[0-3초: 강력한 오프닝]</span><br>'${topic}' 때문에 고민이신가요? 이 영상으로 단 30초 만에 해결해 드립니다.</p>
                <p class="mt-3"><span class="font-bold text-primary/90">[3-25초: 핵심 내용]</span><br>(빠른 템포의 음악 시작) 첫째, 핵심 포인트를 먼저 던지세요. 둘째, 어려운 전문 용어 대신 일상적인 단어를 사용하세요. 마지막으로, 시청자가 따라 할 수 있는 구체적인 행동을 하나 제시하는 겁니다.</p>
                <p class="mt-3"><span class="font-bold text-primary/90">[25-30초: 콜 투 액션]</span><br>이 방법이 도움이 되셨다면, 댓글에 '최고'라고 남겨주세요! 팔로우는 필수!</p>
            `,
            '자막용 문장 (5개)': `
                <p>1. ${topic}, 30초 만에 정복하기</p>
                <p class="mt-2">2. 시간 낭비는 이제 그만!</p>
                <p class="mt-2">3. 가장 중요한 1가지 비밀</p>
                <p class="mt-2">4. 지금 바로 적용해보세요</p>
                <p class="mt-2">5. 팔로우하고 더 많은 꿀팁 받기</p>
            `,
            '캡션': `
                <p>드디어 공개하는 ${topic} 비법! ✨<br>이 영상 하나로 여러분의 시간을 아껴드릴게요.<br>#${topic.replace(/\s+/g, '')} #꿀팁 #숏폼 #${platform}</p>
            `,
            '댓글 유도 문장': `
                <p>여러분만의 '${topic}' 꿀팁이 있다면 댓글로 공유해주세요! 👇</p>
            `
        };

        let html = '<div class="w-full h-full flex flex-col gap-4 text-sm text-slate-300 custom-scrollbar pr-2 overflow-y-auto">';
        for (const [title, content] of Object.entries(sections)) {
            html += `
                <div class="bg-background-dark/30 rounded-xl border border-slate-800/50 p-5 shadow-sm">
                    <h3 class="font-bold text-base text-slate-100 mb-3">${title}</h3>
                    <div class="text-slate-300/80 leading-relaxed space-y-2"> 
                        ${content}
                    </div>
                </div>
            `;
        }
        html += '</div>';

        return html;
    }

    // 초기 버튼 상태 설정
    document.querySelector('#toneButtons button').setAttribute('data-active', 'true');
    document.querySelector('#platformButtons button').setAttribute('data-active', 'true');

});
