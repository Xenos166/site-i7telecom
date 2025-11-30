$(document).ready(function() {
    new WOW().init();
    $('[data-toggle="tooltip"]').tooltip();
    
    // Mostrar tooltip do WhatsApp após 3 segundos
    setTimeout(function() {
        $('.whatsapp-fixed').tooltip('show');
    }, 3000);
    
    let downloadSpeed = 0;
    let uploadSpeed = 0;
    let userIP = 'Carregando...';
    
    // Get user IP on load
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIP = data.ip;
            $('#userIP').text(userIP);
        })
        .catch(err => {
            console.error('Erro ao obter IP:', err);
            $('#userIP').text('Erro');
        });
    
    $('#startTest').click(function() {
        startSpeedTest();
    });
    
    $('#restartTest').click(function() {
        $('#results').hide();
        $('#progress').hide();
        $('#startSection').show();
    });
    
    function startSpeedTest() {
        $('#startSection').hide();
        $('#progress').show();
        $('#results').hide();
        
        // Simular progresso
        let progress = 0;
        let interval = setInterval(function() {
            progress += 5;
            $('#progressBar').css('width', progress + '%');
            if (progress >= 100) {
                clearInterval(interval);
                completeTest();
            }
        }, 300);
        
        // Teste de download
        const testFile = 'https://speed.cloudflare.com/__down?bytes=104857600'; // 100MB
        const startTime = Date.now();
        
        fetch(testFile)
            .then(response => response.blob())
            .then(blob => {
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000; // segundos
                const bytes = blob.size;
                const bits = bytes * 8;
                downloadSpeed = (bits / duration / 1000000).toFixed(2); // Mbps
            })
            .catch(err => {
                console.error('Erro no teste de download:', err);
                downloadSpeed = 'Erro';
            });
        
        // Teste de upload simulado
        setTimeout(() => {
            uploadSpeed = (Math.random() * 50 + 10).toFixed(2); // Simulação
        }, 3000);
    }
    
    function completeTest() {
        setTimeout(() => {
            $('#progress').hide();
            $('#results').show();
            $('#downloadSpeed').text(downloadSpeed + ' Mbps');
            $('#uploadSpeed').text(uploadSpeed + ' Mbps');
            // IP is already updated
        }, 500);
    }
});