class Player {
  constructor(name, age, gameDuration) {
    this.name = name;
    this.age = age;
    this.duration = gameDuration;
  }

  set playerName(name) {
    this.name = name;
  }

  get playerName() {
    return this.name;
  }

  set playerAge(age) {
    this.age = age;
  }

  get playerAge() {
    return this.name;
  }

  set playerDuration(gameDuration) {
    this.duration = gameDuration;
  }

  get playerDuration() {
    return this.duration;
  }
}
