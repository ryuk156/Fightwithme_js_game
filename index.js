const canvas = document.querySelector('canvas')


canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext("2d")

const score = document.getElementById('score')

const startgame = document.getElementById('startGamebtn')
const modal = document.getElementById('modal')
const Modalscore = document.getElementById('modalscore')

class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color


  }



  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

}



class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity


  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }


}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity


  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }


}

const friction = 0.99
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1


  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }


}




const x = canvas.width / 2
const y = canvas.height / 2


let player = new Player(x, y, 15, "white")
let projectiles = []
let enemies = []
let particles = []

function init() {
  player = new Player(x, y, 15, "white")
  projectiles = []
  enemies = []
  particles = []
  Score = 0
  score.innerHTML = Score
  Modalscore.innerHTML = Score

}


function spawnEnemy() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4

    let x
    let y


    if (Math.random() > 0.5) {

      x = Math.random() > 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() > 0.5 ? 0 - radius : canvas.height + radius
    }


    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    const color = `hsl( ${Math.random() * 360},50%,50%)`
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

function clear() {
  c.fillStyle = 'rgba(0,0,0,0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
}


var shootsound = document.getElementById("shootAudio"); 
var blastsound = document.getElementById("blastAudio"); 
var diesound = document.getElementById("dieAudio");
function playshootAudio() { 
  shootsound.play(); 
} 
function playblastAudio() { 
  blastsound.play(); 
} 

function playdieAudio() { 
  diesound.play(); 
} 

addEventListener('click', (event) => {


  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6
  }
  const firecolor = "green"
  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, firecolor, velocity))
 playshootAudio()

})

let animateId
let Score = 0
function animate() {
  animateId = requestAnimationFrame(animate)
  clear()
  try {
    player.draw()
  } catch (error) {
    
  }
 

  projectiles.forEach((Pro, proIndex) => {
    Pro.update()
    if (Pro.x + Pro.radius < 0 || Pro.x - Pro.radius > canvas.width || Pro.y + Pro.radius < 0 || Pro.y - Pro.radius > canvas.height) {
      projectiles.splice(proIndex, 1)
    }
  })

  enemies.forEach((enemy, index) => {
    enemy.update()

    try {
      
    
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if (dist - enemy.radius - player.radius < 1) {
      
      
      player=null
     
      playdieAudio()
      setTimeout(()=>{

        cancelAnimationFrame(animateId)
        modal.style.display = "flex"
        Modalscore.innerHTML = Score
        player = new Player(x, y, 15, "white")
      },800)
     

    }

    particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particles.splice(index, 1)
      } else {
        particle.update()
      }

      

    })

  }
  catch (error) {
    
  }
    projectiles.forEach((pro, proIndex) => {
      const dist = Math.hypot(pro.x - enemy.x, pro.y - enemy.y)
      if (dist - enemy.radius - pro.radius < 1) {


        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(pro.x, pro.y, Math.random() * 3, enemy.color, { x: (Math.random() - 0.5) * (Math.random() * 6), y: (Math.random() - 0.5) * (Math.random() * 6) }))
        }
        if (enemy.radius - 10 > 5) {
          Score += 100
          score.innerHTML = Score
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => {

            projectiles.splice(proIndex, 1)
          }, 0)
        } else {
          setTimeout(() => {
            Score += 250
            score.innerHTML = Score
            enemies.splice(index, 1)
            projectiles.splice(proIndex, 1)
            playblastAudio()
          }, 0)
        }


      }
    })
  })
}

startgame.addEventListener('click', () => {
  init()
  animate()
  spawnEnemy()
  modal.style.display = "none"
})
