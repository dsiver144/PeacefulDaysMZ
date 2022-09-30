//=======================================================================
// * Plugin Name  : DSI_Sys2_MainMenu.js
// * Last Updated : 7/29/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Main Menu
 * @help 
 * Empty Help
 * 
 */
const MainMenuConfig = {
    iconSpacing: 12,
    iconSize: [64, 64],
    iconDisplayY: 27,
    pageDisplayY: 120,
    pages: [
        {
            icon: "bag/BagIcon",
            textKey: "MainMenu_Bag",
            pageClass: "new Window_Bag()"
        }, {
            icon: "bag/BagIcon",
            textKey: "MainMenu_Bag",
            pageClass: "new Window_Base(new Rectangle(0, 0, 400, 400))"
        }
    ]
}

class Scene_MainMenu extends Scene_MenuBase {
    /**
     * Prepare
     */
    prepare(pageIndex = -1) {
        this._defaultPageIndex = pageIndex;
    }
    /**
     * Main Menu Container
     */
    create() {
        this._backgroundEnabled = this.backgroundEnabled();
        super.create();
        this.createAllObjects();
    }
    /**
     * Start
     */
    start() {
        super.start();
        this.initMembers();
        this.selectPage(this._defaultPageIndex || 0);
    }
    /**
     * Init members
     */
    initMembers() {
        this._currentPageIndex = -1;
    }
    /**
     * Create all neccessary objects
     */
    createAllObjects() {
        // const button1 = new Sprite_KeyHint(MenuKeyAction.Confirm);
        // button1.setImage(null, 0);
        // const button2 = new Sprite_KeyHint(MenuKeyAction.Cancel);
        // button2.setImage(null, 0);

        // this.addChild(button1);
        // this.addChild(button2);
        // button1.x = 100;
        // button1.y = 100;
        // button2.x = 400;
        // button2.y = 100;

        this.createAllPages();
    }
    /**
     * Create all pages
     */
    createAllPages() {
        const { iconSize, iconSpacing } = MainMenuConfig;
        this._maxPages = MainMenuConfig.pages.length;
        this._pages = [];
        this._pageIconStartX = (Graphics.width - (this._maxPages * (iconSize[0] + iconSpacing) - iconSpacing)) / 2;
        MainMenuConfig.pages.forEach((pageData, index) => {
            this.setupPage(pageData, index);
        })
    }
    /**
     * Setup Page
     * @param {any} pageData 
     */
    setupPage(pageData, index) {
        const { iconSize, iconSpacing, pageDisplayY } = MainMenuConfig;
        const { icon, textKey, pageClass } = pageData;

        const iconSprite = new Sprite_Clickable();
        iconSprite.bitmap = ImageManager.loadMenu(icon);
        iconSprite.onClick = () => {
            this.onMenuIconButtonClick(index);
        }
        iconSprite.x = this._pageIconStartX + (iconSize[0] + iconSpacing) * index;
        iconSprite.y = MainMenuConfig.iconDisplayY;
        this.addChild(iconSprite);

        /** @type {Window_Base} */
        const window = eval(pageClass);
        window.opacity = 0;
        window.backOpacity = 0;

        const menuBGPlane = new PIXI.NineSlicePlane(PIXI.Texture.from("img/menus/MenuBG.png"), 8, 8, 8, 8);
        menuBGPlane.width = window.innerWidth;
        menuBGPlane.height = window.innerHeight;
        window.addChildToBack(menuBGPlane);

        window.x = (Graphics.width - window.width) / 2;
        window.y = pageDisplayY;

        this._pages.push({
            icon: iconSprite,
            window: window
        })

        window.visible = false;
        iconSprite.opacity = 100;

        this.addChild(window);
    }
    /**
     * This will be call when player click icon button
     * @param {number} index 
     */
    onMenuIconButtonClick(index) {
        if (this._currentPageIndex == index) return;
        this.selectPage(index);
    }
    /**
     * Select page
     * @param {number} index 
     */
    selectPage(index) {
        if (index < 0) return;
        this.unselectPage(this._currentPageIndex);
        const { icon, window } = this._pages[index];
        icon.startTween({ opacity: 255, offsetY: 10 }, 30).ease(Easing.easeOutExpo);
        window.visible = true;
        window.activate();
        window.alpha = 0;
        window.startTween({ offsetY: Graphics.height, alpha: 1.0 }, 30).ease(Easing.easeOutExpo);
        this._currentPageIndex = index;
    }
    /**
     * Unselect page
     * @param {number} index 
     */
    unselectPage(index) {
        if (index < 0) return;
        const { icon, window } = this._pages[index];
        icon.startTween({ opacity: 100 }, 10);
        window.visible = false;
        window.deactivate();
    }
    /**
     * Get current page
     * @returns {{icon: Sprite_Clickable, window: Window_Base}}
     */
    currentPage() {
        return this._pages[this._currentPageIndex];
    }
    /**
     * Pop Scene
     */
    popScene() {
        this._returningToMap = true;
        // Play close animation for main menu before back to map.
        const {window} = this.currentPage();
        window.deactivate();
        window.startTween({offsetY2: Graphics.height, alpha: 0.0}, 30).ease(Easing.easeOutExpo);
        this._pages.forEach((page) => {
            page.icon.startTween({y: 0, alpha: 0}, 30).ease(Easing.easeOutExpo);
        });
        setTimeout(() => {
            super.popScene();
        }, 250);
    }
    /**
     * Check if background scolling is enabled
     * @returns {boolean}
     */
    backgroundEnabled() {
        return false;
    }
    /**
     * Create background
     */
    createBackground() {
        if (!this._backgroundEnabled) {
            return super.createBackground();
        }
        this._backgroundSprite = new TilingSprite();
        this._backgroundSprite.bitmap = ImageManager.loadMenu('BGLoop');
        this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
        this.addChild(this._backgroundSprite);
    }
    /**
     * Update control
     */
    updateControl() {
        if (Input.isTriggered(FieldKeyAction.Menu) || Input.isTriggered(FieldKeyAction.Cancel)) {
            if (this._returningToMap) return;
            if (this.canReturnToMap()) {
                this.returnToMap();
            } else {
                AudioController.playBuzzer();
            }
        }
    }
    /**
     * Check if player can return to map scene
     * @returns {boolean}
     */
    canReturnToMap() {
        return true;
    }
    /**
     * Return to map function
     */
    returnToMap() {
        AudioController.playOk();
        this.popScene();
    }
    /**
     * Update all sprites
     */
    updateSprites() {
        this.updateBackground();
    }
    /**
     * Update background sprite
     */
    updateBackground() {
        if (!this._backgroundEnabled) {
            return;
        }
        this._backgroundSprite.origin.x += 0.5;
        this._backgroundSprite.origin.y += 0.5;
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateControl();
        this.updateSprites();
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

Scene_Map.prototype.callMenu = function () {
    AudioController.playOk();
    SceneManager.push(Scene_MainMenu);
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};