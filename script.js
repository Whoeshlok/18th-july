window.onload = function () {
  // Twinkling stars background
  const starsContainer = document.querySelector('.stars');
  if (starsContainer) {
    const numStars = 40;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2.5 + 2.5; // 2.5px to 5px
      const delay = Math.random() * 2;
      star.style.top = `${top}vh`;
      star.style.left = `${left}vw`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      starsContainer.appendChild(star);
    }
  }

  // Typing animation for thank you message
  const typingEl = document.getElementById("typing-message");
  const surpriseBtn = document.getElementById('surprise-btn');
  if (surpriseBtn) {
    surpriseBtn.style.display = 'none'; // Hide initially
  }
  if (typingEl) {
    const fullText = typingEl.textContent;
    typingEl.textContent = "";
    let i = 0;
    function typeChar() {
      if (i < fullText.length) {
        typingEl.textContent += fullText.charAt(i);
        i++;
        setTimeout(typeChar, 45);
      } else {
        // Show the button after typing is done
        if (surpriseBtn) surpriseBtn.style.display = 'inline-block';
      }
    }
    setTimeout(typeChar, 8500); // delay to start 1s after fireworks
  }

  // Fireworks background animation
  const canvas = document.getElementById('fireworks-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    });

    // Firework and particle logic
    // Only red, pink, blue, golden, silver, yellow
    const colors = [
      '#ff5252', // red
      '#ff69b4', // pink
      '#40c4ff', // blue
      '#ffd700', // golden
      '#c0c0c0', // silver
      '#fff176'  // yellow
    ];

    function randomColor() {
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Cake area (centered, 200px wide)
    function isOverCake(x) {
      const cakeWidth = 200;
      const cakeCenter = W / 2;
      return x > (cakeCenter - cakeWidth / 2 - 20) && x < (cakeCenter + cakeWidth / 2 + 20) && H > 400; // fudge factor for mobile
    }

    function Firework() {
      // Pick a random x that is NOT over the cake
      let x;
      let tries = 0;
      do {
        x = Math.random() * W;
        tries++;
      } while (isOverCake(x) && tries < 20);
      this.x = x;
      this.y = H;
      this.targetY = 150 + Math.random() * (H / 2 - 150);
      this.color = randomColor();
      this.particles = [];
      this.exploded = false;
      this.speed = 7 + Math.random() * 2;
    }
    Firework.prototype.update = function() {
      if (!this.exploded) {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.exploded = true;
          for (let i = 0; i < 36 + Math.random() * 20; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
          }
        }
      } else {
        this.particles.forEach(p => p.update());
      }
    };
    Firework.prototype.draw = function(ctx) {
      if (!this.exploded) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 24;
        ctx.globalAlpha = 0.95;
        ctx.fill();
        ctx.restore();
      } else {
        this.particles.forEach(p => p.draw(ctx));
      }
    };
    Firework.prototype.isDone = function() {
      return this.exploded && this.particles.every(p => p.alpha <= 0.01);
    };

    function Particle(x, y, color) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = 2 + Math.random() * 4;
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.color = color;
      this.size = 3.5 + Math.random() * 3.5; // Larger size
      this.gravity = 0.025 + Math.random() * 0.015;
    }
    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.alpha -= 0.009 + Math.random() * 0.007; // Slower fade
      if (this.alpha < 0) this.alpha = 0;
    };
    Particle.prototype.draw = function(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0.15); // Brighter tail
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 32;
      ctx.fill();
      ctx.restore();
    };

    let fireworks = [];
    function launchFirework() {
      fireworks.push(new Firework());
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      fireworks.forEach(fw => {
        fw.update();
        fw.draw(ctx);
      });
      fireworks = fireworks.filter(fw => !fw.isDone());
      requestAnimationFrame(animate);
    }

    // DELAY fireworks until after cake and typing (now 6.5s)
    setTimeout(() => {
      setInterval(launchFirework, 900);
    }, 6500);
    animate();
  }

  // Surprise button navigation
  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', function() {
      window.location.href = 'food.html';
    });
  }

  // MEMORY CARD FLIP GAME LOGIC (for game.html)
  if (document.body.classList.contains('memory-game')) {
    const emojis = [
      '🎂', '🎂', // Cake
      '🍕', '🍕', // Pizza
      '🍔', '🍔', // Burger
      '🍦', '🍦', // Ice Cream
      '🍩', '🍩', // Donut
      '🍫', '🍫', // Chocolate
      '🎈', '🎈', // Balloon
      '🎉', '🎉'  // Party Popper
    ];
    // Shuffle function
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const shuffled = shuffle([...emojis]);
    const board = document.getElementById('memoryBoard');
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;

    // Create cards
    shuffled.forEach((emoji, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `
        <span class="card-front">${emoji}</span>
        <span class="card-back">🎁</span>
      `;
      card.dataset.emoji = emoji;
      card.tabIndex = 0;
      card.addEventListener('click', () => flipCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') flipCard(card);
      });
      board.appendChild(card);
    });

    function flipCard(card) {
      if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped');
      if (!firstCard) {
        firstCard = card;
        return;
      }
      secondCard = card;
      lockBoard = true;
      if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        // Match!
        setTimeout(() => {
          firstCard.classList.add('matched');
          secondCard.classList.add('matched');
          matchedPairs++;
          if (matchedPairs === emojis.length / 2) {
            setTimeout(() => {
              alert('🎉 You matched all the pairs! Happy Birthday! 🎉\nI hope you enjoyed the game!!');
            }, 400);
          }
          resetBoard();
        }, 500);
      } else {
        // Not a match
        setTimeout(() => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          resetBoard();
        }, 900);
      }
    }
    function resetBoard() {
      [firstCard, secondCard] = [null, null];
      lockBoard = false;
    }
  }
}; 