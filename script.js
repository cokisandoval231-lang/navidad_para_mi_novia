// =============================================
// CONFIGURACIÓN INICIAL Y ELEMENTOS DECORATIVOS
// =============================================

// Fecha desde que se conocen (13 de octubre de 2025)
const startDate = new Date('October 13, 2025 00:00:00');

// Símbolos para el juego de memoria
const gameSymbols = ['🎄', '🎁', '⭐', '🤶', '🦌', '🍪', '🔔', '⛄', '🕯️', '🎅'];
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 6;
let moves = 0;
let gameTime = 0;
let timerInterval = null;
let gameStarted = false;

// Crear copos de nieve
function createSnowflakes() {
    const container = document.getElementById('snowflakes-container');
    const snowflakes = ['❄', '❅', '❆', '•'];
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        snowflake.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 20 + 10;
        snowflake.style.fontSize = size + 'px';
        
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        snowflake.style.animation = `float ${duration}s linear ${delay}s infinite`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.5;
        
        container.appendChild(snowflake);
    }
}

// Crear esferas navideñas
function createChristmasBalls() {
    const container = document.getElementById('christmas-balls-container');
    const colors = ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#ef476f'];
    
    for (let i = 0; i < 20; i++) {
        const ball = document.createElement('div');
        ball.className = 'christmas-ball';
        
        ball.style.left = Math.random() * 100 + 'vw';
        ball.style.top = Math.random() * 100 + 'vh';
        ball.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const size = Math.random() * 20 + 15;
        ball.style.width = size + 'px';
        ball.style.height = size + 'px';
        
        const duration = Math.random() * 5 + 5;
        ball.style.animation = `twinkle ${duration}s ease-in-out infinite`;
        
        container.appendChild(ball);
    }
}

// Crear corazones flotantes
function createHearts() {
    const container = document.getElementById('hearts-container');
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '❤';
        
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        
        const size = Math.random() * 20 + 15;
        heart.style.fontSize = size + 'px';
        
        const duration = Math.random() * 8 + 8;
        const delay = Math.random() * 5;
        heart.style.animation = `distancePulse ${duration}s ease-in-out ${delay}s infinite`;
        
        container.appendChild(heart);
    }
}

// =============================================
// CONTADOR DE TIEMPO JUNTOS
// =============================================

function updateTimeTogether() {
    const now = new Date();
    const timeDiff = now - startDate;
    
    // Si la fecha de inicio es en el futuro, mostrar 0
    if (timeDiff < 0) {
        document.getElementById('days-together').textContent = '0';
        document.getElementById('hours-together').textContent = '0';
        document.getElementById('minutes-together').textContent = '0';
        document.getElementById('seconds-together').textContent = '0';
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    document.getElementById('days-together').textContent = days;
    document.getElementById('hours-together').textContent = hours;
    document.getElementById('minutes-together').textContent = minutes;
    document.getElementById('seconds-together').textContent = seconds;
}

// =============================================
// JUEGO DE MEMORIA NAVIDEÑO
// =============================================

// Inicializar el juego de memoria
function initMemoryGame() {
    const gameContainer = document.getElementById('memory-game');
    gameContainer.innerHTML = '';
    
    // Seleccionar 6 símbolos aleatorios (para 12 cartas, 6 parejas)
    const selectedSymbols = [];
    while (selectedSymbols.length < totalPairs) {
        const randomSymbol = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
        if (!selectedSymbols.includes(randomSymbol)) {
            selectedSymbols.push(randomSymbol);
        }
    }
    
    // Duplicar los símbolos para crear parejas
    gameCards = [...selectedSymbols, ...selectedSymbols];
    
    // Mezclar las cartas
    for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    // Crear las cartas en el DOM
    gameCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = symbol;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.innerHTML = '<i class="fas fa-question"></i>';
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        card.addEventListener('click', () => flipCard(card));
        gameContainer.appendChild(card);
    });
    
    // Reiniciar variables del juego
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameTime = 0;
    gameStarted = false;
    
    // Actualizar la interfaz
    document.getElementById('moves-count').textContent = moves;
    document.getElementById('pairs-count').textContent = `0/${totalPairs}`;
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('game-message').textContent = '¡Encuentra todas las parejas navideñas! Te amo ❤️';
    
    // Detener el temporizador si existe
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

// Voltear una carta
function flipCard(card) {
    // No hacer nada si la carta ya está volteada o emparejada
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }
    
    // Iniciar el temporizador si es la primera jugada
    if (!gameStarted) {
        startGameTimer();
        gameStarted = true;
    }
    
    // Voltear la carta
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Si hay dos cartas volteadas, verificar si coinciden
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves-count').textContent = moves;
        
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Cartas coinciden
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            document.getElementById('pairs-count').textContent = `${matchedPairs}/${totalPairs}`;
            document.getElementById('game-message').textContent = `¡Encontraste una pareja! ❤️ (${matchedPairs}/${totalPairs})`;
            
            // Verificar si el juego terminó
            if (matchedPairs === totalPairs) {
                endGame();
            }
            
            flippedCards = [];
        } else {
            // Cartas no coinciden, voltearlas de nuevo después de un tiempo
            document.getElementById('game-message').textContent = '¡Sigue intentando! Te amo 💕';
            
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}

