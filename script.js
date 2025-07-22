// Estado global da aplicação
let budgetItems = [];
let itemCounter = 0;
let categories = ['Ingressos', 'Hospedagem', 'Transporte', 'Alimentação', 'Outros'];

// Elementos DOM
const itemForm = document.getElementById('itemForm');
const itemsContainer = document.getElementById('itemsContainer');
const itemCategorySelect = document.getElementById('itemCategory');
const newCategoryInput = document.getElementById('newCategory');

// Configurações
const peopleCountInput = document.getElementById('peopleCount');
const currencySelect = document.getElementById('currency');
const feeInput = document.getElementById('fee');
const discountInput = document.getElementById('discount');

// Botões de ação
const printBtn = document.getElementById('printBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const emailBtn = document.getElementById('emailBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCalculations();
    updatePrintClientInfo();
    
    // Debug: verificar se botão existe
    console.log('Botão clearDataBtn encontrado:', document.getElementById('clearDataBtn'));
});

// Event Listeners
function initializeEventListeners() {
    // Formulário de item
    itemForm.addEventListener('submit', addItem);
    
    // Categoria customizada
    itemCategorySelect.addEventListener('change', handleCategoryChange);
    
    // Configurações
    peopleCountInput.addEventListener('input', updateCalculations);
    currencySelect.addEventListener('change', updateCalculations);
    feeInput.addEventListener('input', updateCalculations);
    discountInput.addEventListener('input', updateCalculations);
    
    // Informações do cliente
    document.getElementById('clientName').addEventListener('input', updatePrintClientInfo);
    document.getElementById('clientCompany').addEventListener('input', updatePrintClientInfo);
    document.getElementById('clientEmail').addEventListener('input', updatePrintClientInfo);
    document.getElementById('clientPhone').addEventListener('input', updatePrintClientInfo);
    
    // Botões de ação
    printBtn.addEventListener('click', printBudget);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportToPdf);
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportToCsv);
    if (emailBtn) emailBtn.addEventListener('click', sendByEmail);
    
    // Botão de limpar dados - com verificação adicional
    const clearBtn = document.getElementById('clearDataBtn');
    if (clearBtn) {
        console.log('Event listener adicionado ao botão clearDataBtn');
        clearBtn.addEventListener('click', function() {
            console.log('Botão clearDataBtn clicado!');
            clearAllData();
        });
    } else {
        console.error('Botão clearDataBtn não encontrado!');
    }
    
    // Validações em tempo real
    setupRealTimeValidation();
}

// Validações em tempo real
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
}

function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || Infinity;
    
    if (isNaN(value) || value < min || value > max) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    } else {
        input.classList.add('valid');
        input.classList.remove('invalid');
    }
}

function handleCategoryChange() {
    if (itemCategorySelect.value === 'nova') {
        newCategoryInput.style.display = 'block';
        newCategoryInput.classList.add('show');
        newCategoryInput.focus();
    } else {
        newCategoryInput.style.display = 'none';
        newCategoryInput.classList.remove('show');
    }
}

// Adicionar item
function addItem(e) {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const value = parseFloat(document.getElementById('itemValue').value);
    
    let category = itemCategorySelect.value;
    if (category === 'nova' && newCategoryInput.value.trim()) {
        category = newCategoryInput.value.trim();
        if (!categories.includes(category)) {
            categories.push(category);
            updateCategorySelect();
        }
    }
    
    const item = {
        id: ++itemCounter,
        name,
        description,
        category,
        quantity,
        value,
        total: quantity * value
    };
    
    budgetItems.push(item);
    renderItems();
    updateCalculations();
    updatePrintTable();
    
    // Limpar formulário após adicionar
    itemForm.reset();
    newCategoryInput.style.display = 'none';
    newCategoryInput.classList.remove('show');
    document.getElementById('itemQuantity').value = 1;
}

// Atualizar select de categorias
function updateCategorySelect() {
    const currentValue = itemCategorySelect.value;
    itemCategorySelect.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        itemCategorySelect.appendChild(option);
    });
    
    const newOption = document.createElement('option');
    newOption.value = 'nova';
    newOption.textContent = 'Nova categoria...';
    itemCategorySelect.appendChild(newOption);
    
    if (currentValue && categories.includes(currentValue)) {
        itemCategorySelect.value = currentValue;
    }
}

// Renderizar itens
function renderItems() {
    itemsContainer.innerHTML = '';
    
    if (budgetItems.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhum item adicionado ainda.</p>';
        return;
    }
    
    budgetItems.forEach(item => {
        const itemRow = createItemRow(item);
        itemsContainer.appendChild(itemRow);
    });
}

