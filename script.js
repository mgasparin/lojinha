document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sales-form');
    const teamSelect = document.getElementById('team');
    const participantSelect = document.getElementById('participant');
    const productSelect = document.getElementById('product');

    // Função para carregar dados do Google Sheets
    async function loadData() {
        const sheetId = 'YOUR_SHEET_ID'; // Substitua pelo ID da sua planilha
        const apiKey = 'YOUR_API_KEY'; // Substitua pela sua API Key do Google Sheets API
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Equipes!A2:B?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();
        const teams = data.values;

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team[0];
            option.textContent = team[0];
            teamSelect.appendChild(option);
        });

        // Carregar produtos
        const productsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Produtos!A2:C?key=${apiKey}`;
        const productsResponse = await fetch(productsUrl);
        const productsData = await productsResponse.json();
        const products = productsData.values;

        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product[0];
            option.textContent = `${product[1]} - R$ ${product[2]}`;
            productSelect.appendChild(option);
        });
    }

    // Carregar participantes com base na equipe selecionada
    teamSelect.addEventListener('change', async function() {
        const selectedTeam = teamSelect.value;
        participantSelect.innerHTML = '';

        const sheetId = 'YOUR_SHEET_ID'; // Substitua pelo ID da sua planilha
        const apiKey = 'YOUR_API_KEY'; // Substitua pela sua API Key do Google Sheets API
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Equipes!A2:B?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();
        const participants = data.values.filter(participant => participant[0] === selectedTeam);

        participants.forEach(participant => {
            const option = document.createElement('option');
            option.value = participant[1];
            option.textContent = participant[1];
            participantSelect.appendChild(option);
        });
    });

    // Submeter o formulário
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const date = formData.get('date');
        const team = formData.get('team');
        const participant = formData.get('participant');
        const product = formData.get('product');
        const quantity = formData.get('quantity');

        const sheetId = 'YOUR_SHEET_ID'; // Substitua pelo ID da sua planilha
        const apiKey = 'YOUR_API_KEY'; // Substitua pela sua API Key do Google Sheets API
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Vendas:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [[date, team, participant, product, quantity]]
            })
        });

        if (response.ok) {
            alert('Venda registrada com sucesso!');
            form.reset();
        } else {
            alert('Erro ao registrar a venda.');
        }
    });

    loadData();
});
