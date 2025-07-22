# Criador de Orçamentos - ABSOLUT Sport

Um aplicativo web completo para criação de orçamentos profissionais, desenvolvido especificamente para a ABSOLUT Sport.

## 🚀 Funcionalidades

### ✅ Principais Características
- **Cabeçalho Profissional**: Logo e informações completas da empresa ABSOLUT Sport
- **Informações do Cliente**: Campos para nome, empresa, e-mail e telefone
- **Gestão de Itens**: Adicionar, remover e reordenar itens do orçamento
- **Categorias Customizáveis**: Transporte, Hospedagem, Serviços, Equipamentos e outras categorias personalizadas
- **Cálculos Automáticos**: Subtotal, desconto, fee e valor por pessoa
- **Múltiplas Moedas**: Suporte para Real (R$) e Dólar (US$)

### 🎨 Design e UX
- **Tema Profissional**: Fonte Barlow e cores da ABSOLUT Sport (#155f97)
- **Interface Responsiva**: Funciona em desktop, tablet e mobile
- **Drag & Drop**: Reordenar itens arrastando
- **Validações em Tempo Real**: Validação automática dos campos numéricos
- **Animações Suaves**: Transições e efeitos visuais modernos

### 📄 Exportação e Impressão
- **Impressão Otimizada**: Layout A4 com CSS @media print
- **Exportação PDF**: Gerar PDF profissional do orçamento
- **Exportação CSV**: Dados em formato planilha para análise
- **Envio por Email**: Enviar orçamento via mailto

### 💾 Persistência
- **Auto-save**: Salvamento automático no localStorage
- **Recuperação de Dados**: Carregamento automático ao reabrir o app

## 🛠️ Como Usar

### 1. Informações da Empresa
O cabeçalho já vem preenchido com os dados da ABSOLUT Sport. Você pode editar diretamente no HTML se necessário.

### 2. Configurações do Orçamento
- **Quantidade de Pessoas**: Define o número de pessoas para calcular o valor por pessoa
- **Moeda**: Escolha entre Real (R$) ou Dólar (US$)
- **Fee (%)**: Porcentagem de taxa de serviço
- **Desconto (%)**: Porcentagem de desconto a ser aplicado

### 3. Informações do Cliente
Preencha os campos:
- Nome do cliente
- Empresa
- E-mail
- Telefone

### 4. Adicionar Itens
1. Clique em "Adicionar Item"
2. Preencha:
   - Nome do item
   - Descrição (opcional)
   - Categoria (ou crie uma nova)
   - Quantidade
   - Valor unitário
3. Clique em "Adicionar"

### 5. Gerenciar Itens
- **Reordenar**: Arraste e solte os itens para reordenar
- **Remover**: Clique no botão ❌ para remover um item
- **Editar**: Remove e adiciona novamente com novos dados

### 6. Cálculos Automáticos
O sistema calcula automaticamente:
- **Subtotal**: Soma de todos os itens
- **Desconto**: Valor do desconto aplicado
- **Fee**: Taxa de serviço calculada
- **Total**: Valor final do orçamento
- **Por Pessoa**: Valor dividido pelo número de pessoas

### 7. Exportar e Compartilhar
- **Imprimir**: Clique em "Imprimir" para impressão em A4
- **PDF**: Gerar arquivo PDF do orçamento
- **CSV**: Exportar dados para planilha
- **Email**: Enviar por email (abre cliente de email padrão)

## 🔧 Instalação

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para fonte Barlow)

### Executar o Aplicativo
1. Baixe todos os arquivos (`index.html`, `styles.css`, `script.js`)
2. Abra o arquivo `index.html` em qualquer navegador
3. Comece a usar imediatamente!

## 📁 Estrutura de Arquivos

```
Criador de Orçamentos/
├── index.html          # Estrutura principal do aplicativo
├── styles.css          # Estilos e tema da ABSOLUT Sport
├── script.js           # Funcionalidades e lógica do aplicativo
├── README.md           # Este arquivo de documentação
└── propmt.txt          # Especificações originais do projeto
```

## 🎯 Validações

O aplicativo inclui validações em tempo real para:
- **Quantidade**: Deve ser ≥ 1
- **Valor**: Deve ser ≥ 0
- **Percentuais**: Devem estar entre 0-100%
- **Campos obrigatórios**: Marcados com borda vermelha se inválidos

## 🖨️ Impressão

O aplicativo foi otimizado para impressão em papel A4:
- Layout ajustado automaticamente
- Cores apropriadas para impressão
- Quebras de página inteligentes
- Cabeçalho e rodapé otimizados

## 📱 Responsividade

O aplicativo funciona perfeitamente em:
- **Desktop**: Interface completa com todos os recursos
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Interface simplificada para celulares

## 🔒 Privacidade

- **Dados Locais**: Todos os dados são armazenados localmente no navegador
- **Sem Servidor**: Não há envio de dados para servidores externos
- **Segurança**: Funciona offline após o carregamento inicial

## 🆘 Suporte

### Problemas Comuns
- **PDF não funciona**: Use a função de impressão como alternativa
- **Dados perdidos**: Verifique se o localStorage está habilitado
- **Layout quebrado**: Atualize a página ou limpe o cache

### Compatibilidade
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎨 Personalização

### Cores da Empresa
As cores podem ser alteradas no arquivo `styles.css`:
- Azul principal: `#155f97`
- Azul escuro: `#0f4a7a`
- Branco e preto para contraste

### Informações da Empresa
Edite o cabeçalho no arquivo `index.html` para alterar:
- Nome da empresa
- CNPJ
- Endereço
- Contatos

### Categorias Padrão
No arquivo `script.js`, você pode modificar as categorias iniciais:
```javascript
let categories = ['Transporte', 'Hospedagem', 'Serviços', 'Equipamentos', 'Outros'];
```

## 📈 Futuras Melhorias

- [ ] Múltiplos orçamentos simultâneos
- [ ] Histórico de orçamentos
- [ ] Integração com sistemas de pagamento
- [ ] Assinatura digital
- [ ] Templates personalizáveis
- [ ] Relatórios avançados

---

**Desenvolvido para ABSOLUT Sport** | Versão 1.0 | 2024 