const { spawn } = require('child_process');

console.log("Sunucu ve tünel başlatılıyor, lütfen bekleyin...");

// 1. Önce normal server.js'yi başlatalım
const server = spawn('node', ['server.js'], { stdio: 'inherit' });

// 2. SSH kullanarak localhost.run üzerinden tünel açalım
const tunnel = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-R', '80:localhost:3001',
    'nokey@localhost.run'
]);

let urlFound = false;

function parseOutput(data) {
    const output = data.toString();
    
    // Tünel adresi yakalama (lhr.life)
    const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.lhr\.life/);
    if (match && !urlFound) {
        urlFound = true;
        console.log('\n' + '='.repeat(60));
        console.log('🎉 TÜNEL BAŞARIYLA AÇILDI! Arkadaşına şu linki atabilirsin:');
        console.log('👉  ' + match[0]);
        console.log('='.repeat(60) + '\n');
    }
}

// Bazen ssh logları stdout'a, bazen stderr'e düşer, ikisini de dinliyoruz
tunnel.stdout.on('data', parseOutput);
tunnel.stderr.on('data', parseOutput);

tunnel.on('close', (code) => {
    console.log(`Tünel bağlantısı koptu (Kod: ${code}).`);
    server.kill();
});

server.on('close', (code) => {
    tunnel.kill();
});

// Terminalden çıkış yapıldığında her şeyi temizle
process.on('SIGINT', () => {
    console.log("\nKapatılıyor...");
    server.kill();
    tunnel.kill();
    process.exit();
});
