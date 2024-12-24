export class Character {
  constructor(className, spells, stats, imageURL) {
    this.class = className;
    this.spells = spells;
    this.stats = stats;
    this.Health = 100;
    this.Movement = 30;
    this.image = imageURL;
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

  get CharacterImage() {
    return this.image;
  }

  set CharacterImage(imageURL) {
    this.image = imageURL;
  }
}
