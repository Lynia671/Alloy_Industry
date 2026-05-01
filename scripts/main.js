

this.window = this;

const coreShard = Vars.content.getByName(mindustry.ctype.ContentType.block, "core-Shard");
const coreProtect = Vars.content.getByName(mindustry.ctype.ContentType.block, "core-protect");

var node = TechTree.node;

//斯维特顿（普赛罗）
TechTree.nodeRoot("aSerpulo", coreShard, () => {
    TechTree.node(Blocks.coreProtect);
});

//斯维特顿（本战役）
TechTree.nodeRoot("aySvitetun", coreProtect, () => {
});

this.window = this;

for (let i = 0; i < 8; i++) {
	window["block" + i] = new Block("block" + i);
};

var node = TechTree.node;








