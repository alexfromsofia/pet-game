import { modFox, modScene } from './ui';
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  FEED_TIME,
  HUNGER_LENGTH,
  POOP_LENGTH,
  CLEANUP_POOP_LENGTH
} from './constants';

const gameState = {
  current: 'INIT',
  clock: 1,
  sleepTime: -1,
  feedTime: -1,
  deadTime: -1,
  poopTime: -1,
  tick() {
    this.clock++;
    console.log('clock', this.clock);

    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.feedTime) {
      this.hungry();
    } else if (this.clock === this.deadTime) {
      this.dead();
    } else if (this.clock === this.poopTime) {
      this.poop();
    }

    return this.clock;
  },
  startGame() {
    this.current = 'HATCHING';
    this.wakeTime = this.clock + 3;
    modFox('egg');
    modScene('day');
  },
  dead() {
    this.current = 'DEAD';
    modFox('dead');
    modScene('dead');
  },
  wake() {
    this.current = 'IDLING';
    this.wakeTime = -1;
    modFox('idling');
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.feedTime = this.clock + FEED_TIME;
  },
  sleep() {
    this.state = 'SLEEP';
    modFox('sleep');
    modScene('night');
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  changeWeather() {
    const nextWeather = this.scene === 0 ? 1 : 0;
    this.scene = nextWeather;
    modScene(SCENES[this.scene]);
  },
  cleanUpPoop() {
    console.log('cleanUpPoop');
  },
  feed() {
    this.feedTime = -1;
    this.deadTime = -1;
    this.poopTime = this.clock + POOP_LENGTH;
    modFox('eating');
  },
  hungry() {
    this.deadTime = this.clock + HUNGER_LENGTH;
    modFox('hungry');
  },
  poop() {
    this.deadTime = this.clock + CLEANUP_POOP_LENGTH;
    modFox('pooping');
  },
  handleUserAction(icon) {
    if (
      ['SLEEP', 'FEEDING', 'CELEBRATING', 'HATCHING'].includes(this.current)
    ) {
      // do noting
      return;
    }

    if (this.current === 'INIT' || this.current === 'DEAD') {
      this.startGame();
      return;
    }

    switch (icon) {
      case 'weather':
        this.changeWeather();
        break;
      case 'poop':
        this.cleanUpPoop();
        break;
      case 'fish':
        this.feed();
        break;
    }
  }
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);

export default gameState;
