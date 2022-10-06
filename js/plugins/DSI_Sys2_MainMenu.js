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
    pageButtonOffset: 90,
    pageButtonSpacing: 10,
    pageButtonY: 8,
    pageButtonSelectY: 4,
    pageDisplayY: 120,
    pages: [
        {
            icon: "bag/BagIcon",
            textKey: "Lb_Backpack",
            pageClass: "new Window_Bag()"
        }, 
        {
            icon: "mainMenu/RequestIcon",
            textKey: "Lb_MainMenu_Requests",
            pageClass: "new Window_KeyMapping()"
        }, 
        {
            icon: "mainMenu/NpcIcon",
            textKey: "Lb_MainMenu_NPC",
            pageClass: "new Window_Base(new Rectangle(0, 0, 560, 350))"
        }, 
        {
            icon: "mainMenu/InfoIcon",
            textKey: "Lb_MainMenu_Info",
            pageClass: "new Window_Base(new Rectangle(0, 0, 560, 350))"
        },
        {
            icon: "mainMenu/SettingsIcon2",
            textKey: "Lb_Settings",
            pageClass: "new Window_Settings()"
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
        this.createPageBar();
        this.createAllPages();
        this.createPageButtonCursor();
        this.createPageArrows();
    }
    /**
     * Create Page Bar
     */
    createPageBar() {
        this._barBG = new Sprite(ImageManager.loadMenu('IconBarBGHorz', 'mainMenu'));
        this.addChild(this._barBG);
        this._barBG.y -= 100;
        this._barBG.alpha = 0;
        this._barBG.startTween({ y: 0, alpha: 1.0 }, 15).ease(Easing.easeInOutExpo);
    }
    /**
     * Create all pages
     */
    createAllPages() {
        const { pageButtonSpacing, pageButtonY, pageButtonOffset } = MainMenuConfig;
        this._maxPages = MainMenuConfig.pages.length;
        this._pages = [];
        MainMenuConfig.pages.forEach((pageData, index) => {
            this.setupPage(pageData, index);
        });
        // Relocate icons
        let totalWidth = 0;
        for (var i = 0; i < this._pages.length; i++) {
            const { icon } = this._pages[i];
            totalWidth += icon.width + pageButtonSpacing;
        }
        totalWidth -= pageButtonSpacing;
        let startX = (Graphics.width - (totalWidth)) / 2;
        for (var i = 0; i < this._pages.length; i++) {
            const { icon } = this._pages[i];
            icon.x = startX;
            icon.y = pageButtonY;
            startX += icon.width + pageButtonSpacing;
        }
    }
    /**
     * Create page button cursor
     */
    createPageButtonCursor() {
        const cursor = new Sprite(ImageManager.loadMenu('PageButtonCursor', 'mainMenu'));
        this.addChild(cursor);
        this._pageButtonCursor = cursor;
        this._pageButtonCursor.anchor.x = 0.5;
        this._pageButtonCursor.x = -100;
        this._pageButtonCursor.y = MainMenuConfig.pageButtonY + 32;

    }
    /**
     * Create page arrows
     */
    createPageArrows() {
        this.createLeftPageArrow();
        this.createRightPageArrow();
    }
    /**
     * Create left page arrow
     */
    createLeftPageArrow() {
        const pageArrowLeft = new Sprite_Clickable();
        pageArrowLeft.bitmap = ImageManager.loadMenu("PageArrow", "mainMenu");
        pageArrowLeft.anchor.x = 0.5;
        pageArrowLeft.anchor.y = 0.5;
        pageArrowLeft.x = 25;
        pageArrowLeft.y = 25;
        pageArrowLeft.originalX = pageArrowLeft.x;
        pageArrowLeft.onClick = () => {
            this.switchPage(-1);
        }
        this._barBG.addChild(pageArrowLeft);
        const pageArrowLeftHint = new Sprite_KeyHint(MenuKeyAction.PageLeft, "");
        pageArrowLeftHint.x = pageArrowLeft.x + 15;
        pageArrowLeftHint.y = pageArrowLeft.y - 13;
        this._barBG.addChild(pageArrowLeftHint);
        this._leftPageArrow = pageArrowLeft;
    }
    /**
     * Create right page arrow
     */
    createRightPageArrow() {
        const pageArrowRight = new Sprite_Clickable();
        pageArrowRight.bitmap = ImageManager.loadMenu("PageArrow", "mainMenu");
        pageArrowRight.anchor.x = 0.5;
        pageArrowRight.anchor.y = 0.5;
        pageArrowRight.scale.x = -1;
        pageArrowRight.x = Graphics.width - 25;
        pageArrowRight.y = 25;
        pageArrowRight.originalX = pageArrowRight.x;
        pageArrowRight.onClick = () => {
            this.switchPage(1);
        }
        this._barBG.addChild(pageArrowRight);
        const pageArrowRightHint = new Sprite_KeyHint(MenuKeyAction.PageRight, "");
        pageArrowRightHint.x = pageArrowRight.x - 45;
        pageArrowRightHint.y = pageArrowRight.y - 13;
        this._barBG.addChild(pageArrowRightHint);
        this._rightPageArrow = pageArrowRight;
    }
    /**
     * Setup Page
     * @param {any} pageData 
     * @param {number} pageindexData 
     */
    setupPage(pageData, index) {
        const { pageDisplayY } = MainMenuConfig;
        const { pageClass } = pageData;

        const pageButton = this.createPageButton(pageData, index);

        /** @type {Window_Base} */
        const window = eval(pageClass);
        window.opacity = 0;
        window.backOpacity = 0;

        const menuBGPlane = new PIXI.NineSlicePlane(PIXI.Texture.from("img/menus/MenuBG.png"), 8, 8, 8, 8);
        menuBGPlane.width = window.width;
        menuBGPlane.height = window.height;
        window.addChildToBack(menuBGPlane);

        window.x = (Graphics.width - window.width) / 2;
        window.y = pageDisplayY;

        this._pages.push({
            icon: pageButton,
            window: window
        })

        window.visible = false;
        pageButton.opacity = 100;

        this.addChild(window);
    }
    /**
     * Create page button
     * @param {any} pageData 
     * @param {number} index
     * @returns {Sprite_Clickable}
     */
    createPageButton(pageData, index) {
        const button = new Sprite_Clickable();
        button.onClick = () => {
            this.onMenuIconButtonClick(index);
        }

        const iconSprite = new Sprite(ImageManager.loadMenu(pageData.icon));
        button.addChild(iconSprite);

        const style = new PIXI.TextStyle({
            fill: '#e1e1e1',
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 18,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5
        });
        const str = LocalizeManager.t(pageData.textKey).toUpperCase();
        const pageText = new PIXI.Text(str, style);
        pageText.x = 32 + 4;
        pageText.y = 4;

        button.addChild(pageText);

        button.width = pageText.x + pageText.width;
        button.height = pageText.height;
        button.pageText = pageText;

        this.addChild(button);
        return button;
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
        if (!this.canSwitchPage()) return;
        AudioController.playPage();
        this.unselectPage(this._currentPageIndex);
        const { icon, window } = this._pages[index];
        icon.startTween({ opacity: 255, y: MainMenuConfig.pageButtonSelectY }, 15).ease(Easing.easeOutExpo);
        icon.pageText.style.fill = "#f5b642";

        const cursorTargetX = icon.x + icon.width / 2;
        this._pageButtonCursor.removeTween();
        this._pageButtonCursor.startTween({ x: cursorTargetX }, 30).ease(Easing.easeOutExpo);

        window.visible = true;
        window.activate();
        window.alpha = 0;
        window.y = Graphics.height;
        window.startTween({ y: MainMenuConfig.pageDisplayY, alpha: 1.0 }, 15).ease(Easing.easeOutExpo);
        this._currentPageIndex = index;
        window.showHints?.();
    }
    /**
     * Unselect page
     * @param {number} index 
     */
    unselectPage(index) {
        if (index < 0) return;
        const { icon, window } = this._pages[index];
        icon.startTween({ opacity: 100, y: MainMenuConfig.pageButtonY }, 10);
        icon.pageText.style.fill = "#e1e1e1";
        window.visible = false;
        window.deactivate();
        ScreenOverlay.clearAllHints();
    }
    /**
     * Get current page
     * @returns {{icon: Sprite_Clickable, window: Window_Base}}
     */
    currentPage() {
        return this._pages[this._currentPageIndex];
    }
    /**
     * Switch Page
     */
    switchPage(direction) {
        if (direction == 1) {
            this._rightPageArrow.x = this._rightPageArrow.originalX;
            this._rightPageArrow.startTween({ offsetX: 5 }, 15).ease(Easing.easeInCubic);
        } else {
            this._leftPageArrow.x = this._leftPageArrow.originalX;
            this._leftPageArrow.startTween({ offsetX: -5 }, 15).ease(Easing.easeInCubic);
        }
        let pageIndex = this._currentPageIndex;
        pageIndex += direction;
        if (pageIndex < 0) {
            pageIndex = this._maxPages - 1;
        }
        if (pageIndex > this._maxPages - 1) {
            pageIndex = 0;
        }
        this.selectPage(pageIndex);
    }
    /**
     * Pop Scene
     */
    popScene() {
        this._returningToMap = true;
        // Play close animation for main menu before back to map.
        const { window } = this.currentPage();
        window.deactivate();
        window.startTween({ offsetY2: Graphics.height, alpha: 0.0 }, 30).ease(Easing.easeOutExpo);
        this._barBG.startTween({ y: -200, alpha: 0 }, 30).ease(Easing.easeInOutExpo);
        this._pages.forEach((page) => {
            page.icon.startTween({ y: 0, alpha: 0 }, 30).ease(Easing.easeOutExpo);
        });
        this._pageButtonCursor.startTween({ alpha: 0 }, 30).ease(Easing.easeOutExpo);
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
        if (this._returningToMap) return;
        if (Input.isTriggered(FieldKeyAction.Menu) || Input.isTriggered(MenuKeyAction.Cancel)) {
            if (this.canReturnToMap()) {
                this.returnToMap();
            } else {
                AudioController.playBuzzer();
            }
        }
        if (Input.isTriggered(MenuKeyAction.PageLeft)) {
            this.switchPage(-1);
        }
        if (Input.isTriggered(MenuKeyAction.PageRight)) {
            this.switchPage(1);
        }
        this.updateSwitchPageDelay();
    }
    /**
     * Update switch page delay
     */
    updateSwitchPageDelay() {
        if (!this._switchPageDelayDuration) return;
        this._switchPageDelayDuration -= 1;
    }
    /**
     * Set page switch delay
     * @param {number} duration 
     */
    setPageSwitchDelay(duration) {
        this._switchPageDelayDuration = duration;
    }
    /**
     * Check if player can switch page
     */
    canSwitchPage() {
        return !this._switchPageDelayDuration;
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