// Iniciar el temporizador del juego
function startGameTimer() {
    gameTime = 0;
    timerInterval = setInterval(() => {
        gameTime++;
        const minutes = Math.floor(gameTime / 60).toString().padStart(2, '0');
        const seconds = (gameTime % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Terminar el juego
function endGame() {
    clearInterval(timerInterval);
    
    // Calcular puntuación
    const score = Math.max(1000 - (moves * 10) - (gameTime * 2), 100);
    
    // Mostrar mensaje de victoria
    const messages = [
        `¡Felicidades! Completaste el juego en ${moves} movimientos y ${gameTime} segundos. Te amo infinitamente. ❤️`,
        `¡Increíble! Encontraste todas las parejas. Eres la persona más especial para mí. 💖`,
        `¡Ganaste! Este juego es solo un pequeño recordatorio de lo mucho que te amo. 💕`,
        `¡Perfecto! Como nuestro amor, encontraste todas las conexiones. Te amo más cada día. 💘`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('game-message').innerHTML = randomMessage;
    
    // Mostrar corazones de celebración
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createCelebrationHeart();
        }, i * 100);
    }
}

// Crear corazones de celebración
function createCelebrationHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
    heart.style.zIndex = '1000';
    
    container.appendChild(heart);
    
    // Animación de caída
    const animation = heart.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(-${window.innerHeight}px)`, opacity: 0 }
    ], {
        duration: 2000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    animation.onfinish = () => {
        heart.remove();
    };
}

// Dar una pista
function giveHint() {
    if (matchedPairs === totalPairs || flippedCards.length > 0) return;
    
    // Encontrar cartas no emparejadas y no volteadas
    const unflippedCards = Array.from(document.querySelectorAll('.memory-card:not(.flipped):not(.matched)'));
    
    if (unflippedCards.length >= 2) {
        // Voltear temporalmente dos cartas para dar una pista
        const card1 = unflippedCards[0];
        const card2 = unflippedCards.find(card => 
            card !== card1 && card.dataset.symbol === card1.dataset.symbol
        );
        
        if (card2) {
            card1.classList.add('flipped');
            card2.classList.add('flipped');
            
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1500);
            
            document.getElementById('game-message').textContent = '¡Aquí tienes una pista! 💡';
        }
    }
}

// =============================================
// FUNCIONALIDADES GENERALES
// =============================================

// Funcionalidad del botón de sorpresa
document.getElementById('surprise-btn').addEventListener('click', function() {
    const container = document.getElementById('surprise-container');
    const isOpen = container.style.height !== '0px' && container.style.height !== '';
    
    if (isOpen) {
        container.style.height = '0';
        this.innerHTML = '<i class="fas fa-gift"></i> Abre mi regalo de Navidad para ti';
    } else {
        container.style.height = container.scrollHeight + 'px';
        this.innerHTML = '<i class="fas fa-times"></i> Cerrar mi regalo';
        
        setTimeout(() => {
            const promises = document.querySelectorAll('.memory-list li');
            promises.forEach((promise, index) => {
                setTimeout(() => {
                    promise.style.opacity = '0';
                    promise.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        promise.style.transition = 'all 0.5s ease';
                        promise.style.opacity = '1';
                        promise.style.transform = 'translateX(0)';
                    }, 100);
                }, index * 100);
            });
        }, 300);
    }
});

// Funcionalidad del botón de música
const musicBtn = document.getElementById('music-btn');
const music = document.getElementById('christmas-music');
let isPlaying = false;

musicBtn.addEventListener('click', function() {
    // Verificar si el archivo de audio existe
    music.addEventListener('error', function() {
        document.getElementById('audio-message').style.display = 'block';
        this.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Canción no disponible';
    }, { once: true });
    
    if (isPlaying) {
        music.pause();
        this.innerHTML = '<i class="fas fa-music"></i> Nuestra canción especial';
        isPlaying = false;
    } else {
        music.play().catch(e => {
            document.getElementById('audio-message').style.display = 'block';
            alert("Para reproducir música, haz clic en cualquier parte de la página primero. ¡Gracias!");
        });
        this.innerHTML = '<i class="fas fa-pause"></i> Pausar música';
        isPlaying = true;
    }
});

// Permitir reproducción de música después de la interacción del usuario
document.addEventListener('click', function initAudio() {
    document.removeEventListener('click', initAudio);
}, { once: true });

// Reiniciar juego
document.getElementById('restart-game').addEventListener('click', initMemoryGame);

// Botón de pista
document.getElementById('hint-game').addEventListener('click', giveHint);

// =============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =============================================

window.onload = function() {
    // Inicializar elementos decorativos
    createSnowflakes();
    createChristmasBalls();
    createHearts();
    
    // Inicializar el juego de memoria
    initMemoryGame();
    
    // Iniciar contador de tiempo juntos
    updateTimeTogether();
    setInterval(updateTimeTogether, 1000);
    
    // Efecto de escritura para el mensaje
    const messageText = document.querySelector('.message-text');
    const originalText = messageText.innerHTML;
    messageText.innerHTML = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            messageText.innerHTML += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        }
    }
    
    // Iniciar efecto de escritura después de un breve retraso
    setTimeout(typeWriter, 1000);
    
    // Recomendación de canción
    console.log("%c🎵 Recomendación de canción:", "color: #ff4d6d; font-size: 16px; font-weight: bold;");
    console.log("%cPara tu canción navideña, te recomiendo 'All I Want for Christmas Is You' de Mariah Carey,", "color: #ffd166;");
    console.log("%c'Last Christmas' de Wham!, o 'Feliz Navidad' de José Feliciano.", "color: #ffd166;");
    console.log("%cDescarga la canción en MP3 y colócala en la carpeta 'audio' como 'cancion_navidad.mp3'", "color: #a5e6ba;");
};