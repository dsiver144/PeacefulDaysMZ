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
class FarmMachine extends Building {
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
     * Machine filename
     * @returns {string} image filename of the machine
     */
    machineFilename() {
        return "";
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return 'machines/' + this.machineFilename();
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
// ===============================================================================
// Peaceful Days Farm Machines
// ===============================================================================
