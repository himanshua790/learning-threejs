import Experience from "../Experience";
import Enviroment from "./Enviroment";
import Floor from "./Floor";
import Fox from "./Fox";
export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resouces = this.experience.resources;

    this.resouces.on("ready", () => {
      console.log("resouces are ready");
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Enviroment();
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
