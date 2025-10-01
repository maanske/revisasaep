const sqlGroups = {
    'DDL': {
        name: 'Data Definition Language (Linguagem de Definição de Dados)',
        description: 'É usada para definir ou modificar a estrutura do banco de dados e seus objetos, como tabelas, índices e usuários.',
        examples: ['CREATE', 'ALTER', 'DROP'],
        emoji: '🏗️',
        color: 'blue'
    },
    'DML': {
        name: 'Data Manipulation Language (Linguagem de Manipulação de Dados)',
        description: 'É usada para consultar, inserir, atualizar e excluir dados dentro das tabelas do banco de dados.',
        examples: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
        emoji: '✍️',
        color: 'green'
    },
    'DCL': {
        name: 'Data Control Language (Linguagem de Controle de Dados)',
        description: 'É usada para controlar o acesso aos dados no banco de dados, concedendo ou revogando permissões para os usuários.',
        examples: ['GRANT', 'REVOKE'],
        emoji: '🔐',
        color: 'yellow'
    },
    'TCL': {
        name: 'Transaction Control Language (Linguagem de Controle de Transação)',
        description: 'É usada para gerenciar as transações no banco de dados, garantindo a integridade dos dados ao confirmar ou desfazer alterações.',
        examples: ['COMMIT', 'ROLLBACK', 'SAVEPOINT'],
        emoji: '⏳',
        color: 'purple'
    }
};

const resultArea = document.getElementById('result-area');
const commandInput = document.getElementById('sql-command');
const checkCommandBtn = document.getElementById('check-command-btn');
const groupButtons = document.querySelectorAll('.group-btn');
const quizBtn = document.getElementById('quiz-btn');
const quizArea = document.getElementById('quiz-area');
const quizQuestion = document.getElementById('quiz-question');
const quizFeedback = document.getElementById('quiz-feedback');

let isQuizMode = false;
let currentQuizAnswer = null;

/**
 * mostra infos de um grupo sql
 * @param {string} groupKey 
 */
function displayGroupInfo(groupKey) {
    const group = sqlGroups[groupKey];
    if (!group) return;

    resultArea.innerHTML = `
        <div class="card-enter">
            <h2 class="text-2xl font-bold text-${group.color}-400 mb-2">${group.emoji} ${groupKey}</h2>
            <p class="font-semibold text-gray-300">${group.name}</p>
            <p class="text-gray-300 mt-3">${group.description}</p>
            <div class="mt-4">
                <h3 class="font-semibold text-gray-200">Exemplos de Comandos:</h3>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${group.examples.map(cmd => `<code class="bg-gray-700 text-cyan-300 px-3 py-1 rounded-md text-sm">${cmd}</code>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function findGroupFromCommand() {
    const command = commandInput.value.trim().toUpperCase().split(' ')[0];
    if (!command) {
        resultArea.innerHTML = `<p class="text-yellow-400 card-enter">Por favor, digite um comando SQL.</p>`;
        return;
    }

    for (const groupKey in sqlGroups) {
        const found = sqlGroups[groupKey].examples.some(example => command === example.split(' ')[0]);
        if (found) {
            displayGroupInfo(groupKey);
            return;
        }
    }

    resultArea.innerHTML = `<p class="text-red-400 card-enter">O comando <code class="bg-gray-700 text-red-300 px-2 py-1 rounded-md">${command}</code> não foi encontrado ou não é um exemplo principal. Tente outro!</p>`;
}

function toggleQuizMode() {
    isQuizMode = !isQuizMode;

    if (isQuizMode) {
        quizBtn.textContent = 'Sair do Teste';
        quizBtn.classList.replace('bg-indigo-600', 'bg-red-600');
        quizBtn.classList.replace('hover:bg-indigo-700', 'hover:bg-red-700');
        quizArea.classList.remove('hidden');
        quizFeedback.textContent = 'Clique no grupo correto para responder.';
        generateQuizQuestion();
    } else {
        quizBtn.textContent = 'Iniciar Teste';
        quizBtn.classList.replace('bg-red-600', 'bg-indigo-600');
        quizBtn.classList.replace('hover:bg-red-700', 'hover:bg-indigo-700');
        quizArea.classList.add('hidden');
        quizQuestion.textContent = '';
        quizFeedback.textContent = '';
    }
}

function generateQuizQuestion() {
    const allCommands = Object.entries(sqlGroups).flatMap(([group, data]) => 
        data.examples.map(cmd => ({ command: cmd.split(' ')[0], group }))
    );

    const randomQuestion = allCommands[Math.floor(Math.random() * allCommands.length)];
    currentQuizAnswer = randomQuestion.group;
    
    quizQuestion.innerHTML = `A qual grupo pertence o comando <code class="bg-gray-700 text-cyan-300 px-2 py-1 rounded-md">${randomQuestion.command}</code>?`;
    quizFeedback.textContent = 'Escolha uma das opções acima...';
    quizFeedback.className = 'font-medium'; 
}

/**
 * verifica respostas do user no modo teste
 * @param {string} selectedGroup - 
 */
function checkQuizAnswer(selectedGroup) {
    if (selectedGroup === currentQuizAnswer) {
        quizFeedback.textContent = '✅ Certo! Próxima pergunta...';
        quizFeedback.className = 'font-medium text-green-400';
        setTimeout(generateQuizQuestion, 1500);
    } else {
        quizFeedback.textContent = `❌ Errado! A resposta era ${currentQuizAnswer}. Tente a próxima.`;
        quizFeedback.className = 'font-medium text-red-400';
        setTimeout(generateQuizQuestion, 2500);
    }
}

checkCommandBtn.addEventListener('click', findGroupFromCommand);
commandInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        findGroupFromCommand();
    }
});

groupButtons.forEach(button => {
    button.addEventListener('click', () => {
        const groupKey = button.dataset.group;
        if (isQuizMode) {
            checkQuizAnswer(groupKey);
        } else {
            displayGroupInfo(groupKey);
        }
    });
});

quizBtn.addEventListener('click', toggleQuizMode);
