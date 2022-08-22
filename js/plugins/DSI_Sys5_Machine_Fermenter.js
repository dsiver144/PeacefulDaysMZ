
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