// Criar linha de item
function createItemRow(item) {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.draggable = true;
    row.dataset.itemId = item.id;
    
    const currency = getCurrencySymbol();
    
    row.innerHTML = `
        <div>
            <div class="item-category">${item.category}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
        </div>
        <div></div>
        <div class="item-quantity">${item.quantity}</div>
        <div class="item-value">${currency} ${formatCurrency(item.value)}</div>
        <div class="item-total">${currency} ${formatCurrency(item.total)}</div>
        <div class="item-actions">
            <button class="btn btn-small btn-danger" onclick="removeItem(${item.id})">
                ❌
            </button>
        </div>
    `;
    
    // Drag and drop
    row.addEventListener('dragstart', handleDragStart);
    row.addEventListener('dragover', handleDragOver);
    row.addEventListener('drop', handleDrop);
    row.addEventListener('dragend', handleDragEnd);
    
    return row;
}

// Remover item
function removeItem(id) {
    if (confirm('Deseja remover este item?')) {
        budgetItems = budgetItems.filter(item => item.id !== id);
        renderItems();
        updateCalculations();
        updatePrintTable();
    }
}

// Drag and Drop
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedItem !== this) {
        const draggedId = parseInt(draggedItem.dataset.itemId);
        const targetId = parseInt(this.dataset.itemId);
        
        const draggedIndex = budgetItems.findIndex(item => item.id === draggedId);
        const targetIndex = budgetItems.findIndex(item => item.id === targetId);
        
        // Reordenar array
        const draggedElement = budgetItems.splice(draggedIndex, 1)[0];
        budgetItems.splice(targetIndex, 0, draggedElement);
        
        renderItems();
        updatePrintTable();
    }
    
    this.classList.remove('drag-over');
    return false;
}

function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.item-row').forEach(row => {
        row.classList.remove('drag-over');
    });
    draggedItem = null;
}

// Cálculos
function updateCalculations() {
    const subtotal = budgetItems.reduce((sum, item) => sum + item.total, 0);
    const discountPercent = parseFloat(discountInput.value) || 0;
    const feePercent = parseFloat(feeInput.value) || 0;
    const peopleCount = parseInt(peopleCountInput.value) || 1;
    
    const discountAmount = subtotal * (discountPercent / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const feeAmount = subtotalAfterDiscount * (feePercent / 100);
    const totalAmount = subtotalAfterDiscount + feeAmount;
    const perPersonAmount = totalAmount / peopleCount;
    
    const currency = getCurrencySymbol();
    
    document.getElementById('subtotal').textContent = `${currency} ${formatCurrency(subtotal)}`;
    document.getElementById('discountAmount').textContent = `${currency} ${formatCurrency(discountAmount)}`;
    document.getElementById('feeAmount').textContent = `${currency} ${formatCurrency(feeAmount)}`;
    document.getElementById('totalAmount').textContent = `${currency} ${formatCurrency(totalAmount)}`;
    document.getElementById('perPersonAmount').textContent = `${currency} ${formatCurrency(perPersonAmount)}`;
    
    // Esconder linha de desconto se valor for zero
    const discountRow = document.getElementById('discountRow');
    if (discountRow) {
        discountRow.style.display = discountAmount > 0 ? 'flex' : 'none';
    }
}

// Utilitários
function getCurrencySymbol() {
    return currencySelect.value === 'USD' ? 'US$' : 'R$';
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Impressão
function printBudget() {
    window.print();
}

// Exportar para PDF
function exportToPdf() {
    // Usar jsPDF para gerar PDF
    if (typeof window.jsPDF === 'undefined') {
        // Fallback para impressão
        alert('Funcionalidade de PDF não disponível. Usando impressão como alternativa.');
        printBudget();
        return;
    }
    
    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();
    const content = document.querySelector('.budget-container');
    
    html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        doc.save('orcamento.pdf');
    });
}

