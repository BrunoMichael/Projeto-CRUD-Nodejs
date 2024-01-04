document.getElementById('openModalBtn').onclick = function() {
    document.getElementById('modal').style.display = 'block';
};

document.getElementsByClassName('closeBtn')[0].onclick = function() {
    document.getElementById('modal').style.display = 'none';
};

document.getElementById('cancelBtn').onclick = function() {
    document.getElementById('modal').style.display = 'none';
};

// Para fechar o modal se o usuário clicar fora dele
window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};

function handleSubmit() {
    var configId = document.getElementById('configId').value;
    var url = configId ? '/editar-config' : '/add-config'; // Usar a URL correta

    // Mostrar tela de loading
    showLoading();

    // Coletar dados do formulário
    var formData = new FormData(document.getElementById('configForm'));

    var object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    object['id'] = configId; // Incluir o ID no objeto, se estiver editando

    fetch(url, { // Usar a URL correta baseada na ação (criar ou editar)
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        // Ocultar tela de loading
        hideLoading();

        // Fechar o modal
        document.getElementById('modal').style.display = 'none';

        // Limpar/resetar os campos do formulário
        document.getElementById('configForm').reset();

        // Mostrar mensagem de sucesso ou erro
        if (data.success) {
            showAlert('Configuração processada com sucesso!', 'success');
        } else {
            showAlert(data.message, 'error');
        }

        document.getElementById('botaoSubmit').textContent = 'Inserir';
        // Atualizar a lista ou tabela de configurações aqui, se necessário
    })
    .catch(error => {
        // Ocultar tela de loading e mostrar erro
        hideLoading();
        showAlert('Falha ao processar a configuração.', 'error');
        console.error('Erro ao enviar formulário:', error);
    });
}

function abrirModalEdicao(buttonElement) {
    var configId = buttonElement.getAttribute('data-id');
    // Buscar os dados da configuração pelo ID
    fetch('/get-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: configId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('botaoSubmit').textContent = 'Editar';

            // Preencher os campos do modal com os dados recebidos
            document.getElementById('configId').value = configId;

            document.getElementById('titulo').value = data.config.titulo;
            document.getElementById('logoescrita').value = data.config.logoescrita;
            document.getElementById('logoescritanegrito').value = data.config.logoescritanegrito;
            document.getElementById('descricao').value = data.config.descricao;
            document.getElementById('token').value = data.config.token;
            
            // Abrir o modal
            document.getElementById('modal').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Erro ao buscar configuração:', error);
    });
}

function tornarAtivo(buttonElement) {
    var configId = buttonElement.getAttribute('data-id');

    fetch('/ativar-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: configId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Atualiza a interface do usuário aqui
            atualizarTabelaConfigs(data.configs);
        } else {
            // Manipulação de erro
            console.error('Erro ao atualizar configuração');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

function atualizarTabelaConfigs(configs) {
    var tbody = document.querySelector('#tabela-configs tbody');
    tbody.innerHTML = ''; // Limpa o tbody atual

    configs.forEach(config => {
        var row = `<tr id="linha-config-${config.id}">
            <td>${config.id}</td>
            <td>${config.titulo}</td>
            <td>${config.logoescrita}<b>${config.logoescritanegrito}</b></td>
            <td>${config.descricao}</td>
            <td><span class="alert ${config.status === 'Ativo' ? 'color-success' : 'color-error'}">${config.status}</span></td>
            <td>
                <button class="btn edit" data-id="${config.id}" onclick="abrirModalEdicao(this)"><i class="fa fa-edit"></i></button>
                <button class="btn ${config.status === 'Ativo' ? 'disabled' : 'delete'}" data-id="${config.id}" ${config.status === 'Ativo' ? 'disabled' : ''} onclick="confirmarDelete(this)"><i class="fa fa-trash"></i></button>
                <button class="btn ${config.status === 'Ativo' ? 'disabled' : 'active'}" data-id="${config.id}" ${config.status === 'Ativo' ? 'disabled' : ''} onclick="tornarAtivo(this)"><i class="fa fa-check"></i></button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function confirmarDelete(buttonElement) {
    var configId = buttonElement.getAttribute('data-id');

    if (confirm('Tem certeza que deseja excluir esta configuração?')) {
        fetch('/delete-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: configId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove a linha da tabela
                var linhaParaRemover = document.getElementById('linha-config-' + configId);
                if (linhaParaRemover) {
                    linhaParaRemover.remove();
                }
            } else {
                console.error('Erro ao excluir configuração');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    }
}

function showLoading() {
    document.getElementById('loadingScreen').style.display = 'flex'; // Usa flex aqui
}

function hideLoading() {
    document.getElementById('loadingScreen').style.display = 'none';
}

function showAlert(message, type) {
    var alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'block';
    alertBox.textContent = message;
    alertBox.className = 'alert-box ' + type; // Adiciona classes para estilização baseada no tipo

    // Oculta a notificação após um tempo
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, 4000); // Ajuste o tempo conforme necessário
}

