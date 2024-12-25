export class Player {
  constructor(name, age, gameDifficulty) {
    this.playerName = name;
    this.playerAge = age;
    this.playerDifficulty = gameDifficulty;
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

  set playerDifficulty(gameDuration) {
    this.duration = gameDuration;
  }

  get playerDifficulty() {
    return this.duration;
  }
}
