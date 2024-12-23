export class Character {
  constructor(className, spells, stats) {
    this.class = className;
    this.spells = spells;
    this.stats = stats;
    this.health = 100;
    this.movementSpeed = 30;
    this.equipment = [];
  }

  get ClassType() {
    return this.class;
  }

  get SpellList() {
    return this.spells;
  }

  get Statistics() {
    return this.stats;
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
}
