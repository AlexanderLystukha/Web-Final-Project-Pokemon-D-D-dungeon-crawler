export class Character {
  constructor(className, spells, stats, imageURL) {
    this.ClassType = className;
    this.SpellList = spells;
    this.Statistics = stats;
    this.Health = 100;
    this.Movement = 30;
    this.image = imageURL;
  }

  get ClassType() {
    return this.class;
  }

  set ClassType(className) {
    this.class = className;
  }

  get SpellList() {
    return this.spells;
  }

  set SpellList(usableSpells) {
    this.spells = usableSpells;
  }

  get Statistics() {
    return this.stats;
  }

  set Statistics(statistics) {
    this.stats = statistics;
  }

  set Health(health) {
    this.health = health;
  }

  get Health() {
    return this.health;
  }

  set Movement(newSpeed) {
    return (this.movementSpeed = newSpeed);
  }

  get Equipment() {
    return this.equipment;
  }

  set Equipment(newEquipment) {
    this.equipment = newEquipment;
  }

  get CharacterImage() {
    return this.image;
  }

  set CharacterImage(imageURL) {
    this.image = imageURL;
  }
}