// Exportar para CSV
function exportToCsv() {
    const headers = ['Categoria', 'Item', 'Descrição', 'Quantidade', 'Valor Unitário', 'Total'];
    const rows = budgetItems.map(item => [
        item.category,
        item.name,
        item.description,
        item.quantity,
        item.value,
        item.total
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'orcamento.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Enviar por email
function sendByEmail() {
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const totalAmount = document.getElementById('totalAmount').textContent;
    
    const subject = `Orçamento ABSOLUT Sport - ${clientName}`;
    const body = `
Olá ${clientName},

Segue o orçamento solicitado:

Valor Total: ${totalAmount}

Atenciosamente,
ABSOLUT Sport
    `;
    
    const mailtoUrl = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

// Atualizar select de categorias
updateCategorySelect();

// Salvar no localStorage
function saveToLocalStorage() {
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
}

function loadFromLocalStorage() {
    const savedItems = localStorage.getItem('budgetItems');
    const savedLogo = localStorage.getItem('clientLogo');
    
    if (savedItems) {
        budgetItems = JSON.parse(savedItems);
        itemCounter = Math.max(...budgetItems.map(item => item.id), 0);
        renderItems();
        updateCalculations();
        updatePrintTable();
    }
    
    // Carregar logo do cliente
    if (savedLogo) {
        const logoPreview = document.getElementById('logoPreview');
        const logoPreviewContainer = document.getElementById('logoPreviewContainer');
        const printClientLogo = document.getElementById('printClientLogo');
        const clientLogoPrint = document.getElementById('clientLogoPrint');
        
        logoPreview.src = savedLogo;
        logoPreviewContainer.style.display = 'flex';
        
        // Configurar para impressão
        printClientLogo.src = savedLogo;
        clientLogoPrint.style.display = 'block';
    }
}

// Carregar dados ao inicializar
loadFromLocalStorage();

// Salvar dados automaticamente
setInterval(saveToLocalStorage, 5000);

// Salvar antes de sair da página
window.addEventListener('beforeunload', saveToLocalStorage);

// Atualizar informações do cliente para impressão
function updatePrintClientInfo() {
    const clientName = document.getElementById('clientName').value;
    const clientCompany = document.getElementById('clientCompany').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    
    document.getElementById('printClientName').textContent = clientName ? `Nome: ${clientName}` : '';
    document.getElementById('printClientCompany').textContent = clientCompany ? `Empresa: ${clientCompany}` : '';
    document.getElementById('printClientEmail').textContent = clientEmail ? `E-mail: ${clientEmail}` : '';
    document.getElementById('printClientPhone').textContent = clientPhone ? `Telefone: ${clientPhone}` : '';
}

// Funções para logo do cliente
function handleLogoUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        event.target.value = '';
        return;
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo é muito grande. Por favor, selecione uma imagem menor que 5MB.');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const logoData = e.target.result;
        
        // Mostrar preview
        const logoPreview = document.getElementById('logoPreview');
        const logoPreviewContainer = document.getElementById('logoPreviewContainer');
        const printClientLogo = document.getElementById('printClientLogo');
        const clientLogoPrint = document.getElementById('clientLogoPrint');
        
        logoPreview.src = logoData;
        logoPreviewContainer.style.display = 'flex';
        
        // Configurar para impressão
        printClientLogo.src = logoData;
        clientLogoPrint.style.display = 'block';
        
        // Salvar no localStorage
        localStorage.setItem('clientLogo', logoData);
    };
    
    reader.readAsDataURL(file);
}

function removeClientLogo() {
    if (confirm('Deseja remover o logo do cliente?')) {
        // Limpar preview
        const logoPreview = document.getElementById('logoPreview');
        const logoPreviewContainer = document.getElementById('logoPreviewContainer');
        const clientLogoInput = document.getElementById('clientLogo');
        const printClientLogo = document.getElementById('printClientLogo');
        const clientLogoPrint = document.getElementById('clientLogoPrint');
        
        logoPreview.src = '';
        logoPreviewContainer.style.display = 'none';
        clientLogoInput.value = '';
        
        // Limpar impressão
        printClientLogo.src = '';
        clientLogoPrint.style.display = 'none';
        
        // Remover do localStorage
        localStorage.removeItem('clientLogo');
    }
}

// Atualizar tabela de impressão
function updatePrintTable() {
    const tableBody = document.getElementById('itemsTableBody');
    tableBody.innerHTML = '';
    
    if (budgetItems.length === 0) {
        return;
    }
    
    // Agrupar itens por categoria
    const itemsByCategory = {};
    budgetItems.forEach(item => {
        if (!itemsByCategory[item.category]) {
            itemsByCategory[item.category] = [];
        }
        itemsByCategory[item.category].push(item);
    });
    
    const currency = getCurrencySymbol();
    
    // Criar linhas da tabela agrupadas por categoria
    Object.keys(itemsByCategory).forEach(category => {
        // Linha da categoria
        const categoryRow = document.createElement('tr');
        categoryRow.className = 'category-row';
        categoryRow.innerHTML = `
            <td colspan="5" style="font-weight: bold; background-color: #f0f0f0; color: #155f97;">
                ${category}
            </td>
        `;
        tableBody.appendChild(categoryRow);
        
        // Itens da categoria
        itemsByCategory[category].forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td class="total-column">${currency} ${formatCurrency(item.value)}</td>
                <td class="total-column">${currency} ${formatCurrency(item.total)}</td>
            `;
            tableBody.appendChild(row);
        });
    });
}

// Funções para gerenciamento de dados
function clearAllData() {
    const confirmMessage = 'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.\n\nSerão removidos:\n- Todos os itens do orçamento\n- Informações do cliente\n- Logo do cliente';
    
    if (confirm(confirmMessage)) {
        try {
            // Limpar localStorage
            localStorage.removeItem('budgetItems');
            localStorage.removeItem('clientLogo');
            
            // Resetar variáveis globais
            budgetItems = [];
            itemCounter = 0;
            // Manter categorias padrão (não salvas no localStorage)
            categories = ['Ingressos', 'Hospedagem', 'Transporte', 'Alimentação', 'Outros'];
            
            // Limpar campos do formulário
            clearAllForms();
            
            // Atualizar interface
            renderItems();
            updateCalculations();
            updatePrintTable();
            updateCategorySelect();
            
            alert('Todos os dados foram limpos com sucesso!');
            
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            alert('Erro ao limpar os dados: ' + error.message);
        }
    }
}

function clearAllForms() {
    // Limpar informações do cliente
    document.getElementById('clientName').value = '';
    document.getElementById('clientCompany').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    
    // Limpar configurações
    document.getElementById('peopleCount').value = '1';
    document.getElementById('currency').value = 'BRL';
    document.getElementById('fee').value = '0';
    document.getElementById('discount').value = '0';
    
    // Limpar formulário de item
    itemForm.reset();
    document.getElementById('itemQuantity').value = 1;
    
    // Limpar logo do cliente
    removeClientLogoSilent();
    
    // Limpar informações de impressão
    updatePrintClientInfo();
}

function removeClientLogoSilent() {
    // Versão silenciosa da função removeClientLogo (sem confirmação)
    const logoPreview = document.getElementById('logoPreview');
    const logoPreviewContainer = document.getElementById('logoPreviewContainer');
    const clientLogoInput = document.getElementById('clientLogo');
    const printClientLogo = document.getElementById('printClientLogo');
    const clientLogoPrint = document.getElementById('clientLogoPrint');
    
    if (logoPreview) logoPreview.src = '';
    if (logoPreviewContainer) logoPreviewContainer.style.display = 'none';
    if (clientLogoInput) clientLogoInput.value = '';
    if (printClientLogo) printClientLogo.src = '';
    if (clientLogoPrint) clientLogoPrint.style.display = 'none';
}

// Função para limpar apenas o localStorage (sem interface)
function clearLocalStorageOnly() {
    if (confirm('Deseja limpar apenas os dados salvos no navegador?\n\nOs dados na tela atual não serão perdidos, mas não serão mais salvos automaticamente até que você adicione novos itens.')) {
        try {
            localStorage.removeItem('budgetItems');
            localStorage.removeItem('clientLogo');
            
            alert('Dados do armazenamento local foram limpos!');
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            alert('Erro ao limpar os dados salvos: ' + error.message);
        }
    }
}

// Função global simplificada para ser usada no console (backup)
window.limparTodosDados = function() {
    if (confirm('ATENÇÃO: Limpar todos os dados?\n\n- Todos os itens do orçamento\n- Informações do cliente\n- Logo do cliente')) {
        localStorage.removeItem('budgetItems');
        localStorage.removeItem('clientLogo');
        
        // Resetar interface
        budgetItems = [];
        itemCounter = 0;
        categories = ['Ingressos', 'Hospedagem', 'Transporte', 'Alimentação', 'Outros'];
        
        // Limpar formulários
        document.getElementById('clientName').value = '';
        document.getElementById('clientCompany').value = '';
        document.getElementById('clientEmail').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('peopleCount').value = '1';
        document.getElementById('currency').value = 'BRL';
        document.getElementById('fee').value = '0';
        document.getElementById('discount').value = '0';
        
        // Atualizar tela
        renderItems();
        updateCalculations();
        updatePrintTable();
        updateCategorySelect();
        
        alert('✅ Todos os dados foram limpos!');
    }
}; 