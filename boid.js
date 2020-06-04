class Boid {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }
  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }
  align(boids) {
    let perception = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.pos.x,
        this.pos.y,
        other.pos.x,
        other.pos.y);
      if (other != this && d < perception) {
        steering.add(other.vel);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce)
    }
    return steering;
  }

  cohesion(boids) {
    let perception = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.pos.x,
        this.pos.y,
        other.pos.x,
        other.pos.y);
      if (other != this && d < perception) {
        steering.add(other.pos);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.pos);
      //steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce)
    }
    return steering;
  }
  separation(boids) {
    let perception = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.pos.x,
        this.pos.y,
        other.pos.x,
        other.pos.y);
      if (other != this && d < perception) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce)
    }
    return steering;
  }
  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    separation.mult(separationSlider.value());
    cohesion.mult(cohesionSlider.value());
    alignment.mult(alignSlider.value());
    this.acc.add(separation);
    this.acc.add(alignment);
    this.acc.add(cohesion);
  }
  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
  }
  show() {
    strokeWeight(2);
    stroke(255);
    noFill();
    ellipse(this.pos.x, this.pos.y,8,8)
  }


}