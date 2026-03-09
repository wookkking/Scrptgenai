document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 상수 및 설정 ---
    const WORDS_PER_MINUTE = 130;
    // 더미 데이터 템플릿을 상수로 분리하여 가독성 향상
    const DUMMY_TEMPLATES = {
        '재미있는': {
            hook: [
                `{topic} 때문에 킹받았던 사람? 🙋‍♂️ 1분 안에 해결해드림.`,
                `이거 모르면 손해! {topic} 10초만에 끝내는 법.`,
                `아무도 몰랐던 {topic}의 충격적인 진실! 🤯`
            ],
            script_main: `(신나는 BGM) 여러분, {topic} 하나 때문에 스트레스 받으셨죠? 오늘 제가 종결해드립니다. 핵심은 딱 3가지! 첫째, OOO을 기억하세요. 둘째, XXX는 절대 하지 마세요. 마지막으로, 가장 중요한 건 바로 OOO입니다!`,
            cta: `어때요, 참 쉽죠? 이 방법이 마음에 들었다면 '좋아요' 한번만 꾹! 눌러주세요. 다음엔 더 미친 꿀팁으로 돌아올게요!`,
            captions: `#{topic_tag} #꿀팁 #핵인싸 #{platform}챌린지`,
            comment: `ㅋㅋㅋㅋㅋ 이거 완전 꿀팁이네요! 다들 {topic} 할 때 뭐까지 해봤어요?`
        },
        '정보성': {
            hook: [
                `{topic}에 대한 3가지 핵심 원칙을 알려드립니다.`,
                `이 영상을 통해 {topic}의 모든 것을 알아보세요.`,
                `전문가가 알려주는 {topic}의 정확한 방법.`
            ],
            script_main: `오늘은 {topic}에 대해 체계적으로 알아보겠습니다. 첫 번째 단계는 OOO입니다. 이는 OOO라는 원리 때문입니다. 두 번째로, XXX를 확인해야 합니다. 마지막으로 OOO를 통해 마무리합니다.`,
            cta: `더 궁금한 점이 있다면 댓글로 질문해주세요. 관련 정보가 도움이 되셨다면 '저장'해두고 필요할 때 다시 보세요.`,
            captions: `#{topic_tag} #정보 #팁 #{platform}교실`,
            comment: `오늘도 유익한 정보 감사합니다. 혹시 {topic}와 관련해서 OOO에 대해서도 다뤄주실 수 있나요?`
        },
        '감성적인': {
            hook: [
                `가끔은 {topic}이 우리에게 가르쳐주는 것들.`,
                `힘들었던 당신에게, {topic}이 주는 작은 위로.`,
                `기억하시나요? 우리의 {topic}.`
            ],
            script_main: `(잔잔한 피아노 음악) 우리는 살아가면서 종종 {topic}이라는 순간을 마주합니다. 그럴 때마다 좌절하고 힘들어하지만, 돌이켜보면 그 순간들이 우리를 더 단단하게 만들었죠. OOO을 기억하고, XXX을 놓아주세요.`,
            cta: `오늘 하루, 당신의 {topic}은 어땠나요? 당신의 이야기를 들려주세요. '공유'를 통해 소중한 사람에게 이 영상을 선물하는 건 어떨까요?`,
            captions: `#{topic_tag} #감성 #위로 #공감 #{platform}감성`,
            comment: `요즘 {topic} 때문에 힘들었는데, 영상 보고 많이 위로받았어요. 감사합니다.`
        },
        '전문적인': {
            hook: [
                `2024년, {topic}의 최신 트렌드 분석.`,
                `{topic} 시장의 판도를 바꿀 핵심 전략.`,
                `데이터로 증명된 {topic} 성공 방정식.`
            ],
            script_main: `본 영상에서는 {topic}의 전략적 접근법에 대해 논의하겠습니다. 첫째, OOO 지표를 분석하여 기회를 포착해야 합니다. 둘째, XXX 프레임워크를 적용하여 프로세스를 최적화합니다. 마지막으로, YYY를 통해 지속가능성을 확보해야 합니다.`,
            cta: `귀사의 {topic} 전략에 대한 심도 깊은 컨설팅이 필요하시면 프로필 링크를 확인해주십시오. 이 정보가 유용했다면 '팔로우'하여 더 많은 인사이트를 얻어가세요.`,
            captions: `#{topic_tag} #비즈니스 #전략 #인사이트 #{platform}비즈니스`,
            comment: `정확한 데이터 기반 분석이 인상적이네요. {topic}에 대한 다음 리포트도 기대하겠습니다.`
        }
    };

    // --- 2. DOM 요소 관리 ---
    const elements = {
        topicInput: document.getElementById('topicInput'),
        toneButtons: document.getElementById('toneButtons'),
        platformButtons: document.getElementById('platformButtons'),
        generateBtn: document.getElementById('generateBtn'),
        resultContent: document.getElementById('resultContent'),
        copyBtn: document.getElementById('copyBtn'),
        timeEstimate: document.getElementById('timeEstimate'),
        readingSpeed: document.getElementById('readingSpeed'),
    };
    const initialResultHTML = elements.resultContent.innerHTML;

    // --- 3. 상태 관리 ---
    let isResultGenerated = false;

    // --- 4. 초기화 ---
    initEventListeners();

    // --- 5. 이벤트 리스너 ---
    function initEventListeners() {
        elements.generateBtn.addEventListener('click', handleGenerateClick);
        elements.toneButtons.addEventListener('click', (e) => handleOptionClick(e, 'tone'));
        elements.platformButtons.addEventListener('click', (e) => handleOptionClick(e, 'platform'));
        elements.copyBtn.addEventListener('click', handleCopyClick);
    }

    // --- 6. 핵심 로직 핸들러 ---

    /** 대본 생성 버튼 클릭 처리 */
    function handleGenerateClick() {
        const topic = elements.topicInput.value.trim();
        if (!topic) {
            alert('주제 또는 키워드를 입력해주세요.');
            elements.topicInput.focus();
            return;
        }

        displayLoadingState();

        // --- ※ AI API 연동 지점 ※ ---
        // 아래 setTimeout을 실제 API 호출 코드로 대체합니다.
        // 예: const result = await callAiApi(topic, tone, platform);
        setTimeout(() => {
            const selectedTone = getSelectedOption('tone');
            const selectedPlatform = getSelectedOption('platform');
            const dummyResult = generateDummyContent(topic, selectedTone, selectedPlatform);
            renderResults(dummyResult);
        }, 1000);
    }

    /** 복사 버튼 클릭 처리 */
    function handleCopyClick() {
        if (!isResultGenerated) {
            alert('복사할 결과가 없습니다. 먼저 대본을 생성해주세요.');
            return;
        }
        const textToCopy = convertResultToText();

        navigator.clipboard.writeText(textToCopy).then(() => {
            updateCopyButtonState(true);
            setTimeout(() => updateCopyButtonState(false), 1500);
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
            alert('결과 복사에 실패했습니다.');
        });
    }

    /** 톤/플랫폼 선택 버튼 클릭 처리 */
    function handleOptionClick(event, type) {
        const clickedButton = event.target.closest('button');
        if (!clickedButton) return;

        const buttonGroup = type === 'tone' ? elements.toneButtons : elements.platformButtons;
        
        buttonGroup.querySelectorAll('button').forEach(btn => {
            const isActive = btn === clickedButton;
            btn.setAttribute('data-active', isActive);
            updateButtonStyles(btn, isActive, type);
        });
    }

    // --- 7. UI 업데이트 ---

    /** 로딩 상태 표시 */
    function displayLoadingState() {
        isResultGenerated = false;
        resetResultInfo();
        elements.resultContent.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                <h3 class="text-slate-100 font-bold text-xl">대본을 생성하고 있습니다...</h3>
                <p class="text-slate-500 text-sm">선택하신 옵션으로 최고의 대본을 만들고 있어요.</p>
            </div>
        `;
        elements.resultContent.className = 'flex-1 flex flex-col border-2 border-dashed border-primary/20 rounded-2xl bg-white/50 dark:bg-background-dark/20 overflow-hidden';
    }

    /** 결과 렌더링 */
    function renderResults(htmlContent) {
        elements.resultContent.innerHTML = htmlContent;
        elements.resultContent.className = 'flex-1 flex flex-col overflow-hidden p-2';
        isResultGenerated = true;

        const scriptText = elements.resultContent.querySelector(".script-main-content")?.innerText || '';
        estimateReadingTime(scriptText);
    }

    /** 버튼 활성/비활성 스타일 업데이트 */
    function updateButtonStyles(button, isActive, type) {
        if (type === 'tone') {
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('bg-white', !isActive);
            button.classList.toggle('dark:bg-background-dark/40', !isActive);
            button.classList.toggle('text-slate-600', !isActive);
            button.classList.toggle('dark:text-slate-400', !isActive);
        } else {
            button.classList.toggle('bg-white', isActive);
            button.classList.toggle('dark:bg-background-dark', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('text-primary', isActive);
            button.classList.toggle('text-slate-500', !isActive);
        }
    }
    
    /** 복사 버튼 상태 업데이트 (복사/복사됨) */
    function updateCopyButtonState(isCopied) {
        if(isCopied) {
            elements.copyBtn.innerHTML = `<span class="material-symbols-outlined text-sm">check</span> 복사됨`;
            elements.copyBtn.classList.add('bg-green-500/20', 'text-green-500');
        } else {
            elements.copyBtn.innerHTML = `<span class="material-symbols-outlined text-sm">content_copy</span> 복사`;
            elements.copyBtn.classList.remove('bg-green-500/20', 'text-green-500');
        }
    }

    /** 결과 정보(예상 시간 등) 초기화 */
    function resetResultInfo() {
        elements.timeEstimate.textContent = '예상 소요 시간: 0s';
        elements.readingSpeed.textContent = `예상 읽기 속도: ${WORDS_PER_MINUTE} wpm`;
    }
    
    // --- 8. 데이터 처리/계산 ---

    /** 선택된 옵션 값 가져오기 */
    function getSelectedOption(type) {
        const group = type === 'tone' ? elements.toneButtons : elements.platformButtons;
        return group.querySelector('[data-active="true"]').dataset.value;
    }

    /** 예상 소요 시간 계산 및 표시 */
    function estimateReadingTime(text) {
        const characterCount = text.length;
        if (characterCount === 0) {
            resetResultInfo();
            return;
        }
        const wordCount = characterCount / 3; // 평균 3글자당 1단어 가정
        const seconds = Math.round((wordCount / WORDS_PER_MINUTE) * 60);
        elements.timeEstimate.textContent = `예상 소요 시간: ${seconds}s`;
    }

    /** 더미 데이터 생성 */
    function generateDummyContent(topic, tone, platform) {
        const template = DUMMY_TEMPLATES[tone] || DUMMY_TEMPLATES['정보성'];
        const toneKor = {
            '재미있는': '재미있고',
            '정보성': '정보가 풍부하고',
            '감성적인': '감성을 자극하고',
            '전문적인': '전문적인 느낌의'
        }[tone] || '멋진';

        const sections = {
            '훅 (Hook) - 3가지': template.hook.map(h => `<p>${h.replace('{topic}', topic)}</p>`).join(''),
            [`${platform}용 30초 대본 (${toneKor})`]: `
                <p><span class="font-bold text-primary/90">[0-3초: 강력한 오프닝]</span><br>${template.hook[0].replace('{topic}', topic)}</p>
                <p class="mt-3 script-main-content"><span class="font-bold text-primary/90">[3-25초: 핵심 내용]</span><br>${template.script_main.replace(/{topic}/g, topic)}</p>
                <p class="mt-3"><span class="font-bold text-primary/90">[25-30초: 콜 투 액션]</span><br>${template.cta.replace(/{topic}/g, topic)}</p>
            `,
            '자막용 문장 (5개)': template.hook.map((h, i) => `<p>${i+1}. ${h.replace('{topic}', topic)}</p>`).join('<div class="mt-2"></div>'),
            '캡션': `<p>${template.captions.replace('{topic_tag}', topic.replace(/\s+/g, '')).replace('{platform}', platform)}</p>`,
            '댓글 유도 문장': `<p>${template.comment.replace(/{topic}/g, topic)}</p>`
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

    /** 결과를 텍스트로 변환 */
    function convertResultToText() {
        let text = '';
        elements.resultContent.querySelectorAll('.bg-background-dark\/30').forEach(card => {
            const title = card.querySelector('h3').innerText;
            const content = card.querySelector('div').innerText.replace(/\n\s*\n/g, '\n');
            text += `--- ${title} ---\n${content}\n\n`;
        });
        return text.trim();
    }
});
