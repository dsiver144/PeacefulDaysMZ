//=======================================================================
// * Plugin Name  : DSI_Sys3_FarmMachine.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Farm Machine
 * @help 
 * Empty Help
 * 
 * 
 */
class FarmMachine extends FarmConstruction {
    /**
     * @inheritdoc
     */
    init() {
        super.init();
        this._uuid = MyUtils.uuid();
        /** @type {CraftTask[]} */
        this._task = [];
    }
    /**
     * Add task to machine
     * @param {Blueprint} blueprint 
     * @param {number} number 
     */
    addTask(blueprint, productLevel = 0) {
        const newTask = new CraftTask(this._uuid);
        newTask.setDetail(blueprint, productLevel);
        this._task.push(newTask);
    }
    /**
     * Get the active task
     * @returns {CraftTask}
     */
    get activeTask() {
        return this._task[0];
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return 'machines/';
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        const data = super.saveProperties();
        data.push(['_uuid', null]);
        data.push(['@Arr(CraftTask):_tasks', null]);
        return data;
    }
}

class Fermenter extends FarmMachine {
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "Fermenter";
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_Fermenter;
    }
}