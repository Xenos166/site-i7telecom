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
    
    let downloadDone = false;
    let uploadDone = false;
    
    function startSpeedTest() {
        $('#startSection').hide();
        $('#progress').show();
        $('#results').hide();
        downloadDone = false;
        uploadDone = false;
        downloadSpeed = 0;
        uploadSpeed = 0;
        
        // Simular progresso
        let progress = 0;
        let interval = setInterval(function() {
            progress += 1;
            $('#progressBar').css('width', progress + '%');
            $('#status').text('Testando... ' + progress + '%');
            if (progress >= 100 && downloadDone && uploadDone) {
                clearInterval(interval);
                completeTest();
            } else if (progress >= 100) {
                // Wait a bit more
            }
        }, 100);
        
        // Teste de download
        performDownloadTest();
        
        // Teste de upload
        performUploadTest();
    }
    
    function performDownloadTest() {
        // Estimate speed with small files
        const estimatePromises = [];
        const estimateStart = Date.now();
        for (let i = 0; i < 4; i++) {
            estimatePromises.push(fetch('/api/download?size=1').then(response => response.blob()));
        }
        Promise.all(estimatePromises).then(estimateBlobs => {
            const estimateBytes = estimateBlobs.reduce((sum, blob) => sum + blob.size, 0);
            const estimateTime = (Date.now() - estimateStart) / 1000;
            const estimateSpeed = (estimateBytes * 8) / estimateTime / 1000000; // Mbps
            
            // Decide size for main test, aim for ~10 seconds
            const targetDuration = 10;
            const targetBytes = (estimateSpeed * 1000000 * targetDuration) / 8;
            const sizePerFile = Math.min(100, Math.max(10, Math.floor(targetBytes / 4 / 1024 / 1024))); // MB per file
            
            // Main test
            const startTime = Date.now();
            const promises = [];
            for (let i = 0; i < 4; i++) {
                promises.push(fetch(`/api/download?size=${sizePerFile}`).then(response => response.blob()));
            }
            Promise.all(promises).then(blobs => {
                const totalBytes = blobs.reduce((sum, blob) => sum + blob.size, 0);
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                const bits = totalBytes * 8;
                downloadSpeed = (bits / duration / 1000000).toFixed(2);
                downloadDone = true;
            }).catch(err => {
                console.error('Erro no teste de download:', err);
                downloadSpeed = 'Erro';
                downloadDone = true;
            });
        }).catch(err => {
            console.error('Erro na estimativa de download:', err);
            // Fallback to fixed size
            performFixedDownloadTest();
        });
    }
    
    function performFixedDownloadTest() {
        const testFile = '/api/download?size=100';
        const startTime = Date.now();
        const numConcurrent = 4;
        const promises = [];
        for (let i = 0; i < numConcurrent; i++) {
            promises.push(fetch(testFile).then(response => response.blob()));
        }
        Promise.all(promises).then(blobs => {
            const totalBytes = blobs.reduce((sum, blob) => sum + blob.size, 0);
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            const bits = totalBytes * 8;
            downloadSpeed = (bits / duration / 1000000).toFixed(2);
            downloadDone = true;
        }).catch(err => {
            console.error('Erro no teste de download:', err);
            downloadSpeed = 'Erro';
            downloadDone = true;
        });
    }
    
    function performUploadTest() {
        // Estimate with small upload
        const estimateBlob = new Blob([new ArrayBuffer(1048576)], {type: 'application/octet-stream'}); // 1MB
        const estimateStart = Date.now();
        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'x-start-time': estimateStart.toString()
            },
            body: estimateBlob
        }).then(response => response.json()).then(data => {
            const estimateSpeed = parseFloat(data.speed);
            
            // Decide size for main test, aim for ~10 seconds
            const targetDuration = 10;
            const targetBytes = (estimateSpeed * 1000000 * targetDuration) / 8;
            const uploadSize = Math.min(100 * 1024 * 1024, Math.max(10 * 1024 * 1024, targetBytes)); // bytes
            
            // Main upload
            const uploadBlob = new Blob([new ArrayBuffer(uploadSize)], {type: 'application/octet-stream'});
            const uploadStart = Date.now();
            fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'x-start-time': uploadStart.toString()
                },
                body: uploadBlob
            }).then(response => response.json()).then(data => {
                uploadSpeed = data.speed;
                uploadDone = true;
            }).catch(err => {
                console.error('Erro no teste de upload:', err);
                uploadSpeed = 'Erro';
                uploadDone = true;
            });
        }).catch(err => {
            console.error('Erro na estimativa de upload:', err);
            // Fallback
            performFixedUploadTest();
        });
    }
    
    function performFixedUploadTest() {
        const uploadBlob = new Blob([new ArrayBuffer(104857600)], {type: 'application/octet-stream'}); // 100MB
        const uploadStart = Date.now();
        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'x-start-time': uploadStart.toString()
            },
            body: uploadBlob
        }).then(response => response.json()).then(data => {
            uploadSpeed = data.speed;
            uploadDone = true;
        }).catch(err => {
            console.error('Erro no teste de upload:', err);
            uploadSpeed = 'Erro';
            uploadDone = true;
        });
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