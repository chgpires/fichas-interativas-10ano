(() => {
  const answers = {
    'q1-1': ['1.20e24'], 'q1-2': ['3.011e23'], 'q1-3': ['3.613e24'], 'q1-4': ['1.054e25'],
    'q2-1': ['0.1'], 'q2-2': ['0.5'], 'q2-3': ['66.42'],
    'q3-1': ['18.02'], 'q3-2': ['126.05'], 'q3-3': ['74.10'], 'q3-4': ['63.0'], 'q3-5': ['180.18'],
    'q4-1': ['0.1998'], 'q4-2': ['4.37'], 'q4-3': ['2.93e-5'], 'q4-4': ['0.457'],
    'q5': ['helium'],
    'q6-a': ['6.022e23'], 'q6-b': ['3'], 'q6-c': ['1.807e24'],
    'q7-1': ['0.1995'], 'q7-2': ['1.201e23'], 'q7-3': ['3.604e23'], 'q7-4': ['9.611e23'],
    'q8-1': ['20.018'], 'q8-2': ['150.29'], 'q8-3': ['9.57'], 'q8-4': ['49.925'],
    'q9-nh3-n': ['0.20'], 'q9-nh3-m': ['3.408'], 'q9-nh3-M': ['17.04'], 'q9-nh3-mol': ['1.20e23'], 'q9-nh3-N': ['1.20e23'], 'q9-nh3-H': ['3.613e23'],
    'q9-n2h4-n': ['4.002'], 'q9-n2h4-m': ['128.30'], 'q9-n2h4-M': ['32.06'], 'q9-n2h4-mol': ['2.41e24'], 'q9-n2h4-N': ['4.82e24'], 'q9-n2h4-H': ['9.64e24'],
    'q10-1': ['0.025'], 'q10-2-1': ['1.5055e22'], 'q10-2-2': ['0.150'], 'q10-2-3': ['3.011e22'], 'q11': ['1']
  };
  const inputs = [...document.querySelectorAll('[data-answer]')];
  const status = document.getElementById('overall-status');
  const total = inputs.length;

  function numericValue(text) {
    let value = text.trim().toLowerCase().replace(/[−–]/g, '-').replace(/,/g, '.');
    value = value.replace(/[x×*]\s*10\s*\^?\s*([+-]?\d+)/g, 'e$1');
    value = value.replace(/\s*e\s*([+-]?)\s*(\d+)/g, 'e$1$2');
    const numberPattern = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?';
    const expression = value.match(new RegExp(`^\\s*${numberPattern}(?:\\s*[x×*]\\s*${numberPattern})*`, 'i'));
    if (!expression) return NaN;
    const factors = expression[0].split(/\s*[x×*]\s*/).map(Number);
    const number = factors.reduce((product, factor) => product * factor, 1);
    return Number.isFinite(number) ? number : NaN;
  }

  function matches(input, typed) {
    const key = input.dataset.answer;
    const expected = answers[key] || [];
    if (key === 'q5') {
      const v = typed.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const hasHelium = /helio/.test(v);
      const hasReason = /3[.,]?011\s*(?:(?:x|×|\*)\s*10\s*\^?\s*20|e\s*\+?\s*20|10\s*\^?\s*20)/.test(v);
      return hasHelium && hasReason;
    }
    const actual = numericValue(typed);
    if (!Number.isFinite(actual)) return false;
    return expected.some(candidate => {
      const target = Number(candidate);
      const tolerance = Math.max(Math.abs(target) * 0.006, 0.0000000000000001);
      return Math.abs(actual - target) <= tolerance;
    });
  }

  function check(input) {
    const feedback = input.closest('.answer-item,td').querySelector('.feedback');
    const typed = input.value.trim();
    if (!typed) {
      input.removeAttribute('aria-invalid');
      if (feedback) { feedback.textContent = 'Ainda não respondeste.'; feedback.className = 'feedback neutral'; }
      return 'empty';
    }
    const correct = matches(input, typed);
    input.setAttribute('aria-invalid', String(!correct));
    if (feedback) {
      feedback.textContent = correct ? 'Atividade concluída com sucesso!' : 'Resposta incorreta. Revê o cálculo e tenta novamente.';
      feedback.className = `feedback ${correct ? 'success' : 'error'}`;
    }
    return correct ? 'correct' : 'incorrect';
  }

  function checkAll() {
    const results = inputs.map(check);
    const correct = results.filter(result => result === 'correct').length;
    const empty = results.filter(result => result === 'empty').length;
    status.className = 'overall-status';
    if (empty === total) status.textContent = 'Ainda não respondeste.';
    else if (empty) status.textContent = `${correct} de ${total} respostas corretas. Há respostas por preencher.`;
    else status.textContent = `${correct} de ${total} respostas corretas.`;
  }

  document.getElementById('check-all').addEventListener('click', checkAll);
  inputs.forEach(input => input.addEventListener('change', () => check(input)));
  document.getElementById('show-solutions').addEventListener('click', () => {
    document.querySelectorAll('details.solution').forEach(detail => { detail.open = true; });
  });
  document.getElementById('reset-all').addEventListener('click', () => {
    inputs.forEach(input => { input.value = ''; input.removeAttribute('aria-invalid'); });
    document.querySelectorAll('.feedback').forEach(feedback => { feedback.textContent = ''; feedback.className = 'feedback'; });
    document.querySelectorAll('details.solution').forEach(detail => { detail.open = false; });
    status.textContent = 'Ainda não respondeste.';
  });
  document.getElementById('worksheet').addEventListener('submit', event => event.preventDefault());
})();
