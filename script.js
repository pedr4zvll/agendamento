document.addEventListener('DOMContentLoaded', function() {
    // Preenche os horários disponíveis
    const selectHora = document.getElementById('hora');
    const horarios = [
        '08:00', '09:00', '10:00', '11:00', 
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        selectHora.appendChild(option);
    });
    
    // Define a data mínima como hoje
    const inputData = document.getElementById('data');
    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2, '0');
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const yyyy = hoje.getFullYear();
    inputData.min = `${yyyy}-${mm}-${dd}`;
    
    // Carrega agendamentos salvos
    carregarAgendamentos();
    
    // Formulário de agendamento
    const formAgendamento = document.getElementById('formAgendamento');
    formAgendamento.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const servico = document.getElementById('servico').value;
        const barbeiro = document.getElementById('barbeiro').value;
        
        // Formata a data para exibição
        const dataObj = new Date(data);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        
        // Cria objeto de agendamento
        const agendamento = {
            nome,
            telefone,
            data: dataFormatada,
            hora,
            servico,
            barbeiro,
            timestamp: new Date().getTime() // ID único
        };
        
        // Salva o agendamento
        salvarAgendamento(agendamento);
        
        // Limpa o formulário
        formAgendamento.reset();
        
        // Recarrega a lista de agendamentos
        carregarAgendamentos();
        
        // Feedback para o usuário
        alert('Agendamento realizado com sucesso!');
    });
});

function salvarAgendamento(agendamento) {
    // Pega os agendamentos existentes ou cria um array vazio
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    
    // Adiciona o novo agendamento
    agendamentos.push(agendamento);
    
    // Salva no localStorage
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function carregarAgendamentos() {
    const listaAgendamentos = document.getElementById('listaAgendamentos');
    listaAgendamentos.innerHTML = '';
    
    // Pega os agendamentos do localStorage
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    
    if (agendamentos.length === 0) {
        listaAgendamentos.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
        return;
    }
    
    // Ordena por data e hora
    agendamentos.sort((a, b) => {
        const dataA = new Date(a.data.split('/').reverse().join('-') + 'T' + a.hora);
        const dataB = new Date(b.data.split('/').reverse().join('-') + 'T' + b.hora);
        return dataA - dataB;
    });
    
    // Exibe cada agendamento
    agendamentos.forEach(agendamento => {
        const card = document.createElement('div');
        card.className = 'agendamento-card';
        card.innerHTML = `
            <h3>${agendamento.servico}</h3>
            <p><strong>Data:</strong> ${agendamento.data} às ${agendamento.hora}</p>
            <p><strong>Barbeiro:</strong> ${agendamento.barbeiro}</p>
            <p><strong>Cliente:</strong> ${agendamento.nome} (${agendamento.telefone})</p>
            <button onclick="cancelarAgendamento(${agendamento.timestamp})">Cancelar</button>
        `;
        listaAgendamentos.appendChild(card);
    });
}

function cancelarAgendamento(timestamp) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        // Pega os agendamentos do localStorage
        let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        
        // Filtra removendo o agendamento com o timestamp correspondente
        agendamentos = agendamentos.filter(ag => ag.timestamp !== timestamp);
        
        // Salva a lista atualizada
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        
        // Recarrega a lista
        carregarAgendamentos();
    }
}