// Script para gerenciamento de cookies e coleta de informações com consentimento

// Função para mostrar o banner de consentimento
function showCookieBanner() {
    const banner = document.createElement('div');
    banner.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background-color: rgba(0,0,0,0.8); color: white; padding: 20px; text-align: center; z-index: 9999; width: 100%;">
            Este site utiliza cookies analíticos para melhorar a experiência. Você aceita o uso de cookies?
            <button id="acceptCookies" style="margin-left: 10px; padding: 10px; background-color: green; color: white; border: none; cursor: pointer; border-radius: 5px;">Aceitar</button>
            <button id="rejectCookies" style="margin-left: 10px; padding: 10px; background-color: red; color: white; border: none; cursor: pointer; border-radius: 5px;">Recusar</button>
            <button id="viewTerms" style="margin-left: 10px; padding: 10px; background-color: blue; color: white; border: none; cursor: pointer; border-radius: 5px;">Saiba Mais</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Adiciona os event listeners para aceitar, recusar e visualizar termos
    document.getElementById('acceptCookies').addEventListener('click', () => {
        setCookie('cookiesAccepted', 'true', 365);
        setCookie('welcomeShown', 'false', 365); // Reseta a exibição da mensagem de boas-vindas
        collectAndSendData(); // Coleta os dados e os envia via email
        document.body.removeChild(banner); // Remove o banner após aceitação
    });

    document.getElementById('rejectCookies').addEventListener('click', () => {
        setCookie('cookiesAccepted', 'false', 365);
        // Mantém o banner na tela se o usuário recusar
    });

    document.getElementById('viewTerms').addEventListener('click', () => {
        showTermsPopup(); // Mostra o popup com os termos
    });
}

// Função para mostrar o popup com os termos de uso
function showTermsPopup() {
    const popup = document.createElement('div');
    popup.id = 'termsPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.color = 'black';
    popup.style.padding = '20px';
    popup.style.zIndex = '10000';
    popup.style.width = '80%';
    popup.style.maxWidth = '600px';
    popup.style.height = '80%';
    popup.style.overflowY = 'auto';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

    // Conteúdo dos termos de uso - substitua pelo seu texto
    popup.innerHTML = `
        <h2>Termos de Uso</h2>
        <p>Insira aqui os seus termos de uso...</p>
        <!-- Adicione o conteúdo completo dos termos -->
        <button id="closeTerms" style="margin-top: 20px; padding: 10px; background-color: gray; color: white; border: none; cursor: pointer; border-radius: 5px;">Fechar</button>
    `;

    document.body.appendChild(popup);

    // Event listener para fechar o popup
    document.getElementById('closeTerms').addEventListener('click', () => {
        document.body.removeChild(popup);
    });
}

// Função para definir cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Função para verificar se os cookies já foram aceitos
function checkCookiesConsent() {
    const cookiesAccepted = document.cookie.split('; ').find(row => row.startsWith('cookiesAccepted='));
    if (!cookiesAccepted) {
        showCookieBanner();
    } else if (cookiesAccepted.split('=')[1] === 'true') {
        const welcomeShown = document.cookie.split('; ').find(row => row.startsWith('welcomeShown='));
        if (welcomeShown && welcomeShown.split('=')[1] === 'false') {
            displayWelcomeMessage();
            setCookie('welcomeShown', 'true', 365); // Evita que a mensagem apareça novamente
        }
        collectAndSendData(); // Coleta os dados e os envia via email se o consentimento já tiver sido dado anteriormente
    } else {
        // Se o usuário recusou, mantém o banner na tela
        showCookieBanner();
    }
}

// Função para exibir uma mensagem de boas-vindas
function displayWelcomeMessage() {
    alert("Bem-vindo de volta! Agradecemos por aceitar os cookies.");
}

// Função para coletar e enviar os dados via email
async function collectAndSendData() {
    const data = {
        navegador: navigator.userAgent,
        plataforma: navigator.platform,
        idioma: navigator.language,
        dataAcesso: new Date().toLocaleString(),
        ip: await getUserIP(),
        geolocalizacao: await getGeolocation(),
    };

    // Envia os dados para o servidor via POST
    fetch('https://seu-dominio.com/enviar-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Dados enviados com sucesso.');
        } else {
            console.error('Erro ao enviar dados.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

// Função para obter o IP do usuário (usando um serviço público de IP)
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Erro ao obter IP:', error);
        return 'Desconhecido';
    }
}

// Função para obter a geolocalização aproximada
async function getGeolocation() {
    return new Promise((resolve) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve(`Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`);
            }, () => {
                console.warn('Geolocalização não disponível');
                resolve('Geolocalização não permitida');
            });
        } else {
            resolve('Geolocalização não suportada');
        }
    });
}

// Executa a verificação de consentimento dos cookies ao carregar a página
checkCookiesConsent